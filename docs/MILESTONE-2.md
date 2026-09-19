# Milestone 2 — Validasi Belajar dan Stabilisasi

Status: **Validasi penggunaan nyata belum selesai**. Panduan ini mengikuti aplikasi versi 2 dengan 63 pelajaran dan jalur belajar terbuka.

Baseline dan pemeriksaan scan tanggal 15 September 2026 tetap menjadi bukti historis. Keduanya tidak membuktikan validasi seluruh materi versi 2.
Lihat [laporan implementasi](IMPLEMENTATION-REPORT.md), [audit materi](CONTENT-AUDIT.md), dan [smoke test](UI-UX-SMOKE-TEST.md).

## Ringkasan

Milestone ini menguji apakah website membantu proses belajar nyata. Milestone ini juga menetapkan materi pilot yang dapat dipercaya.

Durasi target: **7 sampai 14 hari penggunaan nyata**.

Pemilik milestone: **pengguna dan pengembang proyek**.

## Hasil yang harus dicapai

Milestone selesai jika semua kondisi ini terpenuhi:

- Pengguna menyelesaikan satu pelajaran baru tanpa bantuan teknis.
- Pengguna mengalami satu remediasi dan memahami alasan jawaban yang salah.
- Pengguna menyelesaikan pengulangan pada sedikitnya tiga tanggal berbeda.
- Materi pilot pada revisi yang diuji memiliki catatan pemeriksaan scan, termasuk soal yang baru.
- Tidak ada masalah P0 atau P1 yang masih terbuka.
- Ekspor dan impor cadangan menghasilkan progres yang sama.
- Pemeriksaan tipe, tes, build, desktop, mobile, dan keyboard lulus.

## Scope

Milestone ini mencakup:

- Uji pakai pada jalur M0–M1.
- Audit materi M0–M1 terhadap scan asli.
- Perbaikan pada alur, teks, aksesibilitas, dan penyimpanan progres.
- Pemeriksaan regresi untuk M2–M8.
- Penetapan hasil validasi versi 2.

Milestone ini tidak mencakup:

- Materi baru di luar sumber saat ini.
- Akun pengguna atau sinkronisasi perangkat.
- Perubahan framework atau penyimpanan server.
- Publikasi ke hosting produksi.
- Perombakan visual tanpa masalah penggunaan yang tercatat.

## Status task

Gunakan status berikut:

**Belum Dikerjakan → Sedang Dikerjakan → Perlu Diperbaiki → Selesai**

| ID | Prioritas | Task | Output | Definition of Done | Status |
|---|---|---|---|---|---|
| M2-01 | Core | Siapkan baseline pengujian | Versi, perangkat, browser, dan cadangan awal tercatat | Baseline v1 tersedia di [M2-01](baselines/M2-01.md); catat perangkat dan versi baru sebelum uji v2 | Baseline v1 selesai; v2 belum dicatat |
| M2-02 | Core | Jalankan sesi belajar pertama | Catatan alur dari Beranda sampai hasil cek | Pengguna menyelesaikan satu pelajaran tanpa bantuan teknis | Belum Dikerjakan |
| M2-03 | Core | Uji remediasi | Catatan satu jawaban salah dan alur perbaikan | Pengguna memahami alasan salah dan lulus set berikutnya | Belum Dikerjakan |
| M2-04 | Core | Uji pengulangan terjadwal | Catatan pengulangan pada tiga tanggal | Kartu maju atau kembali sesuai jawaban dan tidak menggandakan hasil | Belum Dikerjakan |
| M2-05 | Core | Verifikasi materi M0–M1 | Catatan scan untuk revisi materi pilot yang diuji | Arab, harakat, arti, contoh, dan kunci cocok dengan sumber | Scan v1 selesai; soal baru belum diperiksa ulang |
| M2-06 | Important | Triage temuan | Daftar temuan dengan prioritas dan bukti | Setiap temuan memiliki langkah reproduksi dan hasil yang diharapkan | Belum Dikerjakan |
| M2-07 | Core | Perbaiki masalah P0 dan P1 | Perubahan kecil dengan bukti pemeriksaan | Tidak ada P0 atau P1 terbuka dan alur lama tetap lulus | Belum Dikerjakan |
| M2-08 | Important | Perbaiki masalah P2 terpilih | Perbaikan yang mengurangi hambatan belajar | Perubahan didukung catatan uji pakai dan tidak menambah scope | Belum Dikerjakan |
| M2-09 | Core | Uji cadangan dan kompatibilitas | Hasil ekspor, impor, refresh, dan tab ganda | Progres pulih tanpa kehilangan kelulusan atau jadwal | Belum Dikerjakan |
| M2-10 | Core | Tutup milestone | Catatan hasil, keputusan, dan versi stabil | Semua kriteria selesai dan roadmap Milestone 3 diperbarui | Belum Dikerjakan |

