"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopProgressBar from "@/components/TopProgressBar";
import AudioController from "@/components/AudioController";
import Phase0Lockscreen from "@/components/phases/Phase0Lockscreen";
import Phase1MemoryMatch from "@/components/phases/Phase1MemoryMatch";
import Phase2SoundtrackNotes from "@/components/phases/Phase2SoundtrackNotes";
import Phase3CatchWishes from "@/components/phases/Phase3CatchWishes";
import Phase4Finale from "@/components/phases/Phase4Finale";

export type PhaseType = 0 | 1 | 2 | 3 | 4;

export default function BirthdayApp() {
  const [phase, setPhase] = useState<PhaseType>(0);
  const [unlockedMaxPhase, setUnlockedMaxPhase] = useState<number>(0);
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);

  // Transition helper
  const goToPhase = (nextPhase: PhaseType) => {
    setPhase(nextPhase);
    setUnlockedMaxPhase((prev) => Math.max(prev, nextPhase));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Phase 0 unlock
  const handleUnlockPhase0 = () => {
    setAutoPlayTriggered(true);
    goToPhase(1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-dusty-rose/25">
      {/* Top Progress Bar (Visible during Phases 1 to 4) */}
      <TopProgressBar
        currentPhase={phase}
        unlockedMaxPhase={unlockedMaxPhase}
        onSelectPhase={(targetPhase) => goToPhase(targetPhase as PhaseType)}
      />

      {/* Main Phase Stage wrapped in AnimatePresence for smooth editorial fade-and-slide */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="phase-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <Phase0Lockscreen onUnlock={handleUnlockPhase0} />
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <Phase1MemoryMatch onComplete={() => goToPhase(2)} />
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <Phase2SoundtrackNotes onComplete={() => goToPhase(3)} />
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <Phase3CatchWishes onComplete={() => goToPhase(4)} />
            </motion.div>
          )}

          {phase === 4 && (
            <motion.div
              key="phase-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full"
            >
              <Phase4Finale />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Vinyl Audio Controller (Persists across phases, never cuts music) */}
      <AudioController
        currentPhase={phase}
        autoStartOnPhase0Unlock={autoPlayTriggered}
      />
    </div>
  );
}
