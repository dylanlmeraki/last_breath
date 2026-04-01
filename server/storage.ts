import { db } from "./db";
import { eq, desc, asc, and, sql, type SQL } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User, InsertUser,
  Prospect, InsertProspect,
  Interaction, InsertInteraction,
  Task, InsertTask,
  Project, InsertProject,
  ProjectDocument, InsertProjectDocument,
  ProjectMilestone, InsertProjectMilestone,
  ChangeOrder, InsertChangeOrder,
  ProjectMessage, InsertProjectMessage,
  ProposalTemplate, InsertProposalTemplate,
  Proposal, InsertProposal,
  Invoice, InsertInvoice,
  Workflow, InsertWorkflow,
  BlogPost, InsertBlogPost,
  CalendarSettings, InsertCalendarSettings,
  EmailSettings, InsertEmailSettings,
  IcpSettings, InsertIcpSettings,
  AuditLog, InsertAuditLog,
  Notification, InsertNotification,
  ClientInvite, InsertClientInvite,
  InternalInvite, InsertInternalInvite,
  EmailTemplate, InsertEmailTemplate,
  CommunicationTemplate, InsertCommunicationTemplate,
  ProjectRequest, InsertProjectRequest,
  Rfi, InsertRfi,
  SalesOutreach, InsertSalesOutreach,
  EmailSequence, InsertEmailSequence,
  ScheduledReport, InsertScheduledReport,
  CustomPage, InsertCustomPage,
  DashboardConfig, InsertDashboardConfig,
  FormSubmission, InsertFormSubmission,
} from "@shared/schema";

function getTable(entityName: string) {
  const table = schema.entityTableMap[entityName];
  if (!table) throw new Error(`Unknown entity: ${entityName}`);
  return table;
}

function buildOrderBy(table: any, sortStr?: string) {
  if (!sortStr) return desc(table.created_date);
  const field = sortStr.startsWith("-") ? sortStr.slice(1) : sortStr;
  const direction = sortStr.startsWith("-") ? desc : asc;
  if (table[field]) return direction(table[field]);
  return desc(table.created_date);
}

