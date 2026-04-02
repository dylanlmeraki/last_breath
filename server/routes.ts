import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { authRouter, inviteRouter, usersRouter, requireAuth, requireAdmin, requireClient, requireInternalUser, optionalAuth } from "./auth";
import { entityTableMap } from "@shared/schema";
import { sendEmail, sendNotificationEmail, sendTemplatedEmail, interpolateTemplate, renderTemplatePreview } from "./email";
import {
  createMarketingChatbotReply,
  filterMarketingEntity,
  getMarketingBlogPostBySlug,
  getMarketingEntityById,
  getMarketingGalleryProjectBySlug,
  listMarketingEntity,
  submitMarketingIntake,
} from "./marketingStubService";

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isMarketingEntityName(
  entityName: string,
): entityName is "blog-posts" | "gallery-projects" {
  return entityName === "blog-posts" || entityName === "gallery-projects";
}

function createEntityRouter(entityName: string, authMiddleware: any = requireAuth) {
  const router = Router();

  router.get("/", authMiddleware, async (req: Request, res: Response) => {
    try {
      const sort = req.query.sort as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const records = await storage.listEntity(entityName, sort, limit);
      return res.json(records);
    } catch (error: any) {
      console.error(`[routes] GET /${entityName} error:`, error);
      return res.status(500).json({ error: `Failed to list ${entityName}` });
    }
  });

  router.post("/filter", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { query, sort, limit } = req.body;
      const records = await storage.filterEntity(entityName, query || {}, sort, limit);
      return res.json(records);
    } catch (error: any) {
      console.error(`[routes] POST /${entityName}/filter error:`, error);
      return res.status(500).json({ error: `Failed to filter ${entityName}` });
    }
  });

  router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const record = await storage.getEntityById(entityName, getParam(req.params.id));
      if (!record) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      return res.json(record);
    } catch (error: any) {
      console.error(`[routes] GET /${entityName}/:id error:`, error);
      return res.status(500).json({ error: `Failed to get ${entityName}` });
    }
  });

  router.post("/", authMiddleware, async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        created_by: req.user?.email || "system",
      };
      const record = await storage.createEntity(entityName, data);
      return res.status(201).json(record);
    } catch (error: any) {
      console.error(`[routes] POST /${entityName} error:`, error);
      if (error.message?.includes("Duplicate")) {
        return res.status(409).json({ error: error.message });
      }
      if (error.message?.includes("Referenced")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: `Failed to create ${entityName}` });
    }
  });

  router.post("/bulk", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items array required" });
      }
      const dataArray = items.map((item: any) => ({
        ...item,
        created_by: req.user?.email || "system",
      }));
      const records = await storage.bulkCreateEntity(entityName, dataArray);
      return res.status(201).json(records);
    } catch (error: any) {
      console.error(`[routes] POST /${entityName}/bulk error:`, error);
      return res.status(500).json({ error: `Failed to bulk create ${entityName}` });
    }
  });

  router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const record = await storage.updateEntity(entityName, getParam(req.params.id), req.body);
      if (!record) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      return res.json(record);
    } catch (error: any) {
      console.error(`[routes] PUT /${entityName}/:id error:`, error);
      return res.status(500).json({ error: `Failed to update ${entityName}` });
    }
  });

  router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteEntity(entityName, getParam(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      return res.status(204).send();
    } catch (error: any) {
      console.error(`[routes] DELETE /${entityName}/:id error:`, error);
      return res.status(500).json({ error: `Failed to delete ${entityName}` });
    }
  });

  return router;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use("/api/auth", authRouter);
  app.use("/api/invites", inviteRouter);
  app.use("/api/users", usersRouter);

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });
  });

  const publicReadRouter = (entityName: string) => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
      try {
        const sort = req.query.sort as string | undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

        if (isMarketingEntityName(entityName)) {
          const records = listMarketingEntity(entityName, sort, limit);
          return res.json(records);
        }

        const records = await storage.listEntity(entityName, sort, limit);
        return res.json(records);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to list ${entityName}` });
      }
    });

    router.get("/:id", async (req: Request, res: Response) => {
      try {
        if (isMarketingEntityName(entityName)) {
          const record = getMarketingEntityById(entityName, getParam(req.params.id));
          if (!record) return res.status(404).json({ error: `${entityName} not found` });
          return res.json(record);
        }

        const record = await storage.getEntityById(entityName, getParam(req.params.id));
        if (!record) return res.status(404).json({ error: `${entityName} not found` });
        return res.json(record);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to get ${entityName}` });
      }
    });

    router.post("/filter", async (req: Request, res: Response) => {
      try {
        const { query, sort, limit } = req.body;

        if (isMarketingEntityName(entityName)) {
          const records = filterMarketingEntity(entityName, query || {}, sort, limit);
          return res.json(records);
        }

        const records = await storage.filterEntity(entityName, query || {}, sort, limit);
        return res.json(records);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to filter ${entityName}` });
      }
    });

    router.post("/", requireAuth, async (req: Request, res: Response) => {
      try {
        const data = { ...req.body, created_by: req.user?.email || "system" };
        const record = await storage.createEntity(entityName, data);
        return res.status(201).json(record);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to create ${entityName}` });
      }
    });

    router.put("/:id", requireAuth, async (req: Request, res: Response) => {
      try {
        const record = await storage.updateEntity(entityName, getParam(req.params.id), req.body);
        if (!record) return res.status(404).json({ error: `${entityName} not found` });
        return res.json(record);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to update ${entityName}` });
      }
    });

    router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
      try {
        const deleted = await storage.deleteEntity(entityName, getParam(req.params.id));
        if (!deleted) return res.status(404).json({ error: `${entityName} not found` });
        return res.status(204).send();
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to delete ${entityName}` });
      }
    });

    return router;
  };

  app.use("/api/blog-posts", publicReadRouter("blog-posts"));
  app.use("/api/gallery-projects", publicReadRouter("gallery-projects"));

  app.get("/api/blog-posts/slug/:slug", async (req: Request, res: Response) => {
    try {
      const post = getMarketingBlogPostBySlug(getParam(req.params.slug));
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/gallery-projects/slug/:slug", async (req: Request, res: Response) => {
    try {
      const project = getMarketingGalleryProjectBySlug(getParam(req.params.slug));
      if (!project) return res.status(404).json({ error: "Gallery project not found" });
      return res.json(project);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch gallery project" });
    }
  });

  app.post("/api/chatbot", async (req: Request, res: Response) => {
    try {
      return res.json(createMarketingChatbotReply(req.body));
    } catch (error: any) {
      if (error.message === "Message is required") {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Chatbot error" });
    }
  });

  const formSubmissionsRouter = Router();

  formSubmissionsRouter.post("/", async (req: Request, res: Response) => {
    try {
      return res.status(201).json(submitMarketingIntake(req.body));
    } catch (error: any) {
      console.error("[routes] POST /form-submissions error:", error);
      if (error.message?.includes("required")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to submit form" });
    }
  });

  formSubmissionsRouter.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const sort = req.query.sort as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const records = await storage.listEntity("form-submissions", sort, limit);
      return res.json(records);
    } catch (error) {
      return res.status(500).json({ error: "Failed to list form submissions" });
    }
  });

  formSubmissionsRouter.get("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const record = await storage.getEntityById("form-submissions", getParam(req.params.id));
      if (!record) return res.status(404).json({ error: "Form submission not found" });
      return res.json(record);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get form submission" });
    }
  });

  formSubmissionsRouter.put("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const record = await storage.updateEntity("form-submissions", getParam(req.params.id), req.body);
      if (!record) return res.status(404).json({ error: "Form submission not found" });
      return res.json(record);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update form submission" });
    }
  });

  app.use("/api/form-submissions", formSubmissionsRouter);

  app.use("/api/prospects", createEntityRouter("prospects"));
  app.use("/api/interactions", createEntityRouter("interactions"));
  app.use("/api/tasks", createEntityRouter("tasks"));
  app.use("/api/projects", createEntityRouter("projects"));
  app.use("/api/project-documents", createEntityRouter("project-documents"));
  app.use("/api/project-milestones", createEntityRouter("project-milestones"));
  app.use("/api/change-orders", createEntityRouter("change-orders"));
  app.use("/api/project-messages", createEntityRouter("project-messages"));
  app.use("/api/proposals", createEntityRouter("proposals"));
  app.use("/api/proposal-templates", createEntityRouter("proposal-templates"));
  app.use("/api/invoices", createEntityRouter("invoices"));
  app.use("/api/workflows", createEntityRouter("workflows"));
  app.use("/api/calendar-settings", createEntityRouter("calendar-settings"));
  app.use("/api/email-settings", createEntityRouter("email-settings"));
  app.use("/api/icp-settings", createEntityRouter("icp-settings"));
  app.use("/api/audit-logs", createEntityRouter("audit-logs", requireAdmin));
  app.get("/api/notifications/unread/:email", requireAuth, async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getUnreadNotifications(getParam(req.params.email));
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const notification = await storage.markNotificationRead(getParam(req.params.id));
      if (!notification) return res.status(404).json({ error: "Notification not found" });
      return res.json(notification);
    } catch (error) {
      return res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/notifications/read-all", requireAuth, async (req: Request, res: Response) => {
    try {
      const email = req.user?.email;
      if (!email) return res.status(400).json({ error: "User email required" });
      await storage.markAllNotificationsRead(email);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.use("/api/notifications", createEntityRouter("notifications"));
  app.get("/api/client-invites/validate/:token", async (req: Request, res: Response) => {
    try {
      const invite = await storage.getClientInviteByToken(getParam(req.params.token));
      if (!invite) return res.status(404).json({ error: "Invalid or expired invite" });
      if (new Date(invite.expires_at) < new Date()) {
        return res.status(410).json({ error: "Invite has expired" });
      }
      return res.json({ email: invite.email, company_name: invite.company_name, name: invite.name });
    } catch (error) {
      return res.status(500).json({ error: "Failed to validate invite" });
    }
  });

  app.use("/api/client-invites", createEntityRouter("client-invites"));
  app.use("/api/internal-invites", createEntityRouter("internal-invites", requireAdmin));
  app.post("/api/email-templates/preview", requireAuth, async (req: Request, res: Response) => {
    try {
      const { subject_template, body_template, variables } = req.body;
      if (!subject_template || !body_template) {
        return res.status(400).json({ error: "subject_template and body_template are required" });
      }
      const sampleVars = variables || {
        client_name: "John Smith",
        project_name: "Sample Project",
        company_name: "Acme Corp",
        date: new Date().toLocaleDateString(),
        amount: "$10,000",
        invoice_number: "INV-001",
        due_date: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
        name: "John Smith",
        link: "https://pacificengineeringsf.com",
      };
      const html = await renderTemplatePreview(subject_template, body_template, sampleVars);
      return res.json({ html });
    } catch (error: any) {
      console.error("[routes] email template preview error:", error);
      return res.status(500).json({ error: "Failed to render preview" });
    }
  });

  app.post("/api/email-templates/:id/send-test", requireAuth, async (req: Request, res: Response) => {
    try {
      const { to } = req.body;
      if (!to) return res.status(400).json({ error: "Recipient email (to) is required" });

      const template = await storage.getEntityById("email-templates", getParam(req.params.id));
      if (!template) return res.status(404).json({ error: "Template not found" });

      const sampleVars: Record<string, any> = {
        client_name: "John Smith",
        project_name: "Sample Project",
        company_name: "Acme Corp",
        date: new Date().toLocaleDateString(),
        amount: "$10,000",
        invoice_number: "INV-001",
        due_date: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
        name: "John Smith",
        link: "https://pacificengineeringsf.com",
      };

      const subject = interpolateTemplate(template.subject_template, sampleVars);
      const html = await renderTemplatePreview(template.subject_template, template.body_template, sampleVars);

      const result = await sendEmail({ to, subject: `[TEST] ${subject}`, body: html });
      return res.json(result);
    } catch (error: any) {
      console.error("[routes] send test email error:", error);
      return res.status(500).json({ error: "Failed to send test email" });
    }
  });

  app.post("/api/admin/test-email", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { to } = req.body;
      if (!to) return res.status(400).json({ error: "Recipient email (to) is required" });

      const result = await sendNotificationEmail({
        to,
        heading: "Test Email from Pacific Engineering",
        body: `<p style="font-size:15px;color:#4b5563;line-height:1.6;">This is a test email sent from the Pacific Engineering admin console.</p><p style="font-size:15px;color:#4b5563;line-height:1.6;">If you're seeing this, your Resend integration is working correctly with TLS enforced and click-tracking enabled.</p><p style="font-size:13px;color:#9ca3af;">Sent at ${new Date().toISOString()}</p>`,
        subject: "[Test] Pacific Engineering Email Configuration",
        cta_text: "Visit Portal",
        cta_url: "https://internal.pacificengineeringsf.com",
      });

      return res.json(result);
    } catch (error: any) {
      console.error("[routes] admin test email error:", error);
      return res.status(500).json({ error: "Failed to send test email" });
    }
  });

  app.get("/api/admin/email-status", requireAdmin, async (_req: Request, res: Response) => {
    return res.json({
      provider: "Resend",
      configured: !!process.env.RESEND_API_KEY,
      from_email: process.env.FROM_EMAIL || "notifications@pacificengineeringsf.com",
      from_name: process.env.FROM_NAME || "Pacific Engineering",
      tls_enforced: true,
      click_tracking: true,
      open_tracking: false,
      domain: "pacificengineeringsf.com",
      internal_url: process.env.INTERNAL_URL || "https://internal.pacificengineeringsf.com",
      portal_url: process.env.PORTAL_URL || "https://portal.pacificengineeringsf.com",
    });
  });

  app.use("/api/email-templates", createEntityRouter("email-templates"));
  app.use("/api/communication-templates", createEntityRouter("communication-templates"));
  app.use("/api/project-requests", createEntityRouter("project-requests"));
  app.use("/api/rfis", createEntityRouter("rfis"));
  app.use("/api/sales-outreach", createEntityRouter("sales-outreach"));
  app.use("/api/email-sequences", createEntityRouter("email-sequences"));
  app.use("/api/scheduled-reports", createEntityRouter("scheduled-reports"));
  app.use("/api/custom-pages", createEntityRouter("custom-pages"));
  app.use("/api/dashboard-configs", createEntityRouter("dashboard-configs"));

  app.post("/api/integrations/llm", requireAuth, async (req: Request, res: Response) => {
    try {
      return res.json({ message: "LLM integration endpoint — configure provider in settings" });
    } catch (error) {
      return res.status(500).json({ error: "LLM integration failed" });
    }
  });

  app.post("/api/integrations/email", requireAuth, async (req: Request, res: Response) => {
    try {
      const { to, subject, body, from_name, reply_to, cc, bcc } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ error: "to, subject, and body are required" });
      }
      const result = await sendEmail({ to, subject, body, from_name, reply_to, cc, bcc });
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: "Email integration failed" });
    }
  });

  app.post("/api/integrations/upload", requireAuth, async (req: Request, res: Response) => {
    try {
      return res.json({ message: "Upload integration endpoint — configure storage provider in settings" });
    } catch (error) {
      return res.status(500).json({ error: "Upload integration failed" });
    }
  });

  app.post("/api/functions/:functionName", requireAuth, async (req: Request, res: Response) => {
    try {
      const { functionName } = req.params;

      switch (functionName) {
        case "sendNotification": {
          const { recipient_email, type, title, message, link, priority, send_email } = req.body;
          if (!recipient_email || !type || !title || !message) {
            return res.status(400).json({ error: "Missing required fields" });
          }
          const notification = await storage.createEntity("notifications", {
            user_email: recipient_email,
            type,
            title,
            message,
            link,
            priority: priority || "normal",
            created_by: req.user?.email || "system",
          });
          if (send_email !== false) {
            sendNotificationEmail({
              to: recipient_email,
              heading: title,
              body: `<p style="font-size:15px;color:#4b5563;">${message}</p>`,
              cta_text: link ? "View Details" : undefined,
              cta_url: link,
              subject: title,
            }).catch((e) => console.error("[notification] email failed:", e));
          }
          return res.json(notification);
        }

        case "sendProjectNotification": {
          const { projectId, notificationType, customMessage } = req.body;
          if (!projectId || !notificationType) {
            return res.status(400).json({ error: "projectId and notificationType required" });
          }
          const project = await storage.getEntityById("projects", projectId);
          if (!project) return res.status(404).json({ error: "Project not found" });

          if (project.client_email) {
            await storage.createEntity("notifications", {
              user_email: project.client_email,
              type: "info",
              title: `Project Update: ${project.project_name}`,
              message: customMessage || `There is an update for your project: ${notificationType}`,
              link: `/portal/projects`,
              priority: "normal",
              created_by: req.user?.email || "system",
            });
            sendNotificationEmail({
              to: project.client_email,
              heading: `Project Update: ${project.project_name}`,
              body: `<p style="font-size:15px;color:#4b5563;">${customMessage || `There is an update for your project: ${notificationType}`}</p>`,
              cta_text: "View Project",
              cta_url: `${process.env.APP_URL || ""}/portal/projects`,
            }).catch((e) => console.error("[notification] project email failed:", e));
          }
          return res.json({ success: true });
        }

        default:
          return res.json({ message: `Function '${functionName}' executed (stub)` });
      }
    } catch (error: any) {
      console.error(`[functions] ${req.params.functionName} error:`, error);
      return res.status(500).json({ error: `Function execution failed: ${error.message}` });
    }
  });

  return httpServer;
}
