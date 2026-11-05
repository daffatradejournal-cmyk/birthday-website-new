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
    alt: "Foto Kenangan 1",
    caption: "Momen ini pas kamu ketawa lepas banget, padahal jokes-nya garing!",
  },
  {
    id: 2,
    localSrc: "/photos/3.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    alt: "Foto Kenangan 2",
    caption: "Muka ngambek paling gemas sedunia, tapi 5 menit kemudian laper lagi.",
  },
  {
    id: 3,
    localSrc: "/photos/4.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    alt: "Foto Kenangan 3",
    caption: "First date vibes! Masih malu-malu curi pandang seharian.",
  },
  {
    id: 4,
    localSrc: "/photos/5.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    alt: "Foto Kenangan 4",
    caption: "Jalan sore santai berdua, tanpa buru-buru, cuma ada kita dan angin senja.",
  },
];

const finalePolaroidsList: GalleryPhotoItem[] = [
  {
    id: 1,
    localSrc: "/photos/10.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    caption: "Hari pertama kita nongkrong berjam-jam sampai lupa waktu.",
    date: "24 Okt 2023",
    rotation: "-2.5deg",
  },
  {
    id: 2,
    localSrc: "/photos/11.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "Senyum favoritku, selalu bikin hatiku tenang dan damai.",
    date: "14 Des 2023",
    rotation: "2deg",
  },
  {
    id: 3,
    localSrc: "/photos/12.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    caption: "Jalan-jalan sore bareng, menikmati indahnya langit dan genggamanmu.",
    date: "02 Feb 2024",
    rotation: "-1.5deg",
  },
];

