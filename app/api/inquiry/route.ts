import { site } from "@/content/site";

/**
 * Contact form handler.
 *
 * This is the only server-side code in the project. Every page is static;
 * this single function exists so the form does not need a third-party
 * form service. It calls Resend's REST API directly rather than pulling in
 * an SDK, which keeps the dependency list short.
 *
 * Required environment variables (set these in Vercel):
 *   RESEND_API_KEY  from resend.com
 *   RESEND_FROM     a verified sender, e.g. "Studio <hello@yourdomain.com>"
 */

const FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["eventDate", "Event date"],
  ["eventType", "Event type"],
  ["venue", "Venue or location"],
  ["budget", "Budget"],
  ["message", "Message"],
] as const;

/** Trim, cap length, and strip anything that could break out of the HTML email. */
function clean(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .slice(0, max)
    .replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Return 200 so it does not retry.
  if (clean(payload.company)) {
    return Response.json({ ok: true });
  }

  const name = clean(payload.name, 200);
  const email = clean(payload.email, 200);
  const message = clean(payload.message);

  if (!name || !email || !message) {
    return Response.json({ error: "Please fill in every required field." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email address does not look right." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    // Fail loudly in the server log rather than silently dropping an enquiry.
    console.error("Inquiry received but email is not configured. Payload:", {
      name,
      email,
      message,
    });
    return Response.json(
      { error: "The form is not configured yet. Please email us directly." },
      { status: 500 },
    );
  }

  const rows = FIELDS.map(([key, label]) => {
    const value = clean(payload[key]);
    return value ? `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>` : "";
  }).join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: site.contact.inquiryInbox,
      reply_to: email,
      subject: `New enquiry from ${name}`,
      html: `<table cellpadding="8">${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected the request:", res.status, await res.text());
    return Response.json({ error: "We could not send that. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
