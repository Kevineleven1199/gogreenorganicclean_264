import type { Notification } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type OpenPhoneMessagePayload = {
  to: string;
  body: string;
  metadata?: Record<string, unknown>;
};

export const sendOpenPhoneMessage = async (payload: OpenPhoneMessagePayload) => {
  if (!process.env.OPENPHONE_API_KEY) {
    console.warn("OpenPhone API key missing. Skipping message.");
    return { status: "skipped" } as const;
  }

  const endpoint = process.env.OPENPHONE_API_BASE_URL ?? "https://api.openphone.com/v1/messages";

  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENPHONE_API_KEY}`
    },
    body: JSON.stringify(payload)
  }).catch((error) => {
    console.error("Failed to call OpenPhone", error);
  });

  return { status: "queued" } as const;
};

export const logNotification = async (tenantId: string, jobId: string | null, payload: Record<string, unknown>) => {
  return prisma.notification.create({
    data: {
      tenantId,
      jobId,
      channel: "openphone_sms",
      payload,
      delivered: false
    }
  });
};

export const markNotificationDelivered = async (notification: Notification) => {
  return prisma.notification.update({
    where: { id: notification.id },
    data: { delivered: true }
  });
};
