import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  primaryRole: z.string().min(2, "Primary role is required"),
  experienceYears: z.number().min(0, "Experience cannot be negative"),
  targetLevel: z.enum(["Junior", "Mid", "Senior", "Lead"]),
  location: z.string().min(2, "Location is required"),
  techStack: z.array(z.string()).min(1, "At least one skill is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export interface ProfileFormValues {
  name: string;
  primaryRole: string;
  experienceYears: number;
  targetLevel: "Junior" | "Mid" | "Senior" | "Lead";
  location: string;
  techStack: string[];
  bio?: string;
}
