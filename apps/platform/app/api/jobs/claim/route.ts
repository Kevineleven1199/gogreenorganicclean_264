import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { sendOperationalSms, sendSms } from "@/src/lib/notifications";

const claimSchema = z.object({
  jobId: z.string(),
  cleanerId: z.string(),
  cleanerPhone: z.string().optional(),
  cleanerName: z.string().optional()
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const payload = claimSchema.parse(body);

    const job = await prisma.job.findUnique({
      where: { id: payload.jobId },
      include: {
        assignments: true,
        request: true
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (job.assignments.some((assignment) => assignment.status === "CLAIMED")) {
      return NextResponse.json({ error: "Job already claimed." }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.jobAssignment.create({
        data: {
          jobId: payload.jobId,
          cleanerId: payload.cleanerId,
          status: "CLAIMED"
        }
      }),
      prisma.job.update({
        where: { id: payload.jobId },
        data: {
          status: JobStatus.CLAIMED
        }
      })
    ]);

    await sendOperationalSms(
      `Job ${payload.jobId} claimed by ${payload.cleanerName ?? payload.cleanerId}. Confirm schedule and notify customer.`
    );

    if (payload.cleanerPhone) {
      await sendSms({
        to: payload.cleanerPhone,
        text: `Thanks for claiming ${job.request.customerName}'s clean. Confirm visit details in the Go Green portal.`
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[jobs] Claim error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid claim payload", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to claim job" }, { status: 500 });
  }
};
