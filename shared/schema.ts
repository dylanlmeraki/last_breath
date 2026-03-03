import { sql } from "drizzle-orm";
import {
  pgTable, text, integer, boolean, timestamp, jsonb, real,
  uuid, varchar, date, serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const baseColumns = {
  id: uuid("id").defaultRandom().primaryKey(),
  created_date: timestamp("created_date", { withTimezone: true }).defaultNow().notNull(),
  updated_date: timestamp("updated_date", { withTimezone: true }).defaultNow().notNull(),
  created_by: varchar("created_by", { length: 255 }).default("system").notNull(),
};

export const users = pgTable("users", {
  ...baseColumns,
  full_name: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashed_password: text("hashed_password"),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  avatar_url: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 100 }),
  title: varchar("title", { length: 100 }),
  email_verified: boolean("email_verified").default(false),
  account_type: varchar("account_type", { length: 20 }).default("internal"),
  company_name: varchar("company_name", { length: 255 }),
  invited_by: uuid("invited_by"),
  invite_token_used: text("invite_token_used"),
  status: varchar("status", { length: 20 }).default("active"),
  permissions: jsonb("permissions"),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
  login_count: integer("login_count").default(0),
  twofa_enabled: boolean("twofa_enabled").default(false),
  twofa_secret: text("twofa_secret"),
  twofa_method: varchar("twofa_method", { length: 20 }),
  twofa_backup_codes: text("twofa_backup_codes").array(),
  twofa_verified_at: timestamp("twofa_verified_at", { withTimezone: true }),
  notification_preferences: jsonb("notification_preferences"),
  onboarding_complete: boolean("onboarding_complete").default(false),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  twofaVerified: boolean("twofa_verified").default(false),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 8 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const prospects = pgTable("prospects", {
  ...baseColumns,
  company_name: varchar("company_name", { length: 255 }).notNull(),
  company_type: varchar("company_type", { length: 100 }),
  company_website: text("company_website"),
  company_location: varchar("company_location", { length: 255 }),
  company_address: text("company_address"),
  company_size: varchar("company_size", { length: 100 }),
  annual_revenue: varchar("annual_revenue", { length: 100 }),
  key_functions: text("key_functions"),
  contact_name: varchar("contact_name", { length: 255 }).notNull(),
  contact_title: varchar("contact_title", { length: 255 }),
  contact_email: varchar("contact_email", { length: 255 }),
  contact_phone: varchar("contact_phone", { length: 50 }),
  linkedin_url: text("linkedin_url"),
  uploaded_documents: jsonb("uploaded_documents"),
  prospect_score: real("prospect_score"),
  engagement_score: real("engagement_score").default(0),
  fit_score: real("fit_score").default(50),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("New").notNull(),
  lead_source: varchar("lead_source", { length: 50 }).default("AI Research"),
  tags: jsonb("tags"),
  segment: varchar("segment", { length: 50 }),
  industry_focus: jsonb("industry_focus"),
  services_interested: jsonb("services_interested"),
  last_contact_date: timestamp("last_contact_date", { withTimezone: true }),
  next_follow_up: timestamp("next_follow_up", { withTimezone: true }),
  deal_value: real("deal_value"),
  deal_stage: varchar("deal_stage", { length: 50 }),
  probability: real("probability"),
  assigned_to: varchar("assigned_to", { length: 255 }),
  lost_reason: text("lost_reason"),
});

export const interactions = pgTable("interactions", {
  ...baseColumns,
  prospect_id: uuid("prospect_id").notNull().references(() => prospects.id, { onDelete: "cascade" }),
  prospect_name: varchar("prospect_name", { length: 255 }),
  company_name: varchar("company_name", { length: 255 }),
  interaction_type: varchar("interaction_type", { length: 50 }).notNull(),
  interaction_date: timestamp("interaction_date", { withTimezone: true }).notNull(),
  subject: varchar("subject", { length: 500 }),
  content: text("content"),
  duration_minutes: integer("duration_minutes"),
  outcome: varchar("outcome", { length: 50 }),
  sentiment: varchar("sentiment", { length: 50 }),
  next_action: text("next_action"),
  automated: boolean("automated").default(false),
  engagement_points: real("engagement_points").default(0),
  attachments: jsonb("attachments"),
});

export const tasks = pgTable("tasks", {
  ...baseColumns,
  prospect_id: uuid("prospect_id").references(() => prospects.id, { onDelete: "set null" }),
  prospect_name: varchar("prospect_name", { length: 255 }),
  company_name: varchar("company_name", { length: 255 }),
  task_type: varchar("task_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 20 }).default("Medium"),
  status: varchar("status", { length: 20 }).default("Pending"),
  due_date: timestamp("due_date", { withTimezone: true }).notNull(),
  reminder_date: timestamp("reminder_date", { withTimezone: true }),
  assigned_to: varchar("assigned_to", { length: 255 }),
  automated: boolean("automated").default(false),
  completed_date: timestamp("completed_date", { withTimezone: true }),
  notes: text("notes"),
});

export const projects = pgTable("projects", {
  ...baseColumns,
  project_name: varchar("project_name", { length: 500 }).notNull(),
  project_number: varchar("project_number", { length: 100 }),
  client_email: varchar("client_email", { length: 255 }).notNull(),
  client_name: varchar("client_name", { length: 255 }),
  project_type: varchar("project_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("Planning").notNull(),
  priority: varchar("priority", { length: 20 }).default("Medium"),
  start_date: date("start_date"),
  estimated_completion: date("estimated_completion"),
  actual_completion: date("actual_completion"),
  location: text("location"),
  description: text("description"),
  progress_percentage: real("progress_percentage").default(0),
  assigned_team_members: jsonb("assigned_team_members"),
  budget: real("budget"),
  notes: text("notes"),
});

export const projectDocuments = pgTable("project_documents", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  document_name: varchar("document_name", { length: 500 }).notNull(),
  document_type: varchar("document_type", { length: 50 }),
  file_url: text("file_url").notNull(),
  file_size: integer("file_size"),
  uploaded_by: varchar("uploaded_by", { length: 255 }),
  uploaded_by_name: varchar("uploaded_by_name", { length: 255 }),
  description: text("description"),
  version: varchar("version", { length: 20 }),
  status: varchar("status", { length: 50 }).default("Draft"),
});

export const projectMilestones = pgTable("project_milestones", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  milestone_name: varchar("milestone_name", { length: 500 }).notNull(),
  description: text("description"),
  due_date: date("due_date"),
  amount: real("amount"),
  status: varchar("status", { length: 50 }).default("Pending Client Approval").notNull(),
  client_approval_date: timestamp("client_approval_date", { withTimezone: true }),
  client_comments: text("client_comments"),
  completion_percentage: real("completion_percentage").default(0),
  attachments: jsonb("attachments"),
});

export const changeOrders = pgTable("change_orders", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  change_order_number: varchar("change_order_number", { length: 100 }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  reason: text("reason"),
  cost_impact: real("cost_impact"),
  schedule_impact_days: integer("schedule_impact_days"),
  status: varchar("status", { length: 50 }).default("Pending Client Approval").notNull(),
  priority: varchar("priority", { length: 20 }).default("Medium"),
  client_approval_date: timestamp("client_approval_date", { withTimezone: true }),
  client_comments: text("client_comments"),
  proposed_by: varchar("proposed_by", { length: 255 }),
  proposed_by_name: varchar("proposed_by_name", { length: 255 }),
  attachments: jsonb("attachments"),
});

export const projectMessages = pgTable("project_messages", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  sender_email: varchar("sender_email", { length: 255 }).notNull(),
  sender_name: varchar("sender_name", { length: 255 }),
  is_internal: boolean("is_internal").default(false),
  attachments: jsonb("attachments"),
  read_by: jsonb("read_by"),
});

