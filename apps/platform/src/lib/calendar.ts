import { google } from "googleapis";

const calendar = google.calendar("v3");

type CalendarEventInput = {
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  jobId: string;
};

const getAuthClient = () => {
  const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.warn("[calendar] Missing Google service account credentials.");
    return null;
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });
};

const getCalendarId = () => process.env.GOOGLE_CALENDAR_ID ?? "primary";

export const createTentativeCalendarEvent = async ({
  summary,
  description,
  location,
  start,
  end,
  attendees,
  jobId
}: CalendarEventInput) => {
  const auth = getAuthClient();
  if (!auth) return null;

  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: getCalendarId(),
      requestBody: {
        summary,
        description,
        location,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees,
        status: "tentative",
        extendedProperties: {
          private: {
            jobId
          }
        }
      },
      sendUpdates: "all"
    });

    return response.data;
  } catch (error) {
    console.error("[calendar] Failed to create event", error);
    return null;
  }
};

export const updateCalendarEventStatus = async (eventId: string, status: "confirmed" | "cancelled") => {
  const auth = getAuthClient();
  if (!auth) return null;

  try {
    if (status === "cancelled") {
      await calendar.events.delete({
        auth,
        calendarId: getCalendarId(),
        eventId,
        sendUpdates: "all"
      });
      return;
    }

    const response = await calendar.events.patch({
      auth,
      calendarId: getCalendarId(),
      eventId,
      requestBody: {
        status: "confirmed"
      },
      sendUpdates: "all"
    });

    return response.data;
  } catch (error) {
    console.error("[calendar] Failed to update event", error);
    return null;
  }
};
