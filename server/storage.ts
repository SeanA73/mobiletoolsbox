import { 
  users, todos, notes, voiceRecordings, flashcardDecks, flashcards, habits, habitLogs, feedback,
  revenueEvents, supportTransactions, achievements, userAchievements, userStats, projects, timeEntries, taskTemplates, iqTestSessions,
  type User, type UpsertUser, type Todo, type InsertTodo, type Note, type InsertNote,
  type VoiceRecording, type InsertVoiceRecording, type FlashcardDeck, type InsertFlashcardDeck,
  type Flashcard, type InsertFlashcard, type Habit, type InsertHabit, type HabitLog, type InsertHabitLog,
  type Feedback, type InsertFeedback, type RevenueEvent, type InsertRevenueEvent,
  type SupportTransaction, type InsertSupportTransaction, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement, type UserStats, type InsertUserStats,
  type Project, type InsertProject, type TimeEntry, type InsertTimeEntry, type TaskTemplate, type InsertTaskTemplate,
  type IqTestSession, type InsertIqTestSession
} from "@shared/schema";
import { db } from "./db";
import { eq, inArray, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createLocalUser(user: { id: string; email: string; password: string; firstName?: string; lastName?: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User>;
  updateUserSubscriptionStatus(id: string, status: string): Promise<User>;
  updateUserTestGroup(id: string, testGroup: string): Promise<User>;
  updateUserSubscriptionTier(id: string, tier: string): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  addPurchasedTool(id: string, toolId: string): Promise<User>;
  
  // Revenue tracking
  createRevenueEvent(event: InsertRevenueEvent): Promise<RevenueEvent>;
  getRevenueStats(startDate?: Date, endDate?: Date): Promise<any>;
  
  // Support transactions
  createSupportTransaction(transaction: InsertSupportTransaction): Promise<SupportTransaction>;
  getSupportTransactions(userId?: string): Promise<SupportTransaction[]>;

  // Todos
  getTodosByUserId(userId: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, userId: string, todo: Partial<Todo>): Promise<Todo | undefined>;
  deleteTodo(id: number, userId: string): Promise<boolean>;

  // Notes
  getNotesByUserId(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, userId: string, note: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: number, userId: string): Promise<boolean>;

  // Voice Recordings
  getVoiceRecordingsByUserId(userId: string): Promise<VoiceRecording[]>;
  createVoiceRecording(recording: InsertVoiceRecording): Promise<VoiceRecording>;
  updateVoiceRecording(id: number, userId: string, updateData: Partial<VoiceRecording>): Promise<VoiceRecording | undefined>;
  deleteVoiceRecording(id: number, userId: string): Promise<boolean>;

  // Flashcard Decks
  getFlashcardDecksByUserId(userId: string): Promise<FlashcardDeck[]>;
  createFlashcardDeck(deck: InsertFlashcardDeck): Promise<FlashcardDeck>;
  deleteFlashcardDeck(id: number, userId: string): Promise<boolean>;

  // Flashcards
  getFlashcardsByDeckId(deckId: number): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, userId: string, flashcard: Partial<Flashcard>): Promise<Flashcard | undefined>;
  deleteFlashcard(id: number, userId: string): Promise<boolean>;

  // Habits
  getHabitsByUserId(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, userId: string, habit: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: number, userId: string): Promise<boolean>;

  // Habit Logs
  getHabitLogsByHabitId(habitId: number): Promise<HabitLog[]>;
  getHabitLogsByUserId(userId: string): Promise<HabitLog[]>;
  createHabitLog(log: InsertHabitLog): Promise<HabitLog>;
  deleteHabitLog(id: number, userId: string): Promise<boolean>;

  // Feedback
  getFeedbackByUserId(userId: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;
  getFeedbackById(id: number): Promise<Feedback | undefined>;
  updateFeedbackStatus(id: number, status: string, response?: string): Promise<Feedback>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;

  // User Stats
  getUserStats(userId: string): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;
  incrementUserActivity(userId: string, activity: string, amount?: number): Promise<UserStats>;

  // Project Timer
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  getTimeEntriesByUserId(userId: string, filters?: any): Promise<TimeEntry[]>;
  getTimeEntriesByProjectId(projectId: number): Promise<TimeEntry[]>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, entry: Partial<TimeEntry>): Promise<TimeEntry>;
  deleteTimeEntry(id: number): Promise<void>;
  getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined>;
  
  getTaskTemplatesByUserId(userId: string): Promise<TaskTemplate[]>;
  createTaskTemplate(template: InsertTaskTemplate): Promise<TaskTemplate>;
  getRecentTasks(userId: string, limit?: number): Promise<TaskTemplate[]>;

  // IQ Test Sessions
  getIqTestSessionsByUserId(userId: string): Promise<IqTestSession[]>;
  createIqTestSession(session: InsertIqTestSession): Promise<IqTestSession>;
  getIqTestStats(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createLocalUser(userData: { id: string; email: string; password: string; firstName?: string; lastName?: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "pro"
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscriptionStatus(id: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserTestGroup(id: string, testGroup: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        testGroup,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscriptionTier(id: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionTier: tier,
        subscriptionStatus: tier,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        role: role,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async addPurchasedTool(id: string, toolId: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const purchasedTools = user.purchasedTools || [];
    if (!purchasedTools.includes(toolId)) {
      purchasedTools.push(toolId);
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        purchasedTools,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Revenue tracking
  async createRevenueEvent(insertEvent: InsertRevenueEvent): Promise<RevenueEvent> {
    const [event] = await db
      .insert(revenueEvents)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getRevenueStats(startDate?: Date, endDate?: Date): Promise<any> {
    const events = await db.select().from(revenueEvents);
    const allUsers = await db.select().from(users);
    
    const totalRevenue = events.reduce((sum, event) => sum + (event.amount || 0), 0);
    const paidUsers = allUsers.filter(u => u.subscriptionStatus !== "free");
    
    return {
      totalRevenue: totalRevenue / 100,
      totalUsers: allUsers.length,
      conversionRate: allUsers.length > 0 ? (paidUsers.length / allUsers.length * 100) : 0,
      revenueToday: events
        .filter(e => e.createdAt && e.createdAt.toDateString() === new Date().toDateString())
        .reduce((sum, event) => sum + (event.amount || 0), 0) / 100,
      groupStats: this.calculateGroupStats(allUsers, events)
    };
  }

  private calculateGroupStats(users: User[], events: RevenueEvent[]) {
    const groups = ["control", "variant_a", "variant_b", "pricing_test"];
    const stats: any = {};
    
    groups.forEach(group => {
      const groupUsers = users.filter(u => u.testGroup === group);
      const groupEvents = events.filter(e => 
        groupUsers.some(u => u.id === e.userId)
      );
      const groupRevenue = groupEvents.reduce((sum, event) => sum + (event.amount || 0), 0);
      const paidUsers = groupUsers.filter(u => u.subscriptionStatus !== "free");
      
      stats[group] = {
        users: groupUsers.length,
        revenue: groupRevenue / 100,
        conversion: groupUsers.length > 0 ? (paidUsers.length / groupUsers.length * 100) : 0
      };
    });
    
    return stats;
  }

  // Support transactions
  async createSupportTransaction(insertTransaction: InsertSupportTransaction): Promise<SupportTransaction> {
    const [transaction] = await db
      .insert(supportTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getSupportTransactions(userId?: string): Promise<SupportTransaction[]> {
    if (userId) {
      return await db.select().from(supportTransactions).where(eq(supportTransactions.userId, userId));
    }
    return await db.select().from(supportTransactions);
  }

  // Todos
  async getTodosByUserId(userId: string): Promise<Todo[]> {
    return await db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const [todo] = await db
      .insert(todos)
      .values(insertTodo)
      .returning();
    return todo;
  }

  async updateTodo(id: number, userId: string, todoUpdate: Partial<Todo>): Promise<Todo | undefined> {
    const [todo] = await db
      .update(todos)
      .set({ ...todoUpdate, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return todo || undefined;
  }

  async deleteTodo(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning({ id: todos.id });
    return result.length > 0;
  }

  // Notes
  async getNotesByUserId(userId: string): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(insertNote)
      .returning();
    return note;
  }

  async updateNote(id: number, userId: string, noteUpdate: Partial<Note>): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set({ ...noteUpdate, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return note || undefined;
  }

  async deleteNote(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning({ id: notes.id });
    return result.length > 0;
  }

  // Voice Recordings
  async getVoiceRecordingsByUserId(userId: string): Promise<VoiceRecording[]> {
    return await db.select().from(voiceRecordings).where(eq(voiceRecordings.userId, userId));
  }

  async createVoiceRecording(insertRecording: InsertVoiceRecording): Promise<VoiceRecording> {
    const [recording] = await db
      .insert(voiceRecordings)
      .values(insertRecording)
      .returning();
    return recording;
  }

  async updateVoiceRecording(id: number, userId: string, updateData: Partial<VoiceRecording>): Promise<VoiceRecording | undefined> {
    const [recording] = await db
      .update(voiceRecordings)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(eq(voiceRecordings.id, id), eq(voiceRecordings.userId, userId)))
      .returning();
    return recording || undefined;
  }

  async deleteVoiceRecording(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(voiceRecordings)
      .where(and(eq(voiceRecordings.id, id), eq(voiceRecordings.userId, userId)))
      .returning({ id: voiceRecordings.id });
    return result.length > 0;
  }

  // Flashcard Decks
  async getFlashcardDecksByUserId(userId: string): Promise<FlashcardDeck[]> {
    return await db.select().from(flashcardDecks).where(eq(flashcardDecks.userId, userId));
  }

  async createFlashcardDeck(insertDeck: InsertFlashcardDeck): Promise<FlashcardDeck> {
    const [deck] = await db
      .insert(flashcardDecks)
      .values(insertDeck)
      .returning();
    return deck;
  }

  async deleteFlashcardDeck(id: number, userId: string): Promise<boolean> {
    // Verify ownership before touching anything
    const [deck] = await db
      .select()
      .from(flashcardDecks)
      .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, userId)));
    if (!deck) return false;

    await db.delete(flashcards).where(eq(flashcards.deckId, id));
    await db.delete(flashcardDecks).where(eq(flashcardDecks.id, id));
    return true;
  }

  // Flashcards (ownership lives on the parent deck)
  async getFlashcardsByDeckId(deckId: number): Promise<Flashcard[]> {
    return await db.select().from(flashcards).where(eq(flashcards.deckId, deckId));
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const [flashcard] = await db
      .insert(flashcards)
      .values(insertFlashcard)
      .returning();
    return flashcard;
  }

  private async getOwnedDeckIdForFlashcard(flashcardId: number, userId: string): Promise<number | undefined> {
    const [row] = await db
      .select({ deckId: flashcards.deckId })
      .from(flashcards)
      .innerJoin(flashcardDecks, eq(flashcards.deckId, flashcardDecks.id))
      .where(and(eq(flashcards.id, flashcardId), eq(flashcardDecks.userId, userId)));
    return row?.deckId;
  }

  async updateFlashcard(id: number, userId: string, flashcardUpdate: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const owned = await this.getOwnedDeckIdForFlashcard(id, userId);
    if (!owned) return undefined;

    const [flashcard] = await db
      .update(flashcards)
      .set(flashcardUpdate)
      .where(eq(flashcards.id, id))
      .returning();
    return flashcard || undefined;
  }

  async deleteFlashcard(id: number, userId: string): Promise<boolean> {
    const owned = await this.getOwnedDeckIdForFlashcard(id, userId);
    if (!owned) return false;

    await db.delete(flashcards).where(eq(flashcards.id, id));
    return true;
  }

  // Habits
  async getHabitsByUserId(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db
      .insert(habits)
      .values(insertHabit)
      .returning();
    return habit;
  }

  async updateHabit(id: number, userId: string, habitUpdate: Partial<Habit>): Promise<Habit | undefined> {
    const [habit] = await db
      .update(habits)
      .set(habitUpdate)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return habit || undefined;
  }

  async deleteHabit(id: number, userId: string): Promise<boolean> {
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)));
    if (!habit) return false;

    await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
    await db.delete(habits).where(eq(habits.id, id));
    return true;
  }

  // Habit Logs (ownership lives on the parent habit)
  async getHabitLogsByHabitId(habitId: number): Promise<HabitLog[]> {
    return await db.select().from(habitLogs).where(eq(habitLogs.habitId, habitId));
  }

  async getHabitLogsByUserId(userId: string): Promise<HabitLog[]> {
    const userHabits = await this.getHabitsByUserId(userId);
    const habitIds = userHabits.map(habit => habit.id);
    if (habitIds.length === 0) return [];
    
    return await db.select().from(habitLogs).where(inArray(habitLogs.habitId, habitIds));
  }

  async createHabitLog(insertLog: InsertHabitLog): Promise<HabitLog> {
    const [log] = await db
      .insert(habitLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async deleteHabitLog(id: number, userId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .innerJoin(habits, eq(habitLogs.habitId, habits.id))
      .where(and(eq(habitLogs.id, id), eq(habits.userId, userId)));
    if (!row) return false;

    await db.delete(habitLogs).where(eq(habitLogs.id, id));
    return true;
  }

  // Feedback
  async getFeedbackByUserId(userId: string): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.userId, userId));
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackEntry] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackEntry;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async getFeedbackById(id: number): Promise<Feedback | undefined> {
    const [feedbackEntry] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackEntry;
  }

  async updateFeedbackStatus(id: number, status: string, response?: string): Promise<Feedback> {
    const updateData: any = { status, updatedAt: new Date() };
    if (response) {
      updateData.response = response;
    }
    
    const [updatedFeedback] = await db
      .update(feedback)
      .set(updateData)
      .where(eq(feedback.id, id))
      .returning();
    
    return updatedFeedback;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.isActive, true));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        isCompleted: true
      })
      .returning();
    return userAchievement;
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const userStats = await this.getUserStats(userId);
    const allAchievements = await this.getAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedAchievementIds = userAchievements.map(ua => ua.achievementId);
    const newUnlocks: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (unlockedAchievementIds.includes(achievement.id)) continue;

      const requirement = achievement.requirement as any;
      let shouldUnlock = false;

      switch (achievement.key) {
        case 'first_todo':
          shouldUnlock = (userStats.todosCompleted || 0) >= 1;
          break;
        case 'todo_master':
          shouldUnlock = (userStats.todosCompleted || 0) >= 10;
          break;
        case 'note_taker':
          shouldUnlock = (userStats.notesCreated || 0) >= 5;
          break;
        case 'habit_builder':
          shouldUnlock = (userStats.habitsTracked || 0) >= 1;
          break;
        case 'consistency_king':
          shouldUnlock = (userStats.streakDays || 0) >= 7;
          break;
        case 'tool_explorer':
          shouldUnlock = (userStats.toolsUsed || []).length >= 5;
          break;
        case 'focus_master':
          shouldUnlock = (userStats.totalFocusTime || 0) >= 60;
          break;
      }

      if (shouldUnlock) {
        const newAchievement = await this.unlockAchievement(userId, achievement.id);
        newUnlocks.push(newAchievement);
        
        // Award points
        await this.incrementUserActivity(userId, 'points', achievement.points ?? 10);
      }
    }

    return newUnlocks;
  }

  // User Stats
  async getUserStats(userId: string): Promise<UserStats> {
    const [existingStats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));

    if (existingStats) {
      return existingStats;
    }

    // Create new stats for user
    const [newStats] = await db
      .insert(userStats)
      .values({ userId })
      .returning();
    return newStats;
  }

  async updateUserStats(userId: string, statsUpdate: Partial<UserStats>): Promise<UserStats> {
    const [updatedStats] = await db
      .update(userStats)
      .set({ ...statsUpdate, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updatedStats;
  }

  async incrementUserActivity(userId: string, activity: string, amount: number = 1): Promise<UserStats> {
    const currentStats = await this.getUserStats(userId);
    const updates: Partial<UserStats> = {};

    switch (activity) {
      case 'todos_completed':
        updates.todosCompleted = (currentStats.todosCompleted || 0) + amount;
        updates.experiencePoints = (currentStats.experiencePoints || 0) + 5;
        break;
      case 'notes_created':
        updates.notesCreated = (currentStats.notesCreated || 0) + amount;
        updates.experiencePoints = (currentStats.experiencePoints || 0) + 3;
        break;
      case 'habits_tracked':
        updates.habitsTracked = (currentStats.habitsTracked || 0) + amount;
        updates.experiencePoints = (currentStats.experiencePoints || 0) + 2;
        break;
      case 'flashcards_studied':
        updates.flashcardsStudied = (currentStats.flashcardsStudied || 0) + amount;
        updates.experiencePoints = (currentStats.experiencePoints || 0) + 1;
        break;
      case 'pomodoro_sessions':
        updates.pomodoroSessions = (currentStats.pomodoroSessions || 0) + amount;
        updates.totalFocusTime = (currentStats.totalFocusTime || 0) + 25;
        updates.experiencePoints = (currentStats.experiencePoints || 0) + 10;
        break;
      case 'tool_used':
        const toolsUsed = currentStats.toolsUsed || [];
        if (!toolsUsed.includes(activity)) {
          updates.toolsUsed = [...toolsUsed, activity];
        }
        break;
      case 'points':
        updates.totalPoints = (currentStats.totalPoints || 0) + amount;
        break;
    }

    // Calculate level based on experience points
    const newXP = updates.experiencePoints || currentStats.experiencePoints || 0;
    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel > (currentStats.level || 1)) {
      updates.level = newLevel;
    }

    updates.lastActiveDate = new Date();

    return await this.updateUserStats(userId, updates);
  }

  // Project Timer Methods
  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.updatedAt);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...projectUpdate, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getTimeEntriesByUserId(userId: string, filters?: any): Promise<TimeEntry[]> {
    let whereConditions = [eq(timeEntries.userId, userId)];
    
    if (filters?.projectId) {
      whereConditions.push(eq(timeEntries.projectId, filters.projectId));
    }
    
    if (filters?.startDate && filters?.endDate) {
      whereConditions.push(
        gte(timeEntries.startTime, new Date(filters.startDate)),
        lte(timeEntries.startTime, new Date(filters.endDate))
      );
    }
    
    return await db.select().from(timeEntries)
      .where(and(...whereConditions))
      .orderBy(desc(timeEntries.startTime));
  }

  async getTimeEntriesByProjectId(projectId: number): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(eq(timeEntries.projectId, projectId))
      .orderBy(desc(timeEntries.startTime));
  }

  async createTimeEntry(insertEntry: InsertTimeEntry): Promise<TimeEntry> {
    const [entry] = await db.insert(timeEntries).values(insertEntry).returning();
    return entry;
  }

  async updateTimeEntry(id: number, entryUpdate: Partial<TimeEntry>): Promise<TimeEntry> {
    const [entry] = await db
      .update(timeEntries)
      .set({ ...entryUpdate, updatedAt: new Date() })
      .where(eq(timeEntries.id, id))
      .returning();
    return entry;
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  async getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined> {
    const [entry] = await db.select().from(timeEntries)
      .where(and(eq(timeEntries.userId, userId), eq(timeEntries.isActive, true)))
      .limit(1);
    return entry;
  }

  async getTaskTemplatesByUserId(userId: string): Promise<TaskTemplate[]> {
    return await db.select().from(taskTemplates)
      .where(eq(taskTemplates.userId, userId))
      .orderBy(desc(taskTemplates.usageCount));
  }

  async createTaskTemplate(insertTemplate: InsertTaskTemplate): Promise<TaskTemplate> {
    const [template] = await db.insert(taskTemplates).values(insertTemplate).returning();
    return template;
  }

  async getRecentTasks(userId: string, limit: number = 5): Promise<TaskTemplate[]> {
    return await db.select().from(taskTemplates)
      .where(eq(taskTemplates.userId, userId))
      .orderBy(desc(taskTemplates.usageCount))
      .limit(limit);
  }

  // IQ Test Sessions
  async getIqTestSessionsByUserId(userId: string): Promise<IqTestSession[]> {
    const sessions = await db
      .select()
      .from(iqTestSessions)
      .where(eq(iqTestSessions.userId, userId))
      .orderBy(desc(iqTestSessions.completedAt));
    return sessions;
  }

  async createIqTestSession(insertSession: InsertIqTestSession): Promise<IqTestSession> {
    const [session] = await db
      .insert(iqTestSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getIqTestStats(userId: string): Promise<any> {
    const sessions = await this.getIqTestSessionsByUserId(userId);
    
    if (sessions.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        levelProgression: {},
        categoryStrengths: {},
        recentTrend: []
      };
    }

    const totalTests = sessions.length;
    const averageScore = Math.round(sessions.reduce((sum, s) => sum + s.iqScore, 0) / totalTests);
    const bestScore = Math.max(...sessions.map(s => s.iqScore));
    const averageAccuracy = Math.round(sessions.reduce((sum, s) => sum + (s.correctAnswers / s.questionCount * 100), 0) / totalTests);

    // Level progression
    const levelProgression = sessions.reduce((acc, session) => {
      acc[session.testLevel] = (acc[session.testLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Category strengths (average from recent sessions)
    const recentSessions = sessions.slice(0, 5);
    const categoryStrengths = recentSessions.reduce((acc, session) => {
      if (session.categoryScores) {
        const scores = session.categoryScores as Record<string, number>;
        Object.entries(scores).forEach(([category, score]) => {
          if (!acc[category]) acc[category] = [];
          acc[category].push(score);
        });
      }
      return acc;
    }, {} as Record<string, number[]>);

    // Average category scores
    const avgCategoryStrengths: Record<string, number> = {};
    Object.keys(categoryStrengths).forEach(category => {
      const scores = categoryStrengths[category];
      avgCategoryStrengths[category] = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    });

    // Recent trend (last 10 sessions)
    const recentTrend = sessions.slice(0, 10).reverse().map(session => ({
      date: session.completedAt,
      score: session.iqScore,
      level: session.testLevel
    }));

    return {
      totalTests,
      averageScore,
      bestScore,
      averageAccuracy,
      levelProgression,
      categoryStrengths: avgCategoryStrengths,
      recentTrend
    };
  }
}

export const storage = new DatabaseStorage();