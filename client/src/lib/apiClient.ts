import { apiRequest } from "./queryClient";

const entityNameMap: Record<string, string> = {
  Prospect: "prospects",
  Interaction: "interactions",
  Task: "tasks",
  Project: "projects",
  ProjectDoc: "project-documents",
  ProjectDocument: "project-documents",
  ProjectMilestone: "project-milestones",
  ChangeOrder: "change-orders",
  ProjectMessage: "project-messages",
  Proposal: "proposals",
  ProposalTemplate: "proposal-templates",
  Invoice: "invoices",
  Workflow: "workflows",
  BlogPost: "blog-posts",
  CalendarSettings: "calendar-settings",
  EmailSetting: "email-settings",
  EmailSettings: "email-settings",
  ICPSettings: "icp-settings",
  IcpSettings: "icp-settings",
  AuditLog: "audit-logs",
  Notification: "notifications",
  ClientInvite: "client-invites",
  InternalInvite: "internal-invites",
  EmailTemplate: "email-templates",
  CommunicationTemplate: "communication-templates",
  ProjectRequest: "project-requests",
  RFI: "rfis",
  Rfi: "rfis",
  SalesOutreach: "sales-outreach",
  EmailSequence: "email-sequences",
  ScheduledReport: "scheduled-reports",
  CustomPage: "custom-pages",
  DashboardConfig: "dashboard-configs",
  FormSubmission: "form-submissions",
  User: "users",
};

function resolveEntityPath(entityName: string): string {
  return entityNameMap[entityName] || entityName;
}

export async function listEntities<T = any>(
  entityName: string,
  sort?: string,
  limit?: number
): Promise<T[]> {
  const path = resolveEntityPath(entityName);
  const params = new URLSearchParams();
  if (sort) params.set("sort", sort);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  const url = `/api/${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to list ${entityName}`);
  }
  return res.json();
}

export async function filterEntities<T = any>(
  entityName: string,
  query: Record<string, any>,
  sort?: string,
  limit?: number
): Promise<T[]> {
  const path = resolveEntityPath(entityName);
  const res = await apiRequest("POST", `/api/${path}/filter`, { query, sort, limit });
  return res.json();
}

export async function getEntity<T = any>(
  entityName: string,
  id: string
): Promise<T> {
  const path = resolveEntityPath(entityName);
  const res = await fetch(`/api/${path}/${id}`, { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to get ${entityName}`);
  }
  return res.json();
}

export async function createEntity<T = any>(
  entityName: string,
  data: Record<string, any>
): Promise<T> {
  const path = resolveEntityPath(entityName);
  const res = await apiRequest("POST", `/api/${path}`, data);
  return res.json();
}

export async function bulkCreateEntities<T = any>(
  entityName: string,
  items: Record<string, any>[]
): Promise<T[]> {
  const path = resolveEntityPath(entityName);
  const res = await apiRequest("POST", `/api/${path}/bulk`, { items });
  return res.json();
}

export async function updateEntity<T = any>(
  entityName: string,
  id: string,
  data: Record<string, any>
): Promise<T> {
  const path = resolveEntityPath(entityName);
  const res = await apiRequest("PUT", `/api/${path}/${id}`, data);
  return res.json();
}

export async function deleteEntity(
  entityName: string,
  id: string
): Promise<void> {
  const path = resolveEntityPath(entityName);
  await apiRequest("DELETE", `/api/${path}/${id}`);
}

export async function getMe(): Promise<any> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}
