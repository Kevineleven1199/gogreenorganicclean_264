import OpenAI from "openai";
import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const serviceBaseRates: Record<ServiceType, number> = {
  HOME_CLEAN: 0.22,
  PRESSURE_WASH: 0.35,
  AUTO_DETAIL: 0.28,
  CUSTOM: 0.32,
};

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type QuoteResult = {
  subtotal: number;
  fees: number;
  taxes: number;
  total: number;
  smartNotes?: string;
};

export const estimateQuote = async (request: any): Promise<QuoteResult> => {
  const squareFootage = request.squareFootage ?? 2000;
  const baseRate = serviceBaseRates[request.serviceType] ?? serviceBaseRates.CUSTOM;
  const laborCost = squareFootage * baseRate;
  const surfacesMultiplier = 1 + (request.surfaces.length - 1) * 0.06;
  const subtotal = Math.max(120, laborCost * surfacesMultiplier);
  const fees = subtotal * 0.05;
  const taxes = (subtotal + fees) * 0.07;

  if (!openaiClient) {
    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes:
        "Connect OpenAI or your preferred LLM provider to generate customer-facing quote narratives.",
    };
  }

  const message = `You are an environmentally minded cleaning concierge. Create a short summary for a quote with these details: ${JSON.stringify(
    {
      serviceType: request.serviceType,
      squareFootage: request.squareFootage,
      surfaces: request.surfaces,
      city: request.city,
      preferredWindow: request.preferredWindows,
    },
  )}`;

  try {
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: "You write warm, premium yet concise messages." },
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 220,
    });

    const smartNotes = completion.choices[0]?.message?.content?.trim();

    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes: smartNotes ?? undefined,
    };
  } catch (error) {
    console.error("Quote generation failed", error);
    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes:
        "LLM quote narrative unavailable. Generated price using internal estimator.",
    };
  }
};

export const generateQuoteForRequest = async (requestId: string) => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const quoteData = await estimateQuote(request);

  const quote = await prisma.quote.upsert({
    where: {
      requestId,
    },
    update: {
      subtotal: quoteData.subtotal,
      fees: quoteData.fees,
      taxes: quoteData.taxes,
      total: quoteData.total,
      smartNotes: quoteData.smartNotes,
      aiVersion: process.env.OPENAI_MODEL ?? "baseline",
    },
    create: {
      requestId,
      subtotal: quoteData.subtotal,
      fees: quoteData.fees,
      taxes: quoteData.taxes,
      total: quoteData.total,
      smartNotes: quoteData.smartNotes,
      aiVersion: process.env.OPENAI_MODEL ?? "baseline",
    },
  });

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: "QUOTED",
    },
  });

  return quote;
};
