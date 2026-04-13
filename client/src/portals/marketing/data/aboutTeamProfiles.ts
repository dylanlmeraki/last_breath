import { getMarketingTeamAsset } from "@shared/marketing-asset-manifest";

export type AboutTeamProfile = {
  id: string;
  name: string;
  role: string;
  years: string;
  focus: string;
  summary: string;
  credentials: string[];
  image: string;
};

export const aboutTeamProfiles: AboutTeamProfile[] = [
  {
    id: "mark-waldman",
    name: "A. Mark Waldman, P.E., REA, BCEE",
    role: "Principal Engineer & Project Manager",
    years: "25+ years",
    focus: "Civil + Environmental Engineering / Construction Management",
    summary:
      "Leads civil, environmental, and project-management scopes for airports, schools, municipal sites, waterfront facilities, grading, utility design, and permitting-driven Bay Area work.",
    credentials: ["PE (Civil)", "Registered Environmental Assessor", "Board Certified Environmental Engineer"],
    image: getMarketingTeamAsset("mark-waldman").image,
  },
  {
    id: "barry-buckley",
    name: "Barry Buckley",
    role: "Construction Superintendent & Cost Estimator",
    years: "20+ years",
    focus: "Field Construction / Cost Estimating / Demolition",
    summary:
      "Oversees field construction operations and cost estimating for waterfront, demolition, and infrastructure scopes where sequencing, site conditions, and practical delivery judgment matter most.",
    credentials: ["OSHA 30", "CA General Contractor"],
    image: getMarketingTeamAsset("barry-buckley").image,
  },
  {
    id: "miles-grant",
    name: "Miles Grant, C.E.G.",
    role: "Project Geologist",
    years: "18+ years",
    focus: "Geology / Environmental Site Assessment / Hazardous Materials",
    summary:
      "Supports geologic and environmental investigations, remediation-related scopes, and hazardous-material review with field-grounded technical judgment and clear reporting.",
    credentials: ["Certified Engineering Geologist", "HAZWOPER 40"],
    image: getMarketingTeamAsset("miles-grant").image,
  },
  {
    id: "angie-aylsworth",
    name: "Angie Aylsworth",
    role: "Project Controls & Designer",
    years: "15+ years",
    focus: "Project Controls / Civil Design / Scheduling",
    summary:
      "Coordinates design support, schedule awareness, and project controls for infrastructure and public work where documentation discipline and clear sequencing keep teams moving.",
    credentials: ["Project Controls", "Civil Design Support"],
    image: getMarketingTeamAsset("angie-aylsworth").image,
  },
  {
    id: "jack-smith",
    name: "Jack Smith, P.L.S.",
    role: "Project Surveyor",
    years: "20+ years",
    focus: "Topographic / Boundary / Construction Surveying",
    summary:
      "Leads surveying support spanning topographic, boundary, right-of-way, ALTA, and construction staking work where dependable field layout directly affects project momentum.",
    credentials: ["Professional Land Surveyor", "Construction Staking"],
    image: getMarketingTeamAsset("jack-smith").image,
  },
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    role: "Project Superintendent",
    years: "18+ years",
    focus: "Water Infrastructure / Utility Work / Hazardous Materials",
    summary:
      "Manages water-infrastructure and utility scopes with field leadership shaped by site logistics, safety coordination, demolition support, and closeout accountability.",
    credentials: ["Water Infrastructure", "Field Coordination"],
    image: getMarketingTeamAsset("mike-johnson").image,
  },
];