## Prosedur uji pakai

### Sesi pertama

1. Ekspor cadangan jika browser sudah memiliki progres.
2. Buka Beranda.
3. Mulai pelajaran yang tersedia.
4. Baca penjelasan tanpa membuka Referensi.
5. Selesaikan latihan terbimbing.
6. Jawab cek pemahaman secara jujur.
7. Catat bagian yang membingungkan atau terlalu panjang.

### Sesi remediasi

1. Gunakan pelajaran yang belum lulus.
2. Baca alasan untuk setiap jawaban yang salah.
3. Selesaikan latihan perbaikan yang tersedia untuk kesalahan tersebut.
4. Jalankan set cek berikutnya.
5. Catat apakah penjelasan memperbaiki kesalahan awal.

### Sesi pengulangan

1. Pada tanggal kartu jatuh tempo, buka Latihan → Ulangi.
2. Jawab sebelum membuka kartu.
3. Pilih `Ingat` hanya jika jawaban lengkap sudah muncul dari ingatan.
4. Pilih `Belum ingat` jika jawaban tidak lengkap.
5. Ulangi prosedur ini pada tiga tanggal berbeda.

## Format temuan

Gunakan satu catatan untuk satu masalah:

```md
### Judul singkat

- Tanggal:
- Perangkat dan browser:
- Pelajaran atau halaman:
- Langkah reproduksi:
- Hasil yang diharapkan:
- Hasil yang terlihat:
- Dampak belajar:
- Prioritas: P0 | P1 | P2 | P3
- Bukti opsional:
```

### Prioritas temuan

| Prioritas | Arti | Tindakan |
|---|---|---|
| P0 | Progres hilang atau aplikasi tidak dapat digunakan | Hentikan milestone dan perbaiki segera |
| P1 | Penguasaan, rekomendasi prasyarat, jadwal, atau kunci jawaban salah | Perbaiki sebelum milestone selesai |
| P2 | Alur membingungkan atau menghambat pemahaman | Perbaiki jika didukung bukti penggunaan |
| P3 | Perbaikan kecil tanpa dampak nyata pada belajar | Simpan untuk milestone berikutnya |

## Aturan materi

Gunakan [CONTENT-AUDIT.md](CONTENT-AUDIT.md) untuk setiap pemeriksaan materi.

- Pertahankan ID pelajaran setelah progres pengguna tersimpan.
- Naikkan `revision` jika tujuan atau kunci jawaban berubah.
- Naikkan `contentVersion` jika perubahan membutuhkan evaluasi ulang lintas pelajaran.
- Naikkan `formatVersion` hanya jika bentuk data progres berubah.
- Jangan tandai soal baru sebagai terverifikasi scan tanpa pemeriksaan ulang.
- Jangan menghasilkan bentuk tashrif umum dari contoh terkurasi.

## Pemeriksaan sebelum rilis

1. Jalankan `npm run check`.
2. Jalankan `npm test`.
3. Jalankan `npm run build`.
4. Uji tampilan desktop dan mobile.
5. Uji navigasi dengan keyboard.
6. Buka alamat langsung pelajaran yang prasyaratnya belum lulus. Materi harus tetap dapat dibaca.
7. Ekspor cadangan dari versi lama.
8. Impor cadangan ke build baru.
9. Pastikan bahwa kelulusan dan tanggal kartu tetap sama.
10. Perbarui [status proyek](../TASKS.md), [roadmap](../ROADMAP.md), dan catatan audit.

## Catatan penutupan milestone

Isi bagian ini saat semua task selesai:

```md
Tanggal selesai:
Versi:
Pelajaran yang disetujui:
Masalah yang diperbaiki:
Masalah yang ditunda:
Hasil pengulangan tiga tanggal:
Keputusan Milestone 3:
```
