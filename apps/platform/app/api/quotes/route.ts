import { NextResponse } from "next/server";
import { generateQuoteForRequest } from "@/lib/quote-engine";
import { notifyCustomerQuoteReady } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId } = body as { requestId?: string };

    if (!requestId) {
      return NextResponse.json(
        { message: "requestId is required" },
        { status: 400 }
      );
    }

    const quote = await generateQuoteForRequest(requestId);
    await notifyCustomerQuoteReady(requestId);

    return NextResponse.json({ quote });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to generate quote" },
      { status: 500 }
    );
  }
}
