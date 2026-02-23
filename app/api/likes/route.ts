import { auth } from "@/lib/auth";
import { PrismaClient, LikeStatus } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendEmail, getNewLikeTemplate, getNewMatchTemplate } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { toId, status } = body;

    if (!toId || !status || !["MATCHED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // --- DAILY LIMIT CHECK ---
    if (status === "MATCHED") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const likesToday = await prisma.like.count({
        where: {
          fromId: session.user.id,
          status: "MATCHED",
          createdAt: {
            gte: startOfDay
          }
        }
      });

      if (likesToday >= 10) {
        return NextResponse.json(
          { error: "You've reached your 10 like limit for today. Come back tomorrow!" }, 
          { status: 429 }
        );
      }
    }
    // -------------------------

    // 1. Check if the other person already liked the current user
    const existingLikeFromOther = await prisma.like.findUnique({
      where: {
        fromId_toId: {
          fromId: toId,
          toId: session.user.id
        }
      }
    });

    // 2. Record the current user's action
    await prisma.like.upsert({
      where: {
        fromId_toId: {
          fromId: session.user.id,
          toId: toId
        }
      },
      update: {
        status: status as LikeStatus
      },
      create: {
        fromId: session.user.id,
        toId: toId,
        status: status as LikeStatus
      }
    });

    // Send "New Like" email if this is a fresh PENDING like directed at them
    if (status === "PENDING" && !existingLikeFromOther) {
      const recipient = await prisma.user.findUnique({ where: { id: toId }, select: { email: true } });
      if (recipient?.email) {
        // We don't await this so it doesn't block the API response
        sendEmail({
          to: recipient.email,
          subject: "Someone likes you on Vmatch! 👀",
          html: getNewLikeTemplate(session.user.name.split(" ")[0]),
        }).catch(console.error);
      }
    }

    // 3. If mutual match, create Match record
    let isMutualMatch = false;
    // A mutual match occurs if the current user likes the other user, AND the other user has previously liked the current user.
    // The existingLikeFromOther record will only exist if the other user has already taken an action (liked or rejected).
    // If existingLikeFromOther is null, it means the other user has not yet acted on the current user's profile.
    if (status === "MATCHED" && existingLikeFromOther?.status === "MATCHED") {
      isMutualMatch = true;
      
      // Ensure we don't create duplicate Match records (order IDs alphabetically to be safe)
      const user1Id = session.user.id < toId ? session.user.id : toId;
      const user2Id = session.user.id < toId ? toId : session.user.id;

      await prisma.match.upsert({
        where: {
          user1Id_user2Id: {
            user1Id,
            user2Id
          }
        },
        update: {},
        create: {
          user1Id,
          user2Id
        }
      });
      
      // Trigger Email Notification for Mutual Match
      const likedUser = await prisma.user.findUnique({ where: { id: toId }, select: { email: true, name: true } });
      const currentUserEmail = session.user.email; // We know session has email

      if (likedUser?.email) {
        // Email the person who was just matched with
        sendEmail({
          to: likedUser.email,
          subject: "You have a new Match on Vmatch! 🎉",
          html: getNewMatchTemplate(session.user.name.split(" ")[0]),
        }).catch(console.error);
      }
      
      if (currentUserEmail) {
        // Email the current swiper
        sendEmail({
           to: currentUserEmail,
           subject: "You have a new Match on Vmatch! 🎉",
           html: getNewMatchTemplate(likedUser?.name?.split(" ")[0] || "Someone"),
        }).catch(console.error)
      }
    }

    return NextResponse.json({ success: true, isMutualMatch });

  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
