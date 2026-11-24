# GEMINI.md

Semua panduan proyek ada di **[AGENTS.md](AGENTS.md)**: peta kode, format data, tugas cloud, gaya DartShadow, aturan, dan alur kerja. Baca file itu sampai habis sebelum mengubah apa pun.

Ringkasnya:
- Aplikasi = satu file `index.html`, berjalan sebagai artifact claude.ai. Gemini CLI tidak bisa menerbitkan artifact, mengubah capability, atau mengubah tugas cloud. Tulis kebutuhannya di ringkasan PR.
- Sebelum push, jalankan `node tools/check.mjs`, lalu `node tools/smoke.mjs` bila Playwright sudah terpasang. Semuanya harus ✓.
- Kerjakan di branch baru, lalu buka Pull Request ke `main`. Jangan push langsung ke `main`.
- Teks UI dan ringkasan untuk pemilik dalam Bahasa Indonesia. Commit dalam bahasa Inggris. Jangan menulis nama model AI dan jangan commit data nyata.
