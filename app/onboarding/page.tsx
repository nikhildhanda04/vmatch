"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import AcademicStep from "@/app/onboarding/components/academic-step";
import PersonalInfoStep from "@/app/onboarding/components/personal-info-step";
import HeightStep from "@/app/onboarding/components/height-step";
import PromptsStep from "@/app/onboarding/components/prompts-step";
import PhotosStep from "@/app/onboarding/components/photos-step";
import PreviewStep from "@/app/onboarding/components/preview-step";
import { submitOnboarding } from "@/app/actions/onboarding";

const steps = [
  { id: "academic", title: "The Basics" },
  { id: "personal", title: "About You" },
  { id: "height", title: "How tall are you?" },
  { id: "prompts", title: "Show your personality" },
  { id: "photos", title: "Add your photos" },
  { id: "preview", title: "Preview Profile" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    gender: "",
    interestedIn: "",
    branch: "",
    year: "", // passing year
    isHosteler: null as boolean | null,
    age: 18,
    hometown: "",
    height: 68, // default ~ 5'8"
    prompts: [] as { question: string; answer: string }[],
    photos: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const result = await submitOnboarding({
        ...formData,
        gender: formData.gender as any,
        interestedIn: formData.interestedIn as any,
      });
      if (result.success) {
        router.push("/feed");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AcademicStep data={formData} updateData={updateFormData} onNext={handleNext} />;
      case 1:
        return <PersonalInfoStep data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <HeightStep data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PromptsStep data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <PhotosStep data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <PreviewStep data={formData} onComplete={handleComplete} onBack={handleBack} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-orange-500/30">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="font-semibold tracking-tight">Vmatch.</span>
          </div>
          <div className="text-sm font-medium text-neutral-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-neutral-900">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 pt-28 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
