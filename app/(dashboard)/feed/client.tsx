"use client";

import { useState } from "react";
import { User as PrismaUser } from "@prisma/client";
import { MapPin, GraduationCap, Building, Star, X, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Extending the generic User type to include our relational data 
type Prompt = { question: string; answer: string; order: number };
type Photo = { url: string; order: number };

type FeedUser = PrismaUser & {
  prompts: Prompt[];
  photos: Photo[];
};

interface FeedClientProps {
  initialProfiles: FeedUser[];
  currentUser: {
    id: string;
    gender: string | null;
    interestedIn: string | null;
    isComplete: boolean;
  };
}

export default function FeedClient({ initialProfiles, currentUser }: FeedClientProps) {
  const [profiles, setProfiles] = useState<FeedUser[]>(initialProfiles);
  const [loadingAction, setLoadingAction] = useState<"LIKE" | "PASS" | null>(null);

  const activeProfile = profiles[0];

  const formatHeight = (inches: number | null) => {
    if (!inches) return null;
    const ft = Math.floor(inches / 12);
    const inc = inches % 12;
    return `${ft}'${inc}"`;
  };

  const handleAction = async (action: "MATCHED" | "REJECTED") => {
    if (!activeProfile || loadingAction) return;
    
    setLoadingAction(action === "MATCHED" ? "LIKE" : "PASS");

    try {
      // API call to record the Like/Pass
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toId: activeProfile.id,
          status: action,
        }),
      });

      if (!res.ok) throw new Error("Failed to action");

      // Animate out the profile
      setProfiles((prev) => prev.slice(1));
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong with that swipe.");
    } finally {
      setLoadingAction(null);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-4">
          <Star className="w-10 h-10 text-orange-500 opacity-50" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">You've caught up!</h2>
        <p className="text-neutral-400 max-w-sm">
          There are no more new profiles in your queue matching your preferences right now. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Top Mobile Header (Optional, since we have bottom nav, but good for branding) */}
      <header className="md:hidden flex h-16 items-center justify-center shrink-0">
        <span className="font-bold text-xl tracking-tight text-white/90 drop-shadow-md">Vmatch.</span>
      </header>

      {/* Profile Stack */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        <AnimatePresence>
          {activeProfile && (
            <motion.div
              key={activeProfile.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ 
                x: loadingAction === "LIKE" ? 300 : -300,
                opacity: 0,
                rotate: loadingAction === "LIKE" ? 15 : -15 
              }}
              className="absolute inset-0 h-full w-full overflow-y-auto pb-32 no-scrollbar"
            >
              <div className="p-4 md:pt-8 space-y-4">
                
                {/* Main Photo Card (Index 0) */}
                {activeProfile.photos[0] && (
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <img 
                      src={activeProfile.photos[0].url} 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`${activeProfile.name}'s photo`}
                    />
                    
                    {/* Profile Details Overlay on Main Photo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32 pb-6 px-6 z-20">
                      <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-end gap-3 drop-shadow-lg">
                        {activeProfile.name.split(" ")[0]}, {activeProfile.age || 18}
                        <CheckCircle2 className="w-6 h-6 text-orange-500 mb-1.5" />
                      </h3>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="space-y-2 text-white/90 font-medium">
                          {activeProfile.hometown && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-orange-400" />
                              {activeProfile.hometown}
                            </div>
                          )}
                          {(activeProfile.branch || activeProfile.year) && (
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="w-4 h-4 text-orange-400" />
                              {activeProfile.branch} '{activeProfile.year?.slice(2)}
                            </div>
                          )}
                          {activeProfile.isHosteler !== null && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-4 h-4 text-orange-400" />
                              {activeProfile.isHosteler ? "Hosteler" : "Day Scholar"}
                            </div>
                          )}
                        </div>
                        {activeProfile.height && (
                          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-sm font-bold border border-white/10 flex items-center gap-1 shadow-lg">
                            📏 {formatHeight(activeProfile.height)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Iterate remaining photos and interleave prompts */}
                {activeProfile.photos.slice(1).map((photo, index) => (
                  <div key={photo.url} className="space-y-4">
                    
                    {/* Interleave Prompt */}
                    {activeProfile.prompts[index] && (
                      <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 shadow-inner">
                        <h4 className="text-sm font-bold text-orange-400/90 mb-3 tracking-wide uppercase">{activeProfile.prompts[index].question}</h4>
                        <p className="text-3xl font-serif text-white leading-tight">"{activeProfile.prompts[index].answer}"</p>
                      </div>
                    )}
                    
                    {/* Next Photo Card */}
                    <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                      <img 
                        src={photo.url} 
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={`Photo ${index + 2}`}
                      />
                    </div>
                  </div>
                ))}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons */}
      {activeProfile && (
        <div className="absolute bottom-8 inset-x-0 z-50 flex justify-center items-center gap-6 px-6 pointer-events-none">
          <button
            onClick={() => handleAction("REJECTED")}
            disabled={loadingAction !== null}
            className="pointer-events-auto w-16 h-16 rounded-full bg-neutral-900 border-2 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center group hover:bg-neutral-800 hover:border-neutral-700 transition-all disabled:opacity-50 hover:-translate-y-1"
          >
            <X className="w-8 h-8 text-neutral-400 group-hover:text-red-400 transition-colors" />
          </button>

          <button
            onClick={() => handleAction("MATCHED")}
            disabled={loadingAction !== null}
            className="pointer-events-auto w-20 h-20 rounded-full bg-orange-500 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.6)] flex items-center justify-center group hover:bg-orange-400 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Check className="w-10 h-10 text-white group-hover:drop-shadow-lg" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Blur Gradient behind buttons */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30 rounded-b-[2rem]" />
    </div>
  );
}
