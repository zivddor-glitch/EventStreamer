import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  event_date: timestamp("event_date").notNull(),
  status: text("status").notNull().default("draft"), // 'published' or 'draft'
  created_at: timestamp("created_at").notNull().default(sql`now()`),
  updated_at: timestamp("updated_at").notNull().default(sql`now()`),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  event_id: uuid("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  level: text("level").notNull(),
});

export const riders = pgTable("riders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const horses = pgTable("horses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const pairs = pgTable("pairs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  rider_id: uuid("rider_id").notNull().references(() => riders.id),
  horse_id: uuid("horse_id").notNull().references(() => horses.id),
});

export const results = pgTable("results", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  event_id: uuid("event_id").notNull().references(() => events.id),
  class_id: uuid("class_id").notNull().references(() => classes.id),
  pair_id: uuid("pair_id").notNull().references(() => pairs.id),
  final_score_pct: decimal("final_score_pct", { precision: 5, scale: 2 }).notNull(),
  eligible: boolean("eligible").notNull().default(true),
});

export const user_profiles = pgTable("user_profiles", {
  user_id: uuid("user_id").primaryKey(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  email: text("email").notNull(),
  created_at: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
});

export const insertRiderSchema = createInsertSchema(riders).omit({
  id: true,
});

export const insertHorseSchema = createInsertSchema(horses).omit({
  id: true,
});

export const insertPairSchema = createInsertSchema(pairs).omit({
  id: true,
});

export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
});

export const insertUserProfileSchema = createInsertSchema(user_profiles);

// Types
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

export type InsertRider = z.infer<typeof insertRiderSchema>;
export type Rider = typeof riders.$inferSelect;

export type InsertHorse = z.infer<typeof insertHorseSchema>;
export type Horse = typeof horses.$inferSelect;

export type InsertPair = z.infer<typeof insertPairSchema>;
export type Pair = typeof pairs.$inferSelect;

export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof results.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof user_profiles.$inferSelect;
