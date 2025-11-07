import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateQuote, type QuoteAddOn, type QuoteFrequency, type QuoteLocationTier, type QuoteServiceType } from "@/src/lib/pricing";
import { prisma } from "@/lib/prisma";
import {
  JobStatus,
  PaymentProvider,
  PaymentStatus,
  RequestStatus,
  ServiceType
} from "@prisma/client";
import { sendOperationalSms, sendEmail, sendSms } from "@/src/lib/notifications";

const SERVICE_TYPE_VALUES = ["healthy_home", "deep_refresh", "move_in_out", "commercial"] as const;
const FREQUENCY_VALUES = ["one_time", "weekly", "biweekly", "monthly"] as const;
const LOCATION_VALUES = ["sarasota", "manatee", "pinellas", "hillsborough", "pasco", "out_of_area"] as const;
const ADD_ON_VALUES = [
  "inside_appliances",
  "interior_windows",
  "pressure_washing",
  "car_detailing",
  "laundry_organization",
  "eco_disinfection"
] as const;

const quoteRequestSchema = z.object({
  action: z.enum(["preview", "accept", "decline"]).default("preview"),
  quoteId: z.string().optional(),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(18),
  address: z.string().max(160).optional().default(""),
  city: z.string().max(120).optional().default(""),
  serviceType: z.enum(SERVICE_TYPE_VALUES),
  frequency: z.enum(FREQUENCY_VALUES),
  locationTier: z.enum(LOCATION_VALUES),
  bedrooms: z.coerce.number().int().min(0).max(9),
  bathrooms: z.coerce.number().int().min(0).max(9),
  squareFootage: z.coerce.number().min(400).max(8500),
  addOns: z.array(z.enum(ADD_ON_VALUES)).optional().default([]),
  preferredDate: z.string().max(40).optional(),
  notes: z.string().max(600).optional(),
  isFirstTimeClient: z.boolean().optional().default(true)
});

type QuoteAction = "preview" | "accept" | "decline";

const schedulingUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL ?? "https://gogreenorganicclean.com/request";

const SERVICE_LABELS: Record<QuoteServiceType, string> = {
  healthy_home: "Healthy Home Cleaning",
  deep_refresh: "Deep Refresh & Detox",
  move_in_out: "Move-In / Move-Out Detail",
  commercial: "Eco Commercial Care"
};

const FREQUENCY_LABELS: Record<QuoteFrequency, string> = {
  one_time: "One-time",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly"
};

const LOCATION_LABELS: Record<QuoteLocationTier, string> = {
  sarasota: "Sarasota County",
  manatee: "Manatee County",
  pinellas: "Pinellas County",
  hillsborough: "Hillsborough County",
  pasco: "Pasco County",
  out_of_area: "Extended Service Area"
};

const ADD_ON_LABELS: Record<QuoteAddOn, string> = {
  inside_appliances: "Inside fridge + oven",
  interior_windows: "Interior windows",
  pressure_washing: "Pressure washing",
  car_detailing: "Car detailing",
  laundry_organization: "Laundry & organization boost",
  eco_disinfection: "Eco disinfection fogging"
};

const SERVICE_TYPE_MAP: Record<QuoteServiceType, ServiceType> = {
  healthy_home: ServiceType.HOME_CLEAN,
  deep_refresh: ServiceType.HOME_CLEAN,
  move_in_out: ServiceType.HOME_CLEAN,
  commercial: ServiceType.CUSTOM
};

