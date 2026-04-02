import { Router, type Request, type Response, type NextFunction } from "express";
import { hash, verify } from "@node-rs/argon2";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { sendInviteEmail, sendPasswordResetEmail, sendWelcomeEmail } from "./email";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        account_type: string | null;
        company_name: string | null;
        avatar_url: string | null;
        phone: string | null;
        department: string | null;
        title: string | null;
        email_verified: boolean | null;
        twofa_enabled: boolean | null;
        status: string | null;
        permissions: any;
        notification_preferences: any;
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

    const session = await storage.getSessionWithTwofa(sessionId);

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

    if (user.status === "disabled") {
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
      account_type: user.account_type,
      company_name: user.company_name,
      avatar_url: user.avatar_url,
      phone: user.phone,
      department: user.department,
      title: user.title,
      email_verified: user.email_verified,
      twofa_enabled: user.twofa_enabled,
      status: user.status,
      permissions: user.permissions,
      notification_preferences: user.notification_preferences,
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

export function requireInternalUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.account_type !== "internal") {
    return res.status(403).json({ error: "Internal portal access required" });
  }
  next();
}

export function requireClient(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.account_type !== "client" && req.user.role !== "admin") {
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
    account_type: user.account_type || "internal",
    company_name: user.company_name,
    avatar_url: user.avatar_url,
    phone: user.phone,
    department: user.department,
    title: user.title,
    email_verified: user.email_verified,
    twofa_enabled: user.twofa_enabled || false,
    status: user.status || "active",
    permissions: user.permissions,
    notification_preferences: user.notification_preferences,
  };
}

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, invite_token } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "Email, password, and full name are required" });
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    if (!invite_token) {
      return res.status(400).json({ error: "An invitation is required to register" });
    }

    let accountType: string = "internal";
    let role: string = "user";
    let companyName: string | undefined;
    let invitedByEmail: string | undefined;

    const internalInvite = await storage.getInternalInviteByToken(invite_token);
    if (internalInvite) {
      if (new Date(internalInvite.expires_at) < new Date()) {
        return res.status(410).json({ error: "This invitation has expired" });
      }
      if (internalInvite.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ error: "Email does not match the invitation" });
      }
      accountType = "internal";
      role = internalInvite.role || "user";
      invitedByEmail = internalInvite.invited_by_email;

      await storage.updateEntity("internal-invites", internalInvite.id, {
        used: true,
        used_at: new Date(),
        status: "accepted",
      });
    } else {
      const clientInvite = await storage.getClientInviteByToken(invite_token);
      if (!clientInvite) {
        return res.status(404).json({ error: "Invalid invitation token" });
      }
      if (new Date(clientInvite.expires_at) < new Date()) {
        return res.status(410).json({ error: "This invitation has expired" });
      }
      if (clientInvite.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ error: "Email does not match the invitation" });
      }
      accountType = "client";
      role = "client";
      companyName = clientInvite.company_name || undefined;
      invitedByEmail = clientInvite.invited_by_email;

      await storage.updateEntity("client-invites", clientInvite.id, {
        used: true,
        used_at: new Date(),
        status: "accepted",
      });
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
      role,
      account_type: accountType,
      company_name: companyName,
      invite_token_used: invite_token,
      status: "active",
      created_by: invitedByEmail || email.toLowerCase(),
    });

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await storage.createSession({ id: sessionId, userId: user.id, expiresAt });
    setSessionCookie(res, sessionId, expiresAt);

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    sendWelcomeEmail({
      to: user.email,
      name: user.full_name,
      account_type: accountType as "internal" | "client",
      portal_url: accountType === "internal" ? `${appUrl}/internal` : `${appUrl}/portal`,
    }).catch((e) => console.error("[auth] welcome email failed:", e));

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

    if (user.status === "disabled") {
      return res.status(403).json({ error: "Account has been disabled" });
    }

    const validPassword = await verify(user.hashed_password, password, ARGON2_OPTIONS);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const twofaVerified = !user.twofa_enabled;

    await storage.createSession({ id: sessionId, userId: user.id, expiresAt });
    if (!twofaVerified) {
      await storage.updateSessionTwofaVerified(sessionId, false);
    }
    setSessionCookie(res, sessionId, expiresAt);

    await storage.updateUser(user.id, {
      last_login_at: new Date(),
      login_count: (user.login_count || 0) + 1,
    });

    if (user.twofa_enabled) {
      return res.json({
        requires_2fa: true,
        session_id: sessionId,
        user: { id: user.id, email: user.email, full_name: user.full_name },
      });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("[auth] login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

authRouter.post("/verify-2fa", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const sessionId = req.cookies?.pe_session;

    if (!sessionId || !code) {
      return res.status(400).json({ error: "Session and code are required" });
    }

    const session = await storage.getSessionWithTwofa(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const user = await storage.getUserById(session.userId);
    if (!user || !user.twofa_secret) {
      return res.status(400).json({ error: "2FA not configured" });
    }

    const totp = new OTPAuth.TOTP({
      issuer: "Pacific Engineering",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twofa_secret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    await storage.updateSessionTwofaVerified(sessionId, true);
    await storage.updateUser(user.id, { twofa_verified_at: new Date() });

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("[auth] verify-2fa error:", error);
    return res.status(500).json({ error: "2FA verification failed" });
  }
});

authRouter.post("/verify-backup-code", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const sessionId = req.cookies?.pe_session;

    if (!sessionId || !code) {
      return res.status(400).json({ error: "Session and backup code are required" });
    }

    const session = await storage.getSessionWithTwofa(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const user = await storage.getUserById(session.userId);
    if (!user || !user.twofa_backup_codes) {
      return res.status(400).json({ error: "No backup codes configured" });
    }

    const normalizedCode = code.toUpperCase().replace(/\s/g, "");
    const backupCodes = user.twofa_backup_codes as string[];
    let matchIndex = -1;

    for (let i = 0; i < backupCodes.length; i++) {
      const valid = await verify(backupCodes[i], normalizedCode, ARGON2_OPTIONS).catch(() => false);
      if (valid) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex === -1) {
      return res.status(401).json({ error: "Invalid backup code" });
    }

    const updatedCodes = [...backupCodes];
    updatedCodes.splice(matchIndex, 1);
    await storage.updateUser(user.id, { twofa_backup_codes: updatedCodes });

    await storage.updateSessionTwofaVerified(sessionId, true);
    await storage.updateUser(user.id, { twofa_verified_at: new Date() });

    return res.json({
      ...sanitizeUser(user),
      remaining_backup_codes: updatedCodes.length,
    });
  } catch (error) {
    console.error("[auth] verify-backup-code error:", error);
    return res.status(500).json({ error: "Backup code verification failed" });
  }
});

authRouter.post("/setup-2fa", requireAuth, async (req: Request, res: Response) => {
  try {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: "Pacific Engineering",
      label: req.user!.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret,
    });

    const otpauthUrl = totp.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    const backupCodes = generateBackupCodes();

    return res.json({
      secret: secret.base32,
      qr_code: qrCodeDataUrl,
      otpauth_url: otpauthUrl,
      backup_codes: backupCodes,
    });
  } catch (error) {
    console.error("[auth] setup-2fa error:", error);
    return res.status(500).json({ error: "Failed to set up 2FA" });
  }
});

