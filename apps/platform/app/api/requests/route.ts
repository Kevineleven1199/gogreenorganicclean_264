import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceRequestSchema } from "@/lib/validators";
import { generateQuoteForRequest } from "@/lib/quote-engine";
import { notifyCustomerQuoteReady } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = serviceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid request",
          issues: parsed.error.flatten().fieldErrors
        },
        { status: 422 }
      );
    }

    const payload = parsed.data;

    const tenant = await prisma.tenant.findUnique({
      where: { slug: payload.tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json(
        {
          message: `Tenant ${payload.tenantSlug} not configured.`
        },
        { status: 404 }
      );
    }

    const createdRequest = await prisma.serviceRequest.create({
      data: {
        tenantId: tenant.id,
        customerName: `${payload.contact.firstName} ${payload.contact.lastName}`.trim(),
        customerEmail: payload.contact.email.toLowerCase(),
        customerPhone: payload.contact.phone,
        addressLine1: payload.location.addressLine1,
        addressLine2: payload.location.addressLine2,
        city: payload.location.city,
        state: payload.location.state,
        postalCode: payload.location.postalCode,
        lat: payload.location.lat,
        lng: payload.location.lng,
        serviceType: payload.serviceType === "home_clean"
          ? "HOME_CLEAN"
          : payload.serviceType === "pressure_wash"
            ? "PRESSURE_WASH"
            : payload.serviceType === "auto_detail"
              ? "AUTO_DETAIL"
              : "CUSTOM",
        squareFootage: payload.squareFootage ?? null,
        surfaces: payload.surfaces,
        preferredStart: payload.preferredWindows[0]
          ? new Date(payload.preferredWindows[0]?.start)
          : null,
        preferredEnd: payload.preferredWindows[0]
          ? new Date(payload.preferredWindows[0]?.end)
          : null,
        preferredWindows: payload.preferredWindows,
        notes: payload.notes ?? null
      }
    });

    queueQuoteGeneration(createdRequest.id).catch((error) => {
      console.error("Background quote generation failed", error);
    });

    return NextResponse.json(
      {
        requestId: createdRequest.id,
        status: createdRequest.status
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unexpected error" },
      { status: 500 }
    );
  }
}

const queueQuoteGeneration = async (requestId: string) => {
  const quote = await generateQuoteForRequest(requestId);
  await notifyCustomerQuoteReady(requestId);
  return quote;
};
