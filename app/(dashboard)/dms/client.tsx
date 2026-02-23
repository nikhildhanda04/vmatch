"use client";

import Link from "next/link";
import { User, Photo } from "@prisma/client";

type MatchUser = User & {
  photos: Photo[];
};

type FormattedMatch = {
  matchId: string;
  user: MatchUser;
  createdAt: Date;
};

export default function DMsClient({ matches }: { matches: FormattedMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
          <span className="text-4xl opacity-50">💌</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Your inbox is empty</h2>
        <p className="text-neutral-400 max-w-sm">
          Once you match with someone, you'll be able to chat with them here. Go like some profiles!
        </p>
        <Link 
          href="/feed"
          className="mt-6 bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
        >
          Go to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Messages</h1>
        <p className="text-neutral-400">You have {matches.length} matches.</p>
      </div>

      {/* New Matches Queue (Horizontal Scroll) */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">New Matches</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {matches.map(({ matchId, user }) => (
            <Link key={`new-${matchId}`} href={`/dms/${matchId}`} className="shrink-0 flex flex-col items-center gap-2 group w-20">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-orange-500/50 group-hover:border-orange-500 overflow-hidden relative shadow-lg transition-colors p-[2px]">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
                  {user.photos[0] ? (
                    <img src={user.photos[0].url} alt={user.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">No Pic</div>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-white/80 truncate w-full text-center">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Conversations List (Vertical) */}
      <div>
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Conversations</h2>
        <div className="space-y-2">
          {matches.map(({ matchId, user }) => (
            <Link 
              key={`conv-${matchId}`} 
              href={`/dms/${matchId}`}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-neutral-900 overflow-hidden relative shrink-0">
                {user.photos[0] ? (
                  <img src={user.photos[0].url} alt={user.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">No Pic</div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">{user.name}</h3>
                  <span className="text-xs text-neutral-500 shrink-0">New</span>
                </div>
                <p className="text-sm text-neutral-400 truncate group-hover:text-white/80 transition-colors">
                  Tap to start chatting!
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
