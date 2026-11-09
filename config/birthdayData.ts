export interface MemoryPhotoItem {
  id: number;
  localSrc: string;
  fallbackSrc: string;
  alt: string;
  caption: string;
}

export interface JukeboxTrack {
  id: number;
  title: string;
  artist: string;
  audioSrc: string;
  coverSrc: string;
  fallbackCoverSrc: string;
  description?: string;
}

export interface SoftNoteItem {
  id: number;
  title: string;
  subtitle: string;
  stampEmoji: string;
  sealColor: string;
  content: string;
}

export interface GalleryPhotoItem {
  id: number;
  localSrc: string;
  fallbackSrc: string;
  caption: string;
  date: string;
  rotation: string; // e.g. "-2deg", "1.5deg"
}

export interface BirthdayData {
  passcode: string;
  passcodeHint: string;
  partnerName: string;
  birthdayDate: string; // e.g., "24 Oktober"
  relationshipStartDate: string; // YYYY-MM-DD for live counter
  gatePhoto: {
    localSrc: string;
    fallbackSrc: string;
    caption: string;
  };
  bgmMain: string;
  bgmEnding: string;
  audioTracks: {
    main: string;
    ending: string;
  };
  memoryGamePhotos: MemoryPhotoItem[];
  memoryPhotos: MemoryPhotoItem[]; // Compatibility alias
  jukeboxTracks: JukeboxTrack[];
  songQuiz: {
    title: string;
    subtitle: string;
    songTitle: string;
    songArtist: string;
    scrambledPhraseWords: string[];
    correctPhrase: string;
    hint: string;
    revealedMessage: string;
  };
  softNotes: SoftNoteItem[];
  wishesStarCompliments: string[];
  finalePolaroids: GalleryPhotoItem[];
  galleryPhotos: GalleryPhotoItem[]; // Compatibility alias
  mainLetter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    senderName: string;
  };
}

const memoryGamePhotosList: MemoryPhotoItem[] = [
  {
    id: 1,
    localSrc: "/photos/2.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    alt: "Hebat sayangg ♡",
    caption: "Hebat sayangg! Pinter banget langsung nemu pasangannya ♡",
  },
  {
    id: 2,
    localSrc: "/photos/3.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    alt: "Pinter banget ✨",
    caption: "Keren banget sayangku! Daya ingat kamu emang ga ada lawan ✨",
  },
  {
    id: 3,
    localSrc: "/photos/4.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    alt: "Jagoan aku 🤍",
    caption: "Hebat sayangg! Satu pasangan lagi ketemu, makin jago aja nih :p",
  },
  {
    id: 4,
    localSrc: "/photos/5.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    alt: "Keren sayangg 🎉",
    caption: "Jagoan banget kesayanganku! Semua fotonya berhasil kamu tebak 🎉",
  },
];

const finalePolaroidsList: GalleryPhotoItem[] = [
  {
    id: 1,
    localSrc: "/photos/10.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    caption: "Nongkrong berjam-jam tapi ga kerasa waktu jalan secepet itu.",
    date: "",
    rotation: "-2.5deg",
  },
  {
    id: 2,
    localSrc: "/photos/11.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "Senyum favoritku tiap kali kamu lagi hepi hal-hal kecil.",
    date: "",
    rotation: "2deg",
  },
  {
    id: 3,
    localSrc: "/photos/12.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    caption: "Momen jalan sore berdua, ga usah banyak ngomong pun udah nyaman banget.",
    date: "",
    rotation: "-1.5deg",
  },
];

