// Shared by the contact form and /api/contact so both sides apply identical rules.

// The address published on the site; also the default inbox for form submissions.
export const CONTACT_EMAIL = "hoseeee777@gmail.com";

export const LIMITS = { name: 200, email: 254, message: 5000 } as const;

// Rejects "abc", "abc@", "@example.com" and "abc@." without refusing unusual but valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export type Field = "name" | "email" | "message";
export type ErrorKey = "errName" | "errEmailEmpty" | "errEmailInvalid" | "errMessage";
export type ContactInput = Record<Field, string>;

export function normalize(input: Partial<Record<Field, unknown>>): ContactInput {
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return { name: text(input.name), email: text(input.email), message: text(input.message) };
}

export function validate(input: ContactInput) {
  const errors: Partial<Record<Field, ErrorKey>> = {};
  if (!input.name || input.name.length > LIMITS.name) errors.name = "errName";
  if (!input.email) errors.email = "errEmailEmpty";
  else if (input.email.length > LIMITS.email || !EMAIL_PATTERN.test(input.email)) errors.email = "errEmailInvalid";
  if (!input.message || input.message.length > LIMITS.message) errors.message = "errMessage";
  return errors;
}
