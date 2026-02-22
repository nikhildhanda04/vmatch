"use client";

import { useState, useRef } from "react";
import { Plus, X, Crop, Upload } from "lucide-react";

import { StepData } from "../types";

interface PhotosStepProps {
  data: StepData;
  updateData: (data: Partial<StepData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PhotosStep({ data, updateData, onNext, onBack }: PhotosStepProps) {
  // Photos stored as base64 data URLs for preview
  const [photos, setPhotos] = useState<string[]>(data.photos || []);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 7) {
      setError("Maximum 7 photos allowed");
      return;
    }

    setError(null);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => {
          const newPhotos = [...prev, reader.result as string];
          updateData({ photos: newPhotos });
          return newPhotos;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos.splice(index, 1);
      updateData({ photos: newPhotos });
      return newPhotos;
    });
  };

  const handleContinue = () => {
    if (photos.length < 4) {
      setError(`Please upload at least ${4 - photos.length} more photo(s)`);
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="flex flex-col h-full justify-between pb-24">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Build your lineup</h2>
          <p className="text-neutral-400">Add 4 to 7 photos. The first photo will be your main profile picture.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`relative group aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 ${index === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""}`}
            >
              <img 
                src={photo} 
                alt={`Upload ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => removePhoto(index)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Main Photo
                </div>
              )}
            </div>
          ))}

          {/* Add Dropzone Slots */}
          {Array.from({ length: Math.max(0, 7 - photos.length) }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 hover:border-orange-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 text-neutral-500 hover:text-orange-400 ${photos.length === 0 && i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""}`}
            >
              <div className="p-3 bg-neutral-900 rounded-full border border-white/5 shadow-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">
                {photos.length === 0 && i === 0 ? "Add main photo" : "Add photo"}
              </span>
            </button>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

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
            className={`px-8 py-3.5 rounded-xl font-medium transition-all ${
              photos.length >= 4 
              ? "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" 
              : "bg-white/10 text-white/50 cursor-not-allowed border border-white/5"
            }`}
          >
            Continue {photos.length > 0 && photos.length < 4 && `(${4 - photos.length} more)`}
          </button>
        </div>
      </div>
    </div>
  );
}
