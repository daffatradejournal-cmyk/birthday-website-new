"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CurtainRevealProps {
  isActive: boolean;
  onCovered?: () => void;
  onFinish?: () => void;
}

export default function CurtainReveal({ isActive, onCovered, onFinish }: CurtainRevealProps) {
  // phase: "idle" | "closing" | "covered" | "opening" | "done"
  const [phase, setPhase] = useState<"idle" | "closing" | "covered" | "opening" | "done">("idle");

  useEffect(() => {
    if (isActive) {
      setPhase("closing");

      // Step 1: Curtains slide in from left & right to meet in center (750ms)
      const coveredTimer = setTimeout(() => {
        setPhase("covered");
        if (onCovered) onCovered();
      }, 800);

      // Step 2: Curtains hold closed for 400ms, then part open majestically
      const openingTimer = setTimeout(() => {
        setPhase("opening");
      }, 1200);

      // Step 3: Complete transition after curtains part open
      const finishTimer = setTimeout(() => {
        setPhase("done");
        if (onFinish) onFinish();
      }, 2650);

      return () => {
        clearTimeout(coveredTimer);
        clearTimeout(openingTimer);
        clearTimeout(finishTimer);
      };
    } else {
      setPhase("idle");
    }
  }, [isActive, onCovered, onFinish]);

  if (!isActive && phase === "idle") return null;
  if (phase === "done") return null;

  const isOpening = phase === "opening";

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex overflow-hidden">
      {/* Top Valance / Draped Pelmet with Gold Trim */}
      <motion.div
        initial={{ y: -90, opacity: 0 }}
        animate={{
          y: isOpening ? -90 : 0,
          opacity: isOpening ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-50 bg-gradient-to-b from-[#772825] via-[#8E3532] to-[#68221F] shadow-2xl flex items-center justify-center border-b-2 border-amber-300/40"
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 75%, 90% 100%, 80% 75%, 70% 100%, 60% 75%, 50% 100%, 40% 75%, 30% 100%, 20% 75%, 10% 100%, 0% 75%)",
        }}
      >
        <span className="text-amber-200/90 text-xs sm:text-sm font-serif tracking-widest uppercase flex items-center gap-2 font-bold drop-shadow">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          Spesial Buat Kesayanganku ♡
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </span>
      </motion.div>

      {/* LEFT CURTAIN */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{
          x: isOpening ? "-105%" : "0%",
        }}
        transition={{
          duration: isOpening ? 1.35 : 0.75,
          ease: isOpening ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
        }}
        className="w-1/2 h-full relative flex-shrink-0 bg-gradient-to-r from-[#591B19] via-[#8F3733] to-[#631E1B] shadow-[15px_0_35px_rgba(0,0,0,0.6)] border-r border-amber-300/40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(30, 8, 6, 0.45) 0px,
            rgba(255, 255, 255, 0.08) 20px,
            rgba(30, 8, 6, 0.5) 40px,
            rgba(0, 0, 0, 0.35) 60px
          )`,
        }}
      >
        {/* Left Curtain Gold Tassel / Tieback */}
        <div className="absolute top-1/2 right-3 sm:right-6 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <div className="w-5 sm:w-7 h-12 sm:h-16 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-lg border border-amber-300" />
          <div className="w-2.5 sm:w-3.5 h-10 bg-amber-500 rounded-b-md shadow-md" />
        </div>

        {/* Velvet hem ripple */}
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/50 to-transparent" />
      </motion.div>

      {/* RIGHT CURTAIN */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{
          x: isOpening ? "105%" : "0%",
        }}
        transition={{
          duration: isOpening ? 1.35 : 0.75,
          ease: isOpening ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
        }}
        className="w-1/2 h-full relative flex-shrink-0 bg-gradient-to-l from-[#591B19] via-[#8F3733] to-[#631E1B] shadow-[-15px_0_35px_rgba(0,0,0,0.6)] border-l border-amber-300/40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(30, 8, 6, 0.45) 0px,
            rgba(255, 255, 255, 0.08) 20px,
            rgba(30, 8, 6, 0.5) 40px,
            rgba(0, 0, 0, 0.35) 60px
          )`,
        }}
      >
        {/* Right Curtain Gold Tassel / Tieback */}
        <div className="absolute top-1/2 left-3 sm:left-6 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <div className="w-5 sm:w-7 h-12 sm:h-16 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-lg border border-amber-300" />
          <div className="w-2.5 sm:w-3.5 h-10 bg-amber-500 rounded-b-md shadow-md" />
        </div>

        {/* Velvet hem ripple */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/50 to-transparent" />
      </motion.div>

      {/* Center Golden Light Burst when Parting */}
      {isOpening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.5, 2.2, 2.8],
          }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-200/60 blur-3xl pointer-events-none z-50"
        />
      )}
    </div>
  );
}
