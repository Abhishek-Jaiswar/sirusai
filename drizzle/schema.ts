import { pgTable, index, foreignKey, unique, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const candidateLevel = pgEnum("candidate_level", ['Junior', 'Mid', 'Senior', 'Lead'])
export const userRole = pgEnum("user_role", ['CANDIDATE', 'RECRUITER', 'ADMIN'])


export const candidateProfiles = pgTable("candidate_profiles", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	primaryRole: text("primary_role").notNull(),
	experienceYears: integer("experience_years").notNull(),
	techStack: text("tech_stack").array().notNull(),
	targetLevel: candidateLevel("target_level").default('Mid').notNull(),
	location: text(),
	resumeUrl: text("resume_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("location_idx").using("btree", table.location.asc().nullsLast().op("text_ops")),
	index("primary_role_idx").using("btree", table.primaryRole.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "candidate_profiles_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("candidate_profiles_user_id_unique").on(table.userId),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	clerkId: text("clerk_id").notNull(),
	email: text().notNull(),
	name: text(),
	role: userRole().default('CANDIDATE').notNull(),
	avatar: text(),
	profileBanner: text("profile_banner"),
	bio: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_clerk_id_unique").on(table.clerkId),
	unique("users_email_unique").on(table.email),
]);
