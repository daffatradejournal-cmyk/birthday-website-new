"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Delete, KeyRound, Sparkles, Heart } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";
import PolaroidFrame from "@/components/PolaroidFrame";

interface Phase0LockscreenProps {
  onUnlock: () => void;
}

export default function Phase0Lockscreen({ onUnlock }: Phase0LockscreenProps) {
  const [pin, setPin] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDigit = useCallback(
    (digit: string) => {
      if (isSuccess) return;
      if (pin.length < 4) {
        soundEngine.playClickSound();
        const nextPin = pin + digit;
        setPin(nextPin);
        setIsError(false);

        // Check if 4 digits completed
        if (nextPin.length === 4) {
          if (nextPin === birthdayData.passcode) {
            // Correct PIN!
            setIsSuccess(true);
            soundEngine.playSuccessChime();
            setTimeout(() => {
              onUnlock();
            }, 1200);
          } else {
            // Wrong PIN
            setIsError(true);
            soundEngine.playErrorSound();
            setShowHint(true);
            setTimeout(() => {
              setPin("");
              setIsError(false);
            }, 750);
          }
        }
      }
    },
    [pin, isSuccess, onUnlock]
  );

  const handleDelete = useCallback(() => {
    if (isSuccess) return;
    soundEngine.playClickSound();
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  }, [isSuccess]);

  // Support physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleDelete]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center px-3 sm:px-4 py-2 sm:py-8 min-h-[92dvh] sm:min-h-0">
      {/* Decorative scrap tape & title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-2 sm:mb-5"
      >
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/15 text-dusty-rose-dark text-xs font-serif italic tracking-wide mb-2">
          <Heart className="w-3.5 h-3.5 fill-current text-dusty-rose" />
          A Secret Birthday Room
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-espresso tracking-tight">
          Pintu Rahasia
        </h1>
        <p className="text-[11px] sm:text-sm text-taupe mt-0.5 sm:mt-1 max-w-xs mx-auto">
          Khusus buat kesayanganku yang lagi ulang tahun ♡
        </p>
      </motion.div>

      {/* Polaroid Gate Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-32 sm:w-64 mb-2.5 sm:mb-6"
      >
        <PolaroidFrame
          localSrc={birthdayData.gatePhoto.localSrc}
          fallbackSrc={birthdayData.gatePhoto.fallbackSrc}
          alt="Verifikasi Senyum"
          caption={birthdayData.gatePhoto.caption}
          rotation="-2deg"
          aspectRatio="portrait"
          tapeColor="rose"
          priority
        />
      </motion.div>

      {/* PIN Card Surface */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full bg-warmcard/90 backdrop-blur-sm border border-taupe/15 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-soft text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          {isSuccess ? (
            <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-sage-dark animate-bounce" />
          ) : (
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-dusty-rose" />
          )}
          <span className="text-[11px] sm:text-xs font-serif font-semibold tracking-wider uppercase text-taupe">
            {isSuccess ? "PIN Bener! Buka pintu..." : "Ketik PIN rahasia kita yaa"}
          </span>
        </div>

        {/* PIN Dots with Shake Animation on Error */}
        <motion.div
          animate={
            isError
              ? { x: [-12, 12, -8, 8, -4, 4, 0] }
              : isSuccess
              ? { scale: [1, 1.1, 1] }
              : {}
          }
          transition={{ duration: 0.4 }}
          className="flex justify-center items-center gap-3 sm:gap-4 my-2 sm:my-4"
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSuccess
                    ? "bg-sage border-sage scale-110 shadow-sm"
                    : isError
                    ? "bg-rose-400 border-rose-500 scale-105"
                    : isFilled
                    ? "bg-dusty-rose border-dusty-rose scale-110 shadow-sm"
                    : "border-taupe/30 bg-transparent"
                }`}
              >
                {isFilled && !isError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-warmcard" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Hint alert */}
        <AnimatePresence>
          {showHint && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center my-1.5 text-[11px] sm:text-xs text-dusty-rose-dark bg-dusty-rose/10 py-1 px-3 rounded-full inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{birthdayData.passcodeHint}</span>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center my-1.5 text-[11px] sm:text-xs font-medium text-sage-dark bg-sage/15 py-1 px-3.5 rounded-full inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Kuncinya kebuka! Yuk kumpulin bahan kue ulang tahunmu...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keypad Grid (1 to 9, Clear, 0, Backspace) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-2 sm:mt-4 max-w-[240px] sm:max-w-[280px] mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isSuccess}
              onClick={() => handleDigit(num)}
              className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-oat/70 hover:bg-oat-hover border border-taupe/15 text-base sm:text-lg font-serif font-semibold text-espresso transition-all active:scale-95 hover:border-dusty-rose/40 shadow-xs focus:outline-none"
            >
              {num}
            </button>
          ))}

          {/* Hint / Clear button */}
          <button
            type="button"
            disabled={isSuccess}
            onClick={() => {
              soundEngine.playClickSound();
              setShowHint(true);
            }}
            className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-oat/40 hover:bg-oat border border-taupe/10 text-xs font-serif italic text-taupe transition-all active:scale-95 flex items-center justify-center"
            title="Lihat Petunjuk"
          >
            Hint
          </button>

          {/* Zero */}
          <button
            type="button"
            disabled={isSuccess}
            onClick={() => handleDigit("0")}
            className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-oat/70 hover:bg-oat-hover border border-taupe/15 text-base sm:text-lg font-serif font-semibold text-espresso transition-all active:scale-95 hover:border-dusty-rose/40 shadow-xs focus:outline-none"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            disabled={isSuccess || pin.length === 0}
            onClick={handleDelete}
            className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-oat/40 hover:bg-oat border border-taupe/10 text-espresso transition-all active:scale-95 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Hapus digit"
          >
            <Delete className="w-4 h-4 sm:w-5 sm:h-5 text-taupe hover:text-espresso" />
          </button>
        </div>

        <p className="mt-2.5 sm:mt-4 text-[10px] sm:text-[11px] text-taupe/70 font-sans">
          Bisa diketik langsung di keyboard juga yaa
        </p>
      </motion.div>
    </div>
  );
}
