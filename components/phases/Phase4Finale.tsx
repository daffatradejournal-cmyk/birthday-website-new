"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Sparkles, RotateCcw } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";
import InteractiveCake from "@/components/finale/InteractiveCake";
import CurtainReveal from "@/components/finale/CurtainReveal";
import PolaroidScrapbook from "@/components/finale/PolaroidScrapbook";
import EditorialLetter from "@/components/finale/EditorialLetter";
import RelationshipCounter from "@/components/finale/RelationshipCounter";

export default function Phase4Finale() {
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [showRevealedContent, setShowRevealedContent] = useState(false);
  const [isCurtainAnimating, setIsCurtainAnimating] = useState(false);

  // When user blows the candle
  const handleCandleBlown = () => {
    setIsCandleBlown(true);
    setIsCurtainAnimating(true);
  };

  // Called when curtains have fully met in the center covering the whole screen
  const handleCurtainCovered = () => {
    // Hide the cake completely and reveal photos & letter!
    setShowRevealedContent(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Called when curtains have finished opening
  const handleCurtainFinish = () => {
    setIsCurtainAnimating(false);
  };

  // Replay option: allows user to blow the candle again!
  const handleReplayCandle = () => {
    soundEngine.playSparkleSound();
    setIsCandleBlown(false);
    setShowRevealedContent(false);
    setIsCurtainAnimating(false);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Full Screen Theatrical Curtain Wipe (Closes from Left & Right, then Opens) */}
      <AnimatePresence>
        {isCurtainAnimating && (
          <CurtainReveal
            isActive={isCurtainAnimating}
            onCovered={handleCurtainCovered}
            onFinish={handleCurtainFinish}
          />
        )}
      </AnimatePresence>

      {/* STATE A: BEFORE CANDLE BLOWN - Show Cake & Burning Candle */}
      {!showRevealedContent && (
        <motion.div
          key="cake-state"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/20 text-dusty-rose-dark text-xs font-serif italic mb-2">
              <PartyPopper className="w-3.5 h-3.5 text-dusty-rose" />
              The Grand Birthday Celebration
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-espresso tracking-tight">
              Selamat Ulang Tahun, {birthdayData.partnerName}! 🎂
            </h2>
            <p className="text-xs sm:text-base text-taupe mt-2 max-w-md mx-auto">
              Pejamkan mata bentar, make a wish dalam hati, terus tiup lilinnya yaa sayang!
            </p>
          </div>

          {/* The Assembled Birthday Cake */}
          <div className="mb-6">
            <InteractiveCake
              isBlown={isCandleBlown}
              onCandleBlown={handleCandleBlown}
            />
          </div>
        </motion.div>
      )}

      {/* STATE B: AFTER CANDLE BLOWN - Cake is GONE, ONLY Photos & Letter! */}
      {showRevealedContent && (
        <motion.div
          key="letter-photos-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Header for Letter & Photos */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/20 text-dusty-rose-dark text-xs font-serif italic mb-2">
              <Sparkles className="w-3.5 h-3.5 text-dusty-rose" />
              Doa & Harapan Terbaik
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-espresso tracking-tight">
              Selamat Ulang Tahun, {birthdayData.partnerName}! ♡
            </h2>
            <p className="text-xs sm:text-base text-taupe mt-2 max-w-md mx-auto">
              Semua doa baikmu semoga terkabul yaa sayang... Selamat menikmati kejutan kecil ini!
            </p>
          </div>

          {/* Scrapbook Gallery (Photos) */}
          <section aria-label="Scrapbook Gallery">
            <PolaroidScrapbook />
          </section>

          {/* Editorial Birthday Letter (Letter) */}
          <section aria-label="Editorial Letter">
            <EditorialLetter />
          </section>

          {/* Live Relationship Counter */}
          <section aria-label="Relationship Day Counter">
            <RelationshipCounter />
          </section>

          {/* Final Warm Footer Note */}
          <footer className="text-center py-6 text-taupe text-xs sm:text-sm font-serif border-t border-taupe/10">
            <p>Dibuat spesial dengan tulus buat kesayanganku ♡</p>
            <p className="text-[11px] font-sans text-taupe/60 mt-1">
              "Semua aku dirayakan..." • Bahagia terus yaa, hari ini harimu!
            </p>
          </footer>

          {/* Replay Option: Button to bring back cake & candle to blow again! */}
          <div className="flex flex-col items-center justify-center pt-2 pb-12">
            <button
              type="button"
              onClick={handleReplayCandle}
              className="px-6 py-3 rounded-full bg-warmcard hover:bg-oat border border-taupe/20 text-xs sm:text-sm font-serif font-semibold text-espresso shadow-soft hover:shadow-floating transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              <RotateCcw className="w-4 h-4 text-dusty-rose group-hover:rotate-180 transition-transform duration-500" />
              <span>Nyalakan & Tiup Lilin Lagi 🕯️</span>
            </button>
            <p className="text-[11px] text-taupe/70 font-sans mt-2">
              Mau tiup lilinnya lagi? Klik tombol di atas untuk memunculkan kembali kuenya
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
