import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LikesClient from "./client";

const prisma = new PrismaClient();

export default async function LikesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch users who liked the current user
  const likesReceived = await prisma.like.findMany({
    where: {
      toId: session.user.id,
      status: "PENDING"
    },
    include: {
      from: {
        include: {
          photos: {
            orderBy: { order: 'asc' },
            take: 1
          },
          prompts: {
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

  // Simplified format for the frontend
  const formattedLikes = likesReceived.map(like => ({
    likeId: like.id,
    user: like.from
  }));

  return (
    <div className="min-h-[100dvh] bg-black text-white relative">
      <LikesClient initialLikes={formattedLikes} />
    </div>
  );
}
