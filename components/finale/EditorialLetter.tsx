"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Feather } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";

export default function EditorialLetter() {
  const { mainLetter, partnerName } = birthdayData;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative w-full max-w-2xl mx-auto my-8 p-6 sm:p-10 rounded-3xl bg-warmcard border border-taupe/20 shadow-polaroid"
    >
      {/* Decorative Vintage Paper Edge Accent */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-dusty-rose/40 to-transparent" />

      {/* Top Letterhead */}
      <div className="flex items-center justify-between border-b border-taupe/15 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-dusty-rose" />
          <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-taupe">
            Surat Dari Hatiku • Buat {partnerName}
          </span>
        </div>
        <div className="flex items-center gap-1 text-dusty-rose">
          <Heart className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      {/* Salutation */}
      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-espresso mb-6 tracking-tight">
        {mainLetter.greeting}
      </h3>

      {/* Paragraphs */}
      <div className="space-y-4 font-serif text-espresso/90 text-sm sm:text-base leading-relaxed tracking-normal">
        {mainLetter.paragraphs.map((para, idx) => (
          <p key={idx} className="indent-4 sm:indent-6">
            {para}
          </p>
        ))}
      </div>

      {/* Closing & Signoff */}
      <div className="mt-8 pt-6 border-t border-taupe/15 flex flex-col items-end text-right">
        <p className="text-xs sm:text-sm font-serif italic text-taupe">
          {mainLetter.closing}
        </p>
        <p className="text-sm sm:text-base font-serif font-bold text-espresso mt-1">
          {mainLetter.senderName}
        </p>
      </div>

      {/* Bottom subtle stamp */}
      <div className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-sans tracking-widest text-taupe/60">
          <span>✦</span>
          <span>Selalu Sayang Kamu, Selamanya ♡</span>
          <span>✦</span>
        </span>
      </div>
    </motion.article>
  );
}
