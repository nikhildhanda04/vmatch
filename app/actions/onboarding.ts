"use server";

import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { Gender, InterestedIn } from "@prisma/client";

const prisma = new PrismaClient();

export interface OnboardingData {
  gender: Gender;
  interestedIn: InterestedIn;
  branch: string;
  year: string;
  isHosteler: boolean | null;
  age: number;
  hometown: string;
  height: number;
  prompts: { question: string; answer: string }[];
  photos: string[];
}

export async function submitOnboarding(data: OnboardingData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const { gender, interestedIn, branch, year, isHosteler, age, hometown, height, prompts, photos } = data;

    // Update User Profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gender,
        interestedIn,
        branch,
        year,
        isHosteler,
        age,
        hometown,
        height,
        isComplete: true,
      },
    });

    // Handle Prompts
    if (prompts && prompts.length > 0) {
      // Clear existing prompts
      await prisma.prompt.deleteMany({
        where: { userId: session.user.id }
      });
      
      // Create new prompts
      await prisma.prompt.createMany({
        data: prompts.map((p: { question: string; answer: string }, idx: number) => ({
          userId: session.user.id,
          question: p.question,
          answer: p.answer,
          order: idx,
        }))
      });
    }

    // Handle Photos
    // In a real app, you would upload the base64 string `data.photos` to S3 or UploadThing here
    // and store the returned URLs in Prisma. We will just store the base64 strings directly for the MVP.
    if (photos && photos.length > 0) {
       await prisma.photo.deleteMany({
        where: { userId: session.user.id }
      });
      
      await prisma.photo.createMany({
        data: photos.map((url: string, idx: number) => ({
          userId: session.user.id,
          url: url, // Storing base64 directly for now
          order: idx,
        }))
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save profile" };
  }
}
