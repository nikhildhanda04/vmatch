import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  // If the user hasn't completed their profile, push them to onboarding
  if (!dbUser?.isComplete) {
    redirect("/onboarding");
  }

  // Otherwise, to the feed
  redirect("/feed");
}
