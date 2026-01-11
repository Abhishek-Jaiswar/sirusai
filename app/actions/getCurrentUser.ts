import { db } from "@/db";
import { users, candidateProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const getCurrentUserData = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        candidateProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
