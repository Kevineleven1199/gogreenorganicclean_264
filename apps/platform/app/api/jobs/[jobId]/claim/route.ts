import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const { cleanerId } = (await request.json()) as { cleanerId?: string };
    if (!cleanerId) {
      return NextResponse.json(
        { message: "cleanerId required" },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignments: true
      }
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.status !== "PENDING") {
      return NextResponse.json(
        { message: "Job already claimed" },
        { status: 409 }
      );
    }

    await prisma.jobAssignment.create({
      data: {
        jobId: job.id,
        cleanerId
      }
    });

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "CLAIMED"
      }
    });

    return NextResponse.json({ jobId: job.id, status: "CLAIMED" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to claim job" }, { status: 500 });
  }
}
