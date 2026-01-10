'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function checkProfileSetup() {
  const { userId } = await auth();
  
  if (!userId) return { needsProfile: false };

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      CandidateProfile: true,
    },
  });

  if (!user) return { needsProfile: true };

  if (!user.CandidateProfile) {
    return { needsProfile: true };
  }

  return {
    needsProfile: false,
    profile: user.CandidateProfile,
  };
}
