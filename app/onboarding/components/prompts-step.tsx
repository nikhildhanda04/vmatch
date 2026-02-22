"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { StepData } from "../types";

interface PromptsStepProps {
  data: StepData;
  updateData: (data: Partial<StepData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_PROMPTS = [
  "A random fact I love is...",
  "My most controversial opinion is...",
  "I'm a regular at...",
  "Dating me is like...",
  "The quickest way to my heart is...",
  "My simple pleasures...",
  "A life goal of mine...",
  "What I order for the table...",
  "My greatest strength...",
  "The best way to ask me out is...",
  "I won't shut up about...",
  "First round is on me if...",
];

export default function PromptsStep({ data, updateData, onNext, onBack }: PromptsStepProps) {
  // Extract prompts or initialize empty array
  const [prompts, setPrompts] = useState<{question: string, answer: string}[]>(data.prompts || []);
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);
  
  const handleSelectPrompt = (question: string) => {
    if (selectingSlot !== null) {
      const newPrompts = [...prompts];
      newPrompts[selectingSlot] = { question, answer: "" };
      setPrompts(newPrompts);
      updateData({ prompts: newPrompts });
      setSelectingSlot(null);
    }
  };

  const handleUpdateAnswer = (index: number, answer: string) => {
    const newPrompts = [...prompts];
    newPrompts[index].answer = answer;
    setPrompts(newPrompts);
    updateData({ prompts: newPrompts });
  };

  const handleRemovePrompt = (index: number) => {
    const newPrompts = [...prompts];
    newPrompts.splice(index, 1);
    setPrompts(newPrompts);
    updateData({ prompts: newPrompts });
  };

  const handleAddSlot = () => {
    if (prompts.length < 3) {
      setPrompts([...prompts, { question: "", answer: "" }]);
      setSelectingSlot(prompts.length);
    }
  };

  const unusedPrompts = PRESET_PROMPTS.filter(p => !prompts.some(active => active.question === p));

  return (
    <div className="flex flex-col h-full justify-between pb-24">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Show your personality</h2>
          <p className="text-neutral-400">Add up to 3 prompts (optional but recommended!) to give people a reason to talk to you.</p>
        </div>

        {selectingSlot !== null ? (
          // Prompt Selection List
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Select a prompt</h3>
              <button 
                onClick={() => setSelectingSlot(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 h-[400px] overflow-y-auto pr-2 pb-10">
              {unusedPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSelectPrompt(prompt)}
                  className="w-full text-left p-4 rounded-xl bg-neutral-900 border border-white/5 hover:border-orange-500/50 hover:bg-neutral-800 transition-colors"
                >
                  <span className="font-medium">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Active Prompts
          <div className="space-y-6">
            {prompts.map((prompt, index) => (
              <div key={index} className="relative group p-6 rounded-2xl bg-neutral-900 border border-white/10">
                <button 
                  onClick={() => handleRemovePrompt(index)}
                  className="absolute -top-3 -right-3 bg-neutral-800 border border-white/10 text-neutral-400 hover:text-red-400 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {prompt.question ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium text-orange-400">
                      <span>{prompt.question}</span>
                      <button 
                        onClick={() => setSelectingSlot(index)}
                        className="text-neutral-500 hover:text-white underline decoration-dashed underline-offset-4"
                      >
                        Change
                      </button>
                    </div>
                    <textarea
                      value={prompt.answer}
                      onChange={(e) => handleUpdateAnswer(index, e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full bg-transparent text-white text-xl border-none focus:outline-none focus:ring-0 resize-none placeholder:text-neutral-700 h-24"
                    />
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectingSlot(index)}
                    className="w-full h-full text-left font-medium text-orange-500 hover:text-orange-400"
                  >
                    Tap to select a prompt...
                  </button>
                )}
              </div>
            ))}

            {prompts.length < 3 && (
              <button
                onClick={handleAddSlot}
                className="w-full p-6 rounded-2xl border border-dashed border-white/20 text-neutral-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add a prompt
              </button>
            )}
          </div>
        )}
      </div>

      {!selectingSlot && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-2xl mx-auto flex justify-between">
            <button
              onClick={onBack}
              className="text-neutral-400 font-medium px-4 py-3.5 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
