"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PolaroidFrameProps {
  localSrc: string;
  fallbackSrc: string;
  alt: string;
  caption?: string;
  date?: string;
  rotation?: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  showTape?: boolean;
  tapeColor?: "rose" | "sage" | "butter" | "neutral";
  priority?: boolean;
}

export default function PolaroidFrame({
  localSrc,
  fallbackSrc,
  alt,
  caption,
  date,
  rotation = "0deg",
  className = "",
  aspectRatio = "square",
  showTape = true,
  tapeColor = "rose",
  priority = false,
}: PolaroidFrameProps) {
  const [imgSrc, setImgSrc] = useState(localSrc);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  const handleError = () => {
    if (!hasFailedOnce) {
      setHasFailedOnce(true);
      setImgSrc(fallbackSrc);
    }
  };

  const tapeColors = {
    rose: "bg-[#E6BEB3]/75 border-[#D8A796]/40",
    sage: "bg-[#CAD6CC]/75 border-[#9CAF9E]/40",
    butter: "bg-[#F7EFC8]/80 border-[#E8D69A]/40",
    neutral: "bg-[#EFE8DD]/80 border-[#DACFBF]/40",
  };

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  return (
    <motion.div
      style={{ rotate: rotation }}
      whileHover={{ scale: 1.025, rotate: "0deg", zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative bg-warmcard p-3 sm:p-4 pb-4 sm:pb-6 rounded-md shadow-polaroid hover:shadow-polaroid-hover border border-taupe/10 transition-shadow select-none ${className}`}
    >
      {/* Washi tape decoration at the top */}
      {showTape && (
        <div
          aria-hidden="true"
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 ${tapeColors[tapeColor]} border shadow-xs transform -rotate-1 pointer-events-none backdrop-blur-[1px]`}
          style={{
            clipPath:
              "polygon(4% 0%, 96% 0%, 100% 20%, 97% 40%, 100% 60%, 97% 80%, 100% 100%, 0% 100%, 3% 80%, 0% 60%, 3% 40%, 0% 20%)",
          }}
        />
      )}

      {/* Photo Frame Container with standard img tag for flawless local preview */}
      <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden rounded-[2px] bg-oat border border-taupe/15`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          onError={handleError}
        />
        {/* Soft vignette gradient */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(44,37,35,0.08)]" />
      </div>

      {/* Polaroid Caption Area */}
      {(caption || date) && (
        <div className="mt-3 sm:mt-3.5 px-1 text-center">
          {caption && (
            <p className="font-serif italic text-espresso text-xs sm:text-sm leading-relaxed tracking-wide">
              {caption}
            </p>
          )}
          {date && (
            <span className="block mt-1 text-[10px] sm:text-[11px] font-sans font-medium text-taupe tracking-wider uppercase">
              {date}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
