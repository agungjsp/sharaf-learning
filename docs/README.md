# Dokumentasi Sharaf Learning

## Mulai di sini

| Kebutuhan | Dokumen |
|---|---|
| Instalasi dan perintah proyek | [README proyek](../README.md) |
| Arah dan batas produk | [PRODUCT.md](../PRODUCT.md) |
| Hasil implementasi v2 dan status UI | [IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md) |
| Pemeriksaan manual aplikasi | [UI-UX-SMOKE-TEST.md](UI-UX-SMOKE-TEST.md) |
| Validasi belajar 7–14 hari | [MILESTONE-2.md](MILESTONE-2.md) |
| Prosedur audit materi | [CONTENT-AUDIT.md](CONTENT-AUDIT.md) |
| Cakupan 63 pelajaran dan status verifikasi | [CURRICULUM-COVERAGE.md](CURRICULUM-COVERAGE.md) |
| Transkripsi sumber pembelajaran | [sumber.md](sumber.md) |

## Riwayat dan bukti

- [Review scan M0–M1](reviews/M2-CONTENT-REVIEW.md): hasil pemeriksaan tanggal 15 September 2026.
- [Baseline v1](baselines/M2-01.md): lingkungan, hash berkas, dan hasil pemeriksaan lama.
- [Cadangan pengguna baru v1](baselines/m2-initial-progress.json): data untuk skenario impor format lama.
- [Arsip audit v1](archive/CONTENT-AUDIT-V1.md): status 24 pelajaran sebelum perluasan kurikulum.

Catatan historis tidak menyatakan bahwa soal baru sudah diperiksa terhadap scan.
Status implementasi teknis juga tidak membuktikan kelulusan smoke test atau keberhasilan belajar nyata.

## Pemeliharaan

- Pertahankan `sumber.md` di lokasi ini. Skrip sinkronisasi dan tes membaca berkas tersebut secara langsung.
- Setelah mengubah transkripsi, jalankan `npm run source:sync`, lalu `npm run coverage`.
- `CURRICULUM-COVERAGE.md` dibuat oleh skrip. Ubah data sumbernya, bukan tabel hasil secara manual.
- Catat hasil audit baru di `reviews/`. Cantumkan tanggal, sumber, revisi pelajaran, dan cakupan soal yang diperiksa.
- Simpan bukti historis di `archive/`, `baselines/`, atau `reviews/` sesuai jenisnya.
- Setelah memindahkan atau menghapus dokumen, perbarui tautan dan indeks ini.
