import type { Lang } from "@/lib/content";

type Text = Record<Lang, string>;

export type Role = {
  title: Text;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null while the role is ongoing. */
  end: string | null;
  details: Record<Lang, string[]>;
};

export type Organization = {
  name: string;
  monogram: string;
  about: Text;
  /** Newest role first. */
  roles: Role[];
};

// Newest first, so the list reads upward from the oldest entry at the bottom. Source: CV_Hosea.pdf.
export const experience: Organization[] = [
  {
    name: "Schematics ITS",
    monogram: "SC",
    about: {
      en: "The yearly national tech event run by Informatics ITS.",
      id: "Acara teknologi nasional tahunan dari Informatika ITS.",
    },
    roles: [
      {
        title: { en: "Head of Sponsorship", id: "Kepala Divisi Sponsorship" },
        start: "2026-04",
        end: null,
        details: {
          en: [
            "I lead a team of 7 that finds and signs corporate sponsors.",
            "I handle each deal from first contact to signed contract, then make sure we deliver what we promised.",
          ],
          id: [
            "Memimpin tim berisi 7 orang yang mencari dan mengamankan sponsor.",
            "Mengurus tiap kerja sama dari kontak pertama sampai kontrak ditandatangani, lalu memastikan janji ke sponsor terpenuhi.",
          ],
        },
      },
      {
        title: { en: "Sponsorship Staff", id: "Staf Sponsorship" },
        start: "2025-03",
        end: "2025-12",
        details: {
          en: [
            "Reached out to 160+ companies about sponsoring Schematics 2025.",
            "Wrote proposals and negotiated the deals.",
            "Kept in touch with 10+ sponsors and delivered the branding each contract promised.",
          ],
          id: [
            "Menghubungi 160+ perusahaan untuk menawarkan sponsorship Schematics 2025.",
            "Menulis proposal dan menegosiasikan kesepakatannya.",
            "Menjaga komunikasi dengan 10+ sponsor dan memenuhi semua branding yang dijanjikan di kontrak.",
          ],
        },
      },
    ],
  },
  {
    name: "HMTC ITS",
    monogram: "HM",
    about: {
      en: "The Informatics student association at ITS.",
      id: "Himpunan mahasiswa Informatika ITS.",
    },
    roles: [
      {
        title: { en: "Head of Event", id: "Kepala Biro Event" },
        start: "2026-03",
        end: null,
        details: {
          en: [
            "I run the team behind HMTC's big yearly events, like TC Grandcup and TC Quadrathlon.",
            "I handle the team's logistics, budget, and equipment, and guide the staff through it.",
          ],
          id: [
            "Memimpin tim di balik acara tahunan besar HMTC, seperti TC Grandcup dan TC Quadrathlon.",
            "Mengurus logistik, anggaran, dan perlengkapan tim, sambil membimbing para staf.",
          ],
        },
      },
      {
        title: { en: "Staff, Farewell Party", id: "Staf, Farewell Party" },
        start: "2025-12",
        end: "2025-12",
        details: {
          en: [
            "Came up with the theme, rundown, and activities for the outgoing cabinet's farewell, for 40+ members.",
            "Set up the venue and helped keep both main segments on time.",
          ],
          id: [
            "Menyusun tema, rundown, dan aktivitas acara perpisahan kabinet untuk 40+ anggota.",
            "Menyiapkan tempat dan membantu kedua segmen utama berjalan tepat waktu.",
          ],
        },
      },
      {
        title: { en: "Staff Intern", id: "Staf Magang" },
        start: "2025-11",
        end: "2025-12",
        details: {
          en: [
            "Looked after the speakers and guests at an event with 100+ attendees.",
            "Prepared the equipment and helped with setup on the day.",
          ],
          id: [
            "Mendampingi pembicara dan tamu di acara dengan 100+ peserta.",
            "Menyiapkan peralatan dan membantu persiapan di hari acara.",
          ],
        },
      },
    ],
  },
  {
    name: "GDGoC ITS",
    monogram: "GD",
    about: {
      en: "Google Developer Group on Campus, a student developer community at ITS.",
      id: "Google Developer Group on Campus, komunitas developer mahasiswa di ITS.",
    },
    roles: [
      {
        title: { en: "Member", id: "Anggota" },
        start: "2024-11",
        end: null,
        details: {
          en: [
            "Went to 4+ workshops on machine learning, cybersecurity, and software engineering.",
            "Finished 5+ small projects and learning modules.",
          ],
          id: [
            "Ikut 4+ workshop tentang machine learning, keamanan siber, dan rekayasa perangkat lunak.",
            "Menyelesaikan 5+ proyek kecil dan modul belajar.",
          ],
        },
      },
    ],
  },
  {
    name: "TDC ITS",
    monogram: "TD",
    about: {
      en: "Technopreneur Development Center, an ITS group for students interested in tech startups.",
      id: "Technopreneur Development Center, komunitas ITS untuk mahasiswa yang tertarik dengan startup teknologi.",
    },
    roles: [
      {
        title: { en: "Member", id: "Anggota" },
        start: "2024-09",
        end: null,
        details: {
          en: [
            "Went to 3+ sessions on building a business, startup strategy, and testing product ideas.",
            "Studied real business cases on market analysis and growth.",
          ],
          id: [
            "Ikut 3+ sesi tentang membangun bisnis, strategi startup, dan menguji ide produk.",
            "Mempelajari kasus bisnis nyata tentang analisis pasar dan pertumbuhan.",
          ],
        },
      },
    ],
  },
  {
    name: "UKKRIS SMAN 2 Kediri",
    monogram: "UK",
    about: {
      en: "The Christian student group at SMAN 2 Kediri.",
      id: "Persekutuan siswa Kristen di SMAN 2 Kediri.",
    },
    roles: [
      {
        title: { en: "Treasurer", id: "Bendahara" },
        start: "2022-08",
        end: "2023-08",
        details: {
          en: [
            "Handled the money for a group of 100+ members.",
            "Wrote 12 monthly reports and 1 yearly report for the board.",
            "Recorded over Rp 12,000,000 in transactions over the school year.",
          ],
          id: [
            "Mengelola keuangan organisasi dengan 100+ anggota.",
            "Menyusun 12 laporan bulanan dan 1 laporan tahunan untuk pengurus.",
            "Mencatat lebih dari Rp 12.000.000 transaksi selama satu tahun ajaran.",
          ],
        },
      },
    ],
  },
];
