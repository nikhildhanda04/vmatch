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

  // Fetch users that the current user hasn't liked or rejected yet, and isn't already matched with
  const potentialMatches = await prisma.user.findMany({
    where: {
      isComplete: true,
      id: { not: currentUser.id }, // Don't show themselves
      ...genderFilter,
      ...ageFilter,
      // Filter out people they have already liked/passed or matched with
      AND: [
        {
          // Don't show people the current user has already acted upon (liked or rejected)
          likesReceived: {
            none: {
              fromId: currentUser.id
            }
          }
        },
        {
           // Don't show people who have matched with the current user via another flow (just in case)
           matches1: {
             none: { user2Id: currentUser.id }
           }
        },
        {
           matches2: {
             none: { user1Id: currentUser.id }
           }
        }
      ]
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
