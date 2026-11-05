"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Gift, PartyPopper } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import InteractiveCake from "@/components/finale/InteractiveCake";
import PolaroidScrapbook from "@/components/finale/PolaroidScrapbook";
import EditorialLetter from "@/components/finale/EditorialLetter";
import RelationshipCounter from "@/components/finale/RelationshipCounter";

export default function Phase4Finale() {
  const [isCandleBlown, setIsCandleBlown] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Grand Finale Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/20 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <PartyPopper className="w-3.5 h-3.5 text-dusty-rose" />
          The Grand Birthday Celebration
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-espresso tracking-tight">
          Selamat Ulang Tahun, {birthdayData.partnerName}! 🎂
        </h2>
        <p className="text-xs sm:text-base text-taupe mt-2 max-w-md mx-auto">
          {isCandleBlown
            ? "Semua doa baik telah terbang ke langit. Ini hadiah dan surat kecil dariku untukmu..."
            : "Make a wish dalam hati, lalu tiup lilin ulang tahunmu!"}
        </p>
      </motion.div>

      {/* The Assembled Birthday Cake Section */}
      <div className="mb-10">
        <InteractiveCake
          isBlown={isCandleBlown}
          onCandleBlown={() => setIsCandleBlown(true)}
          onRelight={() => setIsCandleBlown(false)}
        />
      </div>

      {/* The Grand Reveal Content (Revealed after candle is blown) */}
      <AnimatePresence>
        {isCandleBlown && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Scrapbook Gallery */}
            <section aria-label="Scrapbook Gallery">
              <PolaroidScrapbook />
            </section>

            {/* Editorial Birthday Letter */}
            <section aria-label="Editorial Letter">
              <EditorialLetter />
            </section>

            {/* Live Relationship Counter */}
            <section aria-label="Relationship Day Counter">
              <RelationshipCounter />
            </section>

            {/* Final Warm Footer Note */}
            <footer className="text-center py-8 text-taupe text-xs sm:text-sm font-serif">
              <p>Dibuat dengan segenap cinta, tawa, dan doa terbaik untukmu ♡</p>
              <p className="text-[11px] font-sans text-taupe/60 mt-1">
                Selamat menikmati harimu, tersenyumlah selalu!
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