export const POST = async (request: Request) => {
  try {
    const json = await request.json();
    const payload = quoteRequestSchema.parse(json);

    const {
      action,
      serviceType,
      frequency,
      locationTier,
      bedrooms,
      bathrooms,
      squareFootage,
      addOns,
      isFirstTimeClient
    } = payload;

    const breakdown = calculateQuote({
      serviceType,
      frequency,
      locationTier,
      bedrooms,
      bathrooms,
      squareFootage,
      addOns,
      isFirstTimeClient
    });

    const tenantId = process.env.DEFAULT_TENANT_ID ?? null;

    let quoteId = payload.quoteId ?? `Q-${Date.now()}`;
    let requestId: string | null = null;

    if (tenantId) {
      try {
        const existingQuote = payload.quoteId
          ? await prisma.quote.findUnique({
              where: { id: payload.quoteId },
              include: { request: true }
            })
          : null;

        if (existingQuote) {
          quoteId = existingQuote.id;
          requestId = existingQuote.requestId;

          await prisma.serviceRequest.update({
            where: { id: existingQuote.requestId },
            data: {
              customerName: payload.name,
              customerEmail: payload.email,
              customerPhone: payload.phone,
              addressLine1: payload.address || "TBD",
              city: payload.city || "Sarasota",
              state: "FL",
              postalCode: existingQuote.request.postalCode ?? "00000",
              squareFootage: Math.round(squareFootage),
              notes: payload.notes,
              status:
                action === "accept"
                  ? RequestStatus.ACCEPTED
                  : action === "decline"
                  ? RequestStatus.CANCELED
                  : RequestStatus.QUOTED
            }
          });

          await prisma.quote.update({
            where: { id: existingQuote.id },
            data: {
              subtotal: breakdown.totalBeforeDiscount,
              fees: breakdown.travelFee,
              taxes: 0,
              total: breakdown.total,
              smartNotes: payload.notes,
              updatedAt: new Date()
            }
          });
        } else {
          const createdRequest = await prisma.serviceRequest.create({
            data: {
              tenantId,
              customerName: payload.name,
              customerEmail: payload.email,
              customerPhone: payload.phone,
              addressLine1: payload.address || "TBD",
              city: payload.city || "Sarasota",
              state: "FL",
              postalCode: "00000",
              serviceType: SERVICE_TYPE_MAP[serviceType],
              squareFootage: Math.round(squareFootage),
              notes: payload.notes,
              status:
                action === "accept"
                  ? RequestStatus.ACCEPTED
                  : action === "decline"
                  ? RequestStatus.CANCELED
                  : RequestStatus.QUOTED
            }
          });

          requestId = createdRequest.id;

          const createdQuote = await prisma.quote.create({
            data: {
              requestId: createdRequest.id,
              subtotal: breakdown.totalBeforeDiscount,
              fees: breakdown.travelFee,
              taxes: 0,
              total: breakdown.total,
              smartNotes: payload.notes,
              expiresAt: payload.preferredDate ? new Date(payload.preferredDate) : undefined
            }
          });

          quoteId = createdQuote.id;
        }

        if (action === "accept" && requestId) {
          await prisma.job.upsert({
            where: { requestId },
            update: {
              status: JobStatus.PENDING,
              payoutAmount: breakdown.cleanerPay,
              updatedAt: new Date()
            },
            create: {
              tenantId,
              requestId,
              status: JobStatus.PENDING,
              payoutAmount: breakdown.cleanerPay
            }
          });

          const existingDeposit = await prisma.paymentRecord.findFirst({
            where: { requestId, deposit: true }
          });

          if (existingDeposit) {
            await prisma.paymentRecord.update({
              where: { id: existingDeposit.id },
              data: {
                amount: breakdown.recommendedDeposit,
                status: PaymentStatus.PENDING,
                metadata: {
                  ...(typeof existingDeposit.metadata === "object" && existingDeposit.metadata !== null
                    ? (existingDeposit.metadata as Record<string, unknown>)
                    : {}),
                  charge_type: "deposit",
                  quote_total: breakdown.total
                }
              }
            });
          } else {
            await prisma.paymentRecord.create({
              data: {
                requestId,
                quoteId,
                provider: PaymentProvider.STRIPE,
                amount: breakdown.recommendedDeposit,
                status: PaymentStatus.PENDING,
                deposit: true,
                metadata: {
                  charge_type: "deposit",
                  quote_total: breakdown.total
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("[quotes] Failed to persist quote to database", error);
      }
    }

    const monthlyValue = frequency === "weekly" ? breakdown.total * 4 : frequency === "biweekly" ? breakdown.total * 2 : breakdown.total;

    const responseBody = {
      quoteId,
      action,
      summary: {
        serviceLabel: SERVICE_LABELS[serviceType],
        frequencyLabel: FREQUENCY_LABELS[frequency],
        locationLabel: LOCATION_LABELS[locationTier]
      },
      pricing: breakdown,
      monthlyValue: Number(monthlyValue.toFixed(2)),
      message:
        action === "preview"
          ? "Quote generated successfully."
          : action === "accept"
          ? "Quote accepted. Our scheduling team will follow up shortly."
          : "Quote declined. Thank you for considering us.",
      schedulingUrl
    };

    if (action !== "preview") {
      const addOnLabelList = payload.addOns.length ? payload.addOns.map((item) => ADD_ON_LABELS[item]).join(", ") : "No add-ons";
      const alertMessage =
        `Quote ${action.toUpperCase()} – ${payload.name} (${payload.phone})\n` +
        `${SERVICE_LABELS[payload.serviceType]} • ${FREQUENCY_LABELS[payload.frequency]} • ${LOCATION_LABELS[locationTier]}\n` +
        `Home: ${payload.bedrooms}BR/${payload.bathrooms}BA, ${squareFootage} sqft\n` +
        `Total: $${breakdown.total.toFixed(2)} | Cleaner pay: $${breakdown.cleanerPay.toFixed(2)}\n` +
        `Add-ons: ${addOnLabelList}` +
        (payload.preferredDate ? `\nPreferred date: ${payload.preferredDate}` : "") +
        (payload.notes ? `\nNotes: ${payload.notes}` : "");

      await sendOperationalSms(alertMessage);

      await sendEmail({
        to: payload.email,
        subject:
          action === "accept"
            ? "Your Go Green Organic Clean visit is being scheduled"
            : action === "decline"
            ? "We’re here if you need us"
            : "Your Go Green Organic Clean quote",
        html:
          action === "accept"
            ? `<p>Hi ${payload.name},</p><p>Thanks for choosing Go Green Organic Clean! We’re lining up the perfect cleaner for you. Please choose up to three preferred time windows so we can lock in your visit.</p><p>Total per visit: <strong>$${breakdown.total.toFixed(2)}</strong><br>Deposit to reserve: <strong>$${breakdown.recommendedDeposit.toFixed(2)}</strong></p><p>We’ll text you updates as soon as your cleaning pro claims the job.</p>`
            : action === "decline"
            ? `<p>Hi ${payload.name},</p><p>Thanks for considering Go Green Organic Clean. If you’d like a revised estimate or have questions about our process, just reply to this email or text us at ${process.env.OPENPHONE_DEFAULT_NUMBER ?? "(941) 271-7948"}.</p>`
            : `<p>Hi ${payload.name},</p><p>Here’s your personalized quote for ${SERVICE_LABELS[serviceType]}.</p><p>Total per visit: <strong>$${breakdown.total.toFixed(2)}</strong><br>Recurring value ≈ <strong>$${monthlyValue.toFixed(2)}/month</strong></p><p><a href="${schedulingUrl}" target="_blank">Accept & reserve your clean</a> when you’re ready!</p>`
      });

      if (action === "accept") {
        await sendSms({
          to: payload.phone,
          text:
            "Thanks for booking with Go Green Organic Clean! Share your preferred cleaning windows and we’ll confirm once your pro claims the job."
        });
      }
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Quote API error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid quote request", details: error.flatten() }, { status: 422 });
    }

    return NextResponse.json({ error: "Unable to process quote at this time." }, { status: 500 });
  }
};
