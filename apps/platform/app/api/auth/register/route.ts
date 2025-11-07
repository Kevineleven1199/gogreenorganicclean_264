import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { applyPasswordHash, extractPasswordHash } from "@/src/lib/auth/password";
import { buildSessionCookie } from "@/src/lib/auth/cookies";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8)
});

export const POST = async (request: Request) => {
  try {
    const payload = registerSchema.parse(await request.json());
    const tenantId = process.env.DEFAULT_TENANT_ID;

    if (!tenantId) {
      return NextResponse.json({ error: "DEFAULT_TENANT_ID is not configured." }, { status: 500 });
    }

    const normalizedPhone = payload.phone.replace(/[^\d+]/g, "");

    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (user && user.role !== Role.CUSTOMER) {
      return NextResponse.json({ error: "This email belongs to an internal user. Please contact HQ for access." }, { status: 400 });
    }

    if (user && extractPasswordHash(user.avatarUrl)) {
      return NextResponse.json({ error: "Account already registered. Please log in." }, { status: 409 });
    }

    const avatarPayload = await applyPasswordHash(payload.password, user?.avatarUrl ?? undefined);

    if (!user) {
      user = await prisma.user.create({
        data: {
          tenantId,
          email: payload.email,
          phone: normalizedPhone,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: Role.CUSTOMER,
          avatarUrl: avatarPayload
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: normalizedPhone,
          avatarUrl: avatarPayload,
          role: Role.CUSTOMER
        }
      });
    }

    const sessionCookie = await buildSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`.trim()
    });

    const response = NextResponse.json({ ok: true, redirectTo: "/client" });
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch (error) {
    console.error("[auth] register error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid registration payload", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to register." }, { status: 500 });
  }
};
