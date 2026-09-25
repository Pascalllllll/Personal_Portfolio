import nodemailer from "nodemailer";
import { CONTACT_EMAIL, normalize, validate } from "@/lib/contact";

// Nodemailer needs Node APIs (sockets, TLS), so this can't run on the edge runtime.
export const runtime = "nodejs";

// Best-effort per-IP limit. Serverless instances each keep their own map, so it slows bursts rather than enforcing a hard cap.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (body: object, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: SMTP_USER and SMTP_PASS must be set.");
    return json({ ok: false, error: "not_configured" }, 500);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  // Honeypot: people never see this field, so a filled one is a bot. Answer like a success so it doesn't retry.
  if (raw.botcheck) return json({ ok: true }, 200);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  const input = normalize(raw);
  const errors = validate(input);
  if (Object.keys(errors).length) return json({ ok: false, error: "invalid_input", fields: errors }, 400);

  // Line breaks in a header value could inject extra headers.
  const name = input.name.replace(/[\r\n]+/g, " ");
  const to = process.env.CONTACT_RECIPIENT_EMAIL || CONTACT_EMAIL;
  const port = Number(process.env.SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const text = `New Portfolio Contact Form Submission

Name:
${name}

Email:
${input.email}

Message:
${input.message}
`;

  const html = `<h2 style="font-family:sans-serif">New Portfolio Contact Form Submission</h2>
<p style="font-family:sans-serif"><strong>Name:</strong><br>${escapeHtml(name)}</p>
<p style="font-family:sans-serif"><strong>Email:</strong><br><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
<p style="font-family:sans-serif"><strong>Message:</strong></p>
<pre style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(input.message)}</pre>`;

  try {
    // Gmail only lets the authenticated account be the sender, so the visitor goes in Reply-To.
    await transporter.sendMail({
      from: { name: "Hosea Felix Portfolio", address: SMTP_USER },
      to,
      replyTo: { name, address: input.email },
      subject: `Portfolio Contact from: ${name}`,
      text,
      html,
    });
  } catch (err) {
    console.error("Contact form: sending failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true }, 200);
}
