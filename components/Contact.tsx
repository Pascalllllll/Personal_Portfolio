"use client";

import { useRef, useState } from "react";
import { AlertCircle, Github, Linkedin, Mail } from "lucide-react";
import { content } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT_EMAIL, LIMITS, normalize, validate, type ErrorKey, type Field } from "@/lib/contact";

const EMAIL = CONTACT_EMAIL;

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/Pascalllllll", handle: "@Pascalllllll" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hoseafs-3a9a0931b/",
    handle: "Hosea Felix Sanjaya",
  },
  { icon: Mail, label: "Email", href: `mailto:${EMAIL}`, handle: EMAIL },
];

const input =
  "w-full rounded-md border border-line-strong aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink bg-raised px-4 py-3 text-base text-ink placeholder:text-faint transition-colors duration-200 ease-out hover:border-ink disabled:opacity-60";

export default function Contact() {
  const t = content.contact;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, ErrorKey>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const inFlight = useRef(false);

  const update = (field: Field, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    // Once an error is showing, re-check as the visitor types so it clears as soon as it is fixed.
    if (errors[field]) setErrors(validate(normalize(next)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    const found = validate(normalize(form));
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalize(form), botcheck }),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else if (response.status === 400 && result?.fields) {
        // The server rejected a field the browser let through; show it on that field.
        setErrors(result.fields);
        setStatus("idle");
      } else {
        console.error("Contact form error:", response.status, result?.error);
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact form network error:", error);
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading id="contact-title" label={t.label} title={t.title} />

        <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-14">
          <div data-reveal>
            <p className="text-muted">{t.subtitle}</p>

            <h3 className="mb-2 mt-10 text-sm font-medium text-faint">{t.orReach}</h3>
            <ul className="border-t border-line">
              {socials.map(({ icon: Icon, label, href, handle }) => (
                <li key={label} className="border-b border-line">
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center gap-4 py-3"
                  >
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" className="flex-shrink-0 text-muted" />
                    <span className="w-16 flex-shrink-0 text-sm text-faint">{label}</span>
                    <span className="link min-w-0 break-words text-sm font-medium text-ink">
                      {handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} aria-live="polite">
            {status === "success" ? (
              <div className="rounded-lg border border-line bg-raised p-6 md:p-8">
                <p className="font-display text-xl font-medium text-ink">{t.success}</p>
                <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-6">
                  {t.sendAnother}
                </button>
              </div>
            ) : status === "error" ? (
              <div className="rounded-lg border-2 border-line-strong bg-raised p-6 md:p-8">
                <p className="font-display text-xl font-medium text-ink">{t.errorTitle}</p>
                <p className="mt-2 text-muted">
                  {t.errorBody}{" "}
                  <a href={`mailto:${EMAIL}`} className="link break-words font-medium text-ink">
                    {EMAIL}
                  </a>
                  .
                </p>
                <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-6">
                  {t.retry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Honeypot for bots; the server drops submissions where it is checked. */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  checked={botcheck}
                  onChange={(e) => setBotcheck(e.target.checked)}
                />
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-ink">
                    {t.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    maxLength={LIMITS.name}
                    type="text"
                    autoComplete="name"
                    placeholder={t.namePlaceholder}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={input}
                    disabled={sending}
                  />
                  <FieldError id="contact-name-error" message={errors.name && t[errors.name]} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-ink">
                    {t.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    maxLength={LIMITS.email}
                    type="email"
                    autoComplete="email"
                    placeholder={t.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={input}
                    disabled={sending}
                  />
                  <FieldError id="contact-email-error" message={errors.email && t[errors.email]} />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-ink">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    maxLength={LIMITS.message}
                    rows={5}
                    placeholder={t.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${input} resize-y`}
                    disabled={sending}
                  />
                  <FieldError id="contact-message-error" message={errors.message && t[errors.message]} />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary self-start disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending && (
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                  )}
                  {sending ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
      <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
      {message}
    </p>
  );
}
