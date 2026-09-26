export type Role = {
  title: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null while the role is ongoing. */
  end: string | null;
  details: string[];
};

export type Organization = {
  name: string;
  monogram: string;
  about: string;
  /** Newest role first. */
  roles: Role[];
};

// Newest first, so the list reads upward from the oldest entry at the bottom. Source: CV_Hosea.pdf.
export const experience: Organization[] = [
  {
    name: "Schematics ITS",
    monogram: "SC",
    about: "The yearly national tech event run by Informatics ITS.",
    roles: [
      {
        title: "Head of Sponsorship",
        start: "2026-04",
        end: null,
        details: [
          "I lead a team of 7 that finds and signs corporate sponsors.",
          "I handle each deal from first contact to signed contract, then make sure we deliver what we promised.",
        ],
      },
      {
        title: "Sponsorship Staff",
        start: "2025-03",
        end: "2025-12",
        details: [
          "Reached out to 160+ companies about sponsoring Schematics 2025.",
          "Wrote proposals and negotiated the deals.",
          "Kept in touch with 10+ sponsors and delivered the branding each contract promised.",
        ],
      },
    ],
  },
  {
    name: "HMTC ITS",
    monogram: "HM",
    about: "The Informatics student association at ITS.",
    roles: [
      {
        title: "Head of Event",
        start: "2026-03",
        end: null,
        details: [
          "I run the team behind HMTC's big yearly events, like TC Grandcup and TC Quadrathlon.",
          "I handle the team's logistics, budget, and equipment, and guide the staff through it.",
        ],
      },
      {
        title: "Staff, Farewell Party",
        start: "2025-12",
        end: "2025-12",
        details: [
          "Came up with the theme, rundown, and activities for the outgoing cabinet's farewell, for 40+ members.",
          "Set up the venue and helped keep both main segments on time.",
        ],
      },
      {
        title: "Staff Intern",
        start: "2025-11",
        end: "2025-12",
        details: [
          "Looked after the speakers and guests at an event with 100+ attendees.",
          "Prepared the equipment and helped with setup on the day.",
        ],
      },
    ],
  },
  {
    name: "GDGoC ITS",
    monogram: "GD",
    about: "Google Developer Group on Campus, a student developer community at ITS.",
    roles: [
      {
        title: "Member",
        start: "2024-11",
        end: null,
        details: [
          "Went to 4+ workshops on machine learning, cybersecurity, and software engineering.",
          "Finished 5+ small projects and learning modules.",
        ],
      },
    ],
  },
  {
    name: "TDC ITS",
    monogram: "TD",
    about: "Technopreneur Development Center, an ITS group for students interested in tech startups.",
    roles: [
      {
        title: "Member",
        start: "2024-09",
        end: null,
        details: [
          "Went to 3+ sessions on building a business, startup strategy, and testing product ideas.",
          "Studied real business cases on market analysis and growth.",
        ],
      },
    ],
  },
  {
    name: "UKKRIS SMAN 2 Kediri",
    monogram: "UK",
    about: "The Christian student group at SMAN 2 Kediri.",
    roles: [
      {
        title: "Treasurer",
        start: "2022-08",
        end: "2023-08",
        details: [
          "Handled the money for a group of 100+ members.",
          "Wrote 12 monthly reports and 1 yearly report for the board.",
          "Recorded over Rp 12,000,000 in transactions over the school year.",
        ],
      },
    ],
  },
];
