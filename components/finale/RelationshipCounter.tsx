"use client";

import React, { useState, useEffect } from "react";
import { Heart, Clock, Calendar } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";

export default function RelationshipCounter() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date(birthdayData.relationshipStartDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, now - startDate);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-7 rounded-3xl bg-warmcard/80 border border-taupe/15 shadow-soft text-center backdrop-blur-xs">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Heart className="w-4 h-4 fill-dusty-rose text-dusty-rose animate-pulse" />
        <span className="text-xs font-serif font-bold tracking-widest uppercase text-dusty-rose-dark">
          Waktu Bersamamu
        </span>
      </div>

      <h4 className="text-xl sm:text-2xl font-serif font-bold text-espresso">
        Menghitung Setiap Detik Berharga
      </h4>

      <p className="text-xs text-taupe mt-1 max-w-sm mx-auto">
        Sejak tanggal {birthdayData.relationshipStartDate}, dunia terasa jauh lebih indah dan penuh makna.
      </p>

      {/* Grid of 4 Time Units */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-5 max-w-md mx-auto">
        {/* Days */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-oat/70 border border-taupe/10 flex flex-col items-center">
          <span className="text-lg sm:text-2xl font-serif font-bold text-espresso">
            {timeElapsed.days}
          </span>
          <span className="text-[10px] sm:text-xs font-sans text-taupe font-medium uppercase tracking-wider">
            Hari
          </span>
        </div>

        {/* Hours */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-oat/70 border border-taupe/10 flex flex-col items-center">
          <span className="text-lg sm:text-2xl font-serif font-bold text-espresso">
            {timeElapsed.hours}
          </span>
          <span className="text-[10px] sm:text-xs font-sans text-taupe font-medium uppercase tracking-wider">
            Jam
          </span>
        </div>

        {/* Minutes */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-oat/70 border border-taupe/10 flex flex-col items-center">
          <span className="text-lg sm:text-2xl font-serif font-bold text-espresso">
            {timeElapsed.minutes}
          </span>
          <span className="text-[10px] sm:text-xs font-sans text-taupe font-medium uppercase tracking-wider">
            Menit
          </span>
        </div>

        {/* Seconds */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-oat/70 border border-taupe/10 flex flex-col items-center">
          <span className="text-lg sm:text-2xl font-serif font-bold text-espresso">
            {timeElapsed.seconds}
          </span>
          <span className="text-[10px] sm:text-xs font-sans text-taupe font-medium uppercase tracking-wider">
            Detik
          </span>
        </div>
      </div>
    </div>
  );
}
