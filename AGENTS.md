# AGENTS.md — panduan untuk AI coding agent (Codex, Claude, dll.)

Baca file ini sampai habis sebelum mengubah apa pun.

## Proyek

**DS-07** adalah asisten AI pribadi milik pemilik repo, bergaya **DARTSHADOW**: HUD gelap, hujan neon Neo Tokyo, kepala bulat hitam dengan dua mata merah. Lore diambil dari novel *DARTSHADOW — A Novel in Six Arcs*, tetapi hanya sebagai warna kepribadian. DS-07 bukan tokoh roleplay.

- **Seluruh aplikasi ada di satu file:** `index.html`, berisi HTML, CSS, dan vanilla JS tanpa framework dan tanpa build step.
- **Berjalan sebagai Artifact di claude.ai:** https://claude.ai/artifact/QGzoQoaj2BN1mbTtZDSWrB. Otak AI-nya Claude, lewat kemampuan runtime artifact. Tidak ada API key.
- **Data pengguna tersimpan di database artifact milik claude.ai**, bukan di repo. Repo hanya berisi kode.
- **Terhubung ke Design Ops**, aplikasi tim desain di repo `priambadabowolaksono-lab/New-Code`, file `design-ops/index.html`. Artifact Design Ops: https://claude.ai/artifact/7AbUhuzCrcXSd8jYGUMfMK.
- **Branch utama:** `main`. Kerjakan setiap tugas di branch baru, lalu buka Pull Request ke `main`. Pemilik yang me-merge.

### Yang TIDAK bisa dilakukan agent selain Claude
- **Menerbitkan ke artifact.** Agent lain hanya mengedit dan push kode. Pemilik nanti meminta Claude menerbitkan ulang ke URL yang sama. Data dan izin tetap utuh.
- **Mengubah tugas cloud** (scheduled task Claude) dan **mengubah izin atau capability artifact.** Keduanya diatur Claude saat publish atau lewat akun claude.ai.
- **Menguji runtime claude.ai sungguhan:** AI, database, suara, konektor. Uji lokal memakai `window.claude` tiruan (lihat bagian Pengujian).
- **Hosting di tempat lain** (GitHub Pages, Vercel, dll.). Di luar claude.ai, AI dan data tidak ada. Jangan sarankan atau lakukan ini.

## Peta kode (cari dengan grep; nomor baris berubah-ubah)

| Bagian | Cari |
|---|---|
| Token desain (warna, radius, gerak) | `:root{` di awal `<style>` |
| Lapisan gerak, layar sambutan, target sentuh | `lapisan gerak`, `layar sambutan`, `target sentuh 44px` |
| Gaya briefing | `PROTOKOL BRIEFING: pembuka bersuara` |
| Persona dan lore untuk Claude | `const LORE`, `function personaPrompt`, `function opsPrompt` |
| Util | `$()`, `esc()`, `uid()`, `toast()`, `ask()`, `trapFocus()`, `announce()`, `copyText()`, `todayISO()`, `fmtDate()` |
| Markdown aman | `function md(`, `function inlineMd(` |
| State global | `const S = {` |
| Penyimpanan | `const Store = {` (brankas bersama, migrasi, mode lokal) |
| Panel samping | `function renderSide`, `function opsPane` |
| Percakapan | `function renderLog`, `function msgHtml`, `function aBody`, `function updateLast` |
| Akun | `function accountDialog`, `DS07_URL` |
| Lampiran (gambar, PDF, teks) | `function addFiles`, `function pdfText`, `loadPdf` |
| Jembatan Design Ops | `DESIGN OPS (jembatan)`, `const Ops = {`, `function opsForm`, `function sendOps` |
| Jembatan ChatGPT | `JEMBATAN CHATGPT`, `function gptDialog`, `function gptPasteDialog` |
| Alat untuk Claude (tool calling) | `function webTools`, `function opsTools`, `function coreTools` |
| Menyusun prompt | `function buildMessages`, `function userContent` |
| Kirim, streaming, error | `async function send`, `async function run`, `function sampleError` |
| Suara | `function speak`, `function voiceDialog`, `function setupDictation` |
| Briefing bersuara | `const BF = {`, `bfScript`, `bfOpen`, `bfRun`, `bfStage`, `bfCanvas`, `bfClose`, `bfMaybeAuto` |
| Hujan latar | `function rain` |
| Mulai | `async function init` |

## Runtime claude.ai

Kemampuan diambil lewat `await claude.use(name)` di `init()`. **Setiap capability bisa `null`**, dan halaman wajib tetap jalan (sembunyikan atau nonaktifkan fiturnya).

