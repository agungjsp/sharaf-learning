# Roadmap redesign UI/UX

Status: **Siap diuji manual**

| Tahap | Hasil | Status |
|---|---|---|
| U0 — Kontrak desain | Arah minimal modern, navigasi, token, dan tiga fase terkunci | Selesai |
| U1 — Fondasi | Tailwind CSS, shadcn-svelte, font lokal, token, shell responsif | Selesai |
| U2 — Beranda dan materi | Beranda terarah, accordion, pencarian, filter dan URL state | Siap diuji |
| U3 — Alur belajar | Materi → Latihan → Cek, satu soal per layar, ringkasan submit | Siap diuji |
| U4 — Halaman pendukung | Latihan, referensi, progres, pengaturan, konfirmasi restore | Siap diuji |
| U5 — Konsolidasi | CSS lama dihapus, check/test/build, dokumentasi, smoke test | Siap diuji |

## Aturan kompatibilitas

- Pertahankan format progres v2, key localStorage, ID pelajaran, soal, dan kartu.
- Pertahankan hash URL lama; `#review` dan `#mixed` menjadi tab pada shell Latihan.
- Perubahan visual tidak menaikkan revisi materi.
- Langkah lama 0–2 dipetakan ke Materi, 3–4 ke Latihan, dan 5 ke Cek.
- Pemeriksaan otomatis mengikuti `AGENTS.md`; pengujian visual dilakukan melalui smoke test pengguna.

## Hasil implementasi

- `src/styles.css` menjadi satu-satunya stylesheet global. `src/app.css` lama telah dihapus.
- Format progres v2, key localStorage, materi, dan URL lama tidak berubah.
- Draft cek memakai `Draft.index` untuk menyimpan nomor soal aktif.
- Tailwind dan komponen shadcn-svelte dikunci di `package-lock.json`.
- Check Svelte/TypeScript, 16 tes yang sudah tersedia, dan build produksi lulus. Status akhir menunggu smoke test manual.
