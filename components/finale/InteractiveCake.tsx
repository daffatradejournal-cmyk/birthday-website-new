"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Mic, MicOff, Wind, Sparkles, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundSynth";

interface InteractiveCakeProps {
  onCandleBlown: () => void;
  isBlown: boolean;
  onRelight?: () => void;
}

export default function InteractiveCake({
  onCandleBlown,
  isBlown,
  onRelight,
}: InteractiveCakeProps) {
  const [isMicListening, setIsMicListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isLit, setIsLit] = useState(!isBlown);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLit(!isBlown);
  }, [isBlown]);

  // Trigger Confetti in Warm Pastel Colors
  const firePastelConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#D8A796", "#9CAF9E", "#F3E5AB", "#F2DCD4", "#C87D65", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Blow out candle execution
  const executeBlow = () => {
    if (!isLit) return;
    soundEngine.playCandleBlowSound();
    setIsLit(false);
    stopMicListening();
    firePastelConfetti();
    setTimeout(() => {
      soundEngine.playSuccessChime();
      onCandleBlown();
    }, 400);
  };

  // Relight candle
  const handleRelight = () => {
    soundEngine.playSparkleSound();
    setIsLit(true);
    if (onRelight) onRelight();
  };

  // Mic Detection for blowing
  const startMicListening = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Threshold for blowing into mic
        if (average > 48) {
          executeBlow();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      animationFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (err: any) {
      setMicError("Mikrofon tidak dapat diakses atau izin ditolak. Kamu tetap bisa klik tombol di bawah!");
      setIsMicListening(false);
    }
  };

  const stopMicListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicListening(false);
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* SVG Birthday Cake Container */}
      <div className="relative w-64 sm:w-72 h-72 sm:h-80 select-none">
        <svg
          viewBox="0 0 300 320"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cake Stand / Porcelain Plate */}
          <ellipse cx="150" cy="285" rx="125" ry="18" fill="#EDE6DF" stroke="#D8CFC7" strokeWidth="2" />
          <path d="M125 285 L135 305 L165 305 L175 285 Z" fill="#E2DAD2" />
          <ellipse cx="150" cy="305" rx="30" ry="6" fill="#D3C9BF" />

          {/* LAYER 1: BASE CAKE (Sponge Cake) */}
          <rect x="50" y="200" width="200" height="75" rx="14" fill="#E8D1BA" />
          <ellipse cx="150" cy="200" rx="100" ry="16" fill="#F0DCB8" />

          {/* Chocolate / Caramel Cream Swirl & Drips */}
          <path
            d="M50 215 C65 235, 75 210, 90 228 C105 240, 115 215, 130 230 C145 245, 155 212, 170 232 C185 242, 195 215, 210 230 C225 240, 235 215, 250 218 L250 200 L50 200 Z"
            fill="#D49E8D"
            opacity="0.85"
          />

          {/* LAYER 2: TOP TIER (Sweet Cream & Berries) */}
          <rect x="80" y="140" width="140" height="65" rx="12" fill="#FAF5EE" stroke="#EFE6DA" strokeWidth="1.5" />
          <ellipse cx="150" cy="140" rx="70" ry="14" fill="#FFFBF5" />

          {/* Cream Dripping Waves */}
          <path
            d="M80 152 C90 166, 98 148, 110 162 C122 170, 130 152, 142 165 C154 172, 162 152, 174 166 C186 172, 194 152, 206 162 C214 168, 218 152, 220 154 L220 140 L80 140 Z"
            fill="#F4EAE0"
          />

          {/* Strawberries & Berries Topping */}
          {/* Strawberry 1 */}
          <path d="M125 130 C120 120, 130 114, 135 125 C140 132, 130 138, 125 130 Z" fill="#D36B64" />
          <circle cx="127" cy="126" r="1" fill="#FFF" />
          <circle cx="132" cy="128" r="1" fill="#FFF" />
          <path d="M128 118 L130 114 L133 118 Z" fill="#9CAF9E" />

          {/* Strawberry 2 */}
          <path d="M165 130 C160 120, 170 114, 175 125 C180 132, 170 138, 165 130 Z" fill="#D36B64" />
          <circle cx="167" cy="126" r="1" fill="#FFF" />
          <circle cx="172" cy="128" r="1" fill="#FFF" />
          <path d="M168 118 L170 114 L173 118 Z" fill="#9CAF9E" />

          {/* Blueberries */}
          <circle cx="108" cy="138" r="5" fill="#6B728E" />
          <circle cx="192" cy="138" r="5" fill="#6B728E" />
          <circle cx="150" cy="144" r="4.5" fill="#6B728E" />

          {/* LAYER 3: BIRTHDAY CANDLE */}
          {/* Candle Body */}
          <rect x="144" y="80" width="12" height="48" rx="4" fill="#FDF8E8" stroke="#EADCB0" strokeWidth="1" />
          {/* Candle Stripes */}
          <path d="M144 92 L156 86 M144 104 L156 98 M144 116 L156 110" stroke="#D8A796" strokeWidth="2.5" strokeLinecap="round" />
          {/* Wick */}
          <line x1="150" y1="80" x2="150" y2="70" stroke="#423835" strokeWidth="2" strokeLinecap="round" />

          {/* FLAME & GLOW (Interactive & Animated) */}
          {isLit && (
            <g className="animate-flicker origin-bottom" style={{ transformOrigin: "150px 70px" }}>
              {/* Outer Warm Glow */}
              <circle cx="150" cy="58" r="26" fill="#F3E5AB" opacity="0.35" />
              {/* Mid Orange Flame */}
              <path
                d="M150 40 C143 52, 142 62, 150 70 C158 62, 157 52, 150 40 Z"
                fill="#F39C12"
              />
              {/* Inner Bright Yellow Core */}
              <path
                d="M150 47 C146 54, 145 61, 150 67 C155 61, 154 54, 150 47 Z"
                fill="#FFF9D2"
              />
            </g>
          )}

          {/* Smoke Puffs if blown */}
          {!isLit && (
            <g className="animate-float-gentle opacity-50">
              <path
                d="M150 68 C148 60, 154 52, 150 42 C146 32, 152 24, 149 16"
                stroke="#A89F98"
                strokeWidth="2"
                strokeDasharray="2 3"
                fill="none"
              />
            </g>
          )}
        </svg>

        {/* Clickable Flame Hitbox */}
        {isLit && (
          <button
            type="button"
            onClick={executeBlow}
            className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full cursor-pointer hover:bg-butter/20 transition-colors flex items-center justify-center focus:outline-none"
            title="Klik untuk tiup lilin!"
            aria-label="Tiup lilin dengan klik"
          />
        )}
      </div>

      {/* Candle Interaction Control Buttons */}
      <div className="mt-4 flex flex-col items-center gap-2.5">
        {isLit ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Main Button: Tiup Lilin */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={executeBlow}
                className="px-6 py-3 rounded-full bg-dusty-rose hover:bg-dusty-rose-dark text-warmcard text-xs sm:text-sm font-serif font-bold tracking-wide shadow-soft flex items-center gap-2 transition-all cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                <span>Tiup Lilinnya (Klik di Sini)</span>
              </motion.button>

              {/* Mic Detection Toggle */}
              <button
                type="button"
                onClick={isMicListening ? stopMicListening : startMicListening}
                className={`px-4 py-2.5 rounded-full border text-xs font-serif font-medium flex items-center gap-2 transition-all ${
                  isMicListening
                    ? "bg-sage text-warmcard border-sage shadow-xs animate-pulse"
                    : "bg-warmcard hover:bg-oat text-taupe hover:text-espresso border-taupe/20"
                }`}
                title="Aktifkan tiup lilin via mic"
              >
                {isMicListening ? (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Mic Aktif (Tiup ke HP/Laptop)</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Gunakan Mic untuk Tiup</span>
                  </>
                )}
              </button>
            </div>

            {micError && (
              <p className="text-[11px] text-taupe/80 text-center max-w-xs mt-1">
                {micError}
              </p>
            )}
          </>
        ) : (
          /* When blown out: Option to re-light */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRelight}
              className="px-4 py-2 rounded-full bg-warmcard hover:bg-oat border border-taupe/20 text-xs font-serif font-medium text-taupe hover:text-espresso flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-dusty-rose" />
              <span>Nyalakan Lilin Lagi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
