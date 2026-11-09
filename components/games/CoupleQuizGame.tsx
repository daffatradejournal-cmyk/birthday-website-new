"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, CheckCircle2, Award, RotateCcw, HelpCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundSynth";
import { birthdayData } from "@/config/birthdayData";

interface QuizOption {
  text: string;
  reaction: string;
  isFavorite?: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Kalau lagi jalan berdua, siapa yang paling sering tiba-tiba bilang 'Laper, mau jajan...'?",
    subtitle: "Jawab jujur yaa, jangan lempar batu sembunyi tangan :p",
    options: [
      {
        text: "Kamu, yang matanya langsung ijo liat jajan lucu",
        reaction: "Wkwkwk bener banget! Apalagi kalo liat jajanan manis pinggir jalan yaa!",
      },
      {
        text: "Aku, yang perutnya emang ga bisa diajak kompromi",
        reaction: "Haha iyaa, pas udah laper langsung cemberut mukanya gemesin!",
      },
      {
        text: "Dua-duanya sama aja, hobi kulineran bareng!",
        reaction: "Fix! Definisi pasangan klop, perut kenyang hati senang ♡",
        isFavorite: true,
      },
      {
        text: "Tergantung ada yang nawarin boba apa engga",
        reaction: "Hehe boba emang selalu jadi solusi segala suasana!",
      },
    ],
  },
  {
    id: 2,
    question: "Pas hari lagi berat dan cape banget, apa obat paling ampuh buat bikin tenang?",
    subtitle: "Pilih yang paling bikin hati kamu adem...",
    options: [
      {
        text: "Disenderin kepala & dipeluk erat berdua",
        reaction: "Aaww.. senderin aja terus kepalamu yaa, selalu ada pelukan buat kamu ♡",
        isFavorite: true,
      },
      {
        text: "Dikasih makan enak & dessert favorit",
        reaction: "Makanan enak emang obat hati nomor satu tanpa tanding!",
      },
      {
        text: "Didengerin curhatnya tanpa dihakimi",
        reaction: "Iya sayang, telingaku selalu siap dengerin cerita kamu kapanpun.",
      },
      {
        text: "Semua jawaban di atas dilakukan berurutan!",
        reaction: "Paket komplit! Wajib banget dipenuhin semuanya buat kesayangan!",
      },
    ],
  },
  {
    id: 3,
    question: "Tanggal jadian kita yang bener tanggal berapa hayoo? Awas kalau salah klik! :p",
    subtitle: "Uji ingatan tanggal paling keramat kita nih...",
    options: [
      {
        text: "26 Juni 2023 (Tanggal resmi & sah kita ♡)",
        reaction: "PINTEERRR! 26 Juni 2023 dong, ga bakal pernah lupa! ♡",
        isFavorite: true,
      },
      {
        text: "23 Juni 2023 (Hehe hampir mirip)",
        reaction: "Wkwkwk salah dikit! Itu tanggal gladi resik kali yaa :p",
      },
      {
        text: "26 Juli 2023 (Beda bulan oy!)",
        reaction: "Hayo ketuker bulannya! Yang bener Juni yaa sayangku :p",
      },
      {
        text: "Pokoknya pas kita udah ga bisa pisah lagi hehe",
        reaction: "Jawabannya diplomatis tapi manis banget! Boleh deh dapet nilai 100!",
      },
    ],
  },
  {
    id: 4,
    question: "Hal apa dari kamu yang paling sering bikin aku jatuh cinta lagi dan lagi?",
    subtitle: "Mungkin kamu ga sadar, tapi ini nyata banget...",
    options: [
      {
        text: "Senyum & tawa lepasmu yang selalu nular",
        reaction: "Tiap liat kamu ketawa lepas, duniaku langsung berasa ringan banget ♡",
      },
      {
        text: "Caramu nerima aku apa adanya tanpa nuntut",
        reaction: "Beneran, cuma sama kamu aku bisa jadi diri sendiri seutuhnya.",
      },
      {
        text: "Perhatian & kebiasaan kecilmu yang bikin anget",
        reaction: "Hal-hal kecil dari kamu tuh selalu berharga banget di mataku.",
      },
      {
        text: "Semuanya, dari ujung kepala sampe sifat manjamu ♡",
        reaction: "Bener banget! Ga ada yang kurang, aku sayang kamu seutuhnya ♡",
        isFavorite: true,
      },
    ],
  },
  {
    id: 5,
    question: "Di umur barumu ini, janji apa yang wajib kita jaga sama-sama?",
    subtitle: "Komitmen cinta buat hari-hari panjang ke depan...",
    options: [
      {
        text: "Saling gandeng tangan mau seneng ataupun susah",
        reaction: "Janji yaa! Susah seneng kita lewatin berdua bareng-bareng ♡",
      },
      {
        text: "Jangan tidur pas masih ada ganjelan atau marahan",
        reaction: "Setuju! Selesaiin baik-baik dengan kepala dingin dan pelukan hangat.",
      },
      {
        text: "Tetep jadi rumah yang paling nyaman buat pulang",
        reaction: "Karena ke mana pun kita melangkah, pulangnya tetep ke satu sama lain.",
      },
      {
        text: "Semua janji di atas wajib kita pegang seumur hidup! ♡",
        reaction: "Aamiin ya Allah! Semoga cinta kita selalu dijaga dan berkah selamanya ♡",
        isFavorite: true,
      },
    ],
  },
];

