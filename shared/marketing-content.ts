import { createGeneratedProjectVisuals } from "./project-visuals";

export type MarketingSubmissionType =
  | "contact"
  | "consultation"
  | "projectInquiry";

export interface MarketingIntakeEnvelope {
  submissionType: MarketingSubmissionType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  serviceInterest?: string;
  projectType?: string;
  attachments?: string[];
  context?: Record<string, unknown>;
  source?: string;
}

export interface MarketingIntakeResponse {
  accepted: true;
  stubbed: true;
  submissionId: string;
  submissionType: MarketingSubmissionType;
  nextStepMessage: string;
}

export interface MarketingChatbotRequest {
  message: string;
  context?: Record<string, unknown>;
  conversationId?: string;
}

export interface MarketingChatbotResponse {
  response: string;
  source: "stub";
  stubbed: true;
  conversationId: string;
  capturedIntent: string;
  suggestedActions: string[];
}

export type MarketingProjectStatus = "current" | "ongoing" | "completed";

export interface MarketingProjectCoordinates {
  lat: number;
  lng: number;
}

export interface MarketingGalleryProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  county: string;
  location: string;
  date: string;
  image: string;
  images: string[];
  services: string[];
  agencies?: string[];
  scope?: string;
  client_name?: string;
  contact_name?: string;
  budget?: string;
  coordinates: MarketingProjectCoordinates;
  markerId: string;
  status: MarketingProjectStatus;
  popupSummary: string;
  homeMeta: string;
  homeProof: string;
  visualPrompt: string;
}

export interface MarketingBlogPost {
  id: string;
  title: string;
  seo_optimized_title?: string;
  slug: string;
  excerpt?: string;
  meta_description?: string;
  content: string;
  category: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  featured_image?: string;
  read_time?: string;
  published?: boolean;
  published_date?: string;
  updated_date?: string;
  featured?: boolean;
}

type BaseMarketingGalleryProject = Omit<MarketingGalleryProject, "image" | "images">;