export const birthdayData: BirthdayData = {
  passcode: "2410",
  passcodeHint: "Hint: Tanggal spesial kita (4 angka: 24-10)",
  partnerName: "Sayang",
  birthdayDate: "24 Oktober",
  relationshipStartDate: "2023-10-24", // Ganti dengan tanggal jadian / pertama kenal kalian

  // Phase 0: Lockscreen Gate Photo (1.jpg)
  gatePhoto: {
    localSrc: "/photos/1.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "Verifikasi dulu: Cuma yang punya senyum ini yang boleh masuk.",
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
      description: "Lagu yang mengajarkan tentang cinta yang bertahan melampaui waktu.",
    },
    {
      id: 2,
      artist: "Hindia",
      title: "Rumah ke Rumah",
      audioSrc: "/audio/song-2.mp3",
      coverSrc: "/photos/7.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      description: "Karena pada akhirnya, rumah ternyaman adalah hatimu.",
    },
    {
      id: 3,
      artist: "Maliq & D'Essentials",
      title: "Kita Bikin Romantis",
      audioSrc: "/audio/song-3.mp3",
      coverSrc: "/photos/8.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=600&q=80",
      description: "Hal-hal sederhana yang selalu kita rayakan berdua penuh rasa syukur.",
    },
    {
      id: 4,
      artist: "Sal Priadi",
      title: "I'd Like To Watch You Sleeping",
      audioSrc: "/audio/song-4.mp3",
      coverSrc: "/photos/9.jpg",
      fallbackCoverSrc: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
      description: "Betapa tenangnya dunia saat melihatmu terlelap dengan damai.",
    },
  ],

  songQuiz: {
    title: "The Soundtrack of Us",
    subtitle: "Susun kata-kata romantis ini untuk membuka amplop rahasia:",
    songTitle: "Until I Found You",
    songArtist: "Stephen Sanchez",
    scrambledPhraseWords: ["hadir", "sudah", "Terima", "di", "kasih", "hidupku"],
    correctPhrase: "Terima kasih sudah hadir di hidupku",
    hint: "Ketik atau klik kata sesuai urutan kalimat syukur kita.",
    revealedMessage: "Lagu yang selalu bikin aku ingat betapa beruntungnya aku punya kamu di sisiku.",
  },

  softNotes: [
    {
      id: 1,
      title: "Baca pas lagi capek",
      subtitle: "Buka saat harimu terasa berat...",
      stampEmoji: "☕",
      sealColor: "#D8A796",
      content:
        "Hai manisku, kalau dunia hari ini lagi terlalu berisik dan bikin lelah, tarik napas pelan-pelan ya. Kamu udah berjuang hebat banget hari ini. Ingat ya, kamu nggak perlu nanggung semuanya sendirian. Ada aku di sini yang selalu bangga sama setiap langkah kecilmu. Istirahat yang cukup ya, sayangku.",
    },
    {
      id: 2,
      title: "Hal kecil yang aku suka dari kamu",
      subtitle: "Daftar sederhana tapi bikin jatuh cinta berkali-kali...",
      stampEmoji: "🌷",
      sealColor: "#9CAF9E",
      content:
        "Caramu ngernyitin dahi pas lagi mikir keras, kebiasaan ngirim foto random makanan tanpa aba-aba, nada suaramu pas baru bangun tidur, dan tatapan tulusmu tiap kali dengerin ceritaku. Hal-hal sesederhana itu yang bikin duniaku terasa jauh lebih hangat.",
    },
    {
      id: 3,
      title: "Kenapa harus kamu",
      subtitle: "Jawaban yang nggak pernah berubah...",
      stampEmoji: "💌",
      sealColor: "#C87D65",
      content:
        "Karena bersama kamu, rumah bukan lagi sekadar tempat, tapi perasaan. Kamu bikin aku merasa aman menjadi diriku yang seutuhnya—tanpa topeng, tanpa takut dihakimi. Nggak ada orang lain yang bisa bikin hatiku setenang ini selain kamu.",
    },
    {
      id: 4,
      title: "Doa di umur baru",
      subtitle: "Harapan paling tulus untukmu hari ini...",
      stampEmoji: "✨",
      sealColor: "#F3E5AB",
      content:
        "Di usia barumu ini, aku berdoa semoga bahagiamu makin melimpah, langkahmu dimudahkan, semua impian yang kamu bisikkan dalam doa pelan-pelan terwujud, dan hatimu selalu dipeluk damai. Dan kalau diizinkan semesta, aku mau ada di setiap ulang tahunmu berikutnya.",
    },
  ],

  wishesStarCompliments: [
    "Caramu ketawa pas lagi salah tingkah bikin hari-hariku cerah! ✨",
    "Sabarnya kamu pas ngadepin moody-nya aku itu luar biasa. 🤍",
    "Tatapan mata kamu yang selalu nenangin tiap duniaku lagi ribut. 🌙",
    "Gimana kamu selalu bangga dan percaya sama semua mimpiku. 🌸",
    "Senyum manismu yang nggak pernah gagal bikin hatiku luluh. 🍰",
  ],

  // Phase 4: Finale Polaroids (10.jpg, 11.jpg, 12.jpg)
  finalePolaroids: finalePolaroidsList,
  galleryPhotos: finalePolaroidsList, // Compatibility alias

  mainLetter: {
    greeting: "Selamat Ulang Tahun, Manisku.",
    paragraphs: [
      "Hari ini adalah hari yang paling aku syukuri di seluruh kalender, karena di tanggal inilah sosok yang paling berharga di hidupku lahir ke dunia.",
      "Terima kasih sudah menjadi manusia yang begitu hangat, penyabar, dan selalu membawa ketenangan di setiap hari-hariku yang sering kali penuh hiruk-pikuk. Kehadiranmu bukan cuma melengkapi, tapi mengajari aku bagaimana rasanya dicintai tanpa syarat.",
      "Di babak umurmu yang baru ini, aku berdoa agar semesta selalu berbaik hati padamu. Semoga langkahmu selalu diringankan, pundakmu dikuatkan, dan impian-impian besarmu satu per satu mekar menjadi kenyataan yang indah. Jangan pernah ragu sama kemampuanmu, karena bagiku kamu selalu luar biasa.",
      "Terima kasih sudah memilih untuk berjalan bersamaku. Semoga kita terus bisa saling memeluk dalam tawa, saling menguatkan saat lelah, dan merayakan tahun demi tahun ke depan dengan genggaman tangan yang tak pernah lepas.",
    ],
    closing: "Selalu mencintaimu di setiap detik,",
    senderName: "Dari yang selalu mengagumimu ♡",
  },
};
