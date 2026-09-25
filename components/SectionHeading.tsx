import type { ReactNode } from "react";

export default function SectionHeading({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div data-reveal className="mb-10 md:mb-12">
      <p className="mb-2 text-sm text-faint">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id={id}
          className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink md:text-[2.25rem]"
        >
          {title}
          <span className="stop" aria-hidden="true">.</span>
        </h2>
        {children}
      </div>
    </div>
  );
}
