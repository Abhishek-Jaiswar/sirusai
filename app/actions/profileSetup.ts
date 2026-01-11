'use server'

import { db } from "@/db";
import { users, candidateProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export default async function checkProfileSetup() {
  const { userId } = await auth();
  
  if (!userId) return { needsProfile: false };

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    with: {
      candidateProfile: true,
    },
  });

  if (!user) return { needsProfile: true };

  if (!user.candidateProfile) {
    return { needsProfile: true };
  }

  return {
    needsProfile: false,
    profile: user.candidateProfile,
  };
}
