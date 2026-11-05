"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cake, Sparkles, Flame, Gift, Check } from "lucide-react";
import { soundEngine } from "@/lib/soundSynth";

interface TopProgressBarProps {
  currentPhase: number;
  unlockedMaxPhase: number;
  onSelectPhase?: (phase: number) => void;
}

const MILESTONES = [
  {
    phase: 1,
    title: "Base Kue",
    desc: "Memory Match",
    icon: Cake,
  },
  {
    phase: 2,
    title: "Krim & Topping",
    desc: "Soundtrack & Notes",
    icon: Sparkles,
  },
  {
    phase: 3,
    title: "Lilin Harapan",
    desc: "Catch Wishes",
    icon: Flame,
  },
  {
    phase: 4,
    title: "Pesta & Surat",
    desc: "Grand Surprise",
    icon: Gift,
  },
];

export default function TopProgressBar({
  currentPhase,
  unlockedMaxPhase,
  onSelectPhase,
}: TopProgressBarProps) {
  // Only show header during Phases 1 to 4
  if (currentPhase < 1) return null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-alabaster/85 border-b border-taupe/10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Left badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-dusty-rose/20 text-dusty-rose text-xs font-serif font-bold">
              ✦
            </span>
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-widest text-taupe block font-medium">
                Perjalanan Hari Spesial
              </span>
              <p className="text-xs sm:text-sm font-serif font-semibold text-espresso">
                Sedang Membuka:{" "}
                <span className="text-dusty-rose font-medium">
                  {MILESTONES[Math.min(currentPhase - 1, 3)].title}
                </span>
              </p>
            </div>
          </div>

          {/* Stepper pills */}
          <nav aria-label="Progress" className="flex items-center gap-1.5 sm:gap-2">
            {MILESTONES.map((milestone, idx) => {
              const isCompleted = milestone.phase < currentPhase;
              const isCurrent = milestone.phase === currentPhase;
              const isUnlocked = milestone.phase <= unlockedMaxPhase;
              const Icon = milestone.icon;

              return (
                <div key={milestone.phase} className="flex items-center">
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked && onSelectPhase) {
                        soundEngine.playClickSound();
                        onSelectPhase(milestone.phase);
                      }
                    }}
                    title={`${milestone.title}: ${milestone.desc}`}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs transition-all duration-200 ${
                      isCurrent
                        ? "bg-espresso text-warmcard shadow-soft font-medium scale-[1.02]"
                        : isCompleted
                        ? "bg-sage/15 text-sage-dark border border-sage/30 hover:bg-sage/25 cursor-pointer"
                        : isUnlocked
                        ? "bg-oat text-taupe border border-taupe/20 hover:text-espresso cursor-pointer"
                        : "bg-oat/50 text-taupe/40 border border-taupe/10 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-sage-dark stroke-[2.5]" />
                    ) : (
                      <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-butter" : "text-current"}`} />
                    )}

                    <span className="hidden md:inline text-[11px] font-sans">
                      {milestone.title}
                    </span>

                    {isCurrent && (
                      <motion.span
                        layoutId="active-step-glow"
                        className="absolute inset-0 rounded-full ring-2 ring-dusty-rose/40 pointer-events-none"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>

                  {idx < MILESTONES.length - 1 && (
                    <div
                      className={`w-3 sm:w-5 h-[1.5px] mx-0.5 sm:mx-1 rounded-full transition-colors ${
                        milestone.phase < currentPhase ? "bg-sage" : "bg-taupe/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
