import { Router, type Request, type Response, type NextFunction } from "express";
import { hash, verify } from "@node-rs/argon2";
import { randomBytes } from "crypto";
import { storage } from "./storage";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        avatar_url: string | null;
        phone: string | null;
        department: string | null;
        title: string | null;
        email_verified: boolean | null;
      } | null;
      sessionId?: string | null;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies?.pe_session;

    if (!sessionId) {
      req.user = null;
      req.sessionId = null;
      return next();
    }

    const session = await storage.getSessionById(sessionId);

    if (!session) {
      res.clearCookie("pe_session");
      req.user = null;
      req.sessionId = null;
      return next();
    }

    if (new Date(session.expiresAt) < new Date()) {
      await storage.deleteSession(sessionId);
      res.clearCookie("pe_session");
      req.user = null;
      req.sessionId = null;
      return next();
    }

    const timeRemaining = new Date(session.expiresAt).getTime() - Date.now();
    if (timeRemaining < SESSION_DURATION_MS / 2) {
      const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
      await storage.updateSessionExpiry(sessionId, newExpiry);
      setSessionCookie(res, sessionId, newExpiry);
    }

    const user = await storage.getUserById(session.userId);
    if (!user) {
      await storage.deleteSession(sessionId);
      res.clearCookie("pe_session");
      req.user = null;
      req.sessionId = null;
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      phone: user.phone,
      department: user.department,
      title: user.title,
      email_verified: user.email_verified,
    };
    req.sessionId = sessionId;
    next();
  } catch (error) {
    console.error("[auth] middleware error:", error);
    req.user = null;
    req.sessionId = null;
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.sessionId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export function requireClient(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "client" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Client access required" });
  }
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  next();
}

function setSessionCookie(res: Response, sessionId: string, expiresAt: Date) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("pe_session", sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    domain: isProduction ? ".pacificengineeringsf.com" : undefined,
    expires: expiresAt,
    path: "/",
  });
}

function clearSessionCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("pe_session", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    domain: isProduction ? ".pacificengineeringsf.com" : undefined,
    path: "/",
  });
}

function sanitizeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url,
    phone: user.phone,
    department: user.department,
    title: user.title,
    email_verified: user.email_verified,
  };
}

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "Email, password, and full name are required" });
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await hash(password, ARGON2_OPTIONS);

    const user = await storage.createUser({
      email: email.toLowerCase(),
      full_name,
      hashed_password: hashedPassword,
      role: role || "user",
      created_by: email.toLowerCase(),
    });

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await storage.createSession({ id: sessionId, userId: user.id, expiresAt });
    setSessionCookie(res, sessionId, expiresAt);

    return res.status(201).json(sanitizeUser(user));
  } catch (error: any) {
    console.error("[auth] register error:", error);
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user || !user.hashed_password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await verify(user.hashed_password, password, ARGON2_OPTIONS);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await storage.createSession({ id: sessionId, userId: user.id, expiresAt });
    setSessionCookie(res, sessionId, expiresAt);

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("[auth] login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    if (req.sessionId) {
      await storage.deleteSession(req.sessionId);
    }
    clearSessionCookie(res);
    return res.json({ success: true });
  } catch (error) {
    console.error("[auth] logout error:", error);
    clearSessionCookie(res);
    return res.json({ success: true });
  }
});

authRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  return res.json(req.user);
});

authRouter.put("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const allowedFields = ["full_name", "avatar_url", "phone", "department", "title"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await storage.updateUser(req.user!.id, updateData);
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(sanitizeUser(updated));
  } catch (error) {
    console.error("[auth] update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

authRouter.get("/session", (req: Request, res: Response) => {
  if (req.user && req.sessionId) {
    return res.json({ valid: true, userId: req.user.id, role: req.user.role });
  }
  return res.status(401).json({ valid: false });
});
