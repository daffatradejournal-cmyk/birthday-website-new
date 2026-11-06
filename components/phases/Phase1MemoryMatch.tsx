"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";

interface CardItem {
  uid: string; // unique for this grid item
  pairId: number;
  localSrc: string;
  fallbackSrc: string;
  caption: string;
  alt: string;
}

interface Phase1MemoryMatchProps {
  onComplete: () => void;
}

export default function Phase1MemoryMatch({ onComplete }: Phase1MemoryMatchProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [activeToast, setActiveToast] = useState<{ caption: string } | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const memoryPhotosList = birthdayData.memoryGamePhotos || birthdayData.memoryPhotos;

  // Initialize and shuffle 4 pairs (8 cards total)
  const initGame = () => {
    const rawPairs: CardItem[] = [];
    memoryPhotosList.forEach((item) => {
      // Create copy A
      rawPairs.push({
        uid: `${item.id}-a`,
        pairId: item.id,
        localSrc: item.localSrc,
        fallbackSrc: item.fallbackSrc,
        caption: item.caption,
        alt: item.alt,
      });
      // Create copy B
      rawPairs.push({
        uid: `${item.id}-b`,
        pairId: item.id,
        localSrc: item.localSrc,
        fallbackSrc: item.fallbackSrc,
        caption: item.caption,
        alt: item.alt,
      });
    });

    // Shuffle using Fisher-Yates
    for (let i = rawPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawPairs[i], rawPairs[j]] = [rawPairs[j], rawPairs[i]];
    }

    setCards(rawPairs);
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setActiveToast(null);
    setIsWon(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    // If already two flipped, or this card is already flipped, or matched -> ignore
    if (
      flippedIndices.length >= 2 ||
      flippedIndices.includes(index) ||
      matchedPairIds.includes(cards[index].pairId)
    ) {
      return;
    }

    soundEngine.playClickSound();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If two cards are now flipped, compare
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        soundEngine.playSuccessChime();
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIndices([]);

        // Show sweet toast caption
        setActiveToast({ caption: firstCard.caption });

        // Check if all 4 pairs matched
        if (nextMatched.length === memoryPhotosList.length) {
          setTimeout(() => {
            setIsWon(true);
          }, 800);
        }
      } else {
        // Not a match: flip back after brief pause
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Title & Instructions */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter/40 border border-butter-light text-espresso text-xs font-serif italic mb-2">
          <Cake className="w-3.5 h-3.5 text-dusty-rose" />
          Kenangan Lucu Kita
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
          Buka Kenangan Kita Berdua
        </h2>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Coba cocokin dua foto yang sama yaa, sambil bernostalgia momen kita berdua ♡
        </p>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-taupe font-medium">
          <span>
            Pasangan:{" "}
            <strong className="text-espresso font-semibold">
              {matchedPairIds.length} / {memoryPhotosList.length}
            </strong>
          </span>
          <span>•</span>
          <span>
            Langkah:{" "}
            <strong className="text-espresso font-semibold">{moves}</strong>
          </span>
          <button
            type="button"
            onClick={initGame}
            className="inline-flex items-center gap-1 ml-2 text-taupe hover:text-espresso transition-colors"
            title="Kocok Ulang"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Floating Memory Match Toast */}
      <div className="min-h-[50px] mb-4 flex items-center justify-center">
        <AnimatePresence>
          {activeToast && (
            <motion.div
              key={activeToast.caption}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-warmcard/95 border border-dusty-rose/30 px-4 py-2 rounded-2xl shadow-soft text-center max-w-md mx-auto"
            >
              <p className="text-xs sm:text-sm font-serif italic text-espresso">
                "{activeToast.caption}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4x2 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {cards.map((card, idx) => {
          const isFlipped =
            flippedIndices.includes(idx) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <div
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              className="relative aspect-[3/4] cursor-pointer perspective-[1000px] select-none"
            >
              <motion.div
                className="w-full h-full relative rounded-xl shadow-soft transition-all duration-500 [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                {/* Back of the card (Editorial Scrapbook Paper Pattern) without # tag */}
                <div className="absolute inset-0 w-full h-full rounded-xl bg-warmcard border-2 border-taupe/15 flex flex-col items-center justify-center p-3 text-center [backface-visibility:hidden] hover:border-dusty-rose/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-oat flex items-center justify-center border border-taupe/20 mb-2">
                    <span className="font-serif text-lg text-dusty-rose">✦</span>
                  </div>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-taupe/70 font-semibold">
                    Kenangan Kita
                  </span>
                  <div className="absolute bottom-2 text-[9px] text-taupe/50 italic font-serif">
                    Klik buat buka
                  </div>
                </div>

                {/* Front of the card (Polaroid Photo with standard img tag) */}
                <div className="absolute inset-0 w-full h-full rounded-xl bg-warmcard border-2 border-dusty-rose/40 p-2 flex flex-col items-center justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
                  <div className="relative w-full h-[76%] rounded-lg overflow-hidden bg-oat">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.localSrc}
                      alt={card.alt}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = card.fallbackSrc;
                      }}
                    />
                    {isMatched && (
                      <div className="absolute top-1.5 right-1.5 bg-sage text-warmcard p-0.5 rounded-full shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="h-[20%] w-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-serif font-medium text-espresso text-center line-clamp-1">
                      {card.alt}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal / Banner */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/30 backdrop-blur-sm"
          >
            <div className="bg-warmcard border border-dusty-rose/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-floating text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-butter/30 absolute -top-6 -right-6 pointer-events-none" />

              <div className="w-16 h-16 rounded-full bg-sage/20 text-sage-dark mx-auto flex items-center justify-center mb-4">
                <Cake className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sage/15 text-sage-dark text-xs font-serif font-semibold uppercase tracking-wider mb-2">
                Pondasi Kuenya Udah Dapet!
              </span>

              <h3 className="text-2xl font-serif font-bold text-espresso">
                Base Kue Ulang Tahunmu Udah Siap! 🎂
              </h3>

              <p className="text-xs sm:text-sm text-taupe mt-2 leading-relaxed">
                Base kuenya udah jadi! Sekarang yuk dengerin lagu favorit kita sambil buka amplop
                surat kecil buat kamu.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSuccessChime();
                    onComplete();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-espresso hover:bg-espresso-light text-warmcard text-xs sm:text-sm font-serif font-semibold tracking-wide inline-flex items-center justify-center gap-2 shadow-soft hover:shadow-floating transition-all"
                >
                  <span>Lanjut Buka Lagu & Amplop ↗</span>
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
