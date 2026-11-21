# AGENTS.md — aturan untuk AI coding agent

- Komunikasi dengan pemilik dan teks UI: **Bahasa Indonesia**. Kutipan lore boleh bahasa Inggris.
- Aplikasi satu file `index.html`. Jangan menambah framework atau build step.
- **Gaya DARTSHADOW wajib dipertahankan:** satu tema gelap. Pakai token warna di `:root`; tiap warna punya makna (merah = DS/normal, amber = ingatan/arsip, emas = disimpan/pilihan, pink = momen hangat).
- **Lore mengikuti novel** dan tersimpan di konstanta `LORE`. Jangan mengarang kejadian baru.
- Dialog bawaan browser diblokir di claude.ai. Jangan pakai `alert/confirm/prompt`; pakai `ask()` dan `toast()`.
- Teks dari pengguna atau AI wajib di-escape (`esc()`), atau dirender lewat `md()` yang sudah aman.
- Setiap capability (`claude.use(...)`) bisa `null`. Halaman harus tetap jalan.
- Jangan ubah jalur data `data/users/<id>/convs/items`, `data/users/<id>/mem/items`, dan koleksi `ops` (dokumen `config`, `katalog`, `req_*`, `lap_*`); data live dan tugas cloud bergantung padanya.
- Format project yang ditulis ke Design Ops harus sama persis dengan record di aplikasi Design Ops (repo New-Code). DS-07 sendiri tidak pernah menulis ke Design Ops; yang menulis adalah tugas cloud.
- Jangan menulis nama model AI di commit, kode, atau komentar.
- Sebelum push: `node tools/check.mjs` harus semua ✓.
