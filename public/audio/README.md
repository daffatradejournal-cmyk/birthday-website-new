# Panduan Audio (Background Music)

Aplikasi ini sudah dilengkapi dengan **Synthesizer Akustik & Kotak Musik Romantis bawaan (Web Audio API)** yang langsung berbunyi otomatis tanpa perlu file eksternal apa pun!

Jika kamu ingin memutar lagu favorit kalian dalam format MP3 asli, cukup letakkan file MP3 di folder ini (`public/audio/`):

1. **`bgm-main.mp3`**: Lagu pengiring untuk Fase 0 s/d Fase 3 (misalnya lagu romantis lembut seperti akustik atau lagu favorit kalian).
2. **`bgm-ending.mp3`**: Lagu untuk perayaan tiup lilin dan surat (Fase 4 Grand Finale).

Pemutar audio (vinyl controller) di pojok kanan bawah akan mendeteksi file MP3 tersebut secara otomatis, dan jika file tidak ditemukan, ia akan memainkan musik romantis akustik lembut bawaan secara mulus.
