"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeightStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function HeightStep({ data, updateData, onNext, onBack }: HeightStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Height range 4'0" (48 inches) to 7'2" (86 inches)
  const heights = Array.from({ length: 39 }, (_, i) => i + 48);
  const [selectedHeight, setSelectedHeight] = useState(data.height || 68);

  const formatHeight = (inches: number) => {
    const ft = Math.floor(inches / 12);
    const inc = inches % 12;
    return `${ft}'${inc}"`;
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Each item is 64px tall (h-16)
    const itemHeight = 64;
    const scrollPosition = container.scrollTop;
    
    // Center offset
    const centerIndex = Math.round(scrollPosition / itemHeight);
    
    if (heights[centerIndex]) {
      setSelectedHeight(heights[centerIndex]);
      updateData({ height: heights[centerIndex] });
    }
  };

  // Initial scroll positioning
  useEffect(() => {
    if (containerRef.current) {
      const index = heights.indexOf(selectedHeight);
      if (index !== -1) {
        containerRef.current.scrollTop = index * 64;
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8 flex-1 flex flex-col pt-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">How tall are you?</h2>
          <p className="text-neutral-400">Be honest, we won't bring a measuring tape on the first date.</p>
        </div>

        <div className="flex-1 flex items-center justify-center relative mt-12 mb-20">
          {/* Selector overlay window */}
          <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 bg-white/5 border border-white/10 rounded-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 shadow-[0_0_40px_rgba(236,72,153,0.15)] pointer-events-none" />

          {/* Scrolling Wheel */}
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="h-[320px] w-full max-w-[200px] overflow-y-auto snap-y snap-mandatory scrollbar-hide relative mask-edges"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)'
            }}
          >
            {/* Top padding elements to allow first item to hit center */}
            <div className="h-[128px]" />
            
            {heights.map((h) => {
              const isSelected = h === selectedHeight;
              return (
                <div 
                  key={h}
                  className={`h-16 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                    isSelected ? "text-3xl font-bold text-white scale-110" : "text-xl font-medium text-neutral-500 hover:text-neutral-400"
                  }`}
                  onClick={() => {
                    const idx = heights.indexOf(h);
                    containerRef.current?.scrollTo({ top: idx * 64, behavior: 'smooth' });
                  }}
                >
                  {formatHeight(h)}
                </div>
              );
            })}

            {/* Bottom padding elements to allow last item to hit center */}
            <div className="h-[128px]" />
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
            onClick={onNext}
            className="bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
