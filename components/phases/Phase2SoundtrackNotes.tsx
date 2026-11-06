"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Mail, Heart, CheckCircle, Sparkles, ArrowRight, RotateCcw, X, BookOpen, Play } from "lucide-react";
import { birthdayData, SoftNoteItem, JukeboxTrack } from "@/config/birthdayData";
import { soundEngine } from "@/lib/soundSynth";

interface Phase2SoundtrackNotesProps {
  onComplete: () => void;
}

export default function Phase2SoundtrackNotes({ onComplete }: Phase2SoundtrackNotesProps) {
  // Jukebox & Scrambled Phrase Quiz State
  const jukeboxTracks = birthdayData.jukeboxTracks;
  const [selectedTrack, setSelectedTrack] = useState<JukeboxTrack>(jukeboxTracks[0]);
  const [isPlayingVinyl, setIsPlayingVinyl] = useState(false);

  const quizConfig = birthdayData.songQuiz;
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(quizConfig.scrambledPhraseWords);
  const [isQuizSolved, setIsQuizSolved] = useState(false);
  const [quizError, setQuizError] = useState(false);

  // Soft Notes Envelopes State
  const totalNotes = birthdayData.softNotes.length;
  const [openedNoteIds, setOpenedNoteIds] = useState<number[]>([]);
  const [activeReadingNote, setActiveReadingNote] = useState<SoftNoteItem | null>(null);
  const [isRewardUnlocked, setIsRewardUnlocked] = useState(false);

  // Play a jukebox track
  const handleSelectTrack = (track: JukeboxTrack) => {
    soundEngine.playClickSound();
    setSelectedTrack(track);
    setIsPlayingVinyl(true);

    // Notify persistent AudioController
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("play-custom-track", {
          detail: { audioSrc: track.audioSrc },
        })
      );
    }
  };

  // Handle word chip click in Quiz
  const handleWordSelect = (word: string, index: number) => {
    soundEngine.playClickSound();
    const newSelected = [...selectedWords, word];
    const newAvailable = availableWords.filter((_, i) => i !== index);

    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    setQuizError(false);

    // If all words placed, check result
    if (newSelected.length === quizConfig.scrambledPhraseWords.length) {
      const sentence = newSelected.join(" ");
      if (sentence === quizConfig.correctPhrase) {
        soundEngine.playSuccessChime();
        setIsQuizSolved(true);
      } else {
        soundEngine.playErrorSound();
        setQuizError(true);
      }
    }
  };

  const handleResetQuiz = () => {
    soundEngine.playClickSound();
    setSelectedWords([]);
    setAvailableWords(quizConfig.scrambledPhraseWords);
    setQuizError(false);
  };

  // Handle opening an envelope
  const handleOpenEnvelope = (note: SoftNoteItem) => {
    soundEngine.playClickSound();
    setActiveReadingNote(note);

    if (!openedNoteIds.includes(note.id)) {
      const nextOpened = [...openedNoteIds, note.id];
      setOpenedNoteIds(nextOpened);

      // STRICT CONDITION: User MUST open ALL 4 envelopes to proceed!
      if (nextOpened.length >= totalNotes && !isRewardUnlocked) {
        setTimeout(() => {
          soundEngine.playSuccessChime();
          setIsRewardUnlocked(true);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Title Header without # tag */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/20 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          The Soundtrack & Soft Notes
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
          Melodi Cinta & Surat Kecil
        </h2>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Pilih piringan hitam lagu kita, susun bait liriknya, lalu buka seluruh amplop surat cinta.
        </p>
      </div>

      {/* The Vinyl Jukebox Player & Lyric Scramble */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-warmcard/90 backdrop-blur-sm border border-taupe/15 rounded-3xl p-5 sm:p-7 shadow-soft mb-8 max-w-3xl mx-auto"
      >
        {/* Jukebox Vinyl Selector Tabs without # tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-dusty-rose flex items-center gap-1.5">
              <Disc3 className="w-3.5 h-3.5" />
              Vinyl Jukebox • Lagu Pilihan Kita
            </span>
            <span className="text-[11px] text-taupe font-serif italic">
              Klik piringan untuk memutar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {jukeboxTracks.map((track) => {
              const isCurrent = track.id === selectedTrack.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track)}
                  className={`relative p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center group cursor-pointer ${
                    isCurrent
                      ? "bg-oat border-dusty-rose shadow-soft scale-[1.02]"
                      : "bg-warmcard hover:bg-oat/50 border-taupe/15 hover:border-dusty-rose/40"
                  }`}
                >
                  {/* Vinyl sleeve with standard img */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-sm mb-2 bg-oat border border-taupe/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.coverSrc}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = track.fallbackCoverSrc;
                      }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-espresso/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-warmcard fill-current" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-serif font-bold text-espresso line-clamp-1 text-center">
                    {track.artist}
                  </span>
                  <span className="text-[10px] text-taupe line-clamp-1 text-center">
                    {track.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Spinning Vinyl Turntable UI */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pt-4 border-t border-taupe/10">
          <div
            className="relative flex-shrink-0 cursor-pointer group"
            onClick={() => handleSelectTrack(selectedTrack)}
            title="Klik piringan untuk memutar lagu"
          >
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-espresso flex items-center justify-center shadow-floating border-4 border-taupe/20 transition-transform duration-300 group-hover:scale-105 ${
                isPlayingVinyl ? "animate-spin-slow" : ""
              }`}
            >
              {/* Vinyl Grooves */}
              <div className="w-20 h-20 rounded-full border border-taupe/30 flex items-center justify-center">
                {/* Center label with album cover art */}
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-warmcard shadow-inner relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTrack.coverSrc}
                    alt={selectedTrack.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = selectedTrack.fallbackCoverSrc;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-warmcard shadow-xs" />
                  </div>
                </div>
              </div>
            </div>
            {isQuizSolved && (
              <div className="absolute -top-1 -right-1 bg-sage text-warmcard p-1 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Active Track Info & Play Button */}
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-dusty-rose block">
              Sedang Diputar
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-espresso">
              {selectedTrack.artist} — {selectedTrack.title}
            </h3>
            <p className="text-xs text-taupe mt-1 italic font-serif">
              "{selectedTrack.description || 'Lagu indah yang selalu punya tempat spesial di hati.'}"
            </p>

            <button
              type="button"
              onClick={() => handleSelectTrack(selectedTrack)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dusty-rose text-warmcard text-xs font-serif font-semibold hover:bg-dusty-rose-dark transition-all shadow-soft active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Putar Lagu Ini ({selectedTrack.artist})</span>
            </button>
          </div>
        </div>

        {/* Word Scramble Quiz Area */}
        <div className="mt-6 pt-5 border-t border-taupe/10">
          <div className="text-center sm:text-left mb-3">
            <h4 className="text-sm font-serif font-bold text-espresso">
              Susun Bait Lirik Lagu Kita:
            </h4>
            <p className="text-xs text-taupe">
              {isQuizSolved ? quizConfig.revealedMessage : quizConfig.subtitle}
            </p>
          </div>

          <div
            className={`min-h-[52px] p-3 rounded-2xl border-2 border-dashed flex flex-wrap items-center justify-center gap-2 transition-colors ${
              quizError
                ? "border-rose-400 bg-rose-50/50"
                : isQuizSolved
                ? "border-sage bg-sage/10"
                : "border-taupe/25 bg-oat/40"
            }`}
          >
            {selectedWords.length === 0 ? (
              <span className="text-xs text-taupe/60 italic font-serif">
                Pilih kata-kata di bawah sesuai urutan...
              </span>
            ) : (
              selectedWords.map((word, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-espresso text-warmcard text-xs font-serif font-medium shadow-xs"
                >
                  {word}
                </span>
              ))
            )}
          </div>

          {quizError && (
            <p className="text-xs text-rose-500 text-center mt-2 font-medium">
              Susunannya belum pas nih. Coba klik reset dan ulang lagi ya sayang ♡
            </p>
          )}

          {/* Word Chip Options */}
          {!isQuizSolved && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {availableWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => handleWordSelect(word, idx)}
                  className="px-3 py-1.5 rounded-full bg-warmcard hover:bg-oat-hover border border-taupe/20 text-xs sm:text-sm font-serif font-medium text-espresso shadow-xs hover:border-dusty-rose transition-all active:scale-95"
                >
                  {word}
                </button>
              ))}

              {selectedWords.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="p-1.5 rounded-full hover:bg-oat text-taupe hover:text-espresso transition-colors ml-2"
                  title="Reset susunan kata"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isQuizSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 text-center text-xs font-serif font-medium text-sage-dark bg-sage/15 py-1.5 px-4 rounded-full inline-flex items-center gap-1.5 mx-auto w-full justify-center"
            >
              <CheckCircle className="w-4 h-4 text-sage-dark" />
              <span>Bait lirik terpecahkan! Seluruh amplop rahasia telah terbuka.</span>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* The Soft Notes Grid (MUST OPEN ALL ENVELOPES) */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-espresso text-center sm:text-left">
              Amplop Surat Cinta (Buka Semua Amplop)
            </h3>
            <p className="text-xs text-taupe text-center sm:text-left">
              Buka dan baca semua 4 amplop untuk melanjutkan ke tahap berikutnya.
            </p>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
            openedNoteIds.length === totalNotes
              ? "bg-sage/20 border-sage/40 text-sage-dark"
              : "bg-oat border-taupe/15 text-espresso"
          }`}>
            <BookOpen className="w-3.5 h-3.5 text-dusty-rose" />
            <span>
              Dibuka: <strong>{openedNoteIds.length}</strong> / {totalNotes}{" "}
              {openedNoteIds.length === totalNotes ? "(Lengkap!)" : "(Harus buka semua)"}
            </span>
          </div>
        </div>

        {/* 4 Envelope Cards without # tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {birthdayData.softNotes.map((note) => {
            const isOpened = openedNoteIds.includes(note.id);
            const isLocked = !isQuizSolved;

            return (
              <motion.div
                key={note.id}
                whileHover={!isLocked ? { y: -3, scale: 1.01 } : {}}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (!isLocked) {
                    handleOpenEnvelope(note);
                  }
                }}
                className={`relative rounded-2xl p-5 border transition-all text-left ${
                  isLocked
                    ? "bg-oat/50 border-taupe/10 opacity-60 cursor-not-allowed"
                    : isOpened
                    ? "bg-warmcard border-dusty-rose/40 shadow-soft cursor-pointer"
                    : "bg-warmcard/80 border-taupe/20 shadow-xs hover:border-dusty-rose cursor-pointer"
                }`}
              >
                {/* Vintage Wax Seal Indicator */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border border-black/5"
                      style={{ backgroundColor: note.sealColor }}
                    >
                      <span>{note.stampEmoji}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-taupe block">
                        Surat Untukmu
                      </span>
                      <h4 className="text-sm sm:text-base font-serif font-bold text-espresso leading-snug">
                        {note.title}
                      </h4>
                    </div>
                  </div>

                  {isOpened ? (
                    <span className="text-[11px] font-sans font-medium text-sage-dark bg-sage/20 px-2 py-0.5 rounded-full">
                      Sudah Dibaca
                    </span>
                  ) : (
                    <Mail className="w-4 h-4 text-dusty-rose" />
                  )}
                </div>

                <p className="text-xs text-taupe mt-3 line-clamp-2 italic font-serif">
                  {isLocked
                    ? "Selesaikan susunan lirik di atas untuk membuka amplop ini."
                    : note.subtitle}
                </p>

                <div className="mt-4 pt-3 border-t border-taupe/10 flex items-center justify-between text-[11px]">
                  <span className="text-dusty-rose font-medium">
                    {isOpened ? "Baca ulang surat ↗" : "Klik untuk membuka amplop ↗"}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-dusty-rose/40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Note Reader Modal */}
      <AnimatePresence>
        {activeReadingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-warmcard border border-dusty-rose/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-floating relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClickSound();
                  setActiveReadingNote(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-oat text-taupe hover:text-espresso transition-colors"
                aria-label="Tutup surat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Envelope Header without # tag */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: activeReadingNote.sealColor }}
                >
                  {activeReadingNote.stampEmoji}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-dusty-rose block">
                    Surat Cinta Dari Hatiku
                  </span>
                  <h3 className="text-lg font-serif font-bold text-espresso">
                    {activeReadingNote.title}
                  </h3>
                </div>
              </div>

              {/* Textured Letter Body */}
              <div className="p-5 rounded-2xl bg-oat/50 border border-taupe/15 text-espresso font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-inner max-h-[50vh] overflow-y-auto">
                {activeReadingNote.content}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-taupe font-serif italic">
                <span>Untuk kamu yang selalu berharga ♡</span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClickSound();
                    setActiveReadingNote(null);
                  }}
                  className="px-4 py-2 rounded-full bg-espresso text-warmcard text-xs font-serif font-semibold tracking-wide hover:bg-espresso-light transition-colors"
                >
                  Simpan & Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal upon OPENING ALL 4 ENVELOPES */}
      <AnimatePresence>
        {isRewardUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/30 backdrop-blur-sm"
          >
            <div className="bg-warmcard border border-dusty-rose/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-floating text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-dusty-rose/20 text-dusty-rose-dark mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sage/15 text-sage-dark text-xs font-serif font-semibold uppercase tracking-wider mb-2">
                Semua Surat Telah Dibaca!
              </span>

              <h3 className="text-2xl font-serif font-bold text-espresso">
                Krim & Topping Manis Terkumpul! 🍓
              </h3>

              <p className="text-xs sm:text-sm text-taupe mt-2 leading-relaxed">
                Kue ulang tahunmu sekarang sudah terbalut krim vanila lembut dan buah beri manis.
                Tinggal satu langkah lagi: lilin ulang tahun!
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
                  <span>Lanjut ke Bintang Harapan</span>
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
