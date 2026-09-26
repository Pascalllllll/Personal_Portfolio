"use client";

import { content } from "@/lib/content";

export default function Footer() {
  const t = content.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} Hosea Felix Sanjaya, {t.affiliation}
        </p>
      </div>
    </footer>
  );
}
