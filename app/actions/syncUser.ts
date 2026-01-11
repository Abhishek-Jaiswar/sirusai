"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncCurrentUserToDb() {
  const { userId } = await auth();
  if (!userId) return null;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (existingUser) return existingUser;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const user = await db.insert(users).values({
    id: clerkUser.id, // Using clerk ID as internal ID or generate one
    clerkId: clerkUser.id,
    email: primaryEmail ?? "",
    name: clerkUser.fullName ?? "",
  }).returning();

  revalidatePath("/");
  return user[0];
}
