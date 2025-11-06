const OPENPHONE_BASE_URL = "https://api.openphone.com/v1/messages";
const SENDGRID_BASE_URL = "https://api.sendgrid.com/v3/mail/send";

type SmsPayload = {
  to: string;
  text: string;
  from?: string;
};

type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
};

const defaultFromName = "Go Green Organic Clean";
const defaultFromEmail = process.env.SENDGRID_FROM_EMAIL ?? "no-reply@gogreenorganicclean.com";

const logMissing = (service: string) => console.warn(`[notifications] Missing configuration for ${service}, skipping send.`);

export const sendSms = async ({ to, text, from }: SmsPayload) => {
  const apiKey = process.env.OPENPHONE_API_KEY;
  const fromNumber = from ?? process.env.OPENPHONE_DEFAULT_NUMBER;

  if (!apiKey || !fromNumber) {
    logMissing("OpenPhone SMS");
    return;
  }

  try {
    await fetch(OPENPHONE_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ to, from: fromNumber, text })
    });
  } catch (error) {
    console.error("[notifications] Failed to send SMS", error);
  }
};

export const sendOperationalSms = async (message: string) => {
  const alertNumber = process.env.OPENPHONE_ALERT_NUMBER;
  if (!alertNumber) {
    logMissing("Operational SMS alert number");
    return;
  }
  await sendSms({ to: alertNumber, text: message });
};

export const sendEmail = async ({ to, subject, text, html, fromEmail, fromName, replyTo }: EmailPayload) => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    logMissing("SendGrid");
    return;
  }

  try {
    await fetch(SENDGRID_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: fromEmail ?? defaultFromEmail,
          name: fromName ?? defaultFromName
        },
        reply_to: replyTo ? { email: replyTo } : undefined,
        subject,
        content: [
          html
            ? { type: "text/html", value: html }
            : { type: "text/plain", value: text ?? "" }
        ]
      })
    });
  } catch (error) {
    console.error("[notifications] Failed to send email", error);
  }
};

export const sendSlackNotification = async (message: string) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    logMissing("Slack webhook");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: message })
    });
  } catch (error) {
    console.error("[notifications] Failed to post to Slack", error);
  }
};
