import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/src/lib/utils";

const querySchema = z.object({
  cleanerId: z.string().min(1),
  timezone: z.string().optional().default("America/New_York")
});

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      cleanerId: searchParams.get("cleanerId"),
      timezone: searchParams.get("timezone") ?? undefined
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Missing cleanerId." }, { status: 400 });
    }

    const { cleanerId, timezone } = parsed.data;

    const payouts = await prisma.cleanerPayout.findMany({
      where: { cleanerId },
      include: {
        job: {
          include: {
            request: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    const upcoming = payouts.filter((payout) => payout.status !== "SENT").map((payout) => ({
      id: payout.id,
      amount: payout.amount,
      currency: payout.currency,
      status: payout.status,
      initiatedAt: payout.initiatedAt,
      customerName: payout.job.request.customerName,
      serviceType: payout.job.request.serviceType,
      address: {
        line1: payout.job.request.addressLine1,
        city: payout.job.request.city,
        state: payout.job.request.state
      },
      formattedAmount: formatCurrency(payout.amount, payout.currency),
      formattedInitiatedAt: payout.initiatedAt
        ? new Date(payout.initiatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short", timeZone: timezone })
        : null
    }));

    const history = payouts.filter((payout) => payout.status === "SENT").map((payout) => ({
      id: payout.id,
      amount: payout.amount,
      currency: payout.currency,
      completedAt: payout.completedAt,
      formattedAmount: formatCurrency(payout.amount, payout.currency),
      formattedCompletedAt: payout.completedAt
        ? new Date(payout.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short", timeZone: timezone })
        : null,
      customerName: payout.job.request.customerName
    }));

    const totals = {
      lifetimeEarnings: payouts.reduce((total, payout) => total + payout.amount, 0),
      pending: upcoming.reduce((total, payout) => total + payout.amount, 0),
      completed: history.reduce((total, payout) => total + payout.amount, 0)
    };

    return NextResponse.json({
      cleanerId,
      upcoming,
      history,
      totals: {
        lifetimeEarnings: formatCurrency(totals.lifetimeEarnings),
        pending: formatCurrency(totals.pending),
        completed: formatCurrency(totals.completed)
      }
    });
  } catch (error) {
    console.error("[payouts] Failed to load cleaner payouts", error);
    return NextResponse.json({ error: "Unable to load payouts." }, { status: 500 });
  }
};
