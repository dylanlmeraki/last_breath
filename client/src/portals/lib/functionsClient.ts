import { apiRequest } from "./queryClient";

export async function callFunction(name: string, params: Record<string, any> = {}): Promise<any> {
  const res = await apiRequest("POST", `/api/functions/${name}`, params);
  return res.json();
}

export async function executeWorkflow(params: Record<string, any>) {
  return callFunction("executeWorkflow", params);
}

export async function sendNotification(params: {
  recipient_email: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  priority?: string;
  send_email?: boolean;
}) {
  return callFunction("sendNotification", params);
}

export async function createClientInvite(params: {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  contact_id?: string;
}) {
  return callFunction("createClientInvite", params);
}

export async function enrichProspect(params: { prospect_id: string }) {
  return callFunction("enrichProspect", params);
}

export async function shareProposal(params: {
  proposal_id: string;
  recipient_emails: string[];
}) {
  return callFunction("shareProposal", params);
}

export async function sendProposalReminder(params: { proposal_id: string }) {
  return callFunction("sendProposalReminder", params);
}

export async function generateProjectReport(params: {
  project_id: string;
  report_type?: string;
}) {
  return callFunction("generateProjectReport", params);
}

export async function startOutreachSequence(params: {
  prospect_id: string;
  sequence_id: string;
}) {
  return callFunction("startOutreachSequence", params);
}

export async function scheduleMeeting(params: {
  prospect_id: string;
  meeting_type?: string;
  duration?: number;
  date?: string;
  time?: string;
}) {
  return callFunction("scheduleMeeting", params);
}

export async function createSandboxData(params?: Record<string, any>) {
  return callFunction("createSandboxData", params || {});
}

export async function sendProjectNotification(params: {
  projectId: string;
  notificationType: string;
  templateId?: string;
  customMessage?: string;
}) {
  return callFunction("sendProjectNotification", params);
}

export async function checkOverdueInvoices() {
  return callFunction("checkOverdueInvoices", {});
}

export async function sendOverdueReminder(params: { doc_id: string }) {
  return callFunction("sendOverdueReminder", params);
}
