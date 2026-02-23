"use client";

import { useState } from "react";
import { User, Photo, Prompt } from "@prisma/client";
import { X, Check } from "lucide-react";
import Image from "next/image";

type LikeUser = User & {
  photos: Photo[];
  prompts: Prompt[];
};

type FormattedLike = {
  likeId: string;
  user: LikeUser;
};

export default function LikesClient({ initialLikes }: { initialLikes: FormattedLike[] }) {
  const [likes, setLikes] = useState<FormattedLike[]>(initialLikes);

  const handleAction = async (likeId: string, action: "MATCHED" | "REJECTED") => {
    try {
      // Optimistically remove from grid
      setLikes((prev) => prev.filter((l) => l.likeId !== likeId));
      
      const res = await fetch("/api/likes/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likeId, status: action }),
      });

      if (!res.ok) throw new Error("Failed to respond to like");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
          <span className="text-4xl filter grayscale opacity-50">👀</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">No new likes yet.</h2>
        <p className="text-neutral-400 max-w-sm">
          Keep swiping and make sure your profile is standing out! The right ones will find you.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-16 md:pt-8 min-h-[100dvh] pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Likes You</h1>
        <p className="text-neutral-400">{likes.length} people are interested in you. Make a move!</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {likes.map(({ likeId, user }) => (
          <div key={likeId} className="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg flex flex-col justify-end">
            
            {user.photos[0] ? (
              // Using img for now to match the payload sizes without setup, but Image from next/image is better
              <img 
                src={user.photos[0].url} 
                alt={`${user.name}`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pb-16" 
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                <span className="text-neutral-600">No Photo</span>
              </div>
            )}

            {/* Content overlay */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-md">
                {user.name.split(" ")[0]}, {user.age || "?"}
              </h3>
              {user.branch && (
                <p className="text-xs text-white/80 line-clamp-1">{user.branch}</p>
              )}
            </div>

            {/* Quick Action Buttons (Always visible on mobile, hover on desktop) */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 transition-opacity z-20">
               <button
                onClick={(e) => { e.stopPropagation(); handleAction(likeId, "MATCHED"); }}
                className="w-10 h-10 rounded-full bg-orange-500 shadow-[0_5px_15px_-5px_rgba(249,115,22,0.6)] flex items-center justify-center hover:scale-110 hover:bg-orange-400 transition-all"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(likeId, "REJECTED"); }}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-neutral-800 hover:scale-110 transition-all"
              >
                <X className="w-5 h-5 text-neutral-400 hover:text-red-400" strokeWidth={2.5} />
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
