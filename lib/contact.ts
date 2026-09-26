export const CONTACT_EMAIL = "hoseeee777@gmail.com";

export const WEB3FORMS_KEY = "4a07a739-f9ea-4f65-85fa-3c6c47af9d47";

export const LIMITS = { name: 200, email: 254, message: 5000 } as const;

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
