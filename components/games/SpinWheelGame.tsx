"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Dices, RotateCw, Heart, Gift, Trophy, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundSynth";

interface WheelSlice {
  id: number;
  label: string;
  icon: string;
  detail: string;
  color: string;
  textColor: string;
}

const SLICES: WheelSlice[] = [
  {
    id: 1,
    label: "Pijit Pundak",
    icon: "💆",
    detail: "Dapet pijatan pundak & leher 15 menit biar pegel-pegel kamu langsung hilang!",
    color: "#EBD8CF",
    textColor: "#5A443A",
  },
  {
    id: 2,
    label: "Boba / Minuman",
    icon: "🧋",
    detail: "Bebas pilih varian minuman / boba favorit kamu hari ini, langsung dipesenin!",
    color: "#DCE8DF",
    textColor: "#3D5344",
  },
  {
    id: 3,
    label: "1 Permintaan",
    icon: "✨",
    detail: "Satu permintaan spesial bebas apa aja, wajib diturutin tanpa komplain!",
    color: "#FAF0D2",
    textColor: "#625026",
  },
  {
    id: 4,
    label: "Peluk Erat",
    icon: "🫂",
    detail: "Pelukan erat & hangat 5 menit non-stop sampai kamu ngerasa aman dan tenang.",
    color: "#F6DDD5",
    textColor: "#6B3F35",
  },
  {
    id: 5,
    label: "Dinyanyiin Lagu",
    icon: "🎤",
    detail: "Dinyanyiin lagu favorit pilihan kamu dengan suara merdu khusus buat kesayangan.",
    color: "#EAE3DC",
    textColor: "#53483E",
  },
  {
    id: 6,
    label: "Ice Cream Date",
    icon: "🍦",
    detail: "Makan es krim atau dessert manis bareng hari ini, pilih rasa paling enak!",
    color: "#E2ECE5",
    textColor: "#364F3E",
  },
  {
    id: 7,
    label: "Jalan Santai",
    icon: "🌅",
    detail: "Jalan santai sore berdua, nikmatin sunset sambil ngobrol santai tanpa mikir beban.",
    color: "#F9E4D4",
    textColor: "#6E452E",
  },
  {
    id: 8,
    label: "Kecup Kening",
    icon: "💋",
    detail: "Kecup kening penuh sayang 100x biar kamu tau betapa berharganya kamu buat aku ♡",
    color: "#F5D6D0",
    textColor: "#693630",
  },
];

