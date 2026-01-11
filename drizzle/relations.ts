import { relations } from "drizzle-orm/relations";
import { users, candidateProfiles } from "./schema";

export const candidateProfilesRelations = relations(candidateProfiles, ({one}) => ({
	user: one(users, {
		fields: [candidateProfiles.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	candidateProfiles: many(candidateProfiles),
}));