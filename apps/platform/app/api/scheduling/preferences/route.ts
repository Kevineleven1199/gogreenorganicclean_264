import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SchedulingStatus } from "@prisma/client";
import { sendOperationalSms } from "@/src/lib/notifications";

const schedulingSchema = z.object({
  quoteId: z.string(),
  slots: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
        priority: z.number().optional()
      })
    )
    .min(1)
    .max(5)
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const payload = schedulingSchema.parse(body);

    const quote = await prisma.quote.findUnique({
      where: { id: payload.quoteId },
      include: { request: true }
    });

    if (!quote?.request) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    const requestId = quote.requestId;

    await prisma.schedulingPreference.deleteMany({
      where: { requestId }
    });

    await prisma.$transaction(
      payload.slots.map((slot, index) =>
        prisma.schedulingPreference.create({
          data: {
            requestId,
            windowStart: new Date(slot.start),
            windowEnd: new Date(slot.end),
            priority: slot.priority ?? index + 1,
            status: SchedulingStatus.PENDING
          }
        })
      )
    );

    await sendOperationalSms(
      `Scheduling options received for quote ${payload.quoteId} – ${payload.slots
        .map((slot) => new Date(slot.start).toLocaleString())
        .join(", ")}`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[scheduling] Failed to record preferences", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid scheduling payload", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to save scheduling preferences" }, { status: 500 });
  }
};
