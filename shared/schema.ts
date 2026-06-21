import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // bcrypt hash; null for accounts created via SSO (legacy)
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").default("user"), // user, admin, superuser
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("free"), // free, starter, pro, premium, lifetime
  subscriptionTier: text("subscription_tier").default("free"), // free, starter, pro, premium, lifetime
  purchasedTools: text("purchased_tools").array().default([]), // Individual tool purchases
  adViewCount: integer("ad_view_count").default(0),
  supportLevel: text("support_level").default("none"), // none, supporter, patron, sponsor
  testGroup: text("test_group").default("control"), // control, variant_a, variant_b, pricing_test
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  urgency: text("urgency").default("medium"), // low, medium, high (for Eisenhower Matrix)
  importance: text("importance").default("medium"), // low, medium, high (for Eisenhower Matrix)
  category: text("category"),
  tags: text("tags").array().default([]), // Flexible tags like #work, @errands
  labels: text("labels").array().default([]), // Custom labels
  customFields: jsonb("custom_fields"), // Flexible custom fields
  dueDate: timestamp("due_date"),
  reminderDate: timestamp("reminder_date"),
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  progress: integer("progress").default(0), // 0-100 percentage
  timeTracking: jsonb("time_tracking"), // Array of {startTime, endTime, duration}
  dependencies: integer("dependencies").array().default([]), // Array of task IDs this task depends on
  blockedBy: integer("blocked_by").array().default([]), // Array of task IDs blocking this task
  notes: text("notes"), // Additional notes/comments
  attachments: jsonb("attachments"), // File attachments metadata
  templateId: integer("template_id"), // Reference to task template if created from one
  parentId: integer("parent_id"), // For subtasks
  position: integer("position").default(0), // For drag-and-drop ordering
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: jsonb("recurring_pattern"), // Complex recurring patterns
  originalText: text("original_text"), // Store original NLP input
  completedAt: timestamp("completed_at"), // When the task was completed
  startedAt: timestamp("started_at"), // When work on this task started
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  markdownContent: text("markdown_content"), // For markdown mode
  contentType: text("content_type").default("rich"), // rich, markdown, template
  folder: text("folder").default("General"),
  parentFolderId: integer("parent_folder_id"), // For nested folders
  tags: text("tags").array().default([]), // Tags for organization
  smartTags: text("smart_tags").array().default([]), // Auto-generated tags
  linkedNotes: integer("linked_notes").array().default([]), // Bi-directional linking
  templateId: integer("template_id"), // Reference to template used
  attachments: jsonb("attachments"), // Media files, images, documents
  metadata: jsonb("metadata"), // OCR text, transcripts, etc.
  outline: jsonb("outline"), // Auto-generated table of contents
  isFavorite: boolean("is_favorite").default(false),
  isArchived: boolean("is_archived").default(false),
  wordCount: integer("word_count").default(0),
  readingTime: integer("reading_time").default(0), // in minutes
  lastViewedAt: timestamp("last_viewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Folders/Notebooks table
export const noteFolders = pgTable("note_folders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"), // For nested folders
  color: text("color").default("#6366f1"),
  icon: text("icon").default("📁"),
  position: integer("position").default(0),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates table
export const noteTemplates = pgTable("note_templates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"), // null for system templates
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  markdownContent: text("markdown_content"),
  contentType: text("content_type").default("rich"),
  category: text("category").default("General"), // meeting, journal, project, etc.
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(false),
  isSystem: boolean("is_system").default(false),
  usageCount: integer("usage_count").default(0),
  thumbnail: text("thumbnail"), // Preview image
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Web clips table  
export const webClips = pgTable("web_clips", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  noteId: integer("note_id"), // Associated note
  url: text("url").notNull(),
  title: text("title"),
  content: text("content"),
  snippet: text("snippet"), // Preview text
  thumbnail: text("thumbnail"),
  domain: text("domain"),
  clipType: text("clip_type").default("full"), // full, simplified, text
  metadata: jsonb("metadata"), // Page metadata
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceRecordings = pgTable("voice_recordings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  duration: integer("duration"), // in seconds
  blob: text("blob"), // base64 encoded audio data
  transcript: text("transcript"), // Generated transcript
  transcriptLanguage: varchar("transcript_language").default("en-US"), // Language code
  summary: text("summary"), // AI-generated summary
  tags: text("tags").array().default([]), // Searchable tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const flashcardDecks = pgTable("flashcard_decks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags"), // Comma-separated tags
  color: text("color").default("blue"), // Deck color theme
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  hint: text("hint"), // Optional hint for the card
  tags: text("tags"), // Comma-separated tags
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  nextReview: timestamp("next_review").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  frequency: text("frequency").default("daily"), // daily, weekly, monthly
  targetDays: jsonb("target_days"), // [1,2,3,4,5] for weekdays
  streak: integer("streak").default(0),
  bestStreak: integer("best_streak").default(0),
  color: text("color").default("#2563EB"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  date: timestamp("date").notNull(),
  completed: boolean("completed").default(true),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(), // bug, feature, improvement, compliment, other
  rating: integer("rating").notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  email: varchar("email"),
  status: varchar("status").default("pending"), // pending, reviewed, resolved
  response: text("response"), // Admin response to feedback
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Revenue tracking table
export const revenueEvents = pgTable("revenue_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  eventType: text("event_type").notNull(), // ad_view, subscription, tool_purchase, donation
  amount: integer("amount").default(0), // In cents
  currency: text("currency").default("usd"),
  metadata: jsonb("metadata"), // Additional data like ad network, tool ID, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Support/donation tracking
export const supportTransactions = pgTable("support_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  supportType: text("support_type").notNull(), // coffee, beer, donation
  amount: integer("amount").notNull(), // In cents
  message: text("message"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for Replit Auth
export type UpsertUser = typeof users.$inferInsert;

export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastViewedAt: true,
});

export const insertNoteFolderSchema = createInsertSchema(noteFolders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteTemplateSchema = createInsertSchema(noteTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

export const insertWebClipSchema = createInsertSchema(webClips).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceRecordingSchema = createInsertSchema(voiceRecordings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFlashcardDeckSchema = createInsertSchema(flashcardDecks).omit({
  id: true,
  createdAt: true,
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
  createdAt: true,
  nextReview: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
  streak: true,
  bestStreak: true,
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({
  id: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertRevenueEventSchema = createInsertSchema(revenueEvents).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTransactionSchema = createInsertSchema(supportTransactions).omit({
  id: true,
  createdAt: true,
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(), // Unique identifier for the achievement
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // productivity, consistency, milestones, exploration
  icon: text("icon").notNull(), // Icon name for the achievement
  color: text("color").default("#3b82f6"), // Color theme for the badge
  requirement: jsonb("requirement").notNull(), // Requirements to unlock (count, days, etc.)
  points: integer("points").default(10), // Points awarded for this achievement
  rarity: text("rarity").default("common"), // common, rare, epic, legendary
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: jsonb("progress"), // Current progress toward achievement
  isCompleted: boolean("is_completed").default(true),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").unique().notNull(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  streakDays: integer("streak_days").default(0),
  lastActiveDate: timestamp("last_active_date"),
  
  // Activity counters
  todosCompleted: integer("todos_completed").default(0),
  notesCreated: integer("notes_created").default(0),
  habitsTracked: integer("habits_tracked").default(0),
  flashcardsStudied: integer("flashcards_studied").default(0),
  pomodoroSessions: integer("pomodoro_sessions").default(0),
  toolsUsed: text("tools_used").array().default([]),
  
  // Time tracking
  totalFocusTime: integer("total_focus_time").default(0), // in minutes
  longestStreak: integer("longest_streak").default(0),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Timer Tables
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#3b82f6"),
  billableRate: integer("billable_rate").default(0),
  isBillable: boolean("is_billable").default(false),
  clientName: varchar("client_name", { length: 255 }),
  status: text("status").default("active"),
  tags: text("tags").array().default([]),
  estimatedHours: integer("estimated_hours"),
  deadlineDate: timestamp("deadline_date"),
  priority: text("priority").default("medium"),
  integrationData: jsonb("integration_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
  taskName: varchar("task_name", { length: 255 }),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").default(0),
  isManual: boolean("is_manual").default(false),
  isBillable: boolean("is_billable").default(false),
  hourlyRate: integer("hourly_rate").default(0),
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata"),
  idleTime: integer("idle_time").default(0),
  isActive: boolean("is_active").default(false),
  predictedCategory: varchar("predicted_category"),
  confidenceScore: integer("confidence_score"),
  anomalyFlags: text("anomaly_flags").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const taskTemplates = pgTable("task_templates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  estimatedDuration: integer("estimated_duration"),
  tags: text("tags").array().default([]),
  category: varchar("category"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskTemplateSchema = createInsertSchema(taskTemplates).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type VoiceRecording = typeof voiceRecordings.$inferSelect;
export type InsertVoiceRecording = z.infer<typeof insertVoiceRecordingSchema>;
export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type InsertFlashcardDeck = z.infer<typeof insertFlashcardDeckSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type RevenueEvent = typeof revenueEvents.$inferSelect;
export type InsertRevenueEvent = z.infer<typeof insertRevenueEventSchema>;
export type SupportTransaction = typeof supportTransactions.$inferSelect;
export type InsertSupportTransaction = z.infer<typeof insertSupportTransactionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TaskTemplate = typeof taskTemplates.$inferSelect;
export type InsertTaskTemplate = z.infer<typeof insertTaskTemplateSchema>;
export type NoteFolder = typeof noteFolders.$inferSelect;
export type InsertNoteFolder = z.infer<typeof insertNoteFolderSchema>;
export type NoteTemplate = typeof noteTemplates.$inferSelect;
export type InsertNoteTemplate = z.infer<typeof insertNoteTemplateSchema>;
export type WebClip = typeof webClips.$inferSelect;
export type InsertWebClip = z.infer<typeof insertWebClipSchema>;

// IQ Test Sessions
export const iqTestSessions = pgTable("iq_test_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  testLevel: varchar("test_level").notNull(), // basic, standard, professional, genius
  questionCount: integer("question_count").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  totalTime: integer("total_time").notNull(), // in seconds
  iqScore: integer("iq_score").notNull(),
  categoryScores: jsonb("category_scores"), // scores by category
  questionsData: jsonb("questions_data"), // question IDs and answers
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertIqTestSessionSchema = createInsertSchema(iqTestSessions).omit({ id: true, completedAt: true });
export type InsertIqTestSession = z.infer<typeof insertIqTestSessionSchema>;
export type IqTestSession = typeof iqTestSessions.$inferSelect;