| Capability | Dipakai untuk |
|---|---|
| `sample` | Claude: chat, streaming `onText`, `tools`, `images`, `modelTier` (quick/default/complex = Senyap/Normal/Overflow) |
| `db` | Brankas bersama dan koleksi `ops` |
| `user` | `me()`, `id()`, `isOwner()` |
| `tts` | Membacakan jawaban dan briefing; suara `buttery`, `airy`, `glassy`, atau `rounded` |
| `dictation` | Dikte suara |
| `downloads` | Unduh `.md` |
| `mcp` | Konektor `Parallel Search` (`web_search`, `web_fetch`) dan `Claude Code Remote` (`fire_trigger`) |

Mengubah daftar capability atau aturan db hanya bisa dilakukan saat publish oleh Claude. Kalau fitur baru butuh capability baru, tulis kebutuhannya di ringkasan PR.

Batasan halaman artifact:
- Tidak ada `fetch` ke host luar. Skrip hanya boleh dari cdnjs atau jsDelivr, dengan versi pasti.
- `alert`, `confirm`, dan `prompt` diblokir.
- Link luar dibuka di tab baru.
- Unduhan file hanya lewat capability `downloads`.

## Data (JANGAN ubah jalur atau format; data live bergantung padanya)

| Jalur | Isi |
|---|---|
| `brankas/utama/convs/<id>` | Percakapan `{id,title,created,updated,messages[],gptWaiting?}`. Isi pesan: `{role,text,at,mode?,modeLabel?,scan?,sources?,proposals?,opsDrafts?,src?:"gpt",toGpt?,files?,attText?,imgNames?,error?,done}` |
| `brankas/utama/mem/<id>` | Fragmen ingatan `{text,created}` |
| `brankas/meta` | `{pindah:[uid…]}`, penanda migrasi dari folder privat per akun |
| `ops/config` | Id tugas cloud dan `myMemberId` pemilik di Design Ops. Diatur Claude, jangan ditulis dari kode |
| `ops/katalog` | `{members:[{id,name,role}], bus:[], cats:[], at}`, ditulis tugas laporan |
| `ops/req_<id>` | Permintaan project baru `{kind:"req", status:"antri"\|"diproses"\|"selesai"\|"gagal", at, data:{nama,bu,pic,deadline,kategori,slide,prioritas,catatan,tanggal}, dipicu, projectId?, pic?, pesan?}` |
| `ops/lap_<YYYY-MM-DD>` | Laporan `{kind:"laporan", date, at, ringkas, md, stats, brief}`. `brief` = `{tanggal, aktif, terlambat, hariIni, besok, mingguIni, baru, selesai, tanpaPic, projects:[{id,bu,nama,pic,deadline,status,telatHari,sisaHari}], beban:[{pic,aktif,terlambat}], masuk:[], selesaiList:[], saran:[]}` |

Aturan akses db (diatur saat publish):
- `brankas` dan `ops` hanya bisa dibaca dan ditulis level `interact` ke atas, yaitu akun-akun pemilik yang diundang.
- Bila db tidak ada, aplikasi masuk **mode lokal** (`localStorage`: `ds07.convs`, `ds07.mems`).

Kunci `localStorage` per penonton: `ds07.mode`, `ds07.web`, `ds07.voice`, `ds07.rain`, `ds07.ttsVoice`, `ds07.autoBrief`, `ds07.briefed`, `ds07.bfVoice`, `ds07.bfSfx`. Bungkus semua akses dengan `lsGet` dan `lsSet` (sudah memakai try/catch).

## Tugas cloud (scheduled task Claude, di akun claude.ai pemilik; bukan di repo)

| Tugas | Jadwal | Kerja |
|---|---|---|
| Input project Design Ops | Dipicu tombol Kirim (akun pemilik) | Membaca `ops/req_*` lalu menulis satu project ke Design Ops `projects/<id>` |
| Antrean project Design Ops | Tiap jam 07.13–22.13 WIB | Memproses `req` yang masih `antri` (dari akun lain, atau pemicu yang gagal) |
| Laporan pagi Design Ops | Senin–Jumat 06.47 WIB, atau tombol Buat laporan | Membaca Design Ops, lalu menulis `ops/lap_*` (termasuk `brief`) dan `ops/katalog` |

Kalau perubahan kode butuh field baru dari tugas cloud, tambahkan field itu sebagai **opsional** dengan nilai default saat membaca, lalu tulis di ringkasan PR bahwa prompt tugas cloud perlu diperbarui oleh Claude.

## Aturan desain (wajib)
- **Satu tema gelap DartShadow.** Jangan menambah tema terang, framework CSS, atau Tailwind.
- **Warna lewat token di `:root`**, dan tiap warna punya makna:
  - merah: DS/normal/aksi;
  - amber: ingatan/arsip;
  - emas: disimpan/pilihan/saran;
  - pink: momen hangat;
  - baja (`--steel`): sistem luar (Design Ops, ChatGPT);
  - hijau: status sehat.
