import { prisma } from "@/lib/prisma";
import type { PaymentStatus, RequestStatus, ServiceType } from "@prisma/client";

const SERVICE_LABEL: Record<ServiceType, string> = {
  HOME_CLEAN: "Healthy Home Clean",
  PRESSURE_WASH: "Pressure Washing",
  AUTO_DETAIL: "Eco Auto Detail",
  CUSTOM: "Custom Service"
};

type InvoiceSummary = {
  requestId: string;
  quoteId: string;
  service: string;
  total: number;
  paid: number;
  balance: number;
  status: "paid" | "due" | "deposit";
  depositDue: number;
  city: string;
};

type VisitSummary = {
  jobId: string;
  service: string;
  dateLabel: string;
  window: string;
  address: string;
  status: string;
};

type QuoteSummary = {
  requestId: string;
  quoteId: string;
  service: string;
  total: number;
  status: RequestStatus;
  createdAt: string;
};

export type ClientPortalData = {
  customerName: string;
  outstandingInvoices: InvoiceSummary[];
  paidInvoices: InvoiceSummary[];
  upcomingVisits: VisitSummary[];
  quotes: QuoteSummary[];
  totalRequests: number;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);

const sumPayments = (payments: { amount: number; status: PaymentStatus }[]) =>
  payments.filter((payment) => payment.status === "CAPTURED").reduce((sum, payment) => sum + payment.amount, 0);

export const getClientPortalData = async (email: string): Promise<ClientPortalData> => {
  const requests = await prisma.serviceRequest.findMany({
    where: { customerEmail: email },
    include: {
      quote: true,
      job: true,
      payments: true
    },
    orderBy: { createdAt: "desc" }
  });

  const outstandingInvoices: InvoiceSummary[] = [];
  const paidInvoices: InvoiceSummary[] = [];
  const upcomingVisits: VisitSummary[] = [];
  const quotes: QuoteSummary[] = [];

  requests.forEach((request) => {
    if (request.job?.scheduledStart) {
      const start = request.job.scheduledStart;
      const end = request.job.scheduledEnd ?? start;
      upcomingVisits.push({
        jobId: request.job.id,
        service: SERVICE_LABEL[request.serviceType],
        dateLabel: formatDate(start),
        window: `${formatTime(start)} – ${formatTime(end)}`,
        address: `${request.addressLine1}, ${request.city}`,
        status: request.job.status
      });
    }

    if (request.quote) {
      const paid = sumPayments(request.payments);
      const balance = Math.max(request.quote.total - paid, 0);
      const deposit = Math.max(request.quote.total * 0.2, 50);
      const invoice: InvoiceSummary = {
        requestId: request.id,
        quoteId: request.quote.id,
        service: SERVICE_LABEL[request.serviceType],
        total: request.quote.total,
        paid,
        balance,
        depositDue: Math.max(deposit - paid, 0),
        status: balance <= 0 ? "paid" : paid > 0 ? "deposit" : "due",
        city: request.city
      };

      if (balance <= 0) {
        paidInvoices.push(invoice);
      } else {
        outstandingInvoices.push(invoice);
      }

      quotes.push({
        requestId: request.id,
        quoteId: request.quote.id,
        service: SERVICE_LABEL[request.serviceType],
        total: request.quote.total,
        status: request.status,
        createdAt: request.createdAt.toISOString()
      });
    }
  });

  const requestName = requests[0]?.customerName ?? "";

  return {
    customerName: requestName,
    outstandingInvoices,
    paidInvoices,
    upcomingVisits,
    quotes,
    totalRequests: requests.length
  };
};
