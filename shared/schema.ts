import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const saveCodes = pgTable("save_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  createdAt: integer("created_at").notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  saveCodeId: integer("save_code_id").references(() => saveCodes.id),
  name: text("name").notNull(),
  age: integer("age").notNull().default(0),
  gender: text("gender").notNull(),
  country: text("country").notNull(),
  talent: text("talent").notNull().default("normal"), // normal, famous
  bankBalance: integer("bank_balance").notNull().default(0),
  happiness: integer("happiness").notNull().default(50),
  health: integer("health").notNull().default(50),
  smarts: integer("smarts").notNull().default(50),
  looks: integer("looks").notNull().default(50),
  fame: integer("fame").notNull().default(0),
  currentJob: text("current_job"),
  jobReputation: integer("job_reputation").default(0),
  salary: integer("salary").default(0),
  workExperience: integer("work_experience").default(0),
  youtubeFollowers: integer("youtube_followers").default(0),
  tiktokFollowers: integer("tiktok_followers").default(0),
  isAlive: boolean("is_alive").notNull().default(true),
  relationships: json("relationships").$type<Record<string, any>>().default({}),
  assets: json("assets").$type<Record<string, any>>().default({}),
  lifeEvents: json("life_events").$type<string[]>().default([]),
  createdAt: integer("created_at").notNull().default(0),
});

export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  minAge: integer("min_age").notNull().default(16),
  minEducation: text("min_education"),
  baseSalary: integer("base_salary").notNull(),
  requirements: json("requirements").$type<Record<string, any>>().default({}),
});

export const lifeEvents = pgTable("life_events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageRange: json("age_range").$type<{min: number, max: number}>(),
  statEffects: json("stat_effects").$type<Record<string, number>>().default({}),
  probability: integer("probability").notNull().default(50),
  requirements: json("requirements").$type<Record<string, any>>().default({}),
});

export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // parent, sibling, spouse, child, friend
  relationship: integer("relationship").notNull().default(50), // 0-100
  age: integer("age"),
  isAlive: boolean("is_alive").notNull().default(true),
});

export const insertSaveCodeSchema = createInsertSchema(saveCodes).omit({
  id: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
});

export const insertCareerSchema = createInsertSchema(careers).omit({
  id: true,
});

export const insertLifeEventSchema = createInsertSchema(lifeEvents).omit({
  id: true,
});

export const insertRelationshipSchema = createInsertSchema(relationships).omit({
  id: true,
});

export type SaveCode = typeof saveCodes.$inferSelect;
export type InsertSaveCode = z.infer<typeof insertSaveCodeSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Career = typeof careers.$inferSelect;
export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type LifeEvent = typeof lifeEvents.$inferSelect;
export type InsertLifeEvent = z.infer<typeof insertLifeEventSchema>;
export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
