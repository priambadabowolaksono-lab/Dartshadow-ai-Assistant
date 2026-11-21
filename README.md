# DS-07 — Asisten AI Pribadi

DS-07 adalah asisten AI serba bisa bergaya **DARTSHADOW**: HUD gelap, hujan neon Neo Tokyo, kepala bulat hitam dengan dua mata merah. Lore novel *DARTSHADOW — A Novel in Six Arcs* hanya dipakai sebagai warna kepribadian, bukan sebagai roleplay.

- **Aplikasi = satu file:** `index.html` (HTML + CSS + JS biasa, tanpa build).
- **Berjalan sebagai Artifact di claude.ai.** Otaknya Claude, lewat kemampuan bawaan artifact, jadi tidak perlu API key.
- **Data pengguna** (riwayat dan ingatan) disimpan di database artifact claude.ai, privat per akun. Data itu tidak tersimpan di repo ini.

## Fitur (Tahap 1)

| Fitur | Keterangan |
|---|---|
| Chat | Jawaban mengalir kata per kata, markdown, tabel, blok kode dengan tombol salin |
| Tiga tingkat kekuatan | **Senyap** (cepat) · **Normal** · **Overflow** (model terkuat, penalaran mendalam) |
| Pencarian web | Lewat konektor **Parallel Search** di claude.ai; sumber ditampilkan di bawah jawaban |
| Fragmen Ingatan | DS-07 *mengusulkan* fakta tentangmu; tersimpan hanya bila kamu setujui. Bisa ditambah dan dihapus manual |
| Arsip | Riwayat percakapan, dan DS-07 bisa mencari di percakapan lama |
| Lampiran | Gambar (dianalisis Claude), PDF, dan file teks/kode/CSV |
| Suara | Dikte (Chrome / aplikasi desktop Claude) dan jawaban dibacakan |
| Unduh | Simpan jawaban sebagai `.md` |

## Rencana berikutnya

- **Tahap 2:** mode agen dengan alat (sandbox kode, grafik, pembuat file, tugas, pratinjau HTML).
- **Tahap 3:** tugas terjadwal, pengingat, dan Misi Latar (lewat *scheduled tasks* Claude, zona WIB), serta konektor Drive, Granola, dan pembuat gambar.
- **Integrasi Design Ops** (Minaret Seven): bentuknya masih dibahas.

## Menguji

```bash
node tools/check.mjs
```

Skrip ini mengecek sintaks JS, larangan `alert/confirm/prompt`, dan nama top-level ganda. Membuka `index.html` langsung di browser hanya menampilkan UI. AI, database, dan suara baru aktif di claude.ai.

Perubahan kode baru tampil di link artifact setelah diterbitkan ulang lewat Claude.