authRouter.post("/confirm-2fa", requireAuth, async (req: Request, res: Response) => {
  try {
    const { secret, code, backup_codes } = req.body;

    if (!secret || !code || !backup_codes) {
      return res.status(400).json({ error: "Secret, code, and backup codes are required" });
    }

    const totp = new OTPAuth.TOTP({
      issuer: "Pacific Engineering",
      label: req.user!.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return res.status(401).json({ error: "Invalid verification code. Please try again." });
    }

    const hashedBackupCodes: string[] = [];
    for (const bc of backup_codes) {
      const normalizedCode = bc.toUpperCase().replace(/\s/g, "");
      const hashed = await hash(normalizedCode, ARGON2_OPTIONS);
      hashedBackupCodes.push(hashed);
    }

    await storage.updateUser(req.user!.id, {
      twofa_enabled: true,
      twofa_secret: secret,
      twofa_method: "totp",
      twofa_backup_codes: hashedBackupCodes,
      twofa_verified_at: new Date(),
    });

    return res.json({ success: true, message: "2FA has been enabled" });
  } catch (error) {
    console.error("[auth] confirm-2fa error:", error);
    return res.status(500).json({ error: "Failed to confirm 2FA" });
  }
});

authRouter.post("/disable-2fa", requireAuth, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Verification code is required" });
    }

    const user = await storage.getUserById(req.user!.id);
    if (!user || !user.twofa_secret) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }

    const totp = new OTPAuth.TOTP({
      issuer: "Pacific Engineering",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twofa_secret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    await storage.updateUser(user.id, {
      twofa_enabled: false,
      twofa_secret: null,
      twofa_method: null,
      twofa_backup_codes: null,
      twofa_verified_at: null,
    });

    return res.json({ success: true, message: "2FA has been disabled" });
  } catch (error) {
    console.error("[auth] disable-2fa error:", error);
    return res.status(500).json({ error: "Failed to disable 2FA" });
  }
});

authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.json({ message: "If an account exists, a reset link has been sent" });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await storage.createPasswordResetToken(user.id, token, expiresAt);

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const resetUrl = `${appUrl}/internal/auth?reset_token=${token}`;

    sendPasswordResetEmail({
      to: user.email,
      name: user.full_name,
      reset_url: resetUrl,
    }).catch((e) => console.error("[auth] reset email failed:", e));

    return res.json({ message: "If an account exists, a reset link has been sent" });
  } catch (error) {
    console.error("[auth] forgot-password error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
});

authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const resetToken = await storage.getPasswordResetToken(token);
    if (!resetToken) {
      return res.status(404).json({ error: "Invalid or expired reset token" });
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      await storage.deletePasswordResetToken(token);
      return res.status(410).json({ error: "Reset token has expired" });
    }

    const hashedPassword = await hash(password, ARGON2_OPTIONS);
    await storage.updateUser(resetToken.userId, { hashed_password: hashedPassword });
    await storage.deletePasswordResetToken(token);
    await storage.deleteUserSessions(resetToken.userId);

    return res.json({ message: "Password has been reset. Please log in." });
  } catch (error) {
    console.error("[auth] reset-password error:", error);
    return res.status(500).json({ error: "Failed to reset password" });
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
    const allowedFields = ["full_name", "avatar_url", "phone", "department", "title", "notification_preferences"];
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
    return res.json({ valid: true, userId: req.user.id, role: req.user.role, account_type: req.user.account_type });
  }
  return res.status(401).json({ valid: false });
});

export const inviteRouter = Router();

inviteRouter.post("/internal", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, full_name, role } = req.body;
    if (!email || !full_name) {
      return res.status(400).json({ error: "Email and full name are required" });
    }

    const validRoles = ["admin", "user"];
    const assignedRole = validRoles.includes(role) ? role : "user";

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "A user with this email already exists" });
    }

    const inviteToken = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await storage.createEntity("internal-invites", {
      invite_token: inviteToken,
      email: email.toLowerCase(),
      full_name,
      role: assignedRole,
      invited_by_email: req.user!.email,
      invited_by_name: req.user!.full_name,
      expires_at: expiresAt,
      status: "pending",
      created_by: req.user!.email,
    });

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const inviteUrl = `${appUrl}/internal/auth?token=${inviteToken}`;

    sendInviteEmail({
      to: email,
      invitee_name: full_name,
      inviter_name: req.user!.full_name,
      invite_url: inviteUrl,
      invite_type: "internal",
    }).catch((e) => console.error("[invite] internal email failed:", e));

    return res.status(201).json(invite);
  } catch (error: any) {
    console.error("[invite] internal error:", error);
    return res.status(500).json({ error: "Failed to create invite" });
  }
});

inviteRouter.post("/client", requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.account_type === "client") {
      return res.status(403).json({ error: "Clients cannot create client invites directly" });
    }

    const { email, name, phone, company_name, contact_id } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    const inviteToken = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await storage.createEntity("client-invites", {
      invite_token: inviteToken,
      email: email.toLowerCase(),
      name,
      phone: phone || null,
      company_name: company_name || null,
      invited_by_email: req.user!.email,
      invited_by_name: req.user!.full_name,
      invited_by_role: req.user!.role,
      expires_at: expiresAt,
      status: "pending",
      created_by: req.user!.email,
    });

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const inviteUrl = `${appUrl}/portal/register/${inviteToken}`;

    sendInviteEmail({
      to: email,
      invitee_name: name,
      inviter_name: req.user!.full_name,
      company_name: company_name,
      invite_url: inviteUrl,
      invite_type: "client",
    }).catch((e) => console.error("[invite] client email failed:", e));

    return res.status(201).json(invite);
  } catch (error: any) {
    console.error("[invite] client error:", error);
    return res.status(500).json({ error: "Failed to create client invite" });
  }
});

