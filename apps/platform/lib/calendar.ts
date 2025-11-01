import { google } from "googleapis";
import { formatISO } from "date-fns";
import { prisma } from "@/lib/prisma";

type CalendarEventInput = {
  tenantId: string;
  jobId: string;
  title: string;
  start: Date;
  end: Date;
  customerEmail: string;
  cleanerEmails: string[];
  description?: string;
};

export const scheduleGoogleCalendarEvent = async (input: CalendarEventInput) => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT || !process.env.GOOGLE_SERVICE_KEY) {
    console.warn("Google Calendar credentials missing. Skipping calendar sync.");
    return { status: "skipped" } as const;
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT,
    key: process.env.GOOGLE_SERVICE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? "primary",
    requestBody: {
      summary: input.title,
      description: input.description ?? "Scheduled via GoGreenOS",
      start: {
        dateTime: formatISO(input.start)
      },
      end: {
        dateTime: formatISO(input.end)
      },
      attendees: [
        { email: input.customerEmail },
        ...input.cleanerEmails.map((email) => ({ email }))
      ]
    }
  });

  await prisma.notification.create({
    data: {
      tenantId: input.tenantId,
      jobId: input.jobId,
      channel: "calendar",
      payload: {
        provider: "google",
        start: input.start,
        end: input.end
      }
    }
  });

  return { status: "scheduled" } as const;
};

export const scheduleAppleCalendarPlaceholder = async (input: CalendarEventInput) => {
  console.info("Apple calendar sync placeholder", input);
  await prisma.notification.create({
    data: {
      tenantId: input.tenantId,
      jobId: input.jobId,
      channel: "calendar",
      payload: {
        provider: "apple",
        start: input.start,
        end: input.end
      }
    }
  });

  return { status: "pending" } as const;
};
