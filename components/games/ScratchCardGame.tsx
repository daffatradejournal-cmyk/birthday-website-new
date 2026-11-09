"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, RotateCcw, Copy, Heart, Gift, Award, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundSynth";

interface CouponItem {
  id: number;
  badge: string;
  title: string;
  description: string;
  icon: string;
  code: string;
  accentColor: string;
  bgLight: string;
}

const COUPONS: CouponItem[] = [
  {
    id: 1,
    badge: "KULINER DATE",
    title: "1x Bebas Pilih Makan Ditraktir",
    description:
      "Bebas pilih mau makan di mana aja, makanan favorit apa aja, ditraktir sampai kenyang tanpa debat!",
    icon: "🍜",
    code: "HBD-MAKAN-PUAS",
    accentColor: "#C87D65",
    bgLight: "#FBF3EF",
  },
  {
    id: 2,
    badge: "PASSPORT MANJA",
    title: "1x Bebas Ngambek Seharian",
    description:
      "Berlaku 24 jam! Ga boleh dibalas ngambek, ga boleh dimarahin, dan wajib dibujuk plus disayang terus :p",
    icon: "🎟️",
    code: "HBD-ANTI-NGAMBEK",
    accentColor: "#D8A796",
    bgLight: "#FAF3F1",
  },
  {
    id: 3,
    badge: "CINEMA TIME",
    title: "1x Movie Date & Popcorn",
    description:
      "Nonton film apa aja pilihan kamu di bioskop, lengkap sama popcorn manis & minuman favorit berdua!",
    icon: "🍿",
    code: "HBD-MOVIE-DATE",
    accentColor: "#8FA396",
    bgLight: "#F2F7F4",
  },
  {
    id: 4,
    badge: "COMFORT ZONE",
    title: "1x Peluk Hangat & Curhat",
    description:
      "Pelukan hangat tanpa batas waktu plus telinga yang siap dengerin semua cerita atau keluh kesahmu sampai plong ♡",
    icon: "🫂",
    code: "HBD-PELUK-HANGAT",
    accentColor: "#A98467",
    bgLight: "#F8F5F1",
  },
];

interface ScratchCardProps {
  coupon: CouponItem;
  isClaimed: boolean;
  onClaim: (id: number) => void;
}

