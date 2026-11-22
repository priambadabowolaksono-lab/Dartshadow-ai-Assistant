# Memasang DS-07 sebagai Custom GPT di ChatGPT Pro

Kira-kira 5 menit. Semua isian ada di folder ini.

## 1. Buat GPT baru
1. Buka **chatgpt.com**, lalu masuk dengan akun Pro.
2. Klik **GPTs** di samping kiri, lalu **+ Create** di kanan atas.
3. Pilih tab **Configure**, bukan Create, supaya isiannya tidak ditulis ulang oleh pembuat otomatis.

## 2. Isi kolom
| Kolom | Isi |
|---|---|
| **Foto profil** | Klik lingkaran foto, pilih *Upload photo*, lalu unggah `avatar-ds07.png` |
| **Name** | `DS-07` |
| **Description** | `Asisten pribadi serba bisa bergaya DARTSHADOW. Tenang, ringkas, setia.` |
| **Instructions** | Salin seluruh isi `INSTRUKSI.md`, lalu tempel |
| **Conversation starters** | Empat baris di bawah |
| **Knowledge** | Unggah `LORE_DARTSHADOW.md` |
| **Capabilities** | Nyalakan **Web Search**, **Canvas**, dan **Code Interpreter & Data Analysis**. **Image Generation** opsional |

Conversation starters:
```
Bantu saya menyusun rencana kerja minggu ini.
Cari berita teknologi terpenting hari ini dan ringkas jadi 5 poin.
Saya lampirkan file — ringkas isinya dan beri 3 temuan utama.
Siapa Lira, dan kenapa DS terus kembali untuknya?
```

## 3. Simpan
1. Klik **Create** di kanan atas.
2. Pilih **Only me**. Jangan pilih *Anyone with the link* atau *GPT Store*, karena file lore-nya bagian dari novel yang belum terbit.
3. Salin link GPT-nya (bentuknya `chatgpt.com/g/g-…`) dan simpan. Link ini dipakai untuk membuka DS-07 di ChatGPT, termasuk dari aplikasi ChatGPT di HP.

## 4. Memakai bersama DS-07 di claude.ai
- **Dari DS-07 ke GPT:** tombol **GPT** di DS-07 membuka ChatGPT biasa dengan pertanyaan sudah terisi. Kalau ingin dijawab oleh DS-07 versi GPT, buka GPT-mu lalu tempel prompt-nya (pakai **Salin prompt**).
- **Dari GPT ke DS-07:** ketik **"ringkas untuk DS-07"** di ChatGPT, salin hasilnya, lalu di DS-07 tekan **Tempel jawaban GPT**.

## Batasan
- DS-07 versi GPT **tidak bisa** membuka arsip, Fragmen Ingatan, atau laporan Design Ops di claude.ai. Ingatannya memakai fitur memori ChatGPT sendiri.
- Bila instruksi atau lore diperbarui di repo ini, ulangi langkah 2 untuk kolom yang berubah. Custom GPT tidak ikut berubah otomatis.
