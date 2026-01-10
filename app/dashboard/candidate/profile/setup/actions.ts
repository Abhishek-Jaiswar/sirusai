"use server";

import { revalidatePath } from "next/cache";
import { profileSchema } from "./form-schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { cloudinary } from "@/lib/cloudinary";

async function uploadToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve({ url: result?.secure_url || "" });
      }
    ).end(buffer);
  });
}

export async function updateCandidateProfile(formData: FormData) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return {
      error: "User not authenticated!",
    };
  }

  // Extract values from FormData
  const values = {
    name: formData.get("name") as string,
    primaryRole: formData.get("primaryRole") as string,
    experienceYears: Number(formData.get("experienceYears")),
    targetLevel: formData.get("targetLevel") as string,
    location: formData.get("location") as string,
    techStack: JSON.parse(formData.get("techStack") as string),
    bio: formData.get("bio") as string,
  };

  const bannerFile = formData.get("banner") as File | null;
  const avatarFile = formData.get("avatar") as File | null;
  const resumeFile = formData.get("resume") as File | null;

  // Validate the data on the server side
  const validatedFields = profileSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { name, primaryRole, experienceYears, targetLevel, location, techStack, bio } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { CandidateProfile: true }
    });

    if (!user) {
      return { error: "User not found in database!" };
    }

    let bannerUrl = user.profileBanner;
    let avatarUrl = user.avatar;
    let resumeUrl = user.CandidateProfile?.resumeUrl;

    // Parallel uploads
    const uploadPromises = [];
    if (bannerFile && bannerFile.size > 0) {
      uploadPromises.push(uploadToCloudinary(bannerFile, "banners").then(res => bannerUrl = res.url));
    }
    if (avatarFile && avatarFile.size > 0) {
      uploadPromises.push(uploadToCloudinary(avatarFile, "avatars").then(res => avatarUrl = res.url));
    }
    if (resumeFile && resumeFile.size > 0) {
      uploadPromises.push(uploadToCloudinary(resumeFile, "resumes").then(res => resumeUrl = res.url));
    }

    await Promise.all(uploadPromises);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        bio,
        profileBanner: bannerUrl,
        avatar: avatarUrl,
        CandidateProfile: {
          upsert: {
            create: {
              primaryRole,
              experienceYears,
              targetLevel: targetLevel as any,
              location,
              techStack,
              resumeUrl,
            },
            update: {
              primaryRole,
              experienceYears,
              targetLevel: targetLevel as any,
              location,
              techStack,
              resumeUrl,
            },
          },
        },
      },
    });

    revalidatePath("/dashboard/candidate/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Database or Upload error:", error);
    return { error: "Something went wrong!" };
  }
}
