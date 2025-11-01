import { prisma } from "@/lib/prisma";

type PayoutPayload = {
  tenantId: string;
  jobId: string;
  cleanerId: string;
  amount: number;
  currency?: string;
  method: "WISE" | "ZELLE" | "PAYPAL";
  memo?: string;
};

export const queuePayout = async (payload: PayoutPayload) => {
  const { tenantId, jobId, cleanerId, amount, currency = "USD", method } = payload;

  console.info("Queueing payout", payload);

  await prisma.notification.create({
    data: {
      tenantId,
      jobId,
      channel: "payout",
      payload: {
        method,
        cleanerId,
        amount,
        currency,
        memo: payload.memo ?? null
      }
    }
  });
};

type BillingPayload = {
  tenantId: string;
  requestId: string;
  total: number;
  currency?: string;
};

export const raiseInvoice = async (payload: BillingPayload) => {
  console.info("Invoice created", payload);
  await prisma.auditLog.create({
    data: {
      tenantId: payload.tenantId,
      actorId: null,
      action: "INVOICE_CREATED",
      metadata: payload
    }
  });
};

export const syncAdp1099 = async (tenantId: string, cleanerId: string) => {
  console.info("Sync ADP 1099", { tenantId, cleanerId });
  await prisma.auditLog.create({
    data: {
      tenantId,
      actorId: cleanerId,
      action: "ADP_SYNC_TRIGGERED",
      metadata: {}
    }
  });
};
