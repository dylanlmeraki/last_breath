import { Resend } from "resend";
import { render } from "@react-email/render";
import { storage } from "./storage";
import { InviteEmail } from "./emails/InviteEmail";
import { WelcomeEmail } from "./emails/WelcomeEmail";
import { PasswordResetEmail } from "./emails/PasswordResetEmail";
import { NotificationEmail } from "./emails/NotificationEmail";
import { ProposalEmail } from "./emails/ProposalEmail";
import { InvoiceEmail } from "./emails/InvoiceEmail";
import { ProjectUpdateEmail } from "./emails/ProjectUpdateEmail";
import { DocumentApprovalEmail } from "./emails/DocumentApprovalEmail";
import { BaseLayout } from "./emails/BaseLayout";
import * as React from "react";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || "notifications@pacificengineeringsf.com";
const DEFAULT_FROM_NAME = process.env.FROM_NAME || "Pacific Engineering";

const INTERNAL_URL = process.env.INTERNAL_URL || "https://internal.pacificengineeringsf.com";
const PORTAL_URL = process.env.PORTAL_URL || "https://portal.pacificengineeringsf.com";

export function getPortalUrl(portal: "internal" | "client"): string {
  return portal === "internal" ? INTERNAL_URL : PORTAL_URL;
}

function getFromAddress(fromName?: string): string {
  return `${fromName || DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL}>`;
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  body: string;
  from_name?: string;
  reply_to?: string;
  cc?: string[];
  bcc?: string[];
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn("[email] Resend not configured (RESEND_API_KEY missing). Email not sent:", params.subject);
    return { success: false, error: "Email provider not configured" };
  }

  let lastError: string | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await resend.emails.send({
        from: getFromAddress(params.from_name),
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.body,
        replyTo: params.reply_to,
        cc: params.cc,
        bcc: params.bcc,
      });

      if (result.error) {
        lastError = result.error.message;
        console.error(`[email] attempt ${attempt + 1} failed:`, result.error);
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }

      console.log("[email] sent successfully:", params.subject, "to:", params.to);
      return { success: true, id: result.data?.id };
    } catch (e: any) {
      lastError = e.message || "Unknown error";
      console.error(`[email] attempt ${attempt + 1} error:`, e);
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  return { success: false, error: lastError };
}

async function renderReactEmail(element: React.ReactElement): Promise<string> {
  return await render(element);
}

function wrapInBrandedTemplate(heading: string, bodyHtml: string, ctaText?: string, ctaUrl?: string): string {
  const ctaBlock = ctaText && ctaUrl
    ? `<div style="text-align:center;margin:30px 0;"><a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#0B67A6 0%,#0EA5A4 100%);color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">${ctaText}</a></div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="background:linear-gradient(135deg,#0B67A6 0%,#0EA5A4 100%);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${heading}</h1>
<p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Pacific Engineering</p>
</div>
<div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
${bodyHtml}
${ctaBlock}
</div>
<div style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
<p style="margin:0;">Pacific Engineering &mdash; San Francisco, CA</p>
<p style="margin:4px 0 0;"><a href="https://pacificengineeringsf.com" style="color:#0B67A6;text-decoration:none;">pacificengineeringsf.com</a></p>
</div>
</div>
</body>
</html>`;
}

export async function sendNotificationEmail(params: {
  to: string;
  heading: string;
  body: string;
  cta_text?: string;
  cta_url?: string;
  subject?: string;
  name?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(NotificationEmail, {
        name: params.name,
        heading: params.heading,
        body: params.body,
        cta_text: params.cta_text,
        cta_url: params.cta_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: params.subject || params.heading,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for notification:", e);
    const html = wrapInBrandedTemplate(params.heading, params.body, params.cta_text, params.cta_url);
    return sendEmail({
      to: params.to,
      subject: params.subject || params.heading,
      body: html,
    });
  }
}

export function interpolateTemplate(template: string, variables: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, String(value ?? ""));
  }
  return result;
}

