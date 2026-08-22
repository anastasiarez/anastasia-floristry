"use client";

import { useState } from "react";
import { contactPage } from "@/content/pages";

/**
 * Inquiry form.
 *
 * Posts to /api/inquiry. Fields match what a florist actually needs to
 * quote a job, which is not the same set the reference design used.
 * Validation is left to the browser plus a server-side check in the route
 * handler, so there is no client validation library to maintain.
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="py-16 text-center">
        <p className="script text-script-sm text-clay">{contactPage.success.title}</p>
        <p className="mt-6">{contactPage.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
      <Field name="name" label="Your name" required />
      <Field name="email" label="Email address" type="email" required />
      <Field name="eventDate" label="Event date" type="date" hint="Approximate is fine" />
      <Field name="eventType" label="Type of event" as="select" options={["Wedding", "Event", "Installation", "Something else"]} />
      <Field name="venue" label="Venue or location" />
      <Field name="budget" label="Floral budget" as="select" options={["Under $2,000", "$2,000 – $5,000", "$5,000 – $10,000", "$10,000+", "Not sure yet"]} />

      <div className="md:col-span-2">
        <Field name="message" label="Tell us about the day" as="textarea" required />
      </div>

      {/* Honeypot. Bots fill hidden fields, people do not. */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="eyebrow w-full border border-taupe px-10 py-5 transition-colors hover:bg-taupe hover:text-cream disabled:opacity-50 md:w-auto"
        >
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>

        {error && (
          <p role="alert" className="mt-5 text-body-sm text-clay-tx">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  as = "input",
  required,
  hint,
  options,
}: {
  name: string;
  label: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  required?: boolean;
  hint?: string;
  options?: string[];
}) {
  const base =
    "mt-3 w-full border-b border-taupe/30 bg-transparent pb-3 text-body focus:border-tan focus:outline-none";

  return (
    <div>
      <label htmlFor={name} className="eyebrow text-text">
        {label}
        {required && <span aria-hidden className="text-clay-tx"> *</span>}
      </label>

      {as === "textarea" ? (
        <textarea id={name} name={name} rows={5} required={required} className={`${base} resize-y`} />
      ) : as === "select" ? (
        <select id={name} name={name} required={required} defaultValue="" className={base}>
          <option value="" disabled>
            Select one
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input id={name} name={name} type={type} required={required} className={base} />
      )}

      {hint && <p className="mt-2 text-body-sm text-text">{hint}</p>}
    </div>
  );
}
