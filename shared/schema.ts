import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  cubes: integer("cubes").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  cubes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  cubeCost: integer("cube_cost").notNull().default(0),
  isSpecial: boolean("is_special").notNull().default(false),
  imageUrl: text("image_url"),
  createdByAdminId: varchar("created_by_admin_id"),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  image: text("image"),
  order: integer("order").notNull(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull(),
  text: text("text").notNull(),
  answerHash: text("answer_hash").notNull(),
  cubeReward: integer("cube_reward").notNull().default(0),
  order: integer("order").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pageId: varchar("page_id").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export const questionSolved = pgTable("question_solved", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questionId: varchar("question_id").notNull(),
  solvedAt: timestamp("solved_at").notNull().default(sql`now()`),
});

export const insertQuestionSolvedSchema = createInsertSchema(questionSolved).omit({
  id: true,
  solvedAt: true,
});

export type InsertQuestionSolved = z.infer<typeof insertQuestionSolvedSchema>;
export type QuestionSolved = typeof questionSolved.$inferSelect;

export const giftCodes = pgTable("gift_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  value: integer("value").notNull(),
  active: boolean("active").notNull().default(true),
  usedByUserId: varchar("used_by_user_id"),
  usedAt: timestamp("used_at"),
});

export const insertGiftCodeSchema = createInsertSchema(giftCodes).omit({
  id: true,
  usedByUserId: true,
  usedAt: true,
});

export type InsertGiftCode = z.infer<typeof insertGiftCodeSchema>;
export type GiftCode = typeof giftCodes.$inferSelect;