const baseMarketingGalleryProjects: BaseMarketingGalleryProject[] = [
  {
    id: "gallery-portwide-demolition",
    title: "Portwide Demolition and Solar Roof Inspection Support",
    slug: "port-of-san-francisco-portwide-demolition",
    description:
      "Multi-pier demolition estimating, roof inspection support, and structural consultation for phased waterfront work across Port of San Francisco properties.",
    category: "Infrastructure",
    county: "San Francisco",
    location: "Port of San Francisco, CA",
    date: "2025",
    services: [
      "Structural Consulting",
      "Inspection Support",
      "Cost Estimating",
    ],
    agencies: ["Port of San Francisco"],
    scope:
      "Pacific supported demolition planning across multiple waterfront structures, assembled estimating support for phased demolition funding decisions, and coordinated structural review for future rooftop solar placement. The work required practical sequencing and documentation discipline across active public assets.",
    client_name: "Port Program Team",
    contact_name: "Capital Improvements Coordination",
    budget: "Program-managed capital scope",
    coordinates: { lat: 37.7955, lng: -122.3937 },
    markerId: "port-sf",
    status: "current",
    popupSummary:
      "Demolition estimating, structural consulting, and solar roof inspection support across active Port waterfront properties.",
    homeMeta: "Inspection / Cost Estimating / Structural Consulting",
    homeProof:
      "Developed demolition cost estimates across multiple waterfront piers while supporting roof inspection and structural review for solar placement.",
    visualPrompt:
      "Waterfront infrastructure planning, demolition phasing, and solar roof inspection support presented through a disciplined Bay Area delivery lens.",
  },
  {
    id: "gallery-caltrans-ada",
    title: "Caltrans Stormwater and ADA Improvement Packages",
    slug: "caltrans-stormwater-ada-improvements",
    description:
      "Drainage reconstruction, ADA upgrades, and erosion-control planning supporting roadway improvement scopes in active transportation corridors.",
    category: "Civil + Stormwater",
    county: "Napa",
    location: "American Canyon / Palo Alto, CA",
    date: "2024",
    services: [
      "Civil Engineering",
      "Stormwater Compliance",
      "Self-Perform Construction",
    ],
    agencies: ["Caltrans"],
    scope:
      "Pacific coordinated drainage upgrades, accessible-path improvements, signal-area reconstruction, and erosion-control documentation in corridors where traffic management and permit sequencing were just as important as technical design.",
    client_name: "Regional Transportation Partner",
    budget: "Agency infrastructure program",
    coordinates: { lat: 38.1749, lng: -122.2608 },
    markerId: "caltrans-american-canyon",
    status: "ongoing",
    popupSummary:
      "Drainage reconstruction, ADA improvements, and erosion-control planning supporting active transportation corridors.",
    homeMeta: "Civil / Erosion Control / Self-Perform Construction",
    homeProof:
      "Reconstructed drainage infrastructure, upgraded ADA elements, and prepared stormwater plans while supporting field execution.",
    visualPrompt:
      "Roadway drainage upgrades, ADA improvement packages, and erosion control planning with Bay Area corridor coordination discipline.",
  },
  {
    id: "gallery-sfusd-bond",
    title: "SFUSD Bond Program Civil and Stormwater Support",
    slug: "sfusd-bond-program-civil-stormwater",
    description:
      "Survey, grading, ADA-access, and stormwater coordination for multi-campus modernization work under layered district and city review.",
    category: "Institutional",
    county: "San Francisco",
    location: "San Francisco Unified School District, CA",
    date: "2024",
    services: [
      "Surveying",
      "Stormwater Planning",
      "Permitting Coordination",
    ],
    agencies: ["SFUSD", "Local Reviewing Agencies"],
    scope:
      "Pacific supported site modernization packages with topographic survey, grading coordination, access improvements, and stormwater planning so campus upgrades could move with fewer permitting surprises and clearer field handoffs.",
    client_name: "School Modernization Program",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    markerId: "sfusd",
    status: "ongoing",
    popupSummary:
      "Survey, grading, ADA access, and stormwater coordination for layered district and city review on modernization work.",
    homeMeta: "Survey / Grading / Permitting",
    homeProof:
      "Supported multi-school modernization packages with topographic survey, grading plans, ADA access, and stormwater engineering under multi-agency review.",
    visualPrompt:
      "Institutional modernization, topographic survey, and permit-aware campus stormwater coordination with clear field handoffs.",
  },
  {
    id: "gallery-sfpuc-utility",
    title: "Water Infrastructure and SWPPP Monitoring Support",
    slug: "sfpuc-water-infrastructure-swppp",
    description:
      "Utility installation support, safety planning, and active SWPPP monitoring across public water infrastructure construction in the Peninsula.",
    category: "Utilities",
    county: "San Mateo",
    location: "San Mateo / San Bruno, CA",
    date: "2023",
    services: [
      "SWPPP Monitoring",
      "Utility Construction Support",
      "Safety Planning",
    ],
    agencies: ["SFPUC"],
    scope:
      "Pacific supported excavation planning, utility placement, hazardous materials coordination, and stormwater monitoring in a utility environment where compliance and field responsiveness had to stay tightly aligned.",
    client_name: "Public Utility Capital Program",
    coordinates: { lat: 37.6305, lng: -122.4111 },
    markerId: "sfpuc",
    status: "completed",
    popupSummary:
      "Excavation planning, utility placement, hazardous materials coordination, and active SWPPP monitoring for utility infrastructure work.",
    homeMeta: "Utility Construction / Compliance / Safety Planning",
    homeProof:
      "Supported excavation, utility installation, hazardous materials planning, and stormwater monitoring across public utility infrastructure work.",
    visualPrompt:
      "Utility corridor support, SWPPP monitoring, and safety planning visualized with disciplined infrastructure field coordination.",
  },
  {
    id: "gallery-sfo-terminal",
    title: "SFO Terminal 3 Boarding Area E Support",
    slug: "sfo-terminal-3-boarding-area-e",
    description:
      "Civil design support, SWPPP planning, survey coordination, and utility installation sequencing for a complex aviation improvement package.",
    category: "Aviation",
    county: "San Mateo",
    location: "San Francisco International Airport, CA",
    date: "2022",
    services: [
      "Civil Design",
      "Survey Coordination",
      "Stormwater and Erosion Control",
    ],
    agencies: ["SFO", "Airport Design-Build Partners"],
    scope:
      "Pacific supported a major aviation package with civil design assistance, erosion-control planning, survey coordination, and utility installation planning that respected active airside and terminal constraints.",
    client_name: "Airport Delivery Team",
    coordinates: { lat: 37.6213, lng: -122.379 },
    markerId: "sfo",
    status: "completed",
    popupSummary:
      "Civil design support, survey coordination, and utility installation planning for a major airport improvement package.",
    homeMeta: "Design-Build / Civil / Utility Installation",
    homeProof:
      "Delivered civil design support, SWPPP planning, survey coordination, and utility installation sequencing for a complex aviation project.",
    visualPrompt:
      "Airport design-build coordination, survey support, and stormwater planning shaped around airside constraints and delivery sequencing.",
  },
  {
    id: "gallery-medical-examiner",
    title: "Chief Medical Examiner Excavation and Survey Support",
    slug: "chief-medical-examiner-building",
    description:
      "Construction staking, potholing investigation, and excavation support for critical foundation work on a civic building project in San Francisco.",
    category: "Civic",
    county: "San Francisco",
    location: "San Francisco, CA",
    date: "2022",
    services: [
      "Construction Survey",
      "Excavation Support",
      "Structural Coordination",
    ],
    agencies: ["City Project Team"],
    scope:
      "Pacific provided field staking, utility potholing support, and excavation coordination for foundation-critical work where survey accuracy and on-site responsiveness directly affected schedule confidence.",
    client_name: "Civic Facilities Program",
    coordinates: { lat: 37.7755, lng: -122.4199 },
    markerId: "medical-examiner",
    status: "completed",
    popupSummary:
      "Construction staking, potholing investigation, and excavation support for critical civic-building foundation work.",
    homeMeta: "Survey / Structural Support / Excavation",
    homeProof:
      "Provided staking, utility potholing investigation, and excavation support for foundation-critical civic work in San Francisco.",
    visualPrompt:
      "Civic foundation support, survey staking, and excavation coordination presented with jobsite accuracy and public-project discipline.",
  },
];

