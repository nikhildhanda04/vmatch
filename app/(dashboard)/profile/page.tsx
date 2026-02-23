import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./client";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch full user data to allow editing
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      photos: { orderBy: { order: 'asc' } },
      prompts: { orderBy: { order: 'asc' } }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white relative flex justify-center">
      <div className="w-full max-w-2xl px-4 pt-16 md:pt-8 pb-32">
        <ProfileClient user={user} />
      </div>
    </div>
  );
}
