# Audit materi

## Status dan cakupan

Aplikasi memuat 63 pelajaran. Daftar lengkap dan status verifikasi per pelajaran berada di [matriks cakupan](CURRICULUM-COVERAGE.md).

Lima pelajaran awal memiliki [catatan pemeriksaan scan tanggal 15 September 2026](reviews/M2-CONTENT-REVIEW.md).
Catatan tersebut berlaku untuk materi yang diperiksa saat itu. Catatan itu tidak mengesahkan seluruh soal atau revisi terbaru.
Penambahan versi 2 dicocokkan dengan transkripsi, tanpa pemeriksaan ulang scan.

[Daftar audit 24 pelajaran versi 1](archive/CONTENT-AUDIT-V1.md) disimpan sebagai arsip. Gunakan matriks cakupan untuk daftar pelajaran aktif.

## Prosedur pemeriksaan

1. Catat ID dan revisi pelajaran dari `src/content.ts` atau `src/curriculum.ts`.
2. Catat nama PDF, halaman, dan identitas berkas sumber.
3. Bandingkan bentuk Arab, harakat, arti, contoh, dan seluruh bank soal dengan scan.
4. Periksa bahwa setiap soal memiliki satu jawaban yang sah dalam konteksnya.
5. Pisahkan mnemonic dari kaidah umum. Catat ketidakjelasan sumber tanpa menambah bentuk rekaan.
6. Simpan hasil pemeriksaan di `docs/reviews/` dengan tanggal dan cakupan yang jelas.
7. Perbarui keterangan verifikasi pelajaran sesuai bukti, lalu jalankan `npm run coverage`.

Gunakan status **Belum Diperiksa → Sedang Diperiksa → Perlu Diperbaiki → Disetujui** dalam catatan pemeriksaan.
Status `Disetujui` memerlukan kecocokan dengan scan dan pemeriksa yang memahami materi sharaf terkait.
Kecocokan dengan transkripsi saja tidak sama dengan persetujuan terhadap scan.

## Aturan perubahan

- Pertahankan ID pelajaran, soal, dan kartu yang terkait dengan progres tersimpan.
- Naikkan `lesson.revision` jika tujuan atau kunci jawaban berubah.
- Catat alasan perubahan serta materi yang masih memerlukan pemeriksaan.
- Jika transkripsi berubah, jalankan `npm run source:sync` sebelum `npm run coverage`.
- Jalankan `npm test` dan `npm run build` setelah perubahan materi. Build juga menjalankan `npm run check`.

## Format catatan pemeriksaan

```md
Tanggal:
Pemeriksa:
Sumber dan SHA-256:
Halaman PDF:
ID dan revisi pelajaran:
Cakupan contoh dan soal:
Status:
Temuan dan perbaikan:
Bagian yang belum diperiksa:
```