inviteRouter.post("/team", requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.account_type !== "client") {
      return res.status(403).json({ error: "Only client users can invite team members" });
    }

    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    const inviteToken = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await storage.createEntity("client-invites", {
      invite_token: inviteToken,
      email: email.toLowerCase(),
      name,
      company_name: req.user!.company_name,
      invited_by_email: req.user!.email,
      invited_by_name: req.user!.full_name,
      invited_by_role: "client",
      expires_at: expiresAt,
      status: "pending",
      created_by: req.user!.email,
    });

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const inviteUrl = `${appUrl}/portal/register/${inviteToken}`;

    sendInviteEmail({
      to: email,
      invitee_name: name,
      inviter_name: req.user!.full_name,
      company_name: req.user!.company_name || undefined,
      invite_url: inviteUrl,
      invite_type: "team",
    }).catch((e) => console.error("[invite] team email failed:", e));

    return res.status(201).json(invite);
  } catch (error: any) {
    console.error("[invite] team error:", error);
    return res.status(500).json({ error: "Failed to create team invite" });
  }
});

inviteRouter.get("/validate/:token", async (req: Request, res: Response) => {
  try {
    const token = getParam(req.params.token);

    const internalInvite = await storage.getInternalInviteByToken(token);
    if (internalInvite) {
      if (new Date(internalInvite.expires_at) < new Date()) {
        return res.status(410).json({ error: "Invitation has expired" });
      }
      return res.json({
        type: "internal",
        email: internalInvite.email,
        full_name: internalInvite.full_name,
        role: internalInvite.role,
        invited_by_name: internalInvite.invited_by_name,
      });
    }

    const clientInvite = await storage.getClientInviteByToken(token);
    if (clientInvite) {
      if (new Date(clientInvite.expires_at) < new Date()) {
        return res.status(410).json({ error: "Invitation has expired" });
      }
      return res.json({
        type: "client",
        email: clientInvite.email,
        name: clientInvite.name,
        company_name: clientInvite.company_name,
        invited_by_name: clientInvite.invited_by_name,
      });
    }

    return res.status(404).json({ error: "Invalid invitation token" });
  } catch (error) {
    console.error("[invite] validate error:", error);
    return res.status(500).json({ error: "Failed to validate invitation" });
  }
});

inviteRouter.get("/internal", requireAdmin, async (req: Request, res: Response) => {
  try {
    const invites = await storage.listEntity("internal-invites", "-created_date", 100);
    return res.json(invites);
  } catch (error) {
    return res.status(500).json({ error: "Failed to list internal invites" });
  }
});

inviteRouter.get("/client", requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.account_type === "client") {
      const invites = await storage.filterEntity("client-invites", {
        invited_by_email: req.user!.email,
      }, "-created_date", 100);
      return res.json(invites);
    }
    const invites = await storage.listEntity("client-invites", "-created_date", 100);
    return res.json(invites);
  } catch (error) {
    return res.status(500).json({ error: "Failed to list client invites" });
  }
});

inviteRouter.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const inviteId = getParam(req.params.id);
    await storage.updateEntity("internal-invites", inviteId, { status: "revoked" }).catch(() => null);
    await storage.updateEntity("client-invites", inviteId, { status: "revoked" }).catch(() => null);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to revoke invite" });
  }
});

export const usersRouter = Router();

usersRouter.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await storage.listUsers("-created_date", 200);
    const sanitized = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      account_type: u.account_type,
      company_name: u.company_name,
      status: u.status,
      department: u.department,
      title: u.title,
      phone: u.phone,
      avatar_url: u.avatar_url,
      twofa_enabled: u.twofa_enabled,
      last_login_at: u.last_login_at,
      login_count: u.login_count,
      created_date: u.created_date,
      permissions: u.permissions,
    }));
    return res.json(sanitized);
  } catch (error) {
    return res.status(500).json({ error: "Failed to list users" });
  }
});

usersRouter.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const allowedFields = ["role", "status", "department", "title", "permissions", "account_type", "company_name"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await storage.updateUser(getParam(req.params.id), updateData);
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(sanitizeUser(updated));
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
});

usersRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = getParam(req.params.id);
    if (userId === req.user!.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await storage.updateUser(userId, { status: "disabled" });
    await storage.deleteUserSessions(userId);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to disable user" });
  }
});
