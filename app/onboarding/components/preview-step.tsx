"use client";

import { CheckCircle2, MapPin, GraduationCap, Building } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

interface PreviewStepProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
}

export default function PreviewStep({ data, onComplete, onBack }: PreviewStepProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const handleFinish = async () => {
    setLoading(true);
    // Trigger Server Action or API Call to save user profile and upload images
    await onComplete();
    setLoading(false);
  };

  const formatHeight = (inches: number) => {
    if (!inches) return "";
    const ft = Math.floor(inches / 12);
    const inc = inches % 12;
    return `${ft}'${inc}"`;
  };

  return (
    <div className="flex flex-col h-full justify-between pb-24">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Looking good.</h2>
            <p className="text-neutral-400">This is how your profile will appear to others.</p>
          </div>
        </div>

        {/* Vertical Profiling */}
        <div className="space-y-4">
          
          {/* Main Photo Card (Index 0) */}
          {data.photos?.[0] && (
            <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={data.photos[0]} 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Profile photo 1"
              />
              
              {/* Profile Details Overlay on Main Photo */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32 pb-6 px-6 z-20">
                <h3 className="text-3xl font-bold text-white tracking-tight flex items-end gap-3 drop-shadow-md">
                  {session?.user?.name?.split(" ")[0] || "Name"}, {data.age || 18}
                  <CheckCircle2 className="w-6 h-6 text-orange-500 mb-1" />
                </h3>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-2 mt-4 text-white/90">
                    {data.hometown && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        {data.hometown}
                      </div>
                    )}
                    {(data.branch || data.year) && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <GraduationCap className="w-4 h-4 text-orange-400" />
                        {data.branch} '{data.year?.slice(2)}
                      </div>
                    )}
                    {data.isHosteler !== null && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Building className="w-4 h-4 text-orange-400" />
                        {data.isHosteler ? "Hosteler" : "Day Scholar"}
                      </div>
                    )}
                  </div>
                  {data.height && (
                    <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-sm font-semibold border border-white/10 flex items-center gap-1 h-fit shadow-lg">
                      📏 {formatHeight(data.height)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Iterate remaining photos and interleave prompts */}
          {data.photos?.slice(1).map((photo: string, index: number) => (
            <div key={`photo-block-${index}`} className="space-y-4">
              
              {/* If there's a prompt for this index, show it above the photo */}
              {data.prompts?.[index]?.question && data.prompts?.[index]?.answer && (
                <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/5 shadow-inner">
                  <h4 className="text-sm md:text-base font-semibold text-orange-400/90 mb-3 tracking-wide">{data.prompts[index].question}</h4>
                  <p className="text-2xl md:text-3xl font-serif text-white leading-tight">"{data.prompts[index].answer}"</p>
                </div>
              )}
              
              {/* Photo Card */}
              <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                <img 
                  src={photo} 
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`Profile photo ${index + 2}`}
                />
              </div>
            </div>
          ))}

          {/* If there are more prompts than photos (not normally possible based on limits, but safe fallback) */}
          {data.prompts?.slice(data.photos?.length - 1).map((prompt: any, i: number) => (
            prompt.question && prompt.answer && (
              <div key={`extra-prompt-${i}`} className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/5 shadow-inner">
                <h4 className="text-sm md:text-base font-semibold text-orange-400/90 mb-3 tracking-wide">{prompt.question}</h4>
                <p className="text-2xl md:text-3xl font-serif text-white leading-tight">"{prompt.answer}"</p>
              </div>
            )
          ))}

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={onBack}
            className="text-neutral-400 font-medium px-4 py-3.5 hover:text-white transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={handleFinish}
            disabled={loading}
            className="bg-orange-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-orange-500 transition-colors shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : null}
            Complete & Enter Feed
          </button>
        </div>
      </div>
    </div>
  );
}
