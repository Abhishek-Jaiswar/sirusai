import { pgTable, text, timestamp, integer, uuid, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["CANDIDATE", "RECRUITER", "ADMIN"]);
export const candidateLevelEnum = pgEnum("candidate_level", ["Junior", "Mid", "Senior", "Lead"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text to match cuid/cuid2 if needed, or uuid()
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: userRoleEnum("role").default("CANDIDATE").notNull(),
  avatar: text("avatar"),
  profileBanner: text("profile_banner"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const candidateProfiles = pgTable("candidate_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  primaryRole: text("primary_role").notNull(),
  experienceYears: integer("experience_years").notNull(),
  techStack: text("tech_stack").array().notNull(), // PostgreSQL text array
  targetLevel: candidateLevelEnum("target_level").default("Mid").notNull(),
  location: text("location"),
  resumeUrl: text("resume_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    primaryRoleIdx: index("primary_role_idx").on(table.primaryRole),
    locationIdx: index("location_idx").on(table.location),
  };
});

export const usersRelations = relations(users, ({ one }) => ({
  candidateProfile: one(candidateProfiles, {
    fields: [users.id],
    references: [candidateProfiles.userId],
  }),
}));

export const candidateProfilesRelations = relations(candidateProfiles, ({ one }) => ({
  user: one(users, {
    fields: [candidateProfiles.userId],
    references: [users.id],
  }),
}));
