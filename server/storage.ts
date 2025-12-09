import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  type User,
  type InsertUser,
  type Module,
  type InsertModule,
  type Page,
  type InsertPage,
  type Question,
  type InsertQuestion,
  type UserProgress,
  type InsertUserProgress,
  type QuestionSolved,
  type InsertQuestionSolved,
  type GiftCode,
  type InsertGiftCode,
  users,
  modules,
  pages,
  questions,
  userProgress,
  questionSolved,
  giftCodes,
} from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCubes(userId: string, cubes: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Module operations
  getAllModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<void>;
  deleteModule(id: string): Promise<void>;
  
  // Page operations
  getPagesByModuleId(moduleId: string): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<void>;
  deletePage(id: string): Promise<void>;
  
  // Question operations
  getQuestionsByPageId(pageId: string): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<void>;
  deleteQuestion(id: string): Promise<void>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  markPageComplete(progress: InsertUserProgress): Promise<void>;
  isPageCompleted(userId: string, pageId: string): Promise<boolean>;
  
  // Question solved operations
  getSolvedQuestions(userId: string): Promise<QuestionSolved[]>;
  markQuestionSolved(solved: InsertQuestionSolved): Promise<void>;
  isQuestionSolved(userId: string, questionId: string): Promise<boolean>;
  
  // Gift code operations
  getAllGiftCodes(): Promise<GiftCode[]>;
  getGiftCodeByCode(code: string): Promise<GiftCode | undefined>;
  createGiftCode(giftCode: InsertGiftCode): Promise<GiftCode>;
  updateGiftCode(id: string, giftCode: Partial<InsertGiftCode>): Promise<void>;
  deleteGiftCode(id: string): Promise<void>;
  redeemGiftCode(code: string, userId: string): Promise<GiftCode>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserCubes(userId: string, cubes: number): Promise<void> {
    await db.update(users).set({ cubes }).where(eq(users.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Module operations
  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const result = await db.select().from(modules).where(eq(modules.id, id));
    return result[0];
  }

  async createModule(module: InsertModule): Promise<Module> {
    const result = await db.insert(modules).values(module).returning();
    return result[0];
  }

  async updateModule(id: string, module: Partial<InsertModule>): Promise<void> {
    await db.update(modules).set(module).where(eq(modules.id, id));
  }

  async deleteModule(id: string): Promise<void> {
    await db.delete(modules).where(eq(modules.id, id));
  }

  // Page operations
  async getPagesByModuleId(moduleId: string): Promise<Page[]> {
    return await db.select().from(pages).where(eq(pages.moduleId, moduleId)).orderBy(pages.order);
  }

  async getPage(id: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id));
    return result[0];
  }

  async createPage(page: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<void> {
    await db.update(pages).set(page).where(eq(pages.id, id));
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Question operations
  async getQuestionsByPageId(pageId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.pageId, pageId)).orderBy(questions.order);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    const result = await db.select().from(questions).where(eq(questions.id, id));
    return result[0];
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const result = await db.insert(questions).values(question).returning();
    return result[0];
  }

  async updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<void> {
    await db.update(questions).set(question).where(eq(questions.id, id));
  }

  async deleteQuestion(id: string): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async markPageComplete(progress: InsertUserProgress): Promise<void> {
    await db.insert(userProgress).values(progress);
  }

  async isPageCompleted(userId: string, pageId: string): Promise<boolean> {
    const result = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.pageId, pageId)));
    return result.length > 0;
  }

  // Question solved operations
  async getSolvedQuestions(userId: string): Promise<QuestionSolved[]> {
    return await db.select().from(questionSolved).where(eq(questionSolved.userId, userId));
  }

  async markQuestionSolved(solved: InsertQuestionSolved): Promise<void> {
    await db.insert(questionSolved).values(solved);
  }

  async isQuestionSolved(userId: string, questionId: string): Promise<boolean> {
    const result = await db.select().from(questionSolved)
      .where(and(eq(questionSolved.userId, userId), eq(questionSolved.questionId, questionId)));
    return result.length > 0;
  }

  // Gift code operations
  async getAllGiftCodes(): Promise<GiftCode[]> {
    return await db.select().from(giftCodes).orderBy(desc(giftCodes.active));
  }

  async getGiftCodeByCode(code: string): Promise<GiftCode | undefined> {
    const result = await db.select().from(giftCodes).where(eq(giftCodes.code, code));
    return result[0];
  }

  async createGiftCode(giftCode: InsertGiftCode): Promise<GiftCode> {
    const result = await db.insert(giftCodes).values(giftCode).returning();
    return result[0];
  }

  async updateGiftCode(id: string, giftCode: Partial<InsertGiftCode>): Promise<void> {
    await db.update(giftCodes).set(giftCode).where(eq(giftCodes.id, id));
  }

  async deleteGiftCode(id: string): Promise<void> {
    await db.delete(giftCodes).where(eq(giftCodes.id, id));
  }

  async redeemGiftCode(code: string, userId: string): Promise<GiftCode> {
    const giftCode = await this.getGiftCodeByCode(code);
    if (!giftCode) {
      throw new Error("Gift code not found");
    }
    if (!giftCode.active || giftCode.usedByUserId) {
      throw new Error("Gift code already used or inactive");
    }
    
    await db.update(giftCodes)
      .set({ usedByUserId: userId, usedAt: new Date(), active: false })
      .where(eq(giftCodes.id, giftCode.id));
    
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserCubes(userId, user.cubes + giftCode.value);
    }
    
    return { ...giftCode, usedByUserId: userId, usedAt: new Date(), active: false };
  }
}

export const storage = new DatabaseStorage();
