import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getCurrentUserData = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        CandidateProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
