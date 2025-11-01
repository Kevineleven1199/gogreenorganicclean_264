import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { finalizeJobAutomation } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const body = await request.json();
    const { start, end, payoutAmount } = body as {
      start?: string;
      end?: string;
      payoutAmount?: number;
    };

    if (!start || !end) {
      return NextResponse.json(
        { message: "start and end are required" },
        { status: 400 }
      );
    }

    const job = await prisma.job.update({
      where: { id: params.jobId },
      data: {
        scheduledStart: new Date(start),
        scheduledEnd: new Date(end),
        payoutAmount: payoutAmount ?? null,
        status: "SCHEDULED"
      }
    });

    await finalizeJobAutomation(job.id);

    return NextResponse.json({ jobId: job.id, status: job.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to schedule job" },
      { status: 500 }
    );
  }
}
