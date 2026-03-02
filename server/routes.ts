import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { authRouter, requireAuth, requireAdmin, requireClient, optionalAuth } from "./auth";
import { entityTableMap } from "@shared/schema";

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
      const record = await storage.getEntityById(entityName, req.params.id);
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
      const record = await storage.updateEntity(entityName, req.params.id, req.body);
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
      const deleted = await storage.deleteEntity(entityName, req.params.id);
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
        const records = await storage.listEntity(entityName, sort, limit);
        return res.json(records);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to list ${entityName}` });
      }
    });

    router.get("/:id", async (req: Request, res: Response) => {
      try {
        const record = await storage.getEntityById(entityName, req.params.id);
        if (!record) return res.status(404).json({ error: `${entityName} not found` });
        return res.json(record);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to get ${entityName}` });
      }
    });

    router.post("/filter", async (req: Request, res: Response) => {
      try {
        const { query, sort, limit } = req.body;
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
        const record = await storage.updateEntity(entityName, req.params.id, req.body);
        if (!record) return res.status(404).json({ error: `${entityName} not found` });
        return res.json(record);
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to update ${entityName}` });
      }
    });

    router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
      try {
        const deleted = await storage.deleteEntity(entityName, req.params.id);
        if (!deleted) return res.status(404).json({ error: `${entityName} not found` });
        return res.status(204).send();
      } catch (error: any) {
        return res.status(500).json({ error: `Failed to delete ${entityName}` });
      }
    });

    return router;
  };

  app.use("/api/blog-posts", publicReadRouter("blog-posts"));

  app.get("/api/blog-posts/slug/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  const formSubmissionsRouter = Router();

  formSubmissionsRouter.post("/", async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        created_by: req.user?.email || "anonymous",
        source: req.body.source || "website",
      };
      const record = await storage.createEntity("form-submissions", data);
      return res.status(201).json(record);
    } catch (error: any) {
      console.error("[routes] POST /form-submissions error:", error);
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
      const record = await storage.getEntityById("form-submissions", req.params.id);
      if (!record) return res.status(404).json({ error: "Form submission not found" });
      return res.json(record);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get form submission" });
    }
  });

  formSubmissionsRouter.put("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const record = await storage.updateEntity("form-submissions", req.params.id, req.body);
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
      const notifications = await storage.getUnreadNotifications(req.params.email);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const notification = await storage.markNotificationRead(req.params.id);
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
      const invite = await storage.getClientInviteByToken(req.params.token);
      if (!invite) return res.status(404).json({ error: "Invalid or expired invite" });
      if (new Date(invite.expires_at) < new Date()) {
        return res.status(410).json({ error: "Invite has expired" });
      }
      return res.json({ email: invite.email, company_name: invite.company_name });
    } catch (error) {
      return res.status(500).json({ error: "Failed to validate invite" });
    }
  });

  app.use("/api/client-invites", createEntityRouter("client-invites"));
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
      return res.json({ message: "Email integration endpoint — configure provider in settings" });
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

  return httpServer;
}
