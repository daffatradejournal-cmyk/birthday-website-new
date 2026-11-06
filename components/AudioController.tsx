"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Disc3, SkipForward, Music } from "lucide-react";
import { birthdayData } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";

interface AudioControllerProps {
  currentPhase: number;
  autoStartOnPhase0Unlock?: boolean;
}

export interface PlayableTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  tag: string;
}

export default function AudioController({
  currentPhase,
  autoStartOnPhase0Unlock = false,
}: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [useSynthFallback, setUseSynthFallback] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Complete playlist
  const playlist: PlayableTrack[] = [
    {
      id: "bgm-main",
      title: "Warm Acoustic Memories",
      artist: "Lagu Tema Utama",
      src: birthdayData.bgmMain || birthdayData.audioTracks.main,
      tag: "Musik Pembuka",
    },
    ...birthdayData.jukeboxTracks.map((jt) => ({
      id: `song-${jt.id}`,
      title: jt.title,
      artist: jt.artist,
      src: jt.audioSrc,
      tag: `Pilihan: ${jt.artist}`,
    })),
    {
      id: "bgm-ending",
      title: "Semua Aku Dirayakan",
      artist: "Nadin Amizah",
      src: birthdayData.bgmEnding || birthdayData.audioTracks.ending,
      tag: "Musik Puncak • Nadin Amizah",
    },
  ];

  const currentTrack = playlist[activeTrackIndex] || playlist[0];

  // Direct, rock-solid audio playback function (NO 2-click delays!)
  const playTrackDirectly = useCallback(
    (index: number) => {
      setActiveTrackIndex(index);
      const target = playlist[index];
      const audio = audioRef.current;
      if (!audio) return;

      try {
        const fullTarget = new URL(target.src, window.location.origin).href;
        if (audio.src !== fullTarget) {
          audio.src = target.src;
        }
        audio.currentTime = 0;
        audio.muted = isMuted;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setUseSynthFallback(false);
            })
            .catch((err) => {
              console.warn("Audio autoplay blocked by browser policy, using fallback synth:", err);
              setUseSynthFallback(true);
              soundEngine.switchTrack(index === playlist.length - 1 ? "ending" : "main");
            });
        }
      } catch (err) {
        console.error("Playback error:", err);
      }
    },
    [playlist, isMuted]
  );

  // Safe play helper
  const triggerPlay = useCallback(async () => {
    setIsPlaying(true);
    if (useSynthFallback) {
      soundEngine.startBackgroundMusic(activeTrackIndex === playlist.length - 1 ? "ending" : "main");
      return;
    }

    if (audioRef.current) {
      try {
        if (!audioRef.current.src) {
          audioRef.current.src = currentTrack.src;
        }
        await audioRef.current.play();
        setUseSynthFallback(false);
      } catch {
        setUseSynthFallback(true);
        soundEngine.startBackgroundMusic(activeTrackIndex === playlist.length - 1 ? "ending" : "main");
      }
    } else {
      soundEngine.startBackgroundMusic(activeTrackIndex === playlist.length - 1 ? "ending" : "main");
    }
  }, [activeTrackIndex, currentTrack.src, playlist.length, useSynthFallback]);

  const triggerPause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    soundEngine.stopBackgroundMusic();
  }, []);

  const togglePlayPause = () => {
    soundEngine.playClickSound();
    if (isPlaying) {
      triggerPause();
    } else {
      triggerPlay();
    }
  };

  const toggleMute = () => {
    soundEngine.playClickSound();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    soundEngine.setMute(nextMuted);
  };

  const nextTrack = () => {
    const nextIdx = (activeTrackIndex + 1) % playlist.length;
    playTrackDirectly(nextIdx);
  };

  // Initialize source once on mount
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      audioRef.current.src = playlist[0].src;
    }
  }, [playlist]);

  // Handle auto-start upon unlocking Phase 0
  useEffect(() => {
    if (autoStartOnPhase0Unlock && currentPhase >= 1 && !isPlaying) {
      playTrackDirectly(0);
    }
  }, [currentPhase, autoStartOnPhase0Unlock, isPlaying, playTrackDirectly]);

  // Global events listener
  useEffect(() => {
    // 1. Play custom track (INSTANT 1-CLICK from Jukebox in Phase 2)
    const handleCustomPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ audioSrc: string }>;
      if (customEvent.detail && customEvent.detail.audioSrc) {
        const foundIdx = playlist.findIndex((p) => p.src === customEvent.detail.audioSrc);
        if (foundIdx !== -1) {
          playTrackDirectly(foundIdx);
        }
      }
    };

    // 2. Ensure music is playing (e.g. when tapping stars in Phase 3)
    const handleEnsurePlaying = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    // 3. Play finale celebration music ("Semua Aku Dirayakan - Nadin Amizah" when candle is blown)
    const handlePlayFinale = () => {
      const endingIndex = playlist.length - 1;
      playTrackDirectly(endingIndex);
    };

    window.addEventListener("play-custom-track", handleCustomPlay as EventListener);
    window.addEventListener("ensure-music-playing", handleEnsurePlaying);
    window.addEventListener("play-finale-music", handlePlayFinale);

    return () => {
      window.removeEventListener("play-custom-track", handleCustomPlay as EventListener);
      window.removeEventListener("ensure-music-playing", handleEnsurePlaying);
      window.removeEventListener("play-finale-music", handlePlayFinale);
    };
  }, [playlist, playTrackDirectly]);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setTrackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      // Loop the current track so music NEVER stops!
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const handleError = () => {
      setUseSynthFallback(true);
      if (isPlaying) {
        soundEngine.startBackgroundMusic(activeTrackIndex === playlist.length - 1 ? "ending" : "main");
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [activeTrackIndex, isPlaying]);

  // Only show after Phase 0 has started or is unlocked
  const isVisible = currentPhase >= 1 || isPlaying;
  if (!isVisible) return null;

  return (
    <>
      {/* 
        CRUCIAL FIX FOR 1-CLICK:
        Audio element is uncontrolled by React's src prop. 
        Setting src imperatively avoids React re-render abort interruptions!
      */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        playsInline
      />

      {/* Floating Vinyl Audio Controller */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex flex-col items-end">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-2.5 w-72 max-w-[calc(100vw-1.5rem)] p-3 sm:p-3.5 rounded-2xl bg-warmcard/95 border border-taupe/15 shadow-floating backdrop-blur-md text-espresso max-h-[380px] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-dusty-rose block">
                    Sedang Diputar
                  </span>
                  <h4 className="text-xs font-serif font-bold text-espresso leading-snug">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] text-taupe">
                    {currentTrack.artist}
                  </p>
                </div>
                <div className="p-1 rounded-full bg-oat text-taupe">
                  <Music className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-oat rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-dusty-rose transition-all duration-300"
                  style={{ width: `${isPlaying ? (trackProgress || 30) : 0}%` }}
                />
              </div>

              {/* Playlist items */}
              <div className="space-y-1 mb-3 pt-1 border-t border-taupe/10">
                <span className="text-[9px] uppercase tracking-wider text-taupe/70 font-semibold block px-1">
                  Daftar Lagu ({playlist.length} Pilihan)
                </span>
                {playlist.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => playTrackDirectly(idx)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      idx === activeTrackIndex
                        ? "bg-dusty-rose/15 text-dusty-rose-dark font-medium"
                        : "hover:bg-oat text-espresso/80"
                    }`}
                  >
                    <span className="line-clamp-1">{item.title}</span>
                    <span className="text-[10px] text-taupe ml-1 shrink-0">{item.artist.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Controls inside popover */}
              <div className="flex items-center justify-between pt-2 border-t border-taupe/10">
                <button
                  type="button"
                  onClick={nextTrack}
                  className="flex items-center gap-1 text-[11px] font-medium text-taupe hover:text-espresso transition-colors px-2 py-1 rounded-lg hover:bg-oat"
                  title="Lagu Berikutnya"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Berikutnya</span>
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-taupe hover:text-espresso hover:bg-oat transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-dusty-rose" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Vinyl Capsule Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 p-1.5 pl-2.5 rounded-full bg-warmcard/95 border border-taupe/20 shadow-floating backdrop-blur-md"
        >
          {/* Vinyl Disc Icon (Spins when playing) */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 group cursor-pointer pr-1"
            title="Klik untuk daftar lagu"
          >
            <div
              className={`relative flex items-center justify-center w-7 h-7 rounded-full bg-espresso text-warmcard transition-transform duration-500 ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            >
              <Disc3 className="w-4 h-4 text-butter" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-dusty-rose" />
            </div>

            <div className="hidden sm:flex flex-col text-left max-w-[110px]">
              <span className="text-[10px] font-serif font-bold text-espresso leading-none truncate">
                {currentTrack.title}
              </span>
              <span className="text-[9px] text-taupe leading-none mt-0.5 truncate">
                {isPlaying ? currentTrack.artist : "Jeda"}
              </span>
            </div>
          </button>

          {/* Quick Play/Pause button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-7 h-7 rounded-full bg-dusty-rose hover:bg-dusty-rose-dark text-warmcard flex items-center justify-center transition-colors shadow-sm"
            aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Quick Mute button */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-7 h-7 rounded-full hover:bg-oat text-taupe hover:text-espresso flex items-center justify-center transition-colors"
            aria-label={isMuted ? "Nyalakan Suara" : "Bisukan Suara"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-dusty-rose" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </motion.div>
      </div>
    </>
  );
}
