"use client";

import { useState, useTransition } from "react";

type InvoicePaymentButtonProps = {
  quoteId: string;
  amount: number;
  deposit?: boolean;
};

export const InvoicePaymentButton = ({ quoteId, amount, deposit }: InvoicePaymentButtonProps) => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePay = () => {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, amount, deposit: Boolean(deposit), provider: "paypal" })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Unable to start payment.");
        return;
      }

      const data = (await response.json()) as { approvalUrl?: string };
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setError("Payment provider not configured. Please contact HQ.");
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={pending}
        className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-70"
      >
        {pending ? "Connecting..." : "Pay Securely"}
      </button>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
};
