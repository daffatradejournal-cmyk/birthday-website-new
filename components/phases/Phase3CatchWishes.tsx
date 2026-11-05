"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Sparkles, Heart, ArrowRight } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";

interface FallingStar {
  id: number;
  xPercent: number; // 5 to 90%
  speed: number;    // falling speed
  yPercent: number; // 0 to 100%
  size: number;
  rotation: number;
  type: "star" | "heart" | "sparkle";
  color: string;
}

interface Phase3CatchWishesProps {
  onComplete: () => void;
}

export default function Phase3CatchWishes({ onComplete }: Phase3CatchWishesProps) {
  const [stars, setStars] = useState<FallingStar[]>([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [currentCompliment, setCurrentCompliment] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const starIdCounter = useRef(0);

  const compliments = birthdayData.wishesStarCompliments;
  const TARGET_STARS = 5;

  const starColors = ["#D8A796", "#9CAF9E", "#F3E5AB", "#C87D65", "#BA8675"];
  const starTypes: ("star" | "heart" | "sparkle")[] = ["star", "heart", "sparkle"];

  // Ensure music stays alive right upon mounting Phase 3
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ensure-music-playing"));
    }
  }, []);

  // Spawn a new falling star
  const spawnStar = (): FallingStar => {
    starIdCounter.current += 1;
    return {
      id: starIdCounter.current,
      xPercent: 8 + Math.random() * 84,
      yPercent: -10 - Math.random() * 15,
      speed: 0.25 + Math.random() * 0.28, // gentle drift
      size: 28 + Math.random() * 16,
      rotation: Math.random() * 360,
      type: starTypes[Math.floor(Math.random() * starTypes.length)],
      color: starColors[Math.floor(Math.random() * starColors.length)],
    };
  };

  // Initialize pool of 6 floating stars
  useEffect(() => {
    const initialStars: FallingStar[] = [];
    for (let i = 0; i < 6; i++) {
      const s = spawnStar();
      s.yPercent = Math.random() * 70;
      initialStars.push(s);
    }
    setStars(initialStars);
  }, []);

  // Animation loop to move stars downwards
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      setStars((prev) =>
        prev.map((star) => {
          const nextY = star.yPercent + star.speed * delta;
          if (nextY > 105) {
            return spawnStar();
          }
          return {
            ...star,
            yPercent: nextY,
            rotation: star.rotation + 0.3,
          };
        })
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Catch star action (click/tap)
  const handleCatchStar = (starId: number) => {
    if (caughtCount >= TARGET_STARS) return;

    // Wake up & keep background music alive continuously!
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ensure-music-playing"));
    }

    soundEngine.playSparkleSound();
    const nextCaught = caughtCount + 1;
    setCaughtCount(nextCaught);

    // Show compliments sequentially
    const compIdx = (nextCaught - 1) % compliments.length;
    setCurrentCompliment(compliments[compIdx]);

    // Replace caught star with a new one spawned at top
    setStars((prev) =>
      prev.map((s) => (s.id === starId ? spawnStar() : s))
    );

    // Check completion
    if (nextCaught >= TARGET_STARS) {
      setTimeout(() => {
        soundEngine.playSuccessChime();
        setIsCompleted(true);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Header without # tag */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter/40 text-espresso text-xs font-serif italic mb-2">
          <Flame className="w-3.5 h-3.5 text-dusty-rose" />
          Catch the Falling Wishes
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
          Tangkap Bintang Harapan
        </h2>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Sentuh bintang atau hati yang melayang pelan untuk mengungkap alasan kenapa aku mencintaimu.
        </p>

        {/* Progress Counter */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 bg-warmcard px-3.5 py-1.5 rounded-full border border-taupe/15 shadow-xs">
            <Star className="w-4 h-4 fill-butter text-amber-500" />
            <span className="text-xs font-serif font-semibold text-espresso">
              Bintang Terkumpul: {caughtCount} / {TARGET_STARS}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Compliment Toast Display */}
      <div className="min-h-[56px] mb-3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentCompliment && (
            <motion.div
              key={currentCompliment}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-5 py-2.5 rounded-2xl bg-warmcard/95 border border-dusty-rose/30 shadow-soft text-center max-w-md mx-auto"
            >
              <p className="text-xs sm:text-sm font-serif italic text-espresso">
                {currentCompliment}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Falling Sky Container */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl bg-oat/50 border-2 border-taupe/20 shadow-soft overflow-hidden select-none backdrop-blur-xs">
        {/* Soft background clouds & gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-alabaster/40 via-oat/30 to-dusty-rose/10 pointer-events-none" />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-sans text-taupe/60 italic pointer-events-none">
          Ketuk bintang atau hati yang jatuh perlahan ✨
        </div>

        {/* Falling Stars & Hearts */}
        {stars.map((star) => (
          <button
            key={star.id}
            type="button"
            onClick={() => handleCatchStar(star.id)}
            style={{
              left: `${star.xPercent}%`,
              top: `${star.yPercent}%`,
              transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            className="absolute z-10 flex items-center justify-center transition-transform hover:scale-125 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Tangkap bintang"
          >
            {star.type === "star" && (
              <Star
                className="w-full h-full drop-shadow-sm fill-current"
                style={{ color: star.color }}
              />
            )}
            {star.type === "heart" && (
              <Heart
                className="w-full h-full drop-shadow-sm fill-current"
                style={{ color: star.color }}
              />
            )}
            {star.type === "sparkle" && (
              <Sparkles
                className="w-full h-full drop-shadow-sm"
                style={{ color: star.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Reward Modal without # tags */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/30 backdrop-blur-sm"
          >
            <div className="bg-warmcard border border-dusty-rose/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-floating text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-butter/40 text-espresso mx-auto flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-amber-500 fill-butter" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sage/15 text-sage-dark text-xs font-serif font-semibold uppercase tracking-wider mb-2">
                Semua Bahan Kue Telah Lengkap!
              </span>

              <h3 className="text-2xl font-serif font-bold text-espresso">
                Lilin Harapan Terkumpul! 🕯️
              </h3>

              <p className="text-xs sm:text-sm text-taupe mt-2 leading-relaxed">
                Semua bahan kue ulang tahun telah lengkap: Base Kue, Krim Manis, dan Lilin Harapan.
                Kini saatnya menyalakan lilin dan merayakan ulang tahunmu!
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSuccessChime();
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("ensure-music-playing"));
                    }
                    onComplete();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-espresso hover:bg-espresso-light text-warmcard text-xs sm:text-sm font-serif font-semibold tracking-wide inline-flex items-center justify-center gap-2 shadow-soft hover:shadow-floating transition-all"
                >
                  <span>Nyalakan & Rayakan Ulang Tahunmu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
