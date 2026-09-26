export type Role = {
  title: string;
  start: string;
  end: string | null;
  details: string[];
};

export type Organization = {
  name: string;
  monogram: string;
  about: string;
  roles: Role[];
};

export const experience: Organization[] = [
  {
    name: "Schematics ITS",
    monogram: "SC",
    about: "Informatics ITS's yearly national tech event.",
    roles: [
      {
        title: "Head of Sponsorship",
        start: "2026-04",
        end: null,
        details: ["Lead a team of 7 that finds sponsors and handles each deal from first contact to delivery."],
      },
      {
        title: "Sponsorship Staff",
        start: "2025-03",
        end: "2025-12",
        details: [
          "Pitched Schematics 2025 to [[160+ companies]] and negotiated the deals.",
          "Delivered the promised branding to 10+ sponsors.",
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
        details: ["Run the team behind TC Grandcup and TC Quadrathlon, including logistics, budget, and equipment."],
      },
      {
        title: "Staff, Farewell Party",
        start: "2025-12",
        end: "2025-12",
        details: ["Planned the outgoing cabinet's farewell for 40+ members and helped keep it on schedule."],
      },
      {
        title: "Staff Intern",
        start: "2025-11",
        end: "2025-12",
        details: ["Looked after speakers and guests at an event with 100+ attendees."],
      },
    ],
  },
  {
    name: "GDGoC ITS",
    monogram: "GD",
    about: "Google Developer Group on Campus at ITS.",
    roles: [
      {
        title: "Member",
        start: "2024-11",
        end: null,
        details: ["Attended 4+ workshops on machine learning, cybersecurity, and software engineering."],
      },
    ],
  },
  {
    name: "TDC ITS",
    monogram: "TD",
    about: "Technopreneur Development Center, the ITS startup group.",
    roles: [
      {
        title: "Member",
        start: "2024-09",
        end: null,
        details: ["Attended 3+ sessions on startup strategy and testing product ideas."],
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
          "Handled the money for 100+ members, over Rp 12,000,000 in one school year.",
          "Wrote 12 monthly reports and a yearly report for the board.",
        ],
      },
    ],
  },
];
