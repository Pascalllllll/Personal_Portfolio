"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { experience, type Role } from "@/lib/experience";
import SectionHeading from "@/components/SectionHeading";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parse = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return { y, m };
};

const formatMonth = (ym: string) => {
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

// Counts both end months, so Nov to Dec is 2 months.
const monthsBetween = (start: string, end: string) => {
  const a = parse(start);
  const b = parse(end);
  return (b.y - a.y) * 12 + (b.m - a.m) + 1;
};

const toYm = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

type Labels = (typeof content)["experience"];

function formatDuration(months: number, t: Labels) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? t.yr : t.yrs}`);
  if (m) parts.push(`${m} ${m === 1 ? t.mo : t.mos}`);
  return parts.join(" ");
}

function Dates({ start, end, now, t }: { start: string; end: string | null; now: string | null; t: Labels }) {
  const until = end ?? now;
  return (
    <p className="text-sm text-faint">
      <time dateTime={start}>{formatMonth(start)}</time>
      {end !== start && (
        <>
          {" - "}
          {end ? <time dateTime={end}>{formatMonth(end)}</time> : t.present}
        </>
      )}
      {/* Ongoing roles need today's date, which only exists on the client, so their duration appears after mount. */}
      {until && <> · {formatDuration(monthsBetween(start, until), t)}</>}
    </p>
  );
}

function Details({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-muted">
      {items.map((item) => (
        <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-line-strong">
          {item}
        </li>
      ))}
    </ul>
  );
}

// Current roles get a filled accent marker; finished ones a hollow ring.
function Marker({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 mt-[0.45rem] block h-2.5 w-2.5 rounded-full ring-4 ring-paper ${
        current ? "bg-accent" : "border border-line-strong bg-paper"
      }`}
    />
  );
}

export default function Experience() {
  const t = content.experience;
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => setNow(toYm(new Date())), []);

  const roleBody = (role: Role) => (
    <>
      <Dates start={role.start} end={role.end} now={now} t={t} />
      <Details items={role.details} />
    </>
  );

  return (
    <section id="experience" aria-labelledby="experience-title" className="section border-b border-line">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading id="experience-title" label={t.label} title={t.title} />

        <ol>
          {experience.map((org, i) => {
            const grouped = org.roles.length > 1;
            const oldest = org.roles[org.roles.length - 1];
            const newest = org.roles[0];
            const last = i === experience.length - 1;

            return (
              <li
                key={org.name}
                className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 pb-12 sm:gap-x-6"
              >
                {/* The rail runs from this organisation's tile down to the next, and fades out under the oldest entry. */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-[1.375rem] top-11 w-px -translate-x-1/2 ${
                    last ? "bg-gradient-to-b from-line to-transparent" : "bg-line"
                  }`}
                />

                <span
                  aria-hidden="true"
                  data-reveal
                  className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-raised font-mono text-xs font-medium text-muted"
                >
                  {org.monogram}
                </span>

                <div data-reveal className="min-w-0 pt-0.5">
                  <h3 className="font-display text-xl font-medium leading-snug text-ink">{org.name}</h3>
                  {grouped ? (
                    <p className="text-sm text-faint">
                      {org.roles.length} {t.roles}
                      {(newest.end ?? now) && <> · {formatDuration(monthsBetween(oldest.start, (newest.end ?? now)!), t)}</>}
                    </p>
                  ) : (
                    <p className="font-semibold text-ink">{newest.title}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">{org.about}</p>
                </div>

                {grouped ? (
                  <ol className="col-span-2 mt-6 grid grid-cols-subgrid gap-y-8">
                    {org.roles.map((role) => (
                      <li key={role.start + role.title} data-reveal className="col-span-full grid grid-cols-subgrid">
                        <span className="flex justify-center">
                          <Marker current={role.end === null} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-ink">{role.title}</h4>
                          {roleBody(role)}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div data-reveal className="col-start-2 mt-2 min-w-0">{roleBody(newest)}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
