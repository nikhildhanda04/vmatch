import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DMsClient from "./client";

const prisma = new PrismaClient();

export default async function DMsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch all matches where current user is user1 or user2
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: session.user.id },
        { user2Id: session.user.id }
      ]
    },
    include: {
      user1: {
        include: {
          photos: {
            orderBy: { order: 'asc' },
            take: 1
          }
        }
      },
      user2: {
        include: {
          photos: {
            orderBy: { order: 'asc' },
            take: 1
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Simplify data for the client: Map to the "other" user
  const formattedMatches = matches.map(m => {
    const isUser1 = m.user1Id === session.user.id;
    const otherUser = isUser1 ? m.user2 : m.user1;
    
    return {
      matchId: m.id,
      user: otherUser,
      createdAt: m.createdAt
    };
  });

  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 pt-16 md:pt-8 relative">
      <DMsClient matches={formattedMatches} />
    </div>
  );
}