function SingleScratchCard({ coupon, isClaimed, onClaim }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize Foil Surface
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Draw shimmering foil gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#D9CEBF");
    gradient.addColorStop(0.3, "#E8DFD3");
    gradient.addColorStop(0.5, "#F7F3EB");
    gradient.addColorStop(0.7, "#DFD5C7");
    gradient.addColorStop(1, "#CEBFB0");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle luxury speckles
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 40; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * rect.width;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * rect.height;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border inner dashed stroke
    ctx.strokeStyle = "rgba(160, 140, 125, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(8, 8, rect.width - 16, rect.height - 16);
    ctx.setLineDash([]);

    // Foil Guide Text
    ctx.fillStyle = "#6E5E56";
    ctx.font = "bold 13px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ GOSOK DI SINI ✦", rect.width / 2, rect.height / 2 - 8);

    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#8C7B72";
    ctx.fillText("Usap pakai jari / kursor", rect.width / 2, rect.height / 2 + 12);

    setIsScratched(false);
    setScratchPercent(0);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isScratched) initCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas, isScratched]);

  // Check progress
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Sample a lower-res grid for fast performance
      const sampleWidth = Math.floor(canvas.width / 6);
      const sampleHeight = Math.floor(canvas.height / 6);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparentPixels = 0;
      let totalSamples = 0;

      for (let y = 0; y < canvas.height; y += 8 * dpr) {
        for (let x = 0; x < canvas.width; x += 8 * dpr) {
          totalSamples++;
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3;
          if (data[index] < 128) {
            transparentPixels++;
          }
        }
      }

      const percent = Math.round((transparentPixels / Math.max(totalSamples, 1)) * 100);
      setScratchPercent(percent);

      if (percent >= 40 && !isScratched) {
        setIsScratched(true);
        soundEngine.playSuccessChime();
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#D8A796", "#9CAF9E", "#F3E5AB"],
        });
      }
    } catch {
      // Ignore security/performance issues with sampling
    }
  }, [isScratched]);

  // Scratch Drawing
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    if (lastPointRef.current) {
      ctx.lineWidth = 36 * dpr;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 18 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPointRef.current = { x, y };
  };

  // Touch & Pointer Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPointRef.current = null;
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault(); // Prevent mobile screen scroll while scratching!
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
    checkScratchPercentage();
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPointRef.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratchAt(e.clientX, e.clientY);
    checkScratchPercentage();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-taupe/20 bg-warmcard shadow-soft overflow-hidden select-none transition-all hover:shadow-floating flex flex-col justify-between"
      style={{ minHeight: "220px" }}
    >
      {/* Ticket Cutout Notches */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-alabaster border-r border-taupe/20 pointer-events-none z-10" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-alabaster border-l border-taupe/20 pointer-events-none z-10" />

      {/* Underneath Card Content (The Revealed Prize) */}
      <div
        className="p-5 flex-1 flex flex-col justify-between"
        style={{ backgroundColor: coupon.bgLight }}
      >
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: `${coupon.accentColor}25`,
                color: coupon.accentColor,
              }}
            >
              ✦ {coupon.badge}
            </span>
            <span className="text-2xl">{coupon.icon}</span>
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-espresso leading-snug">
            {coupon.title}
          </h3>

          <p className="text-xs text-taupe mt-1.5 leading-relaxed font-sans">
            {coupon.description}
          </p>
        </div>

        {/* Footer info & Claim Action */}
        <div className="mt-4 pt-3 border-t border-taupe/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-taupe/70 font-mono">
              Kode Voucher
            </span>
            <span className="text-xs font-mono font-bold text-espresso tracking-wide">
              {coupon.code}
            </span>
          </div>

          {isClaimed ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted-sage/20 text-muted-sage-dark text-xs font-serif font-semibold border border-muted-sage/30">
              <Check className="w-3.5 h-3.5" />
              Sudah Diklaim!
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onClaim(coupon.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-semibold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: coupon.accentColor }}
            >
              <Heart className="w-3 h-3 fill-white" />
              <span>Klaim Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* The Scratchable Canvas Overlay */}
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute inset-0 w-full h-full cursor-pointer touch-none z-20 transition-opacity duration-700 ${
          isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Scratched Stamp Animation */}
      {isClaimed && (
        <motion.div
          initial={{ scale: 2, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        >
          <div className="border-4 border-dashed border-dusty-rose-dark px-4 py-2 rounded-xl bg-warmcard/80 backdrop-blur-xs text-dusty-rose-dark font-serif font-extrabold text-sm uppercase tracking-widest shadow-floating">
            ✓ KLAIM RESMI SAYANG ♡
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ScratchCardGame() {
  const [claimedCoupons, setClaimedCoupons] = useState<number[]>([]);
  const [activeModalCoupon, setActiveModalCoupon] = useState<CouponItem | null>(null);

  const handleClaim = (couponId: number) => {
    soundEngine.playSparkleSound();
    if (!claimedCoupons.includes(couponId)) {
      setClaimedCoupons((prev) => [...prev, couponId]);
    }
    const found = COUPONS.find((c) => c.id === couponId);
    if (found) {
      setActiveModalCoupon(found);
    }
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D8A796", "#9CAF9E", "#F3E5AB", "#BA8675"],
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Intro Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/15 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <Gift className="w-3.5 h-3.5 text-dusty-rose" />
          Kado Kupon Gosok Nyata
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-espresso">
          Kupon Spesial Ulang Tahun 🎟️
        </h3>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Gosok foil keemasannya pakai jarimu buat buka kupon rahasianya. Semua kupon ini asli dan bisa kamu klaim kapan aja ke aku!
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {COUPONS.map((coupon) => (
          <SingleScratchCard
            key={coupon.id}
            coupon={coupon}
            isClaimed={claimedCoupons.includes(coupon.id)}
            onClaim={handleClaim}
          />
        ))}
      </div>

      {/* Bottom Claimed Counter */}
      <div className="p-3 sm:p-4 rounded-xl bg-warmcard border border-taupe/15 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-dusty-rose" />
          <span className="text-xs sm:text-sm font-serif font-medium text-espresso">
            Kupon terkumpul: <strong className="text-dusty-rose">{claimedCoupons.length}</strong> / {COUPONS.length}
          </span>
        </div>
        <p className="text-[11px] text-taupe font-sans">
          💡 Cara pakai: Screenshot kupon yang udah kamu klaim, terus kirim ke chat aku yaa!
        </p>
      </div>

      {/* Claim Confirmation Modal */}
      <AnimatePresence>
        {activeModalCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="w-full max-w-md rounded-2xl bg-warmcard p-6 shadow-floating border border-taupe/20 text-center relative"
            >
              <div className="text-4xl mb-3">{activeModalCoupon.icon}</div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-dusty-rose font-bold">
                KUPON RESMI TERKLAIM
              </span>
              <h4 className="text-xl font-serif font-bold text-espresso mt-1">
                {activeModalCoupon.title}
              </h4>
              <p className="text-xs text-taupe mt-2 leading-relaxed">
                "{activeModalCoupon.description}"
              </p>

              <div className="my-4 p-3 rounded-xl bg-alabaster border border-taupe/15 text-xs text-espresso font-mono flex items-center justify-between">
                <span>KODE: <strong>{activeModalCoupon.code}</strong></span>
                <span className="text-[10px] text-dusty-rose font-serif italic">Masa Berlaku: Selamanya</span>
              </div>

              <p className="text-xs text-taupe/80 font-sans mb-4">
                Screenshot kartu ini sekarang dan kirim ke WhatsApp aku yaa sayang! Pasti langsung aku penuhin janjinya ♡
              </p>

              <button
                type="button"
                onClick={() => setActiveModalCoupon(null)}
                className="w-full py-2.5 rounded-full bg-espresso text-warmcard text-xs sm:text-sm font-serif font-semibold hover:bg-espresso/90 active:scale-98 transition-all cursor-pointer"
              >
                Siap, Simpan Kupon Ini! ♡
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
