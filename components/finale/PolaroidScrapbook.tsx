"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";
import PolaroidFrame from "@/components/PolaroidFrame";

export default function PolaroidScrapbook() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = birthdayData.finalePolaroids || birthdayData.galleryPhotos;

  const handleNext = () => {
    soundEngine.playClickSound();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    soundEngine.playClickSound();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSelect = (idx: number) => {
    soundEngine.playClickSound();
    setCurrentIndex(idx);
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/15 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <Heart className="w-3.5 h-3.5 fill-current text-dusty-rose" />
          Album Kenangan Spesial
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
          Our Little Scrapbook
        </h3>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          Bisa digeser ke samping atau gunakan tombol panah untuk melihat momen kita.
        </p>
      </div>

      {/* Main Drag-enabled Polaroid Display */}
      <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] px-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-warmcard/90 hover:bg-warmcard border border-taupe/20 shadow-soft text-espresso flex items-center justify-center transition-all hover:scale-105"
          aria-label="Foto sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Animated Polaroid Card Stack */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) {
                handleNext();
              } else if (info.offset.x > 60) {
                handlePrev();
              }
            }}
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[300px] sm:max-w-[340px] cursor-grab active:cursor-grabbing select-none"
          >
            <PolaroidFrame
              localSrc={currentPhoto.localSrc}
              fallbackSrc={currentPhoto.fallbackSrc}
              alt={currentPhoto.caption}
              caption={currentPhoto.caption}
              date={currentPhoto.date}
              rotation={currentPhoto.rotation}
              aspectRatio="square"
              tapeColor="rose"
            />
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-warmcard/90 hover:bg-warmcard border border-taupe/20 shadow-soft text-espresso flex items-center justify-center transition-all hover:scale-105"
          aria-label="Foto selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scrapbook Thumbnails Selector (standard img tag) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4">
        {photos.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isActive
                  ? "w-11 h-11 sm:w-13 sm:h-13 border-dusty-rose shadow-soft scale-110"
                  : "w-8 h-8 sm:w-10 sm:h-10 border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.localSrc}
                alt={item.caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = item.fallbackSrc;
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="text-center mt-3 text-[11px] font-sans text-taupe/70">
        Foto {currentIndex + 1} dari {photos.length}
      </div>
    </div>
  );
}