export const proposalTemplates = pgTable("proposal_templates", {
  ...baseColumns,
  template_name: varchar("template_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  template_body: text("template_body").notNull(),
  fields_def: jsonb("fields_def"),
  category: varchar("category", { length: 50 }).default("General"),
  active: boolean("active").default(true),
});

export const proposals = pgTable("proposals", {
  ...baseColumns,
  project_id: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  template_id: uuid("template_id").references(() => proposalTemplates.id, { onDelete: "set null" }),
  proposal_number: varchar("proposal_number", { length: 100 }),
  title: varchar("title", { length: 500 }).notNull(),
  content_html: text("content_html"),
  amount: real("amount"),
  status: varchar("status", { length: 50 }).default("draft"),
  sent_date: timestamp("sent_date", { withTimezone: true }),
  viewed_date: timestamp("viewed_date", { withTimezone: true }),
  signed_date: timestamp("signed_date", { withTimezone: true }),
  declined_date: timestamp("declined_date", { withTimezone: true }),
  declined_reason: text("declined_reason"),
  signature_data: jsonb("signature_data"),
  recipient_emails: jsonb("recipient_emails"),
  reminder_sent_count: integer("reminder_sent_count").default(0),
  last_reminder_date: timestamp("last_reminder_date", { withTimezone: true }),
  expiration_date: timestamp("expiration_date", { withTimezone: true }),
  esign_provider: varchar("esign_provider", { length: 50 }).default("none"),
  esign_provider_id: varchar("esign_provider_id", { length: 255 }),
  fields_data: jsonb("fields_data"),
});

export const invoices = pgTable("invoices", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  invoice_number: varchar("invoice_number", { length: 100 }),
  issue_date: date("issue_date"),
  due_date: date("due_date"),
  paid_date: date("paid_date"),
  description: text("description"),
  line_items: jsonb("line_items"),
  subtotal: real("subtotal"),
  tax: real("tax"),
  total_amount: real("total_amount").notNull(),
  status: varchar("status", { length: 50 }).default("draft"),
  stripe_invoice_id: varchar("stripe_invoice_id", { length: 255 }),
  stripe_payment_intent_id: varchar("stripe_payment_intent_id", { length: 255 }),
});

