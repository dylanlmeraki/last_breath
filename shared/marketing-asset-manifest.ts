export type MarketingAssetStatus = "approved" | "provisional" | "deferred";

export interface MarketingAssetEntry {
  key: string;
  routeFamily: string;
  publicUrl: string;
  alt: string;
  caption?: string;
  sourceNote: string;
  status: MarketingAssetStatus;
  fallbackKey: string;
}

export interface MarketingProjectAssetEntry extends MarketingAssetEntry {
  slug: string;
  image: string;
  images: string[];
}

export interface MarketingTeamAssetEntry extends MarketingAssetEntry {
  id: string;
  image: string;
}

export interface MarketingBlogAssetEntry extends MarketingAssetEntry {
  slug: string;
  featuredImage: string;
}

const PHASE5B_PDF_SOURCE =
  "example-projects-completed.pdf (user-provided source pack, extracted on 2026-04-13)";

const PHASE5_PROVISIONAL_SOURCE_NOTE =
  "Phase 5B provisional local image derived from project-document source imagery and approved fallback assets pending final curation pack.";

const PHASE5_TEAM_SOURCE_NOTE =
  "Phase 5 provisional local profile visual sourced from approved PECI logo fallback pending approved team headshots.";

const FALLBACK_PROJECT_IMAGE = "/images/routes/bay-bridge-fallback.jpg";
const FALLBACK_LOGO_IMAGE = "/images/routes/logo-fallback.jpg";

const PROJECT_SLUGS = [
  "port-of-san-francisco-portwide-demolition",
  "caltrans-stormwater-ada-improvements",
  "sfusd-bond-program-civil-stormwater",
  "sfpuc-water-infrastructure-swppp",
  "sfo-terminal-3-boarding-area-e",
  "chief-medical-examiner-building",
] as const;

type ProjectSlug = (typeof PROJECT_SLUGS)[number];

const TEAM_IDS = [
  "mark-waldman",
  "barry-buckley",
  "miles-grant",
  "angie-aylsworth",
  "jack-smith",
  "mike-johnson",
] as const;

type TeamId = (typeof TEAM_IDS)[number];

const BLOG_SLUGS = [
  "what-bay-area-teams-miss-when-swppp-planning-starts-too-late",
  "special-inspection-coordination-that-actually-helps-the-schedule",
  "field-driven-engineering-decisions-save-more-than-redlines",
] as const;

type BlogSlug = (typeof BLOG_SLUGS)[number];

export const marketingRouteImages = {
  bayBridgeFallback: FALLBACK_PROJECT_IMAGE,
  logoFallback: FALLBACK_LOGO_IMAGE,
  aboutHero: "/images/routes/about-hero.jpg",
  blogHero: "/images/routes/blog-hero.jpg",
  contactHero: "/images/routes/contact-hero.jpg",
  constructionHero: "/images/routes/construction-hero.jpg",
  constructionDetailOne: "/images/routes/construction-detail-01.jpg",
  constructionDetailTwo: "/images/routes/construction-detail-02.jpg",
  constructionDetailThree: "/images/routes/construction-detail-03.jpg",
  consultationHero: "/images/routes/consultation-hero.jpg",
  homeCta: "/images/routes/home-cta-bg.jpg",
  inspectionsHero: "/images/routes/inspections-hero.jpg",
  previousWorkHero: "/images/routes/previous-work-hero.jpg",
  servicesHero: "/images/routes/services-hero.jpg",
  servicesOverviewHero: "/images/routes/services-overview-hero.jpg",
  servicesDetailQsd: "/images/routes/services-detail-qsd.jpg",
  servicesDetailQsp: "/images/routes/services-detail-qsp.jpg",
  specialInspectionsHero: "/images/routes/special-inspections-hero.jpg",
  specialInspectionsLead: "/images/routes/special-inspections-lead.jpg",
  specialInspectionsCaseSteel: "/images/routes/special-inspections-case-steel.jpg",
  specialInspectionsCaseSeismic: "/images/routes/special-inspections-case-seismic.jpg",
  structuralHero: "/images/routes/structural-hero.jpg",
  structuralLead: "/images/routes/structural-lead.jpg",
} as const;

export const marketingProjectAssetManifest: Record<
  ProjectSlug,
  MarketingProjectAssetEntry
