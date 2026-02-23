import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatClient from "./client";

const prisma = new PrismaClient();

export default async function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  // Verify match exists and user is part of it
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [
        { user1Id: session.user.id },
        { user2Id: session.user.id }
      ]
    },
    include: {
      user1: { include: { photos: { orderBy: { order: 'asc' }, take: 1 } } },
      user2: { include: { photos: { orderBy: { order: 'asc' }, take: 1 } } }
    }
  });

  if (!match) {
    redirect("/dms");
  }

  // Determine who the "other" user is
  const isUser1 = match.user1Id === session.user.id;
  const otherUser = isUser1 ? match.user2 : match.user1;
  const currentUser = isUser1 ? match.user1 : match.user2;

  const formattedOtherUser = {
    id: otherUser.id,
    name: otherUser.name,
    photoUrl: otherUser.photos[0]?.url || ""
  };

  const formattedCurrentUser = {
    id: currentUser.id,
    name: currentUser.name,
    photoUrl: currentUser.photos[0]?.url || ""
  };

  return (
    <div className="h-[100dvh] bg-black text-white relative">
      <ChatClient 
        matchId={match.id} 
        otherUser={formattedOtherUser} 
        currentUser={formattedCurrentUser} 
      />
    </div>
  );
}