export const workflows = pgTable("workflows", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  workflow_type: varchar("workflow_type", { length: 20 }).default("crm"),
  trigger_type: varchar("trigger_type", { length: 50 }).notNull(),
  trigger_config: jsonb("trigger_config"),
  steps: jsonb("steps").notNull(),
  execution_count: integer("execution_count").default(0),
  last_executed: timestamp("last_executed", { withTimezone: true }),
});

export const blogPosts = pgTable("blog_posts", {
  ...baseColumns,
  title: varchar("title", { length: 500 }).notNull(),
  seo_optimized_title: varchar("seo_optimized_title", { length: 500 }),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  meta_description: varchar("meta_description", { length: 300 }),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  tags: jsonb("tags"),
  keywords: jsonb("keywords"),
  author: varchar("author", { length: 255 }).default("Pacific Engineering Team"),
  featured_image: text("featured_image"),
  read_time: varchar("read_time", { length: 20 }),
  published: boolean("published").default(false),
  published_date: date("published_date"),
  featured: boolean("featured").default(false),
});

export const calendarSettings = pgTable("calendar_settings", {
  ...baseColumns,
  provider: varchar("provider", { length: 20 }).default("none").notNull(),
  google_calendar_id: varchar("google_calendar_id", { length: 255 }),
  google_refresh_token: text("google_refresh_token"),
  calendly_event_type_uri: text("calendly_event_type_uri"),
  default_meeting_duration: integer("default_meeting_duration").default(30),
  default_meeting_type: varchar("default_meeting_type", { length: 50 }).default("Discovery Call"),
  auto_create_interaction: boolean("auto_create_interaction").default(true),
  auto_create_task: boolean("auto_create_task").default(true),
  meeting_buffer_minutes: integer("meeting_buffer_minutes").default(15),
  timezone: varchar("timezone", { length: 50 }).default("America/Los_Angeles"),
});

export const emailSettings = pgTable("email_settings", {
  ...baseColumns,
  setting_name: varchar("setting_name", { length: 255 }).notNull(),
  recipient_emails: jsonb("recipient_emails").notNull(),
  form_type: varchar("form_type", { length: 50 }).notNull(),
  active: boolean("active").default(true),
});

export const icpSettings = pgTable("icp_settings", {
  ...baseColumns,
  profile_name: varchar("profile_name", { length: 255 }).notNull(),
  company_types: jsonb("company_types"),
  locations: jsonb("locations"),
  company_size_min: varchar("company_size_min", { length: 100 }),
  company_size_max: varchar("company_size_max", { length: 100 }),
  revenue_min: varchar("revenue_min", { length: 100 }),
  revenue_max: varchar("revenue_max", { length: 100 }),
  decision_maker_titles: jsonb("decision_maker_titles"),
  pain_points: jsonb("pain_points"),
  industries: jsonb("industries"),
  active: boolean("active").default(true),
});

