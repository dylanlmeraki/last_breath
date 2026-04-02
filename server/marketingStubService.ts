import {
  marketingBlogPosts,
  marketingGalleryProjects,
  type MarketingBlogPost,
  type MarketingChatbotRequest,
  type MarketingChatbotResponse,
  type MarketingGalleryProject,
  type MarketingIntakeEnvelope,
  type MarketingIntakeResponse,
  type MarketingSubmissionType,
} from "@shared/marketing-content";

type MarketingEntityName = "blog-posts" | "gallery-projects";
type MarketingRecord = MarketingBlogPost | MarketingGalleryProject;
type RecordQuery = Record<string, unknown>;

function getCollection(entityName: MarketingEntityName): MarketingRecord[] {
  return entityName === "blog-posts"
    ? [...marketingBlogPosts]
    : [...marketingGalleryProjects];
}

function normalizeComparable(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function compareValues(a: unknown, b: unknown, direction: 1 | -1): number {
  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * direction;
  }

  const first = normalizeComparable(a);
  const second = normalizeComparable(b);

  if (first < second) return -1 * direction;
  if (first > second) return 1 * direction;
  return 0;
}

function applySort<T extends MarketingRecord>(
  records: T[],
  sort?: string,
): T[] {
  if (!sort) {
    return records;
  }

  const isDescending = sort.startsWith("-");
  const sortKey = (isDescending ? sort.slice(1) : sort) as keyof T;
  const direction: 1 | -1 = isDescending ? -1 : 1;

  return [...records].sort((left, right) =>
    compareValues(left[sortKey], right[sortKey], direction),
  );
}

function matchesQuery(record: MarketingRecord, query: RecordQuery): boolean {
  return Object.entries(query).every(([key, value]) => {
    const recordValue = (record as unknown as Record<string, unknown>)[key];

    if (Array.isArray(recordValue)) {
      if (Array.isArray(value)) {
        return value.every((item) =>
          recordValue.some(
            (recordItem) =>
              normalizeComparable(recordItem) === normalizeComparable(item),
          ),
        );
      }

      return recordValue.some(
        (recordItem) =>
          normalizeComparable(recordItem) === normalizeComparable(value),
      );
    }

    if (value && typeof value === "object") {
      return true;
    }

    return normalizeComparable(recordValue) === normalizeComparable(value);
  });
}

function inferSubmissionType(
  value: Partial<MarketingIntakeEnvelope> & {
    project_type?: string;
    projectType?: string;
  },
): MarketingSubmissionType {
  if (value.submissionType) {
    return value.submissionType;
  }

  const normalizedProjectType = normalizeComparable(
    value.projectType || value.project_type,
  );

  if (normalizedProjectType === "consultation") {
    return "consultation";
  }

  if (normalizedProjectType === "project-inquiry") {
    return "projectInquiry";
  }

  if (normalizeComparable(value.message).startsWith("project inquiry:")) {
    return "projectInquiry";
  }

  return "contact";
}

function normalizeSubmission(
  value: Record<string, unknown>,
): MarketingIntakeEnvelope {
  const submissionType = inferSubmissionType(
    value as Partial<MarketingIntakeEnvelope> & {
      project_type?: string;
      projectType?: string;
    },
  );

  const attachments = Array.isArray(value.attachments)
    ? value.attachments
        .map((item) => String(item).trim())
        .filter(Boolean)
    : [];

  return {
    submissionType,
    name: String(value.name ?? "").trim(),
    email: String(value.email ?? "").trim(),
    phone: String(value.phone ?? "").trim() || undefined,
    company: String(value.company ?? "").trim() || undefined,
    message: String(value.message ?? "").trim(),
    serviceInterest:
      String(value.serviceInterest ?? "").trim() || undefined,
    projectType:
      String(value.projectType ?? value.project_type ?? "").trim() ||
      undefined,
    attachments,
    context:
      value.context && typeof value.context === "object"
        ? (value.context as Record<string, unknown>)
        : undefined,
    source: String(value.source ?? "website").trim() || "website",
  };
}

function nextStepMessage(submissionType: MarketingSubmissionType): string {
  switch (submissionType) {
    case "consultation":
      return "Consultation details received. We now have the core scope, timing, and site context needed for follow-up.";
    case "projectInquiry":
      return "Project inquiry received. Thanks for sharing the project details and what you are looking for.";
    default:
      return "Message received. Thank you for reaching out to Pacific Engineering.";
  }
}

function detectIntent(message: string): string {
  const normalized = normalizeComparable(message);

  if (/\b(asap|urgent|today|tomorrow|rush|emergency)\b/.test(normalized)) {
    return "urgent";
  }
  if (/\b(swppp|stormwater|bmp|erosion)\b/.test(normalized)) {
    return "swppp";
  }
  if (/\b(inspection|testing|concrete|rebar|compaction)\b/.test(normalized)) {
    return "inspection";
  }
  if (/\b(engineer|engineering|structural|design|calculation)\b/.test(normalized)) {
    return "engineering";
  }
  if (/\b(quote|budget|price|cost)\b/.test(normalized)) {
    return "pricing";
  }
  if (/\b(contact|call|phone|talk)\b/.test(normalized)) {
    return "contact";
  }
  if (/\b(consultation|consult|schedule|meeting)\b/.test(normalized)) {
    return "consultation";
  }

  return "general";
}

