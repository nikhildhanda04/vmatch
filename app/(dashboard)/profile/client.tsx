"use client";

import { useState } from "react";
import { User, Photo, Prompt } from "@prisma/client";
import { LogOut, Settings, Edit3, Camera } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type FullUser = User & {
  photos: Photo[];
  prompts: Prompt[];
};

export default function ProfileClient({ user }: { user: FullUser }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
    } catch {
      alert("Failed to sign out");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
        <button 
          className="p-2 bg-neutral-900 border border-white/10 rounded-full hover:bg-neutral-800 transition-colors"
          onClick={() => alert("Settings coming soon")}
        >
          <Settings className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Main Profile Preview Card */}
      <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 group">
        {user.photos[0] ? (
          <img 
            src={user.photos[0].url} 
            className="absolute inset-0 w-full h-full object-cover shadow-[inset_0_-100px_40px_-5px_rgba(0,0,0,0.8)]"
            alt="Main photo"
          />
        ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800">
             <Camera className="w-12 h-12 text-neutral-600 mb-2" />
             <span className="text-neutral-500 font-medium">Add a photo</span>
           </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32 pb-8 px-6 z-20">
          <div className="flex justify-between items-end">
             <div>
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-end gap-3 drop-shadow-md">
                  {user.name.split(" ")[0]}, {user.age || "?"}
                </h2>
                <p className="text-neutral-300 font-medium mt-1">
                  {user.branch} {user.year ? `'${user.year.slice(2)}` : ""}
                </p>
             </div>
             
             <button className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/30 transition-colors shadow-lg">
                <Edit3 className="w-5 h-5 text-white" />
             </button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <button className="w-full bg-neutral-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
               <Camera className="w-5 h-5 text-orange-500" />
             </div>
             <div className="text-left">
               <h3 className="font-semibold text-white">Edit Photos</h3>
               <p className="text-xs text-neutral-400">Add or rearrange your lineup</p>
             </div>
           </div>
           <Edit3 className="w-4 h-4 text-neutral-500" />
        </button>

        <button className="w-full bg-neutral-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
               <span className="text-xl">✍️</span>
             </div>
             <div className="text-left">
               <h3 className="font-semibold text-white">Update Prompts</h3>
               <p className="text-xs text-neutral-400">Change your answers</p>
             </div>
           </div>
           <Edit3 className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="mt-12">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-950/30 border border-red-900/50 text-red-500 rounded-2xl p-4 font-semibold hover:bg-red-950/50 transition-colors flex justify-center items-center gap-2"
        >
          {isLoggingOut ? (
             <div className="w-5 h-5 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              Sign Out
            </>
          )}
        </button>
      </div>
    </div>
  );
}