export const auditLogs = pgTable("audit_logs", {
  ...baseColumns,
  actor_email: varchar("actor_email", { length: 255 }).notNull(),
  actor_name: varchar("actor_name", { length: 255 }),
  action: varchar("action", { length: 50 }).notNull(),
  resource_type: varchar("resource_type", { length: 100 }).notNull(),
  resource_id: uuid("resource_id"),
  resource_name: varchar("resource_name", { length: 500 }),
  details: text("details"),
  changes: jsonb("changes"),
  ip_address: varchar("ip_address", { length: 50 }),
  user_agent: text("user_agent"),
});

export const notifications = pgTable("notifications", {
  ...baseColumns,
  user_email: varchar("user_email", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).default("info"),
  title: varchar("title", { length: 500 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  link: text("link"),
  priority: varchar("priority", { length: 20 }).default("normal"),
  metadata: jsonb("metadata"),
  email_sent: boolean("email_sent").default(false),
});

export const clientInvites = pgTable("client_invites", {
  ...baseColumns,
  invite_token: text("invite_token").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  company_name: varchar("company_name", { length: 255 }),
  invited_by_email: varchar("invited_by_email", { length: 255 }).notNull(),
  invited_by_name: varchar("invited_by_name", { length: 255 }),
  invited_by_role: varchar("invited_by_role", { length: 20 }),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").default(false),
  used_at: timestamp("used_at", { withTimezone: true }),
  status: varchar("status", { length: 20 }).default("pending"),
});

export const internalInvites = pgTable("internal_invites", {
  ...baseColumns,
  invite_token: text("invite_token").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  full_name: varchar("full_name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user"),
  invited_by_email: varchar("invited_by_email", { length: 255 }).notNull(),
  invited_by_name: varchar("invited_by_name", { length: 255 }),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").default(false),
  used_at: timestamp("used_at", { withTimezone: true }),
  status: varchar("status", { length: 20 }).default("pending"),
});

export const emailTemplates = pgTable("email_templates", {
  ...baseColumns,
  template_name: varchar("template_name", { length: 255 }).notNull(),
  template_type: varchar("template_type", { length: 50 }).notNull(),
  subject_template: text("subject_template").notNull(),
  body_template: text("body_template").notNull(),
  html_template: text("html_template"),
  variables: text("variables").array(),
  trigger_event: varchar("trigger_event", { length: 50 }).default("manual"),
  active: boolean("active").default(true),
});

export const communicationTemplates = pgTable("communication_templates", {
  ...baseColumns,
  template_name: varchar("template_name", { length: 255 }).notNull(),
  template_type: varchar("template_type", { length: 50 }).notNull(),
  subject_template: text("subject_template").notNull(),
  body_template: text("body_template").notNull(),
  trigger_event: varchar("trigger_event", { length: 50 }).default("manual"),
  trigger_days_before: integer("trigger_days_before").default(3),
  active: boolean("active").default(true),
  variables: jsonb("variables"),
});

export const projectRequests = pgTable("project_requests", {
  ...baseColumns,
  client_email: varchar("client_email", { length: 255 }).notNull(),
  client_name: varchar("client_name", { length: 255 }),
  project_type: varchar("project_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  location: text("location"),
  budget_range: varchar("budget_range", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  status: varchar("status", { length: 20 }).default("pending"),
  assigned_to: varchar("assigned_to", { length: 255 }),
  notes: text("notes"),
});

export const rfis = pgTable("rfis", {
  ...baseColumns,
  project_id: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  rfi_number: varchar("rfi_number", { length: 100 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  status: varchar("status", { length: 20 }).default("open"),
  priority: varchar("priority", { length: 20 }).default("medium"),
  due_date: date("due_date"),
  asked_by: varchar("asked_by", { length: 255 }),
  asked_by_name: varchar("asked_by_name", { length: 255 }),
  assigned_to: varchar("assigned_to", { length: 255 }),
  attachments: jsonb("attachments"),
});

export const salesOutreach = pgTable("sales_outreach", {
  ...baseColumns,
  prospect_id: uuid("prospect_id").notNull().references(() => prospects.id, { onDelete: "cascade" }),
  prospect_name: varchar("prospect_name", { length: 255 }),
  company_name: varchar("company_name", { length: 255 }),
  sequence_id: uuid("sequence_id"),
  run_id: uuid("run_id"),
  step_index: integer("step_index"),
  ab_variant: varchar("ab_variant", { length: 5 }),
  email_type: varchar("email_type", { length: 50 }),
  email_subject: varchar("email_subject", { length: 500 }),
  email_body: text("email_body"),
  email_template_used: varchar("email_template_used", { length: 255 }),
  sent_date: timestamp("sent_date", { withTimezone: true }),
  opened: boolean("opened").default(false),
  open_count: integer("open_count").default(0),
  clicked: boolean("clicked").default(false),
  click_count: integer("click_count").default(0),
  replied: boolean("replied").default(false),
  reply_date: timestamp("reply_date", { withTimezone: true }),
  reply_content: text("reply_content"),
  outcome: varchar("outcome", { length: 50 }).default("Sent"),
  notes: text("notes"),
  tracking_token: text("tracking_token"),
});

export const emailSequences = pgTable("email_sequences", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  steps: jsonb("steps").notNull(),
  active: boolean("active").default(true),
  prospect_count: integer("prospect_count").default(0),
});

export const scheduledReports = pgTable("scheduled_reports", {
  ...baseColumns,
  report_name: varchar("report_name", { length: 255 }).notNull(),
  report_type: varchar("report_type", { length: 50 }).notNull(),
  frequency: varchar("frequency", { length: 20 }).default("weekly"),
  day_of_week: integer("day_of_week"),
  day_of_month: integer("day_of_month"),
  time_of_day: varchar("time_of_day", { length: 10 }).default("09:00"),
  project_ids: jsonb("project_ids"),
  client_email: varchar("client_email", { length: 255 }),
  client_name: varchar("client_name", { length: 255 }),
  recipient_emails: jsonb("recipient_emails").notNull(),
  include_sections: jsonb("include_sections"),
  custom_intro: text("custom_intro"),
  active: boolean("active").default(true),
  last_generated_at: timestamp("last_generated_at", { withTimezone: true }),
  last_report_html: text("last_report_html"),
  generation_count: integer("generation_count").default(0),
});

export const customPages = pgTable("custom_pages", {
  ...baseColumns,
  page_name: varchar("page_name", { length: 255 }).notNull(),
  page_slug: varchar("page_slug", { length: 255 }).notNull(),
  page_type: varchar("page_type", { length: 20 }).default("landing"),
  page_config: jsonb("page_config"),
  is_published: boolean("is_published").default(false),
  description: text("description"),
});

export const dashboardConfigs = pgTable("dashboard_configs", {
  ...baseColumns,
  user_email: varchar("user_email", { length: 255 }).notNull(),
  layout: jsonb("layout"),
  widgets: jsonb("widgets"),
});

export const formSubmissions = pgTable("form_submissions", {
  ...baseColumns,
  form_type: varchar("form_type", { length: 50 }).notNull(),
  source: varchar("source", { length: 50 }).default("website"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  message: text("message"),
  service_interest: varchar("service_interest", { length: 100 }),
  project_type: varchar("project_type", { length: 100 }),
  form_data: jsonb("form_data"),
  status: varchar("status", { length: 20 }).default("new"),
  assigned_to: varchar("assigned_to", { length: 255 }),
  notes: text("notes"),
  converted_to_prospect: boolean("converted_to_prospect").default(false),
  prospect_id: uuid("prospect_id").references(() => prospects.id, { onDelete: "set null" }),
});

export const clientTeamMembers = pgTable("client_team_members", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull(),
  full_name: varchar("full_name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("viewer").notNull(),
  status: varchar("status", { length: 30 }).default("pending").notNull(),
  invited_by: varchar("invited_by", { length: 255 }).notNull(),
  client_company: varchar("client_company", { length: 255 }),
  permissions: jsonb("permissions"),
  accepted_at: timestamp("accepted_at", { withTimezone: true }),
});

export const documentApprovals = pgTable("document_approvals", {
  ...baseColumns,
  document_id: uuid("document_id").notNull().references(() => projectDocuments.id, { onDelete: "cascade" }),
  reviewer_email: varchar("reviewer_email", { length: 255 }).notNull(),
  reviewer_name: varchar("reviewer_name", { length: 255 }),
  status: varchar("status", { length: 30 }).default("pending").notNull(),
  comments: text("comments"),
  reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
});

export const clientFeedback = pgTable("client_feedback", {
  ...baseColumns,
  client_email: varchar("client_email", { length: 255 }).notNull(),
  project_id: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  category: varchar("category", { length: 100 }),
  rating: integer("rating"),
  comments: text("comments"),
  status: varchar("status", { length: 30 }).default("new").notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  ...baseColumns,
  user_email: varchar("user_email", { length: 255 }).notNull(),
  event_type: varchar("event_type", { length: 100 }).notNull(),
  channel_email: boolean("channel_email").default(true),
  channel_in_app: boolean("channel_in_app").default(true),
});

export const proposalMessages = pgTable("proposal_messages", {
  ...baseColumns,
  proposal_id: uuid("proposal_id").notNull().references(() => proposals.id, { onDelete: "cascade" }),
  sender_email: varchar("sender_email", { length: 255 }).notNull(),
  sender_name: varchar("sender_name", { length: 255 }),
  message: text("message").notNull(),
  attachments: jsonb("attachments"),
  is_internal: boolean("is_internal").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  emailVerificationCodes: many(emailVerificationCodes),
  passwordResetTokens: many(passwordResetTokens),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const prospectsRelations = relations(prospects, ({ many }) => ({
  interactions: many(interactions),
  tasks: many(tasks),
  salesOutreach: many(salesOutreach),
  formSubmissions: many(formSubmissions),
}));

export const interactionsRelations = relations(interactions, ({ one }) => ({
  prospect: one(prospects, { fields: [interactions.prospect_id], references: [prospects.id] }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  prospect: one(prospects, { fields: [tasks.prospect_id], references: [prospects.id] }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  documents: many(projectDocuments),
  milestones: many(projectMilestones),
  changeOrders: many(changeOrders),
  messages: many(projectMessages),
  invoices: many(invoices),
  rfis: many(rfis),
}));

export const projectDocumentsRelations = relations(projectDocuments, ({ one }) => ({
  project: one(projects, { fields: [projectDocuments.project_id], references: [projects.id] }),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  project: one(projects, { fields: [projectMilestones.project_id], references: [projects.id] }),
}));

export const changeOrdersRelations = relations(changeOrders, ({ one }) => ({
  project: one(projects, { fields: [changeOrders.project_id], references: [projects.id] }),
}));

export const projectMessagesRelations = relations(projectMessages, ({ one }) => ({
  project: one(projects, { fields: [projectMessages.project_id], references: [projects.id] }),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  project: one(projects, { fields: [proposals.project_id], references: [projects.id] }),
  template: one(proposalTemplates, { fields: [proposals.template_id], references: [proposalTemplates.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  project: one(projects, { fields: [invoices.project_id], references: [projects.id] }),
}));

export const rfisRelations = relations(rfis, ({ one }) => ({
  project: one(projects, { fields: [rfis.project_id], references: [projects.id] }),
}));

export const salesOutreachRelations = relations(salesOutreach, ({ one }) => ({
  prospect: one(prospects, { fields: [salesOutreach.prospect_id], references: [prospects.id] }),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  prospect: one(prospects, { fields: [formSubmissions.prospect_id], references: [prospects.id] }),
}));

export const documentApprovalsRelations = relations(documentApprovals, ({ one }) => ({
  document: one(projectDocuments, { fields: [documentApprovals.document_id], references: [projectDocuments.id] }),
}));

export const clientFeedbackRelations = relations(clientFeedback, ({ one }) => ({
  project: one(projects, { fields: [clientFeedback.project_id], references: [projects.id] }),
}));

export const proposalMessagesRelations = relations(proposalMessages, ({ one }) => ({
  proposal: one(proposals, { fields: [proposalMessages.proposal_id], references: [proposals.id] }),
}));

const autoFields = { id: true, created_date: true, updated_date: true } as const;

export const insertUserSchema = createInsertSchema(users).omit(autoFields);
export const insertProspectSchema = createInsertSchema(prospects).omit(autoFields);
export const insertInteractionSchema = createInsertSchema(interactions).omit(autoFields);
export const insertTaskSchema = createInsertSchema(tasks).omit(autoFields);
export const insertProjectSchema = createInsertSchema(projects).omit(autoFields);
export const insertProjectDocumentSchema = createInsertSchema(projectDocuments).omit(autoFields);
export const insertProjectMilestoneSchema = createInsertSchema(projectMilestones).omit(autoFields);
export const insertChangeOrderSchema = createInsertSchema(changeOrders).omit(autoFields);
export const insertProjectMessageSchema = createInsertSchema(projectMessages).omit(autoFields);
export const insertProposalTemplateSchema = createInsertSchema(proposalTemplates).omit(autoFields);
export const insertProposalSchema = createInsertSchema(proposals).omit(autoFields);
export const insertInvoiceSchema = createInsertSchema(invoices).omit(autoFields);
export const insertWorkflowSchema = createInsertSchema(workflows).omit(autoFields);
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit(autoFields);
export const insertCalendarSettingsSchema = createInsertSchema(calendarSettings).omit(autoFields);
export const insertEmailSettingsSchema = createInsertSchema(emailSettings).omit(autoFields);
export const insertIcpSettingsSchema = createInsertSchema(icpSettings).omit(autoFields);
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit(autoFields);
export const insertNotificationSchema = createInsertSchema(notifications).omit(autoFields);
export const insertClientInviteSchema = createInsertSchema(clientInvites).omit(autoFields);
export const insertInternalInviteSchema = createInsertSchema(internalInvites).omit(autoFields);
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit(autoFields);
export const insertCommunicationTemplateSchema = createInsertSchema(communicationTemplates).omit(autoFields);
export const insertProjectRequestSchema = createInsertSchema(projectRequests).omit(autoFields);
export const insertRfiSchema = createInsertSchema(rfis).omit(autoFields);
export const insertSalesOutreachSchema = createInsertSchema(salesOutreach).omit(autoFields);
export const insertEmailSequenceSchema = createInsertSchema(emailSequences).omit(autoFields);
export const insertScheduledReportSchema = createInsertSchema(scheduledReports).omit(autoFields);
export const insertCustomPageSchema = createInsertSchema(customPages).omit(autoFields);
export const insertDashboardConfigSchema = createInsertSchema(dashboardConfigs).omit(autoFields);
export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit(autoFields);
export const insertClientTeamMemberSchema = createInsertSchema(clientTeamMembers).omit(autoFields);
export const insertDocumentApprovalSchema = createInsertSchema(documentApprovals).omit(autoFields);
export const insertClientFeedbackSchema = createInsertSchema(clientFeedback).omit(autoFields);
export const insertNotificationPreferenceSchema = createInsertSchema(notificationPreferences).omit(autoFields);
export const insertProposalMessageSchema = createInsertSchema(proposalMessages).omit(autoFields);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Interaction = typeof interactions.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProjectDocument = z.infer<typeof insertProjectDocumentSchema>;
export type ProjectDocument = typeof projectDocuments.$inferSelect;
export type InsertProjectMilestone = z.infer<typeof insertProjectMilestoneSchema>;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertChangeOrder = z.infer<typeof insertChangeOrderSchema>;
export type ChangeOrder = typeof changeOrders.$inferSelect;
export type InsertProjectMessage = z.infer<typeof insertProjectMessageSchema>;
export type ProjectMessage = typeof projectMessages.$inferSelect;
export type InsertProposalTemplate = z.infer<typeof insertProposalTemplateSchema>;
export type ProposalTemplate = typeof proposalTemplates.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertCalendarSettings = z.infer<typeof insertCalendarSettingsSchema>;
export type CalendarSettings = typeof calendarSettings.$inferSelect;
export type InsertEmailSettings = z.infer<typeof insertEmailSettingsSchema>;
export type EmailSettings = typeof emailSettings.$inferSelect;
export type InsertIcpSettings = z.infer<typeof insertIcpSettingsSchema>;
export type IcpSettings = typeof icpSettings.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertClientInvite = z.infer<typeof insertClientInviteSchema>;
export type ClientInvite = typeof clientInvites.$inferSelect;
export type InsertInternalInvite = z.infer<typeof insertInternalInviteSchema>;
export type InternalInvite = typeof internalInvites.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertCommunicationTemplate = z.infer<typeof insertCommunicationTemplateSchema>;
export type CommunicationTemplate = typeof communicationTemplates.$inferSelect;
export type InsertProjectRequest = z.infer<typeof insertProjectRequestSchema>;
export type ProjectRequest = typeof projectRequests.$inferSelect;
export type InsertRfi = z.infer<typeof insertRfiSchema>;
export type Rfi = typeof rfis.$inferSelect;
export type InsertSalesOutreach = z.infer<typeof insertSalesOutreachSchema>;
export type SalesOutreach = typeof salesOutreach.$inferSelect;
export type InsertEmailSequence = z.infer<typeof insertEmailSequenceSchema>;
export type EmailSequence = typeof emailSequences.$inferSelect;
export type InsertScheduledReport = z.infer<typeof insertScheduledReportSchema>;
export type ScheduledReport = typeof scheduledReports.$inferSelect;
export type InsertCustomPage = z.infer<typeof insertCustomPageSchema>;
export type CustomPage = typeof customPages.$inferSelect;
export type InsertDashboardConfig = z.infer<typeof insertDashboardConfigSchema>;
export type DashboardConfig = typeof dashboardConfigs.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertClientTeamMember = z.infer<typeof insertClientTeamMemberSchema>;
export type ClientTeamMember = typeof clientTeamMembers.$inferSelect;
export type InsertDocumentApproval = z.infer<typeof insertDocumentApprovalSchema>;
export type DocumentApproval = typeof documentApprovals.$inferSelect;
export type InsertClientFeedback = z.infer<typeof insertClientFeedbackSchema>;
export type ClientFeedback = typeof clientFeedback.$inferSelect;
export type InsertNotificationPreference = z.infer<typeof insertNotificationPreferenceSchema>;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertProposalMessage = z.infer<typeof insertProposalMessageSchema>;
export type ProposalMessage = typeof proposalMessages.$inferSelect;

export const galleryProjects = pgTable("gallery_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location"),
  county: text("county"),
  category: text("category"),
  date: text("date"),
  budget: text("budget"),
  client_name: text("client_name"),
  contact_name: text("contact_name"),
  description: text("description"),
  scope: text("scope"),
  services: text("services").array(),
  agencies: text("agencies").array(),
  image: text("image"),
  images: text("images").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  sort_order: integer("sort_order").default(0),
  created_date: timestamp("created_date").defaultNow(),
  updated_date: timestamp("updated_date").defaultNow(),
});

export const insertGalleryProjectSchema = createInsertSchema(galleryProjects).omit({ id: true, created_date: true, updated_date: true });
export type InsertGalleryProject = z.infer<typeof insertGalleryProjectSchema>;
export type GalleryProject = typeof galleryProjects.$inferSelect;

export const entityTableMap: Record<string, any> = {
  "prospects": prospects,
  "interactions": interactions,
  "tasks": tasks,
  "projects": projects,
  "project-documents": projectDocuments,
  "project-milestones": projectMilestones,
  "change-orders": changeOrders,
  "project-messages": projectMessages,
  "proposals": proposals,
  "proposal-templates": proposalTemplates,
  "invoices": invoices,
  "workflows": workflows,
  "blog-posts": blogPosts,
  "calendar-settings": calendarSettings,
  "email-settings": emailSettings,
  "icp-settings": icpSettings,
  "audit-logs": auditLogs,
  "notifications": notifications,
  "client-invites": clientInvites,
  "internal-invites": internalInvites,
  "email-templates": emailTemplates,
  "communication-templates": communicationTemplates,
  "project-requests": projectRequests,
  "rfis": rfis,
  "sales-outreach": salesOutreach,
  "email-sequences": emailSequences,
  "scheduled-reports": scheduledReports,
  "custom-pages": customPages,
  "dashboard-configs": dashboardConfigs,
  "form-submissions": formSubmissions,
  "client-team-members": clientTeamMembers,
  "document-approvals": documentApprovals,
  "client-feedback": clientFeedback,
  "notification-preferences": notificationPreferences,
  "proposal-messages": proposalMessages,
  "gallery-projects": galleryProjects,
};
