"use client";

import { useState } from "react";
import { UserCircle, MapPin } from "lucide-react";

import { StepData } from "../types";

interface PersonalInfoStepProps {
  data: StepData;
  updateData: (data: Partial<StepData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalInfoStep({ data, updateData, onNext, onBack }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.age || data.age < 17 || data.age > 40) {
      newErrors.age = "Please enter a valid age (17-40)";
    }
    
    if (!data.hometown || data.hometown.trim().length < 2) {
      newErrors.hometown = "Please enter your hometown";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onNext();
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">About You</h2>
          <p className="text-neutral-400">Tell us a bit more about yourself so we can paint a full picture.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400 flex items-center gap-2 mb-1">
                <UserCircle className="w-4 h-4 text-orange-500" />
                Age
              </label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateData({ age: Math.max(17, (data.age || 18) - 1) })}
                  className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/30 flex items-center justify-center text-xl font-medium transition-colors"
                >
                  -
                </button>
                <div className="flex-1 h-12 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-bold">
                  {data.age || 18}
                </div>
                <button 
                  onClick={() => updateData({ age: Math.min(40, (data.age || 18) + 1) })}
                  className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/30 flex items-center justify-center text-xl font-medium transition-colors"
                >
                  +
                </button>
              </div>
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-neutral-400 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-orange-500" />
                Hometown
              </label>
              <input
                type="text"
                placeholder="e.g. Bhopal, Madhya Pradesh"
                value={data.hometown || ""}
                onChange={(e) => updateData({ hometown: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
               <p className="text-xs text-neutral-500">Where did you grow up?</p>
              {errors.hometown && <p className="text-red-400 text-xs mt-1">{errors.hometown}</p>}
            </div>

          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={onBack}
            className="text-neutral-400 font-medium px-4 py-3.5 hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