export default function CoupleQuizGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score] = useState(100); // Always 100% / 1000% love!

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (opt: QuizOption) => {
    setSelectedOption(opt);
    soundEngine.playSparkleSound();
  };

  const handleNextQuestion = () => {
    soundEngine.playClickSound();
    setSelectedOption(null);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      soundEngine.playSuccessChime();
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#D8A796", "#9CAF9E", "#F3E5AB", "#BA8675", "#C87D65"],
      });
    }
  };

  const handleRestart = () => {
    soundEngine.playClickSound();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsFinished(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dusty-rose/15 text-dusty-rose-dark text-xs font-serif italic mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-dusty-rose" />
          Kuis Romantis Pasangan
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-espresso">
          Seberapa Kompak & Jodoh Kita? 🧩
        </h3>
        <p className="text-xs sm:text-sm text-taupe mt-1 max-w-md mx-auto">
          Jawab pertanyaan-pertanyaan lucu tentang hubungan kita dan dapetin Sertifikat Jodoh Resmi di akhir kuis!
        </p>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!isFinished && currentQ && (
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="p-5 sm:p-6 rounded-2xl bg-warmcard border border-taupe/20 shadow-soft max-w-xl mx-auto space-y-5"
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-xs text-taupe border-b border-taupe/15 pb-3">
            <span className="font-mono uppercase font-bold text-dusty-rose">
              Pertanyaan {currentIdx + 1} dari {QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    i <= currentIdx ? "bg-dusty-rose" : "bg-taupe/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-espresso leading-snug">
              {currentQ.question}
            </h4>
            <p className="text-xs text-taupe mt-1 font-sans">{currentQ.subtitle}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption?.text === opt.text;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-dusty-rose/15 border-dusty-rose text-espresso shadow-sm font-medium"
                      : "bg-alabaster/60 border-taupe/15 text-espresso/90 hover:bg-oat hover:border-taupe/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                      isSelected
                        ? "bg-dusty-rose text-white"
                        : "bg-taupe/15 text-taupe"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Reaction Callout when option picked */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-muted-sage/15 border border-muted-sage/25 text-espresso text-xs font-serif leading-relaxed"
              >
                <div className="flex items-center gap-1.5 font-bold text-muted-sage-dark mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Respon Manis:</span>
                </div>
                <p>"{selectedOption.reaction}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {selectedOption && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-full bg-dusty-rose text-white text-xs sm:text-sm font-serif font-bold shadow-soft hover:bg-dusty-rose-dark active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIdx < QUESTIONS.length - 1 ? "Lanjut Pertanyaan Berikutnya" : "Lihat Hasil & Sertifikat! 🎉"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* RESULT & CERTIFICATE VIEW */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-2xl bg-warmcard border-2 border-dusty-rose/30 shadow-floating max-w-xl mx-auto text-center space-y-6 relative overflow-hidden"
        >
          {/* Certificate Corner Ornaments */}
          <div className="absolute top-3 left-3 text-dusty-rose/40 text-lg">✦</div>
          <div className="absolute top-3 right-3 text-dusty-rose/40 text-lg">✦</div>
          <div className="absolute bottom-3 left-3 text-dusty-rose/40 text-lg">✦</div>
          <div className="absolute bottom-3 right-3 text-dusty-rose/40 text-lg">✦</div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-dusty-rose font-bold">
              SERTIFIKAT KEKOMPAKAN RESMI
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-espresso mt-1">
              1000% Jodoh Dunia Akhirat ♡
            </h4>
            <p className="text-xs text-taupe mt-1">
              Nomor Registrasi: #2606-SELAMANYA-HBD
            </p>
          </div>

          {/* Certificate Border Card */}
          <div className="p-5 rounded-xl border border-dashed border-taupe/30 bg-alabaster/70 text-left space-y-3">
            <p className="text-xs sm:text-sm font-serif text-espresso leading-relaxed italic text-center">
              "Dengan ini dinyatakan bahwa pemilik hati paling spesial: <strong>{birthdayData.partnerName}</strong>, telah resmi terbukti memiliki kecocokan luar biasa, paling kompak, paling ngertiin, dan ditakdirkan untuk selalu bahagia bersama."
            </p>

            <div className="border-t border-taupe/20 pt-3 flex items-center justify-between text-[11px] text-taupe font-mono">
              <div>
                <span>Tanggal Berlaku:</span>
                <p className="font-bold text-espresso">26 Juni 2023 - Selamanya</p>
              </div>
              <div className="text-right">
                <span>Status Hubungan:</span>
                <p className="font-bold text-dusty-rose-dark">Rumah Paling Nyaman ♡</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-taupe font-sans">
            📸 Jangan lupa screenshot sertifikat ini yaa sayang, simpen baik-baik sebagai bukti kita emang sejodoh itu!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-full bg-oat border border-taupe/20 text-xs font-serif font-semibold text-espresso hover:bg-taupe/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-dusty-rose" />
              <span>Main Ulang Kuis</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