export const marketingGalleryProjects: MarketingGalleryProject[] =
  baseMarketingGalleryProjects.map((project) => ({
    ...project,
    ...createGeneratedProjectVisuals({
      title: project.title,
      slug: project.slug,
      category: project.category,
      location: project.location,
      county: project.county,
      date: project.date,
      services: project.services,
      popupSummary: project.popupSummary,
      status: project.status,
      visualPrompt: project.visualPrompt,
      coordinates: project.coordinates,
    }),
  }));

export const marketingFeaturedProjectSlugs = [
  "port-of-san-francisco-portwide-demolition",
  "caltrans-stormwater-ada-improvements",
  "sfo-terminal-3-boarding-area-e",
] as const;

export const marketingHomeEvidenceSlugs = [
  "port-of-san-francisco-portwide-demolition",
  "caltrans-stormwater-ada-improvements",
  "sfusd-bond-program-civil-stormwater",
  "sfpuc-water-infrastructure-swppp",
  "sfo-terminal-3-boarding-area-e",
  "chief-medical-examiner-building",
] as const;

export const marketingBlogPosts: MarketingBlogPost[] = [
  {
    id: "blog-swppp-precon",
    title: "What Bay Area Teams Miss When SWPPP Planning Starts Too Late",
    seo_optimized_title:
      "What Bay Area Teams Miss When SWPPP Planning Starts Too Late",
    slug: "what-bay-area-teams-miss-when-swppp-planning-starts-too-late",
    excerpt:
      "Permit readiness usually slips long before crews mobilize. Early SWPPP coordination keeps phasing, BMP placement, and jurisdictional review from turning into field delays.",
    meta_description:
      "Early SWPPP planning helps Bay Area project teams avoid permit drift, field conflicts, and costly rework before mobilization.",
    content: `## Why this shows up so often

SWPPP work is frequently treated like a late-stage checklist item instead of an early coordination discipline. By the time grading assumptions, access paths, or stockpile locations are locked, the stormwater plan has fewer good options.

## What changes when planning starts earlier

- BMP layout can align with the real sequence of work.
- Site logistics and inspection access stay practical.
- Permit comments are easier to resolve without redesigning the field plan.
- Owners and contractors get a clearer picture of risk before mobilization.

## A practical Bay Area workflow

1. Review disturbance assumptions during early civil coordination.
2. Map out likely sequencing and temporary protection needs.
3. Confirm agency expectations before the submittal package hardens.
4. Keep field changes tied back to the same intake and documentation path.

## The Pacific approach

We treat SWPPP planning as part of delivery strategy, not as paperwork. That means engineering judgment, compliance documentation, and field execution stay connected from the start.`,
    category: "compliance",
    tags: ["SWPPP", "Preconstruction", "Permit Readiness"],
    keywords: ["SWPPP planning", "Bay Area stormwater", "permit coordination"],
    author: "Pacific Engineering Team",
    featured_image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    read_time: "5 min read",
    published: true,
    published_date: "2026-03-20T17:00:00.000Z",
    updated_date: "2026-03-24T17:00:00.000Z",
    featured: true,
  },
  {
    id: "blog-special-inspections",
    title: "Special Inspection Coordination That Actually Helps the Schedule",
    seo_optimized_title:
      "Special Inspection Coordination That Actually Helps the Schedule",
    slug: "special-inspection-coordination-that-actually-helps-the-schedule",
    excerpt:
      "Inspection planning works best when it is connected to sequencing, communication, and documentation expectations before the pour or install window arrives.",
    meta_description:
      "Special inspection coordination supports the construction schedule when planning, sequencing, and reporting are aligned ahead of field work.",
    content: `## Inspection support is a coordination problem first

Teams usually feel inspection friction when communication is late or incomplete, not because the requirement itself was unclear.

## Where projects lose time

- Hold points are identified too late.
- Scope boundaries between trades are fuzzy.
- Required documentation is scattered.
- The inspection team is looped in after the field window is already moving.

## What better looks like

Use pre-task communication that confirms the work area, the sequence, and the required documentation package. That turns inspections into a predictable step instead of a scramble.

## Why owners notice the difference

When inspection reporting is timely and field-aware, it reduces uncertainty for everyone else in the chain: project management, agency review, and the next trade in line.`,
    category: "inspections",
    tags: ["Special Inspections", "Construction Coordination", "Scheduling"],
    keywords: ["special inspections", "inspection coordination", "construction schedule"],
    author: "Pacific Engineering Team",
    featured_image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    read_time: "4 min read",
    published: true,
    published_date: "2026-03-14T17:00:00.000Z",
    updated_date: "2026-03-18T17:00:00.000Z",
    featured: false,
  },
  {
    id: "blog-field-driven-engineering",
    title: "Field-Driven Engineering Decisions Save More Than Redlines",
    seo_optimized_title:
      "Field-Driven Engineering Decisions Save More Than Redlines",
    slug: "field-driven-engineering-decisions-save-more-than-redlines",
    excerpt:
      "The best engineering support does more than answer technical questions. It keeps permitting, field execution, and owner communication moving together.",
    meta_description:
      "Field-driven engineering keeps decisions practical, permit-aware, and easier to execute once crews are on site.",
    content: `## Drawings are only part of the story

Projects rarely struggle because nobody can produce a technically correct detail. They struggle when the detail is disconnected from sequencing, access, existing conditions, or review realities.

## What field-driven engineering changes

- Comments arrive with constructability context.
- Revisions respect schedule pressure.
- Stakeholders understand the tradeoffs faster.
- The path from design to execution gets shorter.

## Why this matters in the Pacific workflow

Pacific approaches design, inspection, and compliance as one delivery conversation. That makes engineering more useful because it stays tied to what must happen next in the field.`,
    category: "engineering",
    tags: ["Engineering", "Constructability", "Project Delivery"],
    keywords: ["field driven engineering", "constructability", "project delivery"],
    author: "Pacific Engineering Team",
    featured_image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
    read_time: "4 min read",
    published: true,
    published_date: "2026-03-08T17:00:00.000Z",
    updated_date: "2026-03-12T17:00:00.000Z",
    featured: false,
  },
];
