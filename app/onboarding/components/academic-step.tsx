"use client";

import { MapPin, GraduationCap, Calendar, Users } from "lucide-react";
import { useState } from "react";

import { StepData } from "../types";

interface AcademicStepProps {
  data: StepData;
  updateData: (data: Partial<StepData>) => void;
  onNext: () => void;
}

const branches = [
  "BTech CSE (Core)",
  "BTech CSE (AI & ML)",
  "BTech CSE (Cyber Security)",
  "BTech CSE (Gaming Tech)",
  "BTech CSE (Health Info)",
  "BTech ECE",
  "BTech ECE (AI & Cyber)",
  "BTech Mech",
  "BTech Mech (AI & Robotics)",
  "BTech Aerospace",
  "BArch",
  "BBA",
  "MCA",
  "MTech",
];

const currentYear = new Date().getFullYear();
const passingYears = Array.from({ length: 7 }, (_, i) => (currentYear + i).toString());

export default function AcademicStep({ data, updateData, onNext }: AcademicStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (!data.gender) newErrors.gender = "Please select your gender";
    if (!data.interestedIn) newErrors.interestedIn = "Please select who you're interested in";
    if (!data.branch) newErrors.branch = "Please select your branch";
    if (!data.year) newErrors.year = "Please select your passing year";
    if (data.isHosteler === null) newErrors.isHosteler = "Please specify if you live on campus";

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
          <h2 className="text-3xl font-bold tracking-tight mb-2">The Basics</h2>
          <p className="text-neutral-400">Let's set up your profile framework. This helps us find the right matches on campus.</p>
        </div>

        <div className="space-y-6">
          {/* Identity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Identity & Preferences
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">I am a...</label>
                <div className="flex gap-2">
                  {["MALE", "FEMALE"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => updateData({ gender })}
                      className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                        data.gender === gender 
                        ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                        : "border-white/10 text-neutral-400 hover:border-white/30"
                      }`}
                    >
                      {gender === "MALE" ? "Guy" : "Girl"}
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Interested in...</label>
                <div className="flex gap-2">
                  {["MALE", "FEMALE", "EVERYONE"].map((interest) => (
                    <button
                      key={interest}
                      onClick={() => updateData({ interestedIn: interest })}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                        data.interestedIn === interest 
                        ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                        : "border-white/10 text-neutral-400 hover:border-white/30"
                      }`}
                    >
                      {interest === "MALE" ? "Guys" : interest === "FEMALE" ? "Girls" : "All"}
                    </button>
                  ))}
                </div>
                {errors.interestedIn && <p className="text-red-400 text-xs mt-1">{errors.interestedIn}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Academics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-500" />
              Academics
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Branch / Program</label>
                <select
                  value={data.branch}
                  onChange={(e) => updateData({ branch: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none"
                >
                  <option value="" disabled>Select your branch</option>
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Passing Year</label>
                <div className="grid grid-cols-4 gap-2">
                  {passingYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => updateData({ year })}
                      className={`py-2 rounded-lg border font-medium text-sm transition-all ${
                        data.year === year 
                        ? "bg-orange-500 border-orange-500 text-white" 
                        : "border-white/10 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      '{year.slice(2)}
                    </button>
                  ))}
                </div>
                {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm text-neutral-400">Campus Housing</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateData({ isHosteler: true })}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      data.isHosteler === true 
                      ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                      : "border-white/10 text-neutral-400 hover:border-white/30"
                    }`}
                  >
                    Hosteler
                  </button>
                  <button
                    onClick={() => updateData({ isHosteler: false })}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      data.isHosteler === false 
                      ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                      : "border-white/10 text-neutral-400 hover:border-white/30"
                    }`}
                  >
                    Day Scholar
                  </button>
                </div>
                {errors.isHosteler && <p className="text-red-400 text-xs mt-1">{errors.isHosteler}</p>}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-2xl mx-auto flex justify-end">
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