export async function sendTemplatedEmail(
  templateName: string,
  variables: Record<string, any>,
  to: string | string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const templates = await storage.filterEntity("email-templates", {
      template_name: templateName,
      active: true,
    });

    if (!templates.length) {
      console.warn(`[email] template "${templateName}" not found, falling back to basic send`);
      return sendEmail({
        to,
        subject: variables.subject || templateName,
        body: variables.body || "",
      });
    }

    const template = templates[0];
    const subject = interpolateTemplate(template.subject_template, variables);
    const bodyContent = interpolateTemplate(template.body_template, variables);
    const html = wrapInBrandedTemplate(subject, bodyContent, variables.cta_text, variables.cta_url);

    return sendEmail({ to, subject, body: html });
  } catch (error: any) {
    console.error("[email] sendTemplatedEmail error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendInviteEmail(params: {
  to: string;
  invitee_name: string;
  inviter_name: string;
  company_name?: string;
  invite_url: string;
  invite_type: "internal" | "client" | "team";
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(InviteEmail, {
        invitee_name: params.invitee_name,
        inviter_name: params.inviter_name,
        company_name: params.company_name,
        invite_url: params.invite_url,
        invite_type: params.invite_type,
      })
    );

    const typeLabels: Record<string, string> = {
      internal: "Internal Portal",
      client: "Client Portal",
      team: "Team",
    };

    return sendEmail({
      to: params.to,
      subject: `You're invited to Pacific Engineering ${typeLabels[params.invite_type]}`,
      body: html,
      from_name: "Pacific Engineering",
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for invite:", e);
    const typeLabels: Record<string, string> = {
      internal: "Internal Portal",
      client: "Client Portal",
      team: "Team",
    };
    const heading = `You're Invited to Pacific Engineering ${typeLabels[params.invite_type]}`;
    const body = `<p>Hi ${params.invitee_name || "there"},</p><p>${params.inviter_name} has invited you to join the Pacific Engineering ${typeLabels[params.invite_type]}.</p>`;
    const html = wrapInBrandedTemplate(heading, body, "Accept Invitation", params.invite_url);
    return sendEmail({ to: params.to, subject: heading, body: html, from_name: "Pacific Engineering" });
  }
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  reset_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(PasswordResetEmail, {
        name: params.name,
        reset_url: params.reset_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: "Reset Your Password - Pacific Engineering",
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for password reset:", e);
    const body = `<p>Hi ${params.name},</p><p>Click the button below to reset your password.</p>`;
    const html = wrapInBrandedTemplate("Reset Your Password", body, "Reset Password", params.reset_url);
    return sendEmail({ to: params.to, subject: "Reset Your Password - Pacific Engineering", body: html });
  }
}

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  account_type: "internal" | "client";
  portal_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(WelcomeEmail, {
        name: params.name,
        account_type: params.account_type,
        portal_url: params.portal_url,
      })
    );
    const portalLabel = params.account_type === "internal" ? "Internal Portal" : "Client Portal";
    return sendEmail({
      to: params.to,
      subject: `Welcome to Pacific Engineering ${portalLabel}`,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for welcome:", e);
    const portalLabel = params.account_type === "internal" ? "Internal Portal" : "Client Portal";
    const body = `<p>Hi ${params.name},</p><p>Your account has been created. You now have access to the Pacific Engineering ${portalLabel}.</p>`;
    const html = wrapInBrandedTemplate("Welcome to Pacific Engineering!", body, `Go to ${portalLabel}`, params.portal_url);
    return sendEmail({ to: params.to, subject: `Welcome to Pacific Engineering ${portalLabel}`, body: html });
  }
}

export async function sendProposalEmail(params: {
  to: string;
  client_name: string;
  project_name: string;
  proposal_number?: string;
  amount?: number;
  expiration_date?: string;
  proposal_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(ProposalEmail, {
        client_name: params.client_name,
        project_name: params.project_name,
        proposal_number: params.proposal_number,
        amount: params.amount,
        expiration_date: params.expiration_date,
        proposal_url: params.proposal_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: `Proposal for ${params.project_name} - Pacific Engineering`,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for proposal:", e);
    const body = `<p>Hi ${params.client_name},</p><p>A proposal has been prepared for ${params.project_name}.</p>`;
    const html = wrapInBrandedTemplate("Your Proposal is Ready", body, "View Proposal", params.proposal_url);
    return sendEmail({ to: params.to, subject: `Proposal for ${params.project_name}`, body: html });
  }
}

export async function sendInvoiceEmail(params: {
  to: string;
  client_name: string;
  project_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  invoice_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(InvoiceEmail, {
        client_name: params.client_name,
        project_name: params.project_name,
        invoice_number: params.invoice_number,
        amount: params.amount,
        due_date: params.due_date,
        invoice_url: params.invoice_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: `Invoice ${params.invoice_number} - Pacific Engineering`,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for invoice:", e);
    const body = `<p>Hi ${params.client_name},</p><p>Invoice ${params.invoice_number} for $${params.amount.toLocaleString()} is due ${params.due_date}.</p>`;
    const html = wrapInBrandedTemplate("Invoice Notification", body, "View Invoice", params.invoice_url);
    return sendEmail({ to: params.to, subject: `Invoice ${params.invoice_number}`, body: html });
  }
}

export async function sendProjectUpdateEmail(params: {
  to: string;
  client_name: string;
  project_name: string;
  update_type: string;
  milestone_name?: string;
  progress_percentage?: number;
  message: string;
  project_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(ProjectUpdateEmail, {
        client_name: params.client_name,
        project_name: params.project_name,
        update_type: params.update_type,
        milestone_name: params.milestone_name,
        progress_percentage: params.progress_percentage,
        message: params.message,
        project_url: params.project_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: `Project Update: ${params.project_name} - Pacific Engineering`,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for project update:", e);
    const body = `<p>Hi ${params.client_name},</p><p>${params.message}</p>`;
    const html = wrapInBrandedTemplate("Project Update", body, "View Project", params.project_url);
    return sendEmail({ to: params.to, subject: `Project Update: ${params.project_name}`, body: html });
  }
}

export async function sendDocumentApprovalEmail(params: {
  to: string;
  reviewer_name: string;
  document_name: string;
  project_name: string;
  uploaded_by: string;
  description?: string;
  review_url: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await renderReactEmail(
      React.createElement(DocumentApprovalEmail, {
        reviewer_name: params.reviewer_name,
        document_name: params.document_name,
        project_name: params.project_name,
        uploaded_by: params.uploaded_by,
        description: params.description,
        review_url: params.review_url,
      })
    );
    return sendEmail({
      to: params.to,
      subject: `Document Review: ${params.document_name} - Pacific Engineering`,
      body: html,
    });
  } catch (e) {
    console.error("[email] renderReactEmail fallback for document approval:", e);
    const body = `<p>Hi ${params.reviewer_name},</p><p>Please review the document "${params.document_name}" for ${params.project_name}.</p>`;
    const html = wrapInBrandedTemplate("Document Review Request", body, "Review Document", params.review_url);
    return sendEmail({ to: params.to, subject: `Document Review: ${params.document_name}`, body: html });
  }
}

export async function renderTemplatePreview(
  subject_template: string,
  body_template: string,
  variables: Record<string, any>
): Promise<string> {
  const subject = interpolateTemplate(subject_template, variables);
  const bodyContent = interpolateTemplate(body_template, variables);
  return wrapInBrandedTemplate(subject, bodyContent, variables.cta_text, variables.cta_url);
}
