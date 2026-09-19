# Sharaf Learning

Aplikasi belajar sharaf pribadi dengan Svelte 5, Vite, TypeScript, Tailwind CSS 4, dan shadcn-svelte. Materi mengikuti `docs/sumber.md`: 63 pelajaran, tabel sumber lengkap, latihan kontekstual, dan pengulangan terjadwal.

## Menjalankan

Gunakan Node.js 22.18 atau lebih baru.

```sh
npm install
npm run dev
```

## Pemeriksaan

```sh
npm test              # logika, migrasi, bank soal, dan cakupan sumber
npm run check        # sinkronisasi sumber, Svelte, dan TypeScript
npm run build        # build statis produksi
npm run coverage     # perbarui matriks cakupan kurikulum
```

`AGENTS.md` meminta pengujian browser dilakukan sebagai smoke test manual. Jalankan daftar pemeriksaan redesign di `docs/UI-UX-SMOKE-TEST.md`; pemeriksaan otomatis di atas tidak mengklaim validasi visual atau interaksi browser.

## Alur belajar

Ikuti rekomendasi atau buka pelajaran langsung. Sesi 10–15 menit menggabungkan pengulangan, satu konsep, dan penerapan. Latihan, cek lima soal, dan remediasi menggunakan bank terpisah. Sedikitnya dua soal cek menguji penerapan; empat jawaban benar termasuk konsep wajib diperlukan untuk mencatat penguasaan.

Progres disimpan di browser. Posisi latihan, jawaban, dan urutan pilihan tersimpan. Cadangan versi 1 dapat dipulihkan; riwayat kelulusan dan kartu lama dipertahankan. Karena penilaian berubah, materi lama memerlukan cek revisi baru. Kartu revisi lama ditangguhkan sampai cek ulang lulus.

Sebelum migrasi, data asli disalin ke `sharaf.progress.before-v2`. Jika penyalinan gagal, data lama dilindungi. Pengaturan menyediakan unduhan data sebelum migrasi serta ekspor/impor cadangan baru. Salinan mentah ini juga dapat dibungkus sebagai `{ exportedAt, progress }` untuk impor; unduhan arsip aplikasi sudah memakai pembungkus tersebut.

## Materi dan pemeliharaan

- `src/content.ts`: contoh pelajaran dan pemilihan bank soal.
- `src/curriculum.ts`: aplikasi konsep, pelajaran tabel, dan hubungan sumber.
- `src/source.ts`: bagian sumber dengan tautan unik dan tabel baca.
- `src/engine.ts`: penguasaan revisi, kartu, draft, validasi, dan migrasi.
- `src/styles.css`, `src/lib/components/ui`: token Tailwind dan komponen shadcn-svelte.
- `docs/UI-UX-ROADMAP.md`: status implementasi redesign.
- `docs/CURRICULUM-COVERAGE.md`: semua bagian sumber, tujuan, latihan, cek, dan status verifikasi.
- `docs/IMPLEMENTATION-REPORT.md`: perbaikan, bukti pemeriksaan, dan batas validasi.

Sesudah mengubah `docs/sumber.md`, jalankan `npm run source:sync` dan `npm run coverage`. Pemeriksaan akan gagal jika salinan sumber yang dibundel berbeda. ID konsep lama berada di `src/concept-ids.ts`; jangan ubah ID saat memperbaiki teks. Baris tabel memakai ID posisi yang tetap; perubahan susunan sumber memerlukan migrasi eksplisit. Naikkan revisi pelajaran jika tujuan atau kunci berubah.

Aplikasi tidak menggunakan backend, akun, sinkronisasi, penilaian pelafalan, atau mesin tashrif untuk akar sembarang. Mazid hanya pengantar. Catatan verifikasi PDF terdahulu dipertahankan, tetapi penambahan ini dicocokkan dengan transkripsi, bukan pemeriksaan ulang scan.
