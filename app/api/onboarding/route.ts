import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
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
      await prisma.prompt.deleteMany({
        where: { userId: session.user.id }
      });
      
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
    if (photos && photos.length > 0) {
       await prisma.photo.deleteMany({
        where: { userId: session.user.id }
      });
      
      await prisma.photo.createMany({
        data: photos.map((url: string, idx: number) => ({
          userId: session.user.id,
          url: url,
          order: idx,
        }))
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Onboarding Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save profile" },
      { status: 500 }
    );
  }
}
