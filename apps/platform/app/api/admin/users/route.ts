import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const ALLOWED_ROLES = [Role.HQ, Role.CLEANER] as const;

const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  payoutMethod: z.string().optional(),
  serviceRadius: z.coerce.number().optional()
});

export const GET = async () => {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json({ error: "DEFAULT_TENANT_ID is not configured." }, { status: 500 });
    }

    const users = await prisma.user.findMany({
      where: {
        tenantId,
        role: {
          in: ALLOWED_ROLES
        }
      },
      include: {
        cleaner: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        cleaner: user.cleaner
          ? {
              id: user.cleaner.id,
              rating: user.cleaner.rating,
              completedJobs: user.cleaner.completedJobs,
              serviceRadius: user.cleaner.serviceRadius,
              payoutMethod: user.cleaner.payoutMethod
            }
          : null
      }))
    });
  } catch (error) {
    console.error("[admin-users] Failed to list users", error);
    return NextResponse.json({ error: "Unable to load team members." }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json({ error: "DEFAULT_TENANT_ID is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const payload = createUserSchema.parse(body);

    if (!ALLOWED_ROLES.includes(payload.role)) {
      return NextResponse.json({ error: "Only cleaners and HQ managers can be created here." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (existing) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        tenantId,
        email: payload.email,
        phone: payload.phone,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role
      }
    });

    if (payload.role === Role.CLEANER) {
      await prisma.cleanerProfile.create({
        data: {
          userId: user.id,
          payoutMethod: payload.payoutMethod ?? "WISE",
          serviceRadius: payload.serviceRadius ?? 15
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin-users] Failed to create user", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid user payload.", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
};
