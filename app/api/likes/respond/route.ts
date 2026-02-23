import { auth } from "@/lib/auth";
import { PrismaClient, LikeStatus } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendEmail, getNewMatchTemplate } from "@/lib/email";

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
    const { likeId, status } = body;

    if (!likeId || !status || !["MATCHED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // 1. Check if the like exists and the current user is the intended recipient
    const existingLike = await prisma.like.findUnique({
      where: {
        id: likeId
      }
    });

    if (!existingLike || existingLike.toId !== session.user.id) {
      return NextResponse.json({ error: "Like not found or unauthorized" }, { status: 404 });
    }

    if (existingLike.status !== "PENDING") {
      return NextResponse.json({ error: "Like has already been responded to" }, { status: 400 });
    }

    // 2. Update the Like status
    await prisma.like.update({
      where: {
        id: likeId
      },
      data: {
        status: status as LikeStatus
      }
    });

    // 3. If Match, create Match record
    let isMutualMatch = false;

    if (status === "MATCHED") {
      isMutualMatch = true;

      // Create a unified match record using both user IDs for uniqueness and querying
      const user1Id = session.user.id < existingLike.fromId ? session.user.id : existingLike.fromId;
      const user2Id = session.user.id < existingLike.fromId ? existingLike.fromId : session.user.id;

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
      
      // Also optionally mark a reciprocating like if the current user also liked them manually recently (optional, ensures clean state)
      await prisma.like.upsert({
         where: {
            fromId_toId: {
              fromId: session.user.id,
              toId: existingLike.fromId
            }
         },
         update: {
             status: "MATCHED"
         },
         create: {
             fromId: session.user.id,
             toId: existingLike.fromId,
             status: "MATCHED"
         }
      })

      // Trigger Email Notification for Mutual Match (Accepted from Likes Tab)
      const likedUser = await prisma.user.findUnique({ where: { id: existingLike.fromId }, select: { email: true, name: true } });
      const currentUserEmail = session.user.email; 

      if (likedUser?.email) {
        // Email the person whose like was just accepted
        sendEmail({
          to: likedUser.email,
          subject: "You have a new Match on Vmatch! 🎉",
          html: getNewMatchTemplate(session.user.name.split(" ")[0]),
        }).catch(console.error);
      }
      
      if (currentUserEmail) {
        // Email the current user who just accepted the like
        sendEmail({
           to: currentUserEmail,
           subject: "You have a new Match on Vmatch! 🎉",
           html: getNewMatchTemplate(likedUser?.name?.split(" ")[0] || "Someone"),
        }).catch(console.error)
      }
    }

    return NextResponse.json({ success: true, isMutualMatch });

  } catch (error) {
    console.error("Like Respond API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