- **Tidak boleh ungu** di tampilan. Ungu hanya ada di lore.
- **Font:** Oxanium (judul), IBM Plex Sans (isi), JetBrains Mono (label).
- **Skala radius:** `--r-s` 4, `--r` 6, `--r-c` 8, `--r-l` 12.
- **Gerak:**
  - pakai token `--ease`, `--ease-enter`, `--m-in`, `--m-out`, `--m-press`;
  - hanya transform, opacity, dan warna;
  - tidak ada animasi saat scroll;
  - hormati `prefers-reduced-motion`.
- **Aksesibilitas:**
  - target sentuh minimal 44px di layar sentuh;
  - kontras teks minimal 4,5:1, dan tepi field minimal 3:1 (`--line-field`);
  - cincin fokus merah;
  - dialog memakai `trapFocus` dan mengembalikan fokus saat ditutup;
  - pesan error tampil di dekat field (`aria-invalid` dan `aria-describedby`);
  - kolom input 16px di HP.
- **Nama class baru di briefing diawali `bf-`.** Class `side` sudah dipakai laci HP, dan bentrokan nama pernah membuat overlay hilang.

## Aturan kode (wajib)
1. Teks UI dan komunikasi dengan pemilik memakai **Bahasa Indonesia**. Kutipan lore boleh bahasa Inggris.
2. Teks dari pengguna, AI, atau database **selalu di-escape** dengan `esc()`, atau dirender lewat `md()`.
3. **Jangan pakai** `alert`, `confirm`, atau `prompt`. Pakai `ask()`, `toast()`, atau dialog sendiri dengan `trapFocus`.
4. **Jangan membuat nama fungsi atau const top-level yang sudah ada.** `tools/check.mjs` memeriksanya.
5. **Lore mengikuti novel** dan ada di `const LORE`. Jangan mengarang kejadian, tokoh, atau kutipan baru.
6. **Jangan menulis nama model AI** di commit, kode, atau komentar.
7. **Jangan commit data nyata**: nama klien, anggota tim, isi laporan. Fixture dan contoh memakai data dummy.
8. **Buat perubahan kecil dan terfokus.** Jangan memformat ulang seluruh file.
9. **Format project Design Ops harus sama persis dengan aplikasi Design Ops.** DS-07 sendiri tidak pernah menulis ke Design Ops; yang menulis adalah tugas cloud.

## Pengujian (wajib sebelum push)

```bash
node tools/check.mjs
```
Skrip ini mengecek sintaks JS, larangan `alert`/`confirm`/`prompt`, dan nama top-level ganda. Hasilnya harus ✓ semua.

```bash
npm i -D playwright && npx playwright install chromium   # sekali saja
node tools/smoke.mjs
```
Skrip ini menjalankan uji asap di Chromium dengan `window.claude` tiruan:
- chat dan streaming;
- usulan ingatan;
- jembatan ChatGPT;
- briefing dari awal sampai akhir;
- lebar 1440 dan 390;
- tanpa error dan tanpa scroll ke samping.

Uji manual:
1. Buka `index.html` di browser (berjalan dalam mode lokal, tanpa AI).
2. Periksa fitur yang diubah di lebar 1440px dan 390px.
3. Pastikan tidak ada teks yang keluar kotak, dan Console bersih.

## Alur kerja
1. Mulai dari `main` terbaru, lalu buat branch baru untuk tugas ini.
2. Edit `index.html`, lalu jalankan `node tools/check.mjs` dan `node tools/smoke.mjs`.
3. Commit dengan pesan bahasa Inggris yang ringkas, push branch, lalu buka Pull Request ke `main`.
4. Tulis ringkasan untuk pemilik dalam **Bahasa Indonesia**: apa yang berubah, apa yang sudah dan belum diuji, dan capability atau perubahan tugas cloud yang perlu dikerjakan Claude. Ingatkan bahwa perubahan baru tampil setelah artifact diterbitkan ulang lewat Claude.

## Backlog (ide yang sudah dibahas dengan pemilik)
- **Auto upload project ke Design Ops:** lempar file, Claude mengenali project-nya, folder Drive dibuat, file diunggah, thumbnail dipasang, dan checklist serah-terima tercentang.
  - Rekomendasi: dibangun **di Design Ops** (repo New-Code), karena pengunggah Drive (`openDriveUpload`, `createProjectFolder`), penyimpanan thumbnail (`thumbs/<id>`), dan checklist otomatis (`hoAuto`) sudah ada di sana.
  - Masih menunggu keputusan pemilik: apakah "File final dikirim" tercentang otomatis dari file di Exported, dan apakah thumbnail diambil otomatis.
- **Suara pria ala Jarvis lewat ElevenLabs:** opsional, memakai kredit ElevenLabs.
- **Tahap 2 mode agen:** sandbox JavaScript, grafik, pembuat file, dan pratinjau HTML.
