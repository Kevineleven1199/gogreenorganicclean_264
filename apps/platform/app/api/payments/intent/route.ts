import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { createStripePaymentIntent, createPayPalOrder } from "@/src/lib/payments";

const intentSchema = z.object({
  quoteId: z.string(),
  provider: z.enum(["stripe", "paypal"] as const),
  amount: z.number().optional(),
  deposit: z.boolean().optional().default(false),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const payload = intentSchema.parse(body);

    const quote = await prisma.quote.findUnique({
      where: { id: payload.quoteId },
      include: { request: { include: { payments: true } } }
    });

    if (!quote?.request) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    const defaultDeposit = Math.max(quote.total * 0.2, 50);
    const amount =
      payload.amount ??
      (payload.deposit
        ? quote.request.payments.find((payment) => payment.deposit)?.amount ?? defaultDeposit
        : quote.total);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Payment amount must be greater than zero." }, { status: 400 });
    }

    const paymentRecord = await prisma.paymentRecord.create({
      data: {
        requestId: quote.requestId,
        quoteId: quote.id,
        provider: payload.provider === "stripe" ? PaymentProvider.STRIPE : PaymentProvider.PAYPAL,
        amount,
        status: PaymentStatus.PENDING,
        deposit: payload.deposit
      }
    });

    if (payload.provider === "stripe") {
      const intent = await createStripePaymentIntent({
        amount,
        customerEmail: quote.request.customerEmail,
        metadata: { quoteId: quote.id, paymentRecordId: paymentRecord.id }
      });

      if (!intent) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
      }

      await prisma.paymentRecord.update({
        where: { id: paymentRecord.id },
        data: { providerIntentId: intent.id }
      });

      return NextResponse.json({
        paymentRecordId: paymentRecord.id,
        provider: "stripe",
        clientSecret: intent.clientSecret
      });
    }

    const order = await createPayPalOrder({
      amount,
      returnUrl: payload.returnUrl ?? `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://gogreenorganicclean.com"}/payments/success`,
      cancelUrl: payload.cancelUrl ?? `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://gogreenorganicclean.com"}/payments/canceled`,
      metadata: { quoteId: quote.id, paymentRecordId: paymentRecord.id }
    });

    if (!order) {
      return NextResponse.json({ error: "PayPal is not configured." }, { status: 500 });
    }

    await prisma.paymentRecord.update({
      where: { id: paymentRecord.id },
      data: { providerIntentId: order.id }
    });

    return NextResponse.json({
      paymentRecordId: paymentRecord.id,
      provider: "paypal",
      orderId: order.id,
      approvalUrl: order.links?.find((link) => link.rel === "approve")?.href
    });
  } catch (error) {
    console.error("[payments] intent error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payment payload", details: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to create payment intent" }, { status: 500 });
  }
};