function buildConditions(table: any, query: Record<string, any>): SQL[] {
  const conditions: SQL[] = [];
  for (const [key, value] of Object.entries(query || {})) {
    if (table[key] && value !== undefined && value !== null) {
      conditions.push(eq(table[key], value));
    }
  }
  return conditions;
}

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  createSession(data: { id: string; userId: string; expiresAt: Date }): Promise<void>;
  getSessionById(id: string): Promise<{ id: string; userId: string; expiresAt: Date } | undefined>;
  deleteSession(id: string): Promise<void>;
  deleteUserSessions(userId: string): Promise<void>;
  updateSessionExpiry(id: string, expiresAt: Date): Promise<void>;

  listEntity(entityName: string, sort?: string, limit?: number): Promise<any[]>;
  filterEntity(entityName: string, query: Record<string, any>, sort?: string, limit?: number): Promise<any[]>;
  getEntityById(entityName: string, id: string): Promise<any | undefined>;
  createEntity(entityName: string, data: Record<string, any>): Promise<any>;
  bulkCreateEntity(entityName: string, dataArray: Record<string, any>[]): Promise<any[]>;
  updateEntity(entityName: string, id: string, data: Record<string, any>): Promise<any | undefined>;
  deleteEntity(entityName: string, id: string): Promise<boolean>;

  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(limit?: number): Promise<BlogPost[]>;
  getUnreadNotifications(userEmail: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userEmail: string): Promise<void>;
  getClientInviteByToken(token: string): Promise<ClientInvite | undefined>;
  getInternalInviteByToken(token: string): Promise<InternalInvite | undefined>;
  listUsers(sort?: string, limit?: number): Promise<User[]>;
  updateSessionTwofaVerified(id: string, verified: boolean): Promise<void>;
  getSessionWithTwofa(id: string): Promise<{ id: string; userId: string; expiresAt: Date; twofaVerified: boolean | null } | undefined>;
  createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{ userId: string; expiresAt: Date } | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
      return user;
    } catch (error) {
      console.error("[storage] getUserById failed:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).limit(1);
      return user;
    } catch (error) {
      console.error("[storage] getUserByEmail failed:", error);
      throw new Error("Failed to fetch user by email");
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(schema.users).values({
        ...userData,
        email: userData.email.toLowerCase(),
      }).returning();
      return user;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new Error("Email already registered");
      }
      console.error("[storage] createUser failed:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [user] = await db.update(schema.users)
        .set({ ...data, updated_date: new Date() })
        .where(eq(schema.users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error("[storage] updateUser failed:", error);
      throw new Error("Failed to update user");
    }
  }

  async createSession(data: { id: string; userId: string; expiresAt: Date }): Promise<void> {
    try {
      await db.insert(schema.sessions).values({
        id: data.id,
        userId: data.userId,
        expiresAt: data.expiresAt,
      });
    } catch (error) {
      console.error("[storage] createSession failed:", error);
      throw new Error("Failed to create session");
    }
  }

  async getSessionById(id: string): Promise<{ id: string; userId: string; expiresAt: Date } | undefined> {
    try {
      const [session] = await db.select().from(schema.sessions).where(eq(schema.sessions.id, id)).limit(1);
      return session ? { id: session.id, userId: session.userId, expiresAt: session.expiresAt } : undefined;
    } catch (error) {
      console.error("[storage] getSessionById failed:", error);
      throw new Error("Failed to fetch session");
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
    } catch (error) {
      console.error("[storage] deleteSession failed:", error);
      throw new Error("Failed to delete session");
    }
  }

  async deleteUserSessions(userId: string): Promise<void> {
    try {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
    } catch (error) {
      console.error("[storage] deleteUserSessions failed:", error);
      throw new Error("Failed to delete user sessions");
    }
  }

  async updateSessionExpiry(id: string, expiresAt: Date): Promise<void> {
    try {
      await db.update(schema.sessions).set({ expiresAt }).where(eq(schema.sessions.id, id));
    } catch (error) {
      console.error("[storage] updateSessionExpiry failed:", error);
      throw new Error("Failed to update session expiry");
    }
  }

  async listEntity(entityName: string, sort?: string, limit: number = 50): Promise<any[]> {
    try {
      const table = getTable(entityName);
      const orderBy = buildOrderBy(table, sort);
      return await db.select().from(table).orderBy(orderBy).limit(limit);
    } catch (error) {
      console.error(`[storage] listEntity(${entityName}) failed:`, error);
      throw new Error(`Failed to list ${entityName}`);
    }
  }

  async filterEntity(entityName: string, query: Record<string, any>, sort?: string, limit: number = 50): Promise<any[]> {
    try {
      const table = getTable(entityName);
      const conditions = buildConditions(table, query);
      const orderBy = buildOrderBy(table, sort);
      return await db.select().from(table)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit);
    } catch (error) {
      console.error(`[storage] filterEntity(${entityName}) failed:`, error);
      throw new Error(`Failed to filter ${entityName}`);
    }
  }

  async getEntityById(entityName: string, id: string): Promise<any | undefined> {
    try {
      const table = getTable(entityName);
      const [record] = await db.select().from(table).where(eq(table.id, id)).limit(1);
      return record;
    } catch (error) {
      console.error(`[storage] getEntityById(${entityName}, ${id}) failed:`, error);
      throw new Error(`Failed to get ${entityName} by id`);
    }
  }

  async createEntity(entityName: string, data: Record<string, any>): Promise<any> {
    try {
      const table = getTable(entityName);
      const [record] = await db.insert(table).values(data).returning() as any[];
      return record;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new Error(`Duplicate entry for ${entityName}`);
      }
      if (error?.code === "23503") {
        throw new Error(`Referenced record not found for ${entityName}`);
      }
      console.error(`[storage] createEntity(${entityName}) failed:`, error);
      throw new Error(`Failed to create ${entityName}`);
    }
  }

  async bulkCreateEntity(entityName: string, dataArray: Record<string, any>[]): Promise<any[]> {
    try {
      if (!dataArray.length) return [];
      const table = getTable(entityName);
      return await db.insert(table).values(dataArray).returning() as any[];
    } catch (error) {
      console.error(`[storage] bulkCreateEntity(${entityName}) failed:`, error);
      throw new Error(`Failed to bulk create ${entityName}`);
    }
  }

  async updateEntity(entityName: string, id: string, data: Record<string, any>): Promise<any | undefined> {
    try {
      const table = getTable(entityName);
      const cleanData: Record<string, any> = { ...data, updated_date: new Date() };
      delete cleanData.id;
      delete cleanData.created_date;
      delete cleanData.created_by;

      const [record] = await db.update(table).set(cleanData).where(eq(table.id, id)).returning() as any[];
      return record;
    } catch (error) {
      console.error(`[storage] updateEntity(${entityName}, ${id}) failed:`, error);
      throw new Error(`Failed to update ${entityName}`);
    }
  }

  async deleteEntity(entityName: string, id: string): Promise<boolean> {
    try {
      const table = getTable(entityName);
      const [deleted] = await db.delete(table).where(eq(table.id, id)).returning() as any[];
      return !!deleted;
    } catch (error) {
      console.error(`[storage] deleteEntity(${entityName}, ${id}) failed:`, error);
      throw new Error(`Failed to delete ${entityName}`);
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).limit(1);
      return post;
    } catch (error) {
      console.error("[storage] getBlogPostBySlug failed:", error);
      throw new Error("Failed to fetch blog post");
    }
  }

  async getPublishedBlogPosts(limit: number = 50): Promise<BlogPost[]> {
    try {
      return await db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, true))
        .orderBy(desc(schema.blogPosts.published_date))
        .limit(limit);
    } catch (error) {
      console.error("[storage] getPublishedBlogPosts failed:", error);
      throw new Error("Failed to fetch published blog posts");
    }
  }

  async getUnreadNotifications(userEmail: string): Promise<Notification[]> {
    try {
      return await db.select().from(schema.notifications)
        .where(and(
          eq(schema.notifications.user_email, userEmail),
          eq(schema.notifications.read, false)
        ))
        .orderBy(desc(schema.notifications.created_date))
        .limit(50);
    } catch (error) {
      console.error("[storage] getUnreadNotifications failed:", error);
      throw new Error("Failed to fetch notifications");
    }
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    try {
      const [notification] = await db.update(schema.notifications)
        .set({ read: true, updated_date: new Date() })
        .where(eq(schema.notifications.id, id))
        .returning();
      return notification;
    } catch (error) {
      console.error("[storage] markNotificationRead failed:", error);
      throw new Error("Failed to mark notification as read");
    }
  }

  async markAllNotificationsRead(userEmail: string): Promise<void> {
    try {
      await db.update(schema.notifications)
        .set({ read: true, updated_date: new Date() })
        .where(and(
          eq(schema.notifications.user_email, userEmail),
          eq(schema.notifications.read, false)
        ));
    } catch (error) {
      console.error("[storage] markAllNotificationsRead failed:", error);
      throw new Error("Failed to mark all notifications as read");
    }
  }

  async getClientInviteByToken(token: string): Promise<ClientInvite | undefined> {
    try {
      const [invite] = await db.select().from(schema.clientInvites)
        .where(and(
          eq(schema.clientInvites.invite_token, token),
          eq(schema.clientInvites.used, false)
        ))
        .limit(1);
      return invite;
    } catch (error) {
      console.error("[storage] getClientInviteByToken failed:", error);
      throw new Error("Failed to fetch client invite");
    }
  }

  async getInternalInviteByToken(token: string): Promise<InternalInvite | undefined> {
    try {
      const [invite] = await db.select().from(schema.internalInvites)
        .where(and(
          eq(schema.internalInvites.invite_token, token),
          eq(schema.internalInvites.used, false)
        ))
        .limit(1);
      return invite;
    } catch (error) {
      console.error("[storage] getInternalInviteByToken failed:", error);
      throw new Error("Failed to fetch internal invite");
    }
  }

  async listUsers(sort?: string, limit: number = 50): Promise<User[]> {
    try {
      const orderBy = buildOrderBy(schema.users, sort);
      return await db.select().from(schema.users).orderBy(orderBy).limit(limit);
    } catch (error) {
      console.error("[storage] listUsers failed:", error);
      throw new Error("Failed to list users");
    }
  }

  async updateSessionTwofaVerified(id: string, verified: boolean): Promise<void> {
    try {
      await db.update(schema.sessions)
        .set({ twofaVerified: verified })
        .where(eq(schema.sessions.id, id));
    } catch (error) {
      console.error("[storage] updateSessionTwofaVerified failed:", error);
      throw new Error("Failed to update session 2FA status");
    }
  }

  async getSessionWithTwofa(id: string): Promise<{ id: string; userId: string; expiresAt: Date; twofaVerified: boolean | null } | undefined> {
    try {
      const [session] = await db.select().from(schema.sessions).where(eq(schema.sessions.id, id)).limit(1);
      return session ? { id: session.id, userId: session.userId, expiresAt: session.expiresAt, twofaVerified: session.twofaVerified } : undefined;
    } catch (error) {
      console.error("[storage] getSessionWithTwofa failed:", error);
      throw new Error("Failed to fetch session with 2FA");
    }
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await db.insert(schema.passwordResetTokens).values({ userId, token, expiresAt });
    } catch (error) {
      console.error("[storage] createPasswordResetToken failed:", error);
      throw new Error("Failed to create password reset token");
    }
  }

  async getPasswordResetToken(token: string): Promise<{ userId: string; expiresAt: Date } | undefined> {
    try {
      const [row] = await db.select().from(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.token, token)).limit(1);
      return row ? { userId: row.userId, expiresAt: row.expiresAt } : undefined;
    } catch (error) {
      console.error("[storage] getPasswordResetToken failed:", error);
      throw new Error("Failed to fetch password reset token");
    }
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    try {
      await db.delete(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.token, token));
    } catch (error) {
      console.error("[storage] deletePasswordResetToken failed:", error);
      throw new Error("Failed to delete password reset token");
    }
  }
}

export const storage = new DatabaseStorage();
