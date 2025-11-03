import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const serviceBaseRates: Record<string, number> = {
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
  const baseRate =
    serviceBaseRates[request.serviceType] ?? serviceBaseRates.CUSTOM;
  const laborCost = squareFootage * baseRate;
  const surfacesMultiplier =
    1 + (request.surfaces.length - 1) * 0.06;
  const subtotal = Math.max(120, laborCost * surfacesMultiplier);
  const fees = subtotal * 0.05;
  const taxes = (subtotal + fees) * 0.07;
  if (!openaiClient) {
    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes: "Connect OpenAI or your preferred LLM provider to generate customer-facing quote narratives.",
    };
  }

  const message = `You are an environmentally minded cleaning concierge. Create a short summary for a quote with these details:
${JSON.stringify(
  {
    serviceType: request.serviceType,
    squareFootage: squareFootage,
    city: request.city,
    surfaces: request.surfaces,
    preferredWindows: request.preferredWindows,
    total: subtotal + fees + taxes,
  },
  null,
  2
)}`;

  try {
    const chatCompletion = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates short, friendly summaries of cleaning requests based on the quote calculation details provided.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "gpt-4o",
    });

    const smartNotes = chatCompletion.choices[0].message.content?.trim();

    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes,
    };
  } catch (error) {
    return {
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
      smartNotes: "An error occurred while generating a summary.",
    };
  }
};

export const generateQuoteForRequest = async (
  requestId: string
): Promise<void> => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Service request not found.");
  }

  const quoteData = await estimateQuote(request);

  await prisma.quote.upsert({
    where: { requestId },
    update: {
      subtotal: quoteData.subtotal,
      fees: quoteData.fees,
      taxes: quoteData.taxes,
      total: quoteData.total,
      smartNotes: quoteData.smartNotes,
    },
    create: {
      subtotal: quoteData.subtotal,
      fees: quoteData.fees,
      taxes: quoteData.taxes,
      total: quoteData.total,
      smartNotes: quoteData.smartNotes,
      requestId,
    },
  });
};
