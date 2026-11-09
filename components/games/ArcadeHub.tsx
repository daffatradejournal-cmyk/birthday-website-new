"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Dices, HelpCircle, Gamepad2, Sparkles } from "lucide-react";
import ScratchCardGame from "@/components/games/ScratchCardGame";
import SpinWheelGame from "@/components/games/SpinWheelGame";
import CoupleQuizGame from "@/components/games/CoupleQuizGame";
import { soundEngine } from "@/lib/soundSynth";

type ArcadeTab = "scratch" | "spin" | "quiz";

interface TabItem {
  id: ArcadeTab;
  label: string;
  icon: string;
  badge: string;
}

const TABS: TabItem[] = [
  {
    id: "scratch",
    label: "Kupon Gosok",
    icon: "🎟️",
    badge: "Hadiah Nyata",
  },
  {
    id: "spin",
    label: "Roda Putar",
    icon: "🎰",
    badge: "Putar & Menang",
  },
  {
    id: "quiz",
    label: "Kuis Cinta",
    icon: "🧩",
    badge: "Tes Jodoh",
  },
];

export default function ArcadeHub() {
  const [activeTab, setActiveTab] = useState<ArcadeTab>("scratch");

  const handleTabChange = (tab: ArcadeTab) => {
    soundEngine.playClickSound();
    setActiveTab(tab);
  };

  return (
    <section
      aria-label="Arcade & Mini Games Ulang Tahun"
      className="w-full rounded-3xl bg-warmcard/80 border border-taupe/20 p-4 sm:p-8 shadow-soft backdrop-blur-xs relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-dusty-rose/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-muted-sage/10 blur-3xl pointer-events-none" />

      {/* Arcade Header */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/20 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-dusty-rose" />
          Zona Arcade & Kado Tambahan
        </span>
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-espresso tracking-tight">
          Mini Games Spesial Ulang Tahun 🎮
        </h3>
        <p className="text-xs sm:text-base text-taupe mt-1.5 max-w-lg mx-auto">
          Biar ga ngebosenin dan makin asik, ini ada 3 mini game seru buat kamu mainkan! Cobain semua gamenya yaa sayang ♡
        </p>

        {/* Tab Selector Pills */}
        <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-dusty-rose text-white shadow-soft"
                    : "bg-alabaster hover:bg-oat text-espresso border border-taupe/20"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md hidden sm:inline-block ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-taupe/15 text-taupe"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Stage */}
      <div className="relative min-h-[380px]">
        <AnimatePresence mode="wait">
          {activeTab === "scratch" && (
            <motion.div
              key="tab-scratch"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ScratchCardGame />
            </motion.div>
          )}

          {activeTab === "spin" && (
            <motion.div
              key="tab-spin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <SpinWheelGame />
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="tab-quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <CoupleQuizGame />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