export const birthdayData: BirthdayData = {
  passcode: "2606",
  passcodeHint: "Clue: Tanggal jadian kita dong, masa lupa sih haha (4 angka: 26-06 yaa)",
  partnerName: "Sayang",
  birthdayDate: "24 Oktober",
  relationshipStartDate: "2023-06-26", // Tanggal jadian: 26 Juni 2023

  // Phase 0: Lockscreen Gate Photo (1.jpg)
  gatePhoto: {
    localSrc: "/photos/1.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "Tatap layarnya dulu bentar... cuma pemilik senyum paling gemesin ini yang boleh masuk :p",
  },

  bgmMain: "/audio/bgm-main.mp3",
  bgmEnding: "/audio/bgm-ending.mp3",
  audioTracks: {
    main: "/audio/bgm-main.mp3",
    ending: "/audio/bgm-ending.mp3",
  },

  // Phase 1: Memory Polaroid Match (2.jpg, 3.jpg, 4.jpg, 5.jpg)
  memoryGamePhotos: memoryGamePhotosList,
  memoryPhotos: memoryGamePhotosList, // Compatibility alias

  // Phase 2: Vinyl Jukebox Tracks (6.jpg, 7.jpg, 8.jpg, 9.jpg)
  jukeboxTracks: [
    {
      id: 1,
      artist: "Banda Neira",
      title: "Sampai Jadi Debu",
      audioSrc: "/audio/song-1.mp3",
      coverSrc: "/photos/6.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      description: "Lagu yang selalu bikin aku mikir: yuk menua bareng sampai beneran jadi debu.",
    },
    {
      id: 2,
      artist: "Hindia",
      title: "Rumah ke Rumah",
      audioSrc: "/audio/song-2.mp3",
      coverSrc: "/photos/7.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      description: "Udah keliling ke mana-mana, tetep aja pulangnya paling nyaman ya ke kamu.",
    },
    {
      id: 3,
      artist: "Maliq & D'Essentials",
      title: "Kita Bikin Romantis",
      audioSrc: "/audio/song-3.mp3",
      coverSrc: "/photos/8.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=600&q=80",
      description: "Hal-hal kecil sama kamu selalu berasa romantis, sesimpel jajan sore bareng.",
    },
    {
      id: 4,
      artist: "Sal Priadi",
      title: "I'd Like To Watch You Sleeping",
      audioSrc: "/audio/song-4.mp3",
      coverSrc: "/photos/9.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
      description: "Paling suka liatin muka kamu pas tidur pules, damai banget rasanya.",
    },
  ],

  songQuiz: {
    title: "Lagu Cerita Kita",
    subtitle: "Susun kalimat manis ini dulu yaa buat buka amplopnya:",
    songTitle: "Until I Found You",
    songArtist: "Stephen Sanchez",
    scrambledPhraseWords: ["hadir", "sudah", "Terima", "di", "kasih", "hidupku"],
    correctPhrase: "Terima kasih sudah hadir di hidupku",
    hint: "Klik kata sesuai urutannya yaa sayang.",
    revealedMessage: "Beneran, makasih banyak yaa udah hadir dan bikin hari-hariku jauh lebih berwarna ♡",
  },

  softNotes: [
    {
      id: 1,
      title: "Baca pas lagi cape",
      subtitle: "Buka pas hari kamu lagi berat yaa...",
      stampEmoji: "☕",
      sealColor: "#D8A796",
      content:
        "Hai sayangg, kalau hari ini rasanya berat dan km ngerasa cape bgt sama semuanya, senderin dulu kepala km ya.\n\nKm udah sampai tahap ini aja udah keren, gpp bgt buat istirahat dulu sebentar, ga harus cepat-cepat ko buat kejar semuanya sekaligus, ingat yaa kapan pun km butuh ak buat cerita atau minta dipeluk, ak selalu ada buat km disini ayy.\n\nIstirahat yang cukup ya sayangku.",
    },
    {
      id: 2,
      title: "Hal kecil yang bikin aku naksir lagi",
      subtitle: "Hal-hal random yang bikin makin sayang...",
      stampEmoji: "🌷",
      sealColor: "#9CAF9E",
      content:
        "Hal-hal random yang mungkin km ga sadar, tapi selalu sukses buat bikin ak jatuh cinta lagi:\n\nDari cara km bercanda dan nunjukin diri km sendiri ke aku dengan candaan km, ketawa lepas km, kebiasaan kecil km ngirim pap makanan tiba-tiba.\n\nMungkin itu hal yang sederhana, tapi ya hal-hal kecil kaya gitu yang bikin aku selalu ngerasa beruntung banget punya km.",
    },
    {
      id: 3,
      title: "Kenapa harus kamu?",
      subtitle: "Jawaban jujur dari lubuk hatiku...",
      stampEmoji: "💌",
      sealColor: "#C87D65",
      content:
        "Jujur, dari sekian banyak orang di dunia ini, cuma sama km aku bisa jadi diriku sendiri yang paling aneh, yang km terima apa adanya, dari mulai manjaku, takutku tanpa ak harus takut dihakimi.\n\nKm ga pernah nuntut aku buat jadi orang lain, dan cara dan respon km pas dengarkan aku cerita ituu selalu bikin hati ak tenang, walopun km belum bisa kontrol ego sama emosi km kewkekekwkwk, tapi kalo jawabannya disederhanakan: karena km itu rumah buat aku pulang.",
    },
    {
      id: 4,
      title: "Doa buat umur barumu",
      subtitle: "Harapan paling tulus di hari spesialmu...",
      stampEmoji: "✨",
      sealColor: "#F3E5AB",
      content:
        "Selamat ulang tahun ya sayangku.\n\nDi umur km yang baru ini, aku cuman pengen km selalu bahagia, sehat selalu, dan dijauhkan dari hal-hal yang bikin km sedih. Semoga apapun yang lagi km usahakan pelan-pelan nemu jalannya.\n\nDan semoga, di setiap ulang tahun km kedepannya, kita masih tetap sama-sama ngerayakan kaya gini yaa..",
    },
  ],

  wishesStarCompliments: [
    "Caramu ketawa pas lagi salting tuh lucu banget tau ga! 🤍",
    "Makasih yaa udah selalu sabar ngadepin sifatku yang kadang rewel ✨",
    "Tiap lagi pusing sama dunia, liat senyummu tuh rasanya langsung tenang 🌙",
    "Dukungan kecil dari kamu selalu jadi alasan aku semangat terus 🌸",
    "Senyum manismu ga pernah gagal bikin hari-hariku cerah lagi 🍰",
  ],

  // Phase 4: Finale Polaroids (10.jpg, 11.jpg, 12.jpg)
  finalePolaroids: finalePolaroidsList,
  galleryPhotos: finalePolaroidsList, // Compatibility alias

  mainLetter: {
    greeting: "Selamat Ulang Tahun, Sayangku.",
    paragraphs: [
      "Selamat bertambah umur buat orang paling spesial di hidupku! Hari ini aku cuma pengen bilang makasih banyak. Makasih udah lahir ke dunia, makasih udah tumbuh jadi orang sebaik, sehangat, dan sepengertian ini.",
      "Makasih yaa udah selalu ada nemenin hari-hariku. Mau pas lagi seru-serunya ketawa bareng, sampai pas duniaku lagi berat dan kepalaku lagi berisik, kamu ga pernah sekalipun ninggalin aku sendirian. Ada kamu di sampingku tuh bikin hariku yang kadang berantakan jadi terasa jauh lebih tenang dan teratur.",
      "Di umur barumu ini, aku bener-bener doain semoga kamu selalu sehat, rezekimu lancar, langkahmu selalu dimudahkan, dan hal-hal baik selalu datang ke hidup kamu. Jangan pernah ngerasa sendirian atau ngeremehin kemampuanmu sendiri ya, kamu tuh jauh lebih hebat dan berharga dari yang kamu bayangin.",
      "Yuk terus bareng-bareng yaa? Lewatin hari-hari ke depan, saling gandeng tangan, saling kuatin kalau lagi lelah, dan terus bikin kenangan lucu berdua. I love you so much, more than words could ever say.",
    ],
    closing: "Peluk hangat dan sayang selalu,",
    senderName: "Dari aku yang selalu sayang kamu ♡",
  },
};
