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
const f = contactPage.form;

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
        throw new Error(body.error ?? f.genericError);
      }
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : f.genericError);
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="py-16 text-center">
        <p className="script text-script-sm text-mauve">{contactPage.success.title}</p>
        <p className="mt-6">{contactPage.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
      <Field name="name" label={f.name.label} autoComplete="name" required />
      <Field name="email" label={f.email.label} type="email" autoComplete="email" required />
      <Field name="eventDate" label={f.eventDate.label} type="date" hint={f.eventDate.hint} />
      <Field name="eventType" label={f.eventType.label} as="select" options={f.eventType.options} />
      <Field name="venue" label={f.venue.label} />
      <Field name="budget" label={f.budget.label} as="select" options={f.budget.options} />

      <div className="md:col-span-2">
        <Field name="message" label={f.message.label} as="textarea" required />
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
          className="eyebrow btn w-full disabled:opacity-50 md:w-auto"
        >
          {state === "sending" ? f.submitting : f.submit}
        </button>

        {error && (
          <p role="alert" className="mt-5 text-body-sm text-mauve-tx">
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
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  required?: boolean;
  hint?: string;
  options?: readonly string[];
  autoComplete?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const base =
    "mt-3 w-full border-b border-ink/60 bg-transparent pb-3 text-body focus:border-ink focus:outline-hidden user-invalid:border-mauve-tx";

  return (
    <div>
      <label htmlFor={name} className="eyebrow text-ink">
        {label}
        {required && <span aria-hidden className="text-mauve-tx"> *</span>}
      </label>

      {as === "textarea" ? (
        <textarea id={name} name={name} rows={5} required={required} className={`${base} min-h-32 resize-y field-sizing-content`} />
      ) : as === "select" ? (
        // appearance-none drops the browser's own height and inset, so the
        // select lines up with the text fields beside it; the arrow is drawn.
        <div className="relative">
          <select
            id={name}
            name={name}
            required={required}
            defaultValue=""
            className={`${base} h-11 appearance-none pr-8`}
          >
            <option value="" disabled>
              {f.placeholder}
            </option>
            {options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 bottom-5 size-2 rotate-45 border-r border-b border-ink"
          />
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-describedby={hintId}
          className={`${base} h-11`}
        />
      )}

      {hint && (
        <p id={hintId} className="mt-2 text-body-sm text-ink">
          {hint}
        </p>
      )}
    </div>
  );
}