> = {
  "port-of-san-francisco-portwide-demolition": {
    key: "project-port-of-san-francisco-portwide-demolition",
    slug: "port-of-san-francisco-portwide-demolition",
    routeFamily: "projects",
    publicUrl: "/images/projects/port-of-san-francisco-portwide-demolition-01.jpg",
    image: "/images/projects/port-of-san-francisco-portwide-demolition-01.jpg",
    images: [
      "/images/projects/port-of-san-francisco-portwide-demolition-01.jpg",
      "/images/projects/port-of-san-francisco-portwide-demolition-02.jpg",
    ],
    alt: "Port of San Francisco waterfront demolition support showing active pier and equipment context.",
    caption: "Portwide demolition estimate and roof inspection support for solar panel planning.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 1 project sheet: Port of San Francisco portwide demolition estimate and roof inspection support.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "caltrans-stormwater-ada-improvements": {
    key: "project-caltrans-stormwater-ada-improvements",
    slug: "caltrans-stormwater-ada-improvements",
    routeFamily: "projects",
    publicUrl: "/images/projects/caltrans-stormwater-ada-improvements-01.jpg",
    image: "/images/projects/caltrans-stormwater-ada-improvements-01.jpg",
    images: [
      "/images/projects/caltrans-stormwater-ada-improvements-01.jpg",
      "/images/projects/caltrans-stormwater-ada-improvements-02.jpg",
    ],
    alt: "Caltrans corridor construction scene showing drainage and access-improvement field conditions.",
    caption: "Caltrans drainage reconstruction, ADA upgrades, and erosion-control support.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 2 project sheet: Caltrans transportation improvement packages including stormwater and ADA scope.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "sfusd-bond-program-civil-stormwater": {
    key: "project-sfusd-bond-program-civil-stormwater",
    slug: "sfusd-bond-program-civil-stormwater",
    routeFamily: "projects",
    publicUrl: "/images/projects/sfusd-bond-program-civil-stormwater-01.jpg",
    image: "/images/projects/sfusd-bond-program-civil-stormwater-01.jpg",
    images: [
      "/images/projects/sfusd-bond-program-civil-stormwater-01.jpg",
      "/images/projects/sfusd-bond-program-civil-stormwater-02.jpg",
    ],
    alt: "SFUSD bond-program civil coordination visual with campus planning and grading documentation context.",
    caption: "SFUSD modernization support with survey, grading, ADA access, and stormwater coordination.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 3 project sheet: SFUSD bond program civil and stormwater support across campus modernization work.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "sfpuc-water-infrastructure-swppp": {
    key: "project-sfpuc-water-infrastructure-swppp",
    slug: "sfpuc-water-infrastructure-swppp",
    routeFamily: "projects",
    publicUrl: "/images/projects/sfpuc-water-infrastructure-swppp-01.jpg",
    image: "/images/projects/sfpuc-water-infrastructure-swppp-01.jpg",
    images: [
      "/images/projects/sfpuc-water-infrastructure-swppp-01.jpg",
      "/images/projects/sfpuc-water-infrastructure-swppp-02.jpg",
    ],
    alt: "SFPUC utility construction scene with excavation and public-water infrastructure field work.",
    caption: "SFPUC utility installation support with excavation planning and SWPPP monitoring.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 4 project sheet: SFPUC water infrastructure support including utility work and SWPPP monitoring.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "sfo-terminal-3-boarding-area-e": {
    key: "project-sfo-terminal-3-boarding-area-e",
    slug: "sfo-terminal-3-boarding-area-e",
    routeFamily: "projects",
    publicUrl: "/images/projects/sfo-terminal-3-boarding-area-e-01.jpg",
    image: "/images/projects/sfo-terminal-3-boarding-area-e-01.jpg",
    images: [
      "/images/projects/sfo-terminal-3-boarding-area-e-01.jpg",
      "/images/projects/sfo-terminal-3-boarding-area-e-02.jpg",
    ],
    alt: "SFO Terminal 3 airside/terminal visual supporting design-build civil and utility sequencing context.",
    caption: "SFO Terminal 3 Boarding Area E design-build civil and survey support.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 5 project sheet: SFO Terminal 3 Boarding Area E civil design, survey, and utility coordination support.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "chief-medical-examiner-building": {
    key: "project-chief-medical-examiner-building",
    slug: "chief-medical-examiner-building",
    routeFamily: "projects",
    publicUrl: "/images/projects/chief-medical-examiner-building-01.jpg",
    image: "/images/projects/chief-medical-examiner-building-01.jpg",
    images: [
      "/images/projects/chief-medical-examiner-building-01.jpg",
      "/images/projects/chief-medical-examiner-building-02.jpg",
    ],
    alt: "Chief Medical Examiner Building project visual with survey and excavation support documentation context.",
    caption: "Chief Medical Examiner Building survey staking and excavation support.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; page 6 project sheet: San Francisco Office of Chief Medical Examiner Building survey and excavation support.`,
    status: "approved",
    fallbackKey: "route-bay-bridge-fallback",
  },
};

