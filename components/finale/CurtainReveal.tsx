"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CurtainRevealProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function CurtainReveal({ isOpen, children }: CurtainRevealProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [curtainsFullyOpen, setCurtainsFullyOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small dramatic pause (300ms) right as candle flame goes out and music starts
      const startTimer = setTimeout(() => {
        setAnimationStarted(true);
      }, 300);

      // Curtains fully opened after transition (2.4s)
      const endTimer = setTimeout(() => {
        setCurtainsFullyOpen(true);
      }, 2700);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    } else {
      setAnimationStarted(false);
      setCurtainsFullyOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="relative w-full overflow-hidden mt-6 rounded-3xl min-h-[500px]">
      {/* Behind the curtains: The Revealed Content (Scrapbook, Letter, Counter) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: animationStarted ? 1 : 0.2,
          scale: animationStarted ? 1 : 0.96,
        }}
        transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>

      {/* Theatrical Curtain Overlay (Visible during parting animation) */}
      {!curtainsFullyOpen && (
        <div className="absolute inset-0 z-30 pointer-events-none flex overflow-hidden">
          {/* Top Valance / Draped Pelmet with Gold Trim */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: animationStarted ? [1, 1, 0] : 1, y: animationStarted ? -40 : 0 }}
            transition={{ duration: 2.2, delay: 0.5 }}
            className="absolute top-0 left-0 right-0 h-14 sm:h-16 z-40 bg-gradient-to-b from-[#772825] via-[#8E3532] to-[#68221F] shadow-lg flex items-center justify-center border-b-2 border-amber-300/40"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 75%, 90% 100%, 80% 75%, 70% 100%, 60% 75%, 50% 100%, 40% 75%, 30% 100%, 20% 75%, 10% 100%, 0% 75%)",
            }}
          >
            <span className="text-amber-200/80 text-[11px] font-serif tracking-widest uppercase flex items-center gap-1.5 font-bold drop-shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Untukmu Yang Paling Berharga
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </span>
          </motion.div>

          {/* LEFT CURTAIN */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: animationStarted ? "-105%" : 0 }}
            transition={{
              duration: 2.2,
              ease: [0.25, 1, 0.5, 1], // Luxurious smooth theatrical parting curve
            }}
            className="w-1/2 h-full relative flex-shrink-0 bg-gradient-to-r from-[#631E1B] via-[#8F3733] to-[#591B19] shadow-[10px_0_30px_rgba(0,0,0,0.5)] border-r border-amber-300/30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(40, 10, 8, 0.4) 0px,
                rgba(255, 255, 255, 0.08) 18px,
                rgba(40, 10, 8, 0.45) 36px,
                rgba(0, 0, 0, 0.3) 54px
              )`,
            }}
          >
            {/* Left Curtain Gold Tassel / Tieback */}
            <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-4 sm:w-6 h-10 sm:h-14 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-md border border-amber-300" />
              <div className="w-2 sm:w-3 h-8 bg-amber-500 rounded-b-md shadow-sm" />
            </div>

            {/* Velvet hem ripple */}
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
          </motion.div>

          {/* RIGHT CURTAIN */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: animationStarted ? "105%" : 0 }}
            transition={{
              duration: 2.2,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="w-1/2 h-full relative flex-shrink-0 bg-gradient-to-l from-[#631E1B] via-[#8F3733] to-[#591B19] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-amber-300/30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgba(40, 10, 8, 0.4) 0px,
                rgba(255, 255, 255, 0.08) 18px,
                rgba(40, 10, 8, 0.45) 36px,
                rgba(0, 0, 0, 0.3) 54px
              )`,
            }}
          >
            {/* Right Curtain Gold Tassel / Tieback */}
            <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-4 sm:w-6 h-10 sm:h-14 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-md border border-amber-300" />
              <div className="w-2 sm:w-3 h-8 bg-amber-500 rounded-b-md shadow-sm" />
            </div>

            {/* Velvet hem ripple */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
          </motion.div>

          {/* Center Parting Light Leak Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: animationStarted ? [0, 0.8, 0] : 0,
              scale: animationStarted ? [0.5, 1.8, 2] : 0.5,
            }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-amber-200/50 blur-2xl pointer-events-none z-50"
          />
        </div>
      )}
    </div>
  );
}
