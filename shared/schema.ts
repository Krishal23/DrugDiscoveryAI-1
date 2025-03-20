import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role"),
});

export const targets = pgTable("targets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  uniprotId: text("uniprot_id"),
  geneName: text("gene_name"),
  confidence: integer("confidence"),
  druggabilityScore: integer("druggability_score"),
  molecularWeight: text("molecular_weight"),
  subcellularLocation: text("subcellular_location"),
  publicationCount: integer("publication_count"),
  pathwayCount: integer("pathway_count"),
  existingDrugCount: integer("existing_drug_count"),
  evidenceSummary: text("evidence_summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const drugs = pgTable("drugs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  smiles: text("smiles").notNull(), // Simplified molecular-input line-entry system
  targetId: integer("target_id"),
  status: text("status"), // e.g., "generated", "optimized", "lead"
  properties: jsonb("properties"), // Store molecular properties
  createdAt: timestamp("created_at").defaultNow(),
});

export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  drugId: integer("drug_id"),
  targetId: integer("target_id"),
  score: integer("score"), // Interaction score
  confidence: integer("confidence"),
  predictionMethod: text("prediction_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admetPredictions = pgTable("admet_predictions", {
  id: serial("id").primaryKey(),
  drugId: integer("drug_id"),
  absorption: integer("absorption"),
  distribution: integer("distribution"),
  metabolism: integer("metabolism"),
  excretion: integer("excretion"),
  toxicity: integer("toxicity"),
  overallScore: integer("overall_score"),
  predictionMethod: text("prediction_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  description: text("description").notNull(),
  activityType: text("activity_type").notNull(), // e.g., "target_identification", "drug_generation"
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

export const insertTargetSchema = createInsertSchema(targets).omit({
  id: true,
  createdAt: true,
});

export const insertDrugSchema = createInsertSchema(drugs).omit({
  id: true,
  createdAt: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  createdAt: true,
});

export const insertAdmetPredictionSchema = createInsertSchema(admetPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTarget = z.infer<typeof insertTargetSchema>;
export type Target = typeof targets.$inferSelect;

export type InsertDrug = z.infer<typeof insertDrugSchema>;
export type Drug = typeof drugs.$inferSelect;

export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Interaction = typeof interactions.$inferSelect;

export type InsertAdmetPrediction = z.infer<typeof insertAdmetPredictionSchema>;
export type AdmetPrediction = typeof admetPredictions.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