export const marketingTeamAssetManifest: Record<TeamId, MarketingTeamAssetEntry> = {
  "mark-waldman": {
    key: "team-mark-waldman",
    id: "mark-waldman",
    routeFamily: "team",
    publicUrl: "/images/team/mark-waldman-01.jpg",
    image: "/images/team/mark-waldman-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for A. Mark Waldman.",
    caption: "A. Mark Waldman, P.E., REA, BCEE.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
  "barry-buckley": {
    key: "team-barry-buckley",
    id: "barry-buckley",
    routeFamily: "team",
    publicUrl: "/images/team/barry-buckley-01.jpg",
    image: "/images/team/barry-buckley-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for Barry Buckley.",
    caption: "Barry Buckley, Superintendent and Cost Estimator.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
  "miles-grant": {
    key: "team-miles-grant",
    id: "miles-grant",
    routeFamily: "team",
    publicUrl: "/images/team/miles-grant-01.jpg",
    image: "/images/team/miles-grant-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for Miles Grant.",
    caption: "Miles Grant, C.E.G.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
  "angie-aylsworth": {
    key: "team-angie-aylsworth",
    id: "angie-aylsworth",
    routeFamily: "team",
    publicUrl: "/images/team/angie-aylsworth-01.jpg",
    image: "/images/team/angie-aylsworth-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for Angie Aylsworth.",
    caption: "Angie Aylsworth, Project Controls and Designer.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
  "jack-smith": {
    key: "team-jack-smith",
    id: "jack-smith",
    routeFamily: "team",
    publicUrl: "/images/team/jack-smith-01.jpg",
    image: "/images/team/jack-smith-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for Jack Smith.",
    caption: "Jack Smith, P.L.S.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
  "mike-johnson": {
    key: "team-mike-johnson",
    id: "mike-johnson",
    routeFamily: "team",
    publicUrl: "/images/team/mike-johnson-01.jpg",
    image: "/images/team/mike-johnson-01.jpg",
    alt: "Pacific Engineering leadership profile image placeholder for Mike Johnson.",
    caption: "Mike Johnson, Project Superintendent.",
    sourceNote: PHASE5_TEAM_SOURCE_NOTE,
    status: "provisional",
    fallbackKey: "route-logo-fallback",
  },
};

export const marketingBlogAssetManifest: Record<BlogSlug, MarketingBlogAssetEntry> = {
  "what-bay-area-teams-miss-when-swppp-planning-starts-too-late": {
    key: "blog-swppp-precon",
    slug: "what-bay-area-teams-miss-when-swppp-planning-starts-too-late",
    routeFamily: "blog",
    publicUrl: "/images/blog/what-bay-area-teams-miss-when-swppp-planning-starts-too-late-hero.jpg",
    featuredImage:
      "/images/blog/what-bay-area-teams-miss-when-swppp-planning-starts-too-late-hero.jpg",
    alt: "Stormwater compliance planning visual for Bay Area preconstruction sequencing.",
    caption: "SWPPP planning guidance.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; derived editorial crop from Caltrans/SFPUC stormwater-focused source imagery.`,
    status: "provisional",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "special-inspection-coordination-that-actually-helps-the-schedule": {
    key: "blog-special-inspections",
    slug: "special-inspection-coordination-that-actually-helps-the-schedule",
    routeFamily: "blog",
    publicUrl:
      "/images/blog/special-inspection-coordination-that-actually-helps-the-schedule-hero.jpg",
    featuredImage:
      "/images/blog/special-inspection-coordination-that-actually-helps-the-schedule-hero.jpg",
    alt: "Special inspections coordination visual focused on schedule reliability.",
    caption: "Special inspection coordination guidance.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; derived editorial crop from SFPUC utility field-coordination source imagery.`,
    status: "provisional",
    fallbackKey: "route-bay-bridge-fallback",
  },
  "field-driven-engineering-decisions-save-more-than-redlines": {
    key: "blog-field-driven-engineering",
    slug: "field-driven-engineering-decisions-save-more-than-redlines",
    routeFamily: "blog",
    publicUrl: "/images/blog/field-driven-engineering-decisions-save-more-than-redlines-hero.jpg",
    featuredImage:
      "/images/blog/field-driven-engineering-decisions-save-more-than-redlines-hero.jpg",
    alt: "Field-driven engineering visual for constructability-focused project decisions.",
    caption: "Field-driven engineering guidance.",
    sourceNote:
      `${PHASE5B_PDF_SOURCE}; derived editorial crop from project-sheet engineering documentation imagery.`,
    status: "provisional",
    fallbackKey: "route-bay-bridge-fallback",
  },
};

export const marketingPreviousWorkImageMap = {
  portwideDemolition:
    marketingProjectAssetManifest["port-of-san-francisco-portwide-demolition"].image,
  caltransStormwater:
    marketingProjectAssetManifest["caltrans-stormwater-ada-improvements"].image,
  sfusdBond:
    marketingProjectAssetManifest["sfusd-bond-program-civil-stormwater"].image,
  sfpucMicrowave:
    marketingProjectAssetManifest["sfpuc-water-infrastructure-swppp"].image,
  sfoTerminal3:
    marketingProjectAssetManifest["sfo-terminal-3-boarding-area-e"].image,
  chiefMedicalExaminer:
    marketingProjectAssetManifest["chief-medical-examiner-building"].image,
  hetchHetchy:
    marketingProjectAssetManifest["sfpuc-water-infrastructure-swppp"].images[1],
  sfpucDb124:
    marketingProjectAssetManifest["sfpuc-water-infrastructure-swppp"].images[1],
  temporaryBoardingAreaB:
    marketingProjectAssetManifest["sfo-terminal-3-boarding-area-e"].images[1],
  ductBankUtility:
    marketingProjectAssetManifest["sfo-terminal-3-boarding-area-e"].images[1],
  sfoTowerAtct:
    marketingProjectAssetManifest["sfo-terminal-3-boarding-area-e"].images[1],
} as const;

export function getMarketingProjectAsset(slug: string): MarketingProjectAssetEntry {
  return (
    marketingProjectAssetManifest[slug as ProjectSlug] ?? {
      key: "project-fallback",
      slug,
      routeFamily: "projects",
      publicUrl: FALLBACK_PROJECT_IMAGE,
      image: FALLBACK_PROJECT_IMAGE,
      images: [FALLBACK_PROJECT_IMAGE],
      alt: "Pacific Engineering project visual fallback.",
      caption: "Project image fallback.",
      sourceNote: PHASE5_PROVISIONAL_SOURCE_NOTE,
      status: "provisional",
      fallbackKey: "route-bay-bridge-fallback",
    }
  );
}

export function getMarketingBlogAsset(slug: string): MarketingBlogAssetEntry {
  return (
    marketingBlogAssetManifest[slug as BlogSlug] ?? {
      key: `blog-${slug || "fallback"}`,
      slug,
      routeFamily: "blog",
      publicUrl: FALLBACK_PROJECT_IMAGE,
      featuredImage: FALLBACK_PROJECT_IMAGE,
      alt: "Pacific Engineering blog visual fallback.",
      caption: "Blog image fallback.",
      sourceNote: PHASE5_PROVISIONAL_SOURCE_NOTE,
      status: "provisional",
      fallbackKey: "route-bay-bridge-fallback",
    }
  );
}

export function getMarketingTeamAsset(id: string): MarketingTeamAssetEntry {
  return (
    marketingTeamAssetManifest[id as TeamId] ?? {
      key: `team-${id || "fallback"}`,
      id,
      routeFamily: "team",
      publicUrl: FALLBACK_LOGO_IMAGE,
      image: FALLBACK_LOGO_IMAGE,
      alt: "Pacific Engineering team profile visual fallback.",
      caption: "Team profile fallback.",
      sourceNote: PHASE5_TEAM_SOURCE_NOTE,
      status: "provisional",
      fallbackKey: "route-logo-fallback",
    }
  );
}
