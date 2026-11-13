import { site } from "@/content/site";

/**
 * Contact form handler.
 *
 * This is the only server-side code in the project. Every page is static;
 * this single function exists so the form does not need a third-party
 * form service. It calls Resend's REST API directly rather than pulling in
 * an SDK, which keeps the dependency list short.
 *
 * Environment variables.
 *
 * The Vercel Resend integration injects these two automatically, so there is
 * nothing to copy by hand and nothing to re-set if the resource is
 * re-provisioned:
 *   RESEND_API_KEY        the sending key
 *   RESEND_EMAIL_DOMAIN   the verified domain, e.g. "anastasiafloristry.com"
 *
 * The From address is derived from those plus the studio name, so it stays
 * correct if the business is renamed. Optionally override the whole thing:
 *   RESEND_FROM           e.g. "Anastasia Floristry <hello@example.com>"
 *
 * The local part is a constant below rather than an env var; it only needs to
 * exist on the verified domain, and Resend accepts any local part there.
 */

/** Mailbox the enquiry notifications are sent FROM, on the verified domain. */
const SENDER_LOCAL_PART = "hello";

const FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["eventDate", "Event date"],
  ["eventType", "Event type"],
  ["venue", "Venue or location"],
  ["budget", "Budget"],
  ["message", "Message"],
] as const;

/** Trim and cap length. Returns plain text; escape it before putting it in HTML. */
function clean(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** For the HTML email body only. The subject and logs take plain text. */
function escapeHtml(value: string): string {
  return value.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
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
  const domain = process.env.RESEND_EMAIL_DOMAIN;

  // An explicit RESEND_FROM wins; otherwise build it from the injected domain.
  const from =
    process.env.RESEND_FROM ?? (domain ? `${site.name} <${SENDER_LOCAL_PART}@${domain}>` : undefined);

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

  const fields = Object.fromEntries(FIELDS.map(([key]) => [key, clean(payload[key])]));

  // pre-wrap keeps the line breaks of a multi-paragraph message.
  const rows = FIELDS.map(([key, label]) => {
    const value = fields[key];
    return value
      ? `<tr><td valign="top"><strong>${label}</strong></td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
      : "";
  }).join("");

  // Every failure path logs the full enquiry, so a failed send never loses it.
  const failed = (reason: string, detail?: unknown) => {
    console.error(`Inquiry NOT delivered (${reason}). Enquiry:`, fields, detail ?? "");
    return Response.json({ error: "We could not send that. Please try again." }, { status: 502 });
  };

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: site.contact.inquiryInbox,
        reply_to: email,
        // Plain text, no line breaks: an email subject is not HTML.
        subject: `New enquiry from ${name.replace(/[\r\n]+/g, " ")}`,
        html: `<table cellpadding="8">${rows}</table>`,
      }),
    });
  } catch (error) {
    return failed("network error reaching Resend", error);
  }

  if (!res.ok) {
    return failed(`Resend rejected it, status ${res.status}`, await res.text());
  }

  return Response.json({ ok: true });
}