export default function SpinWheelGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSlice | null>(null);
  const [prizeHistory, setPrizeHistory] = useState<WheelSlice[]>([]);
  const currentRotationRef = useRef(0);
  const spinCountRef = useRef(0);

  const sliceAngle = 360 / SLICES.length;

  const handleSpin = () => {
    if (isSpinning) return;

    soundEngine.playClickSound();
    setIsSpinning(true);
    setWonPrize(null);

    // Play ticking sounds during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      soundEngine.playTone(800 + (tickCount % 4) * 100, 0.05, "sine", 0.04);
      tickCount++;
      if (tickCount > 28) {
        clearInterval(tickInterval);
      }
    }, 140);

    // Pick random target slice (0 to SLICES.length - 1)
    const targetIndex = Math.floor(Math.random() * SLICES.length);

    // Calculate rotation:
    // Pointer is at the top (270 degrees in SVG coordinates or 0 degrees relative to top).
    // Each slice occupies sliceAngle degrees. Slice i spans [i * sliceAngle, (i+1) * sliceAngle].
    // Center of slice i is (i + 0.5) * sliceAngle.
    // For slice i to end up at the top pointer (0 deg):
    // We want (finalRotation % 360) to align with top pointer.
    // Top pointer corresponds to angle = 0.
    // When wheel rotates by R, a slice originally at angle A moves to (A + R) % 360.
    // To make slice center A land at top (270 deg or 0 offset),
    // angle offset = 360 - (targetIndex * sliceAngle + sliceAngle / 2).
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3)); // 5 to 7 full rotations
    const targetOffset = 360 - (targetIndex * sliceAngle + sliceAngle / 2);
    const newRotation = currentRotationRef.current + extraSpins + (targetOffset - (currentRotationRef.current % 360) + 360) % 360;

    currentRotationRef.current = newRotation;
    setRotationDegree(newRotation);

    // Duration matches CSS transition: 4.8 seconds
    setTimeout(() => {
      setIsSpinning(false);
      const selected = SLICES[targetIndex];
      setWonPrize(selected);
      setPrizeHistory((prev) => [selected, ...prev]);

      soundEngine.playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D8A796", "#9CAF9E", "#F3E5AB", "#BA8675", "#FFFFFF"],
      });
    }, 4800);
  };

  return (
    <div className="w-full space-y-6">
      {/* Intro Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/15 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <Dices className="w-3.5 h-3.5 text-dusty-rose" />
          Roda Keberuntungan Cinta
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-espresso">
          Spin The Birthday Wheel 🎰
        </h3>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Putar rodanya dan dapetin hadiah manja dari aku hari ini! Kamu boleh putar lebih dari sekali lho :p
        </p>
      </div>

      {/* Wheel Container */}
      <div className="flex flex-col items-center justify-center relative py-4">
        {/* Pointer Needle at Top */}
        <div className="relative z-30 -mb-5 flex flex-col items-center drop-shadow-md">
          <div className="w-8 h-8 rounded-full bg-dusty-rose-dark border-2 border-white flex items-center justify-center text-white shadow-soft">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-dusty-rose-dark -mt-1" />
        </div>

        {/* The Rotating Wheel SVG */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-2 bg-gradient-to-b from-oat to-warmcard shadow-floating border-4 border-taupe/20">
          <div
            className="w-full h-full rounded-full overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotationDegree}deg)`,
              transitionDuration: isSpinning ? "4.8s" : "0s",
              transitionTimingFunction: "cubic-bezier(0.12, 0.8, 0.32, 1)",
            }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full select-none">
              {SLICES.map((slice, i) => {
                const startAngle = (i * sliceAngle * Math.PI) / 180;
                const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
                const midAngle = ((i + 0.5) * sliceAngle * Math.PI) / 180;

                const x1 = 200 + 195 * Math.sin(startAngle);
                const y1 = 200 - 195 * Math.cos(startAngle);
                const x2 = 200 + 195 * Math.sin(endAngle);
                const y2 = 200 - 195 * Math.cos(endAngle);

                // Text Position
                const textRadius = 135;
                const textX = 200 + textRadius * Math.sin(midAngle);
                const textY = 200 - textRadius * Math.cos(midAngle);
                const textRotate = (i + 0.5) * sliceAngle;

                return (
                  <g key={slice.id}>
                    {/* Wedge Path */}
                    <path
                      d={`M 200 200 L ${x1} ${y1} A 195 195 0 0 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      stroke="#FAF7F2"
                      strokeWidth="2.5"
                    />

                    {/* Content inside wedge */}
                    <g transform={`translate(${textX}, ${textY}) rotate(${textRotate})`}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="20"
                        y="-10"
                      >
                        {slice.icon}
                      </text>
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="serif"
                        fill={slice.textColor}
                        y="10"
                      >
                        {slice.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Decorative Cap */}
          <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-warmcard border-4 border-taupe/25 shadow-soft flex items-center justify-center pointer-events-none z-20">
            <Sparkles className="w-6 h-6 text-dusty-rose animate-pulse" />
          </div>
        </div>

        {/* Spin Trigger Button */}
        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`px-8 py-3.5 rounded-full font-serif font-bold text-sm sm:text-base text-white shadow-floating flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
              isSpinning
                ? "bg-taupe/50 cursor-not-allowed"
                : "bg-dusty-rose hover:bg-dusty-rose-dark"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "Sedang Berputar..." : "Putar Rodanya Sekarang! 🎲"}</span>
          </button>
          <span className="text-[11px] text-taupe mt-2 font-sans">
            Klik tombol untuk memutar roda hadiah keberuntungan
          </span>
        </div>
      </div>

      {/* Won Prize Celebration Card / Modal */}
      <AnimatePresence>
        {wonPrize && !isSpinning && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-5 rounded-2xl bg-warmcard border-2 border-dusty-rose/30 shadow-floating text-center max-w-md mx-auto"
          >
            <div className="text-4xl mb-2">{wonPrize.icon}</div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-dusty-rose font-bold">
              🎉 SELAMAT! KAMU DAPET HADIAH INI:
            </span>
            <h4 className="text-xl font-serif font-bold text-espresso mt-1">
              {wonPrize.label}
            </h4>
            <p className="text-xs text-taupe mt-2 leading-relaxed">
              "{wonPrize.detail}"
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleSpin}
                className="px-4 py-2 rounded-full bg-oat border border-taupe/20 text-xs font-serif font-semibold text-espresso hover:bg-taupe/10 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Putar Lagi</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prize History Tracker */}
      {prizeHistory.length > 0 && (
        <div className="p-4 rounded-xl bg-warmcard border border-taupe/15">
          <div className="flex items-center gap-2 mb-2 text-xs font-serif font-semibold text-espresso">
            <Trophy className="w-4 h-4 text-dusty-rose" />
            <span>Hadiah yang Berhasil Kamu Kumpulin ({prizeHistory.length}):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {prizeHistory.map((prize, idx) => (
              <span
                key={`${prize.id}-${idx}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium border border-taupe/15 bg-alabaster text-espresso"
              >
                <span>{prize.icon}</span>
                <span>{prize.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
