"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncCurrentUserToDb() {
  const { userId } = await auth();
  if (!userId) return null;

  const existingUser = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const user = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: primaryEmail ?? "",
      name: clerkUser.fullName ?? "",
    },
  });

  revalidatePath("/");
  return user;
}
