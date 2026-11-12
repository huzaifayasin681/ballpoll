import "server-only";

/**
 * Customer notifications (email / push).
 * [Insert Email Provider API Key Here]: plug in Resend, SES, Postmark etc.
 * Until a provider is configured, messages are logged to the server console.
 */
export async function notifyCustomer(to: string, subject: string, body: string) {
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || `GlobalPoolStore <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>`,
          to,
          subject,
          text: body,
        }),
      });
      return;
    } catch (e) {
      console.error("[notify] email failed", e);
    }
  }
  console.info(`[notify] → ${to} | ${subject}\n${body}`);
}