function chatbotResponseForIntent(intent: string): {
  response: string;
  suggestedActions: string[];
} {
  switch (intent) {
    case "urgent":
      return {
        response:
          "If this project is time-sensitive, the fastest next step is to call Pacific directly. You can also use the consultation flow so the key scope and timing details are already organized.",
        suggestedActions: ["Call Now", "Schedule Consultation"],
      };
    case "swppp":
      return {
        response:
          "Pacific supports SWPPP planning, implementation support, and compliance-minded coordination. If you already know the site and likely disturbance area, the consultation form is the best place to share those details.",
        suggestedActions: ["Schedule Consultation", "Our Services"],
      };
    case "inspection":
      return {
        response:
          "Pacific handles inspection and testing workflows with field-aware coordination. If you share the scope, jurisdiction, and timing, we can point you toward the right next step quickly.",
        suggestedActions: ["Schedule Consultation", "Contact Us"],
      };
    case "engineering":
      return {
        response:
          "Pacific approaches engineering with field realities in mind, so design, permitting, and construction coordination stay connected. If you want, I can point you to service coverage or help you stage a scoped consultation request.",
        suggestedActions: ["Our Services", "Schedule Consultation"],
      };
    case "pricing":
      return {
        response:
          "Pricing depends on scope, jurisdiction, and delivery conditions. The consultation path is the best way to share the information needed for a meaningful next conversation.",
        suggestedActions: ["Schedule Consultation", "Contact Us"],
      };
    case "contact":
      return {
        response:
          "You can call Pacific directly or use the contact form. Both are set up to capture the core project details you share here.",
        suggestedActions: ["Call Now", "Contact Us"],
      };
    case "consultation":
      return {
        response:
          "The consultation form is ready to capture project scope, locations, attachments, and timing so the follow-up starts with better context.",
        suggestedActions: ["Schedule Consultation", "Contact Us"],
      };
    default:
      return {
        response:
          "Pacific supports engineering, inspections, construction coordination, and stormwater compliance across the Bay Area. Tell me a little about the project and I can point you to the best next step.",
        suggestedActions: [
          "Our Services",
          "Schedule Consultation",
          "Contact Us",
        ],
      };
  }
}

export function listMarketingEntity(
  entityName: MarketingEntityName,
  sort?: string,
  limit = 50,
): MarketingRecord[] {
  const records = applySort(getCollection(entityName), sort);
  return records.slice(0, limit);
}

export function getMarketingEntityById(
  entityName: MarketingEntityName,
  id: string,
): MarketingRecord | undefined {
  return getCollection(entityName).find(
    (record) => normalizeComparable(record.id) === normalizeComparable(id),
  );
}

export function filterMarketingEntity(
  entityName: MarketingEntityName,
  query: RecordQuery = {},
  sort?: string,
  limit = 50,
): MarketingRecord[] {
  const filtered = getCollection(entityName).filter((record) =>
    matchesQuery(record, query),
  );
  return applySort(filtered, sort).slice(0, limit);
}

export function getMarketingBlogPostBySlug(
  slug: string,
): MarketingBlogPost | undefined {
  return marketingBlogPosts.find(
    (post) => normalizeComparable(post.slug) === normalizeComparable(slug),
  );
}

export function getMarketingGalleryProjectBySlug(
  slug: string,
): MarketingGalleryProject | undefined {
  return marketingGalleryProjects.find(
    (project) => normalizeComparable(project.slug) === normalizeComparable(slug),
  );
}

export function submitMarketingIntake(
  body: Record<string, unknown>,
): MarketingIntakeResponse {
  const submission = normalizeSubmission(body);

  if (!submission.name || !submission.email || !submission.message) {
    throw new Error("name, email, and message are required");
  }

  return {
    accepted: true,
    stubbed: true,
    submissionId: `stub-${Date.now()}`,
    submissionType: submission.submissionType,
    nextStepMessage: nextStepMessage(submission.submissionType),
  };
}

export function createMarketingChatbotReply(
  body: MarketingChatbotRequest,
): MarketingChatbotResponse {
  if (!body.message || !body.message.trim()) {
    throw new Error("Message is required");
  }

  const capturedIntent = detectIntent(body.message);
  const reply = chatbotResponseForIntent(capturedIntent);

  return {
    response: reply.response,
    source: "stub",
    stubbed: true,
    conversationId:
      body.conversationId?.trim() || `stub-chat-${Date.now()}`,
    capturedIntent,
    suggestedActions: reply.suggestedActions,
  };
}
