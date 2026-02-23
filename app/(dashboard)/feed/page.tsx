import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FeedClient from "./client";

const prisma = new PrismaClient();

export default async function FeedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      id: true, 
      gender: true, 
      interestedIn: true, 
      age: true,
      isComplete: true 
    }
  });

  if (!currentUser?.isComplete) {
    redirect("/onboarding");
  }

  // Determine who to show based on preferences
  const genderFilter = currentUser.interestedIn === "EVERYONE" 
    ? undefined 
    : { gender: currentUser.interestedIn };

  const currentAge = currentUser.age || 20;
  const ageFilter = {
    age: {
      gte: Math.max(18, currentAge - 4),
      lte: currentAge + 4
    }
  };

  // Fetch users that the current user hasn't liked or rejected yet
  const potentialMatches = await prisma.user.findMany({
    where: {
      isComplete: true,
      id: { not: currentUser.id }, // Don't show themselves
      ...genderFilter,
      ...ageFilter,
      // Filter out people they have already liked/passed
      likesReceived: {
        none: {
          fromId: currentUser.id
        }
      }
    },
    include: {
      prompts: {
        orderBy: { order: 'asc' }
      },
      photos: {
        orderBy: { order: 'asc' }
      }
    },
    take: 10 // Batch size
  });

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FeedClient initialProfiles={potentialMatches} />
    </div>
  );
}
