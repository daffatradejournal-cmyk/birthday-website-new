# 🎂 Romantic Birthday Web Application

Sebuah web aplikasi perayaan ulang tahun romantis, interaktif, dan penuh ketelitian craft visual dengan estetika **Warm Editorial Digital Scrapbook**. Dibangun menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, dan **canvas-confetti**.

---

## ✨ Fitur Utama & Desain Visual

### 1. Visual Direction & Design System
- **Aesthetic**: Warm Editorial Digital Scrapbook. Lembut, intim, taktil, dan light mode elegan (bebas dari nuansa cyber-neon gelap atau gradien AI mengkilap).
- **Color Palette**:
  - Background: Warm Alabaster (`#FAF7F2`) & Soft Oat (`#F4EFEA`)
  - Text: Deep Espresso (`#2C2523`) & Warm Taupe (`#7A6F68`)
  - Accent: Dusty Rose (`#D8A796`), Muted Sage (`#9CAF9E`), Warm Butter (`#F3E5AB`), Terracotta (`#C87D65`)
- **Typography**: Google Fonts *Instrument Serif*, *Playfair Display*, dan *Plus Jakarta Sans*.
- **Tactile Details**: Overlay tekstur kertas / subtle noise di seluruh layar, bingkai foto polaroid dengan rotasi alami dan washi tape berpola, serta bayangan lembut difus (`shadow-soft` & `shadow-polaroid`).

### 2. State Machine & Audio Persisten Tanpa Putus
- Dirancang sebagai **Single-Page State Machine** (`phase: 0 | 1 | 2 | 3 | 4`) di dalam satu layout terpadu sehingga musik latar **tidak pernah terputus atau me-restart** saat berpindah fase.
- Dilengkapi **Floating Minimalist Vinyl Player** di pojok kanan bawah dengan piringan hitam mikro yang berputar, tombol play/pause, pengalih lagu, dan kontrol mute.
- **Dual-Engine Audio**: Mendukung pemutaran file MP3 (`/audio/bgm-main.mp3` & `/audio/bgm-ending.mp3`) sekaligus dilengkapi mesin **Synthesizer Web Audio API Romantis bawaan** (kotak musik / petikan akustik) jika file MP3 belum dimasukkan, sehingga audio langsung berbunyi 100% out-of-the-box!
- **Top Quest Progress Bar**: Menampilkan progres 4 tahapan mengumpulkan bahan kue ulang tahun (Base Kue, Krim Manis, Lilin Harapan, Grand Finale).
- Transisi fase halus dengan Framer Motion `<AnimatePresence mode="wait">`.

---

## 🗺️ Perjalanan 5 Fase Interaktif

1. **Phase 0: The Secret Lockscreen (Password Gate)**
   - Polaroid cover dengan foto dan verifikasi senyum.
   - 4-digit PIN pad interaktif (bisa diklik di layar maupun diketik langsung via keyboard).
   - Animasi getar horizontal (shake) dan pesan petunjuk jika PIN salah.
   - PIN bawaan: **`2410`** (bisa disesuaikan di `config/birthdayData.ts`).
   - Saat terbuka: musik mulai mengalun lembut dan langsung lanjut ke Fase 1.

2. **Phase 1: Memory Polaroid Match (Unlock: Base Kue)**
   - Mini-game memori 8 kartu (4 pasang foto kenangan).
   - Efek balik kartu 3D (`rotateY`).
   - Setiap kartu yang cocok memunculkan catatan kecil momen lucu/spesial.
   - Selesai mencocokkan: Membuka **Item 1: Base Kue Ulang Tahun**.

3. **Phase 2: The Soundtrack & Soft Notes (Unlock: Krim & Topping Manis)**
   - **Part A (Mini Lyric Quiz)**: Piringan hitam berputar dengan tebak susunan lirik romantis (*"Terima kasih sudah hadir di hidupku"*).
   - **Part B (Soft Notes)**: 4 amplop berstempel lilin vintage (Baca pas capek, Hal kecil yang disuka, Kenapa harus kamu, Doa di umur baru).
   - Membaca minimal 3 amplop membuka **Item 2: Krim & Topping Buah Beri Manis**.

4. **Phase 3: Catch the Falling Wishes (Unlock: Lilin Ulang Tahun)**
   - Mini-game santai dan menenangkan: menangkap 5 bintang/hati yang jatuh melayang perlahan.
   - Setiap bintang yang tertangkap menampilkan kalimat cinta & pujian manis tulus.
   - Menangkap 5 bintang membuka **Item 3: Lilin Ulang Tahun**.

5. **Phase 4: The Complete Birthday Cake & Grand Finale**
   - Musik otomatis beralih ke lagu penutup (`bgm-ending.mp3` / Romantic Waltz).
   - **Interactive SVG Birthday Cake**: Kue ulang tahun bertingkat lengkap dengan base, krim vanila, buah stroberi/bluberi, dan lilin menyala dengan animasi api berkedip hangat.
   - **Interaksi Tiup Lilin**:
     - Tombol *"Tiup Lilinnya (Klik di Sini)"*
     - Deteksi hembusan suara via mikrofon laptop/HP (`Web Audio API Analyser`) dengan fallback yang aman.
   - **The Reveal**: Saat lilin padam:
     - Efek letusan konfeti warna pastel lembut (`canvas-confetti`).
     - Album Kenangan Polaroid Scrapbook yang bisa digeser (drag / swipe).
     - Surat Ulang Tahun Editorial multi-paragraf yang menyentuh hati.
     - Live counter hubungan: menghitung hari, jam, menit, dan detik secara real-time.

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Server Pengembangan:
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Melakukan Build untuk Produksi:
```bash
npm run build
npm start
```

---

## ⚙️ Kustomisasi Mudah (`config/birthdayData.ts`)

Buka file [`config/birthdayData.ts`](file:///c:/Users/Asus/Downloads/birthday%20webiste%20baru/config/birthdayData.ts) untuk mengubah seluruh data aplikasi:
- **`passcode`**: Ganti PIN 4 digit (default: `"2410"`).
- **`partnerName`**: Ganti nama panggilan pasanganmu.
- **`relationshipStartDate`**: Ganti tanggal jadian / pertama kenal (format `YYYY-MM-DD`, contoh: `"2023-10-24"`) untuk counter real-time.
- **`memoryPhotos`**: Ganti foto dan caption kenangan untuk game memori.
- **`softNotes`**: Ganti isi 4 amplop surat.
- **`galleryPhotos`**: Ganti foto-foto polaroid album scrapbook.
- **`mainLetter`**: Ganti isi surat cinta panjangmu.
