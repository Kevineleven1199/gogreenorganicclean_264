import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { buildSessionCookie } from "@/src/lib/auth/cookies";
import { applyPasswordHash, extractPasswordHash, verifyPassword } from "@/src/lib/auth/password";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  portal: z.enum(["client", "admin", "cleaner"])
});

const PORTAL_REDIRECT: Record<"client" | "admin" | "cleaner", string> = {
  client: "/client",
  admin: "/admin",
  cleaner: "/cleaner"
};

const PORTAL_ROLE: Record<"client" | "admin" | "cleaner", Role> = {
  client: Role.CUSTOMER,
  admin: Role.HQ,
  cleaner: Role.CLEANER
};

const masterAdminEmail = process.env.MASTER_ADMIN_EMAIL ?? "kevin@ggoc.us";
const masterAdminPassword = process.env.MASTER_ADMIN_PASSWORD ?? "MtCodeRed2020";

const ensureMasterAdmin = async () => {
  const tenantId = process.env.DEFAULT_TENANT_ID;
  if (!tenantId) {
    console.warn("[auth] DEFAULT_TENANT_ID is missing. Unable to seed master admin.");
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: masterAdminEmail }
  });

  if (!existing) {
    const hashed = await applyPasswordHash(masterAdminPassword);
    await prisma.user.create({
      data: {
        tenantId,
        email: masterAdminEmail,
        firstName: "Kevin",
        lastName: "Admin",
        phone: "+1 (555) 555-5555",
        role: Role.HQ,
        avatarUrl: hashed
      }
    });
    return;
  }

  if (!extractPasswordHash(existing.avatarUrl)) {
    const hashed = await applyPasswordHash(masterAdminPassword, existing.avatarUrl ?? undefined);
    await prisma.user.update({
      where: { id: existing.id },
      data: { avatarUrl: hashed, role: Role.HQ }
    });
  }
};

const roleMatchesPortal = (role: Role, portal: "client" | "admin" | "cleaner") => {
  if (portal === "client") {
    return role === Role.CUSTOMER || role === Role.HQ;
  }
  if (portal === "cleaner") {
    return role === Role.CLEANER || role === Role.HQ;
  }
  return role === Role.HQ;
};

export const POST = async (request: Request) => {
  try {
    const payload = loginSchema.parse(await request.json());

    if (payload.portal === "admin") {
      await ensureMasterAdmin();
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found. Please register first." }, { status: 404 });
    }

    const validPassword = await verifyPassword(payload.password, user.avatarUrl);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!roleMatchesPortal(user.role, payload.portal)) {
      return NextResponse.json({ error: "This portal is not available for your role." }, { status: 403 });
    }

    const sessionCookie = await buildSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`.trim()
    });

    const response = NextResponse.json({
      ok: true,
      redirectTo: PORTAL_REDIRECT[payload.portal]
    });
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch (error) {
    console.error("[auth] login error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid login payload", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
};
