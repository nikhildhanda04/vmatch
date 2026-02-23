import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fetch Messages for a specific Match
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
    }

    // Verify user is part of the match
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match || (match.user1Id !== session.user.id && match.user2Id !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: "asc" },
      take: 100 // Limit for MVP
    });

    return NextResponse.json({ messages });

  } catch (error) {
    console.error("Messages API Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Send a Message
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { matchId, text } = body;

    if (!matchId || !text || !text.trim()) {
      return NextResponse.json({ error: "Match ID and text are required" }, { status: 400 });
    }

    // Verify user is part of the match
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match || (match.user1Id !== session.user.id && match.user2Id !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        matchId,
        senderId: session.user.id,
        text: text.trim()
      }
    });

    return NextResponse.json({ success: true, message: newMessage });

  } catch (error) {
    console.error("Messages API Send Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
