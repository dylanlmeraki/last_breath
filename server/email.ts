import { Resend } from "resend";
import { storage } from "./storage";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || "notifications@pacificengineeringsf.com";
const DEFAULT_FROM_NAME = process.env.FROM_NAME || "Pacific Engineering";

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
}): Promise<{ success: boolean; error?: string }> {
  const html = wrapInBrandedTemplate(params.heading, params.body, params.cta_text, params.cta_url);
  return sendEmail({
    to: params.to,
    subject: params.subject || params.heading,
    body: html,
  });
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
  const typeLabels = {
    internal: "Internal Portal",
    client: "Client Portal",
    team: "Team",
  };

  const heading = `You're Invited to Pacific Engineering ${typeLabels[params.invite_type]}`;
  const body = `
<p style="font-size:16px;color:#374151;">Hi ${params.invitee_name || "there"},</p>
<p style="font-size:15px;color:#4b5563;line-height:1.6;">
${params.inviter_name} has invited you to join the Pacific Engineering ${typeLabels[params.invite_type]}${params.company_name ? ` for <strong>${params.company_name}</strong>` : ""}.
</p>
<p style="font-size:15px;color:#4b5563;line-height:1.6;">
Click the button below to create your account and get started.
</p>
<p style="font-size:13px;color:#9ca3af;margin-top:20px;">This invitation expires in 7 days.</p>`;

  const html = wrapInBrandedTemplate(heading, body, "Accept Invitation", params.invite_url);
  return sendEmail({
    to: params.to,
    subject: `You're invited to Pacific Engineering ${typeLabels[params.invite_type]}`,
    body: html,
    from_name: "Pacific Engineering",
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  reset_url: string;
}): Promise<{ success: boolean; error?: string }> {
  const heading = "Reset Your Password";
  const body = `
<p style="font-size:16px;color:#374151;">Hi ${params.name},</p>
<p style="font-size:15px;color:#4b5563;line-height:1.6;">
We received a request to reset your password. Click the button below to choose a new password.
</p>
<p style="font-size:13px;color:#9ca3af;margin-top:20px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>`;

  const html = wrapInBrandedTemplate(heading, body, "Reset Password", params.reset_url);
  return sendEmail({
    to: params.to,
    subject: "Reset Your Password - Pacific Engineering",
    body: html,
  });
}

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  account_type: "internal" | "client";
  portal_url: string;
}): Promise<{ success: boolean; error?: string }> {
  const heading = "Welcome to Pacific Engineering!";
  const portalLabel = params.account_type === "internal" ? "Internal Portal" : "Client Portal";
  const body = `
<p style="font-size:16px;color:#374151;">Hi ${params.name},</p>
<p style="font-size:15px;color:#4b5563;line-height:1.6;">
Your account has been successfully created. You now have access to the Pacific Engineering ${portalLabel}.
</p>
<p style="font-size:15px;color:#4b5563;line-height:1.6;">
Click the button below to get started.
</p>`;

  const html = wrapInBrandedTemplate(heading, body, `Go to ${portalLabel}`, params.portal_url);
  return sendEmail({
    to: params.to,
    subject: `Welcome to Pacific Engineering ${portalLabel}`,
    body: html,
  });
}
