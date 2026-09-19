# Milestone 2 — Validasi Belajar dan Stabilisasi

> Catatan versi 2 (19 September 2026): dokumen ini menyimpan baseline milestone terdahulu. Keputusan jalur terbuka, revisi penilaian, dan cakupan 63 pelajaran mengikuti [laporan implementasi](IMPLEMENTATION-REPORT.md) serta [matriks terbaru](CURRICULUM-COVERAGE.md). Catatan verifikasi scan lama tetap berlaku untuk materi yang diperiksa saat itu, bukan soal baru.


## Ringkasan

Milestone ini menguji apakah website membantu proses belajar nyata. Milestone ini juga menetapkan materi pilot yang dapat dipercaya.

Durasi target: **7 sampai 14 hari penggunaan nyata**.

Pemilik milestone: **pengguna dan pengembang proyek**.

## Hasil yang harus dicapai

Milestone selesai jika semua kondisi ini terpenuhi:

- Pengguna menyelesaikan satu pelajaran baru tanpa bantuan teknis.
- Pengguna mengalami satu remediasi dan memahami alasan jawaban yang salah.
- Pengguna menyelesaikan pengulangan pada sedikitnya tiga tanggal berbeda.
- Lima pelajaran M0–M1 memiliki status `Disetujui` pada audit materi.
- Tidak ada masalah P0 atau P1 yang masih terbuka.
- Ekspor dan impor cadangan menghasilkan progres yang sama.
- Pemeriksaan tipe, tes, build, desktop, mobile, dan keyboard lulus.

## Scope

Milestone ini mencakup:

- Uji pakai pada jalur M0–M1.
- Audit materi M0–M1 terhadap scan asli.
- Perbaikan pada alur, teks, aksesibilitas, dan penyimpanan progres.
- Pemeriksaan regresi untuk M2–M8.
- Penetapan versi stabil pertama.

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
| M2-01 | Core | Siapkan baseline pengujian | Versi, perangkat, browser, dan cadangan awal tercatat | Build lulus dan cadangan awal dapat dibaca | Selesai |
| M2-02 | Core | Jalankan sesi belajar pertama | Catatan alur dari Hari Ini sampai hasil cek | Pengguna menyelesaikan satu pelajaran tanpa bantuan teknis | Belum Dikerjakan |
| M2-03 | Core | Uji remediasi | Catatan satu jawaban salah dan alur perbaikan | Pengguna memahami alasan salah dan lulus set berikutnya | Belum Dikerjakan |
| M2-04 | Core | Uji pengulangan terjadwal | Catatan pengulangan pada tiga tanggal | Kartu maju atau kembali sesuai jawaban dan tidak menggandakan hasil | Belum Dikerjakan |
| M2-05 | Core | Verifikasi materi M0–M1 | Lima baris audit berstatus `Disetujui` | Arab, harakat, arti, contoh, dan kunci cocok dengan sumber | Selesai |
| M2-06 | Important | Triage temuan | Daftar temuan dengan prioritas dan bukti | Setiap temuan memiliki langkah reproduksi dan hasil yang diharapkan | Belum Dikerjakan |
| M2-07 | Core | Perbaiki masalah P0 dan P1 | Perubahan kecil dengan bukti pemeriksaan | Tidak ada P0 atau P1 terbuka dan alur lama tetap lulus | Belum Dikerjakan |
| M2-08 | Important | Perbaiki masalah P2 terpilih | Perbaikan yang mengurangi hambatan belajar | Perubahan didukung catatan uji pakai dan tidak menambah scope | Belum Dikerjakan |
| M2-09 | Core | Uji cadangan dan kompatibilitas | Hasil ekspor, impor, refresh, dan tab ganda | Progres pulih tanpa kehilangan kelulusan atau jadwal | Belum Dikerjakan |
| M2-10 | Core | Tutup milestone | Catatan hasil, keputusan, dan versi stabil | Semua kriteria selesai dan roadmap Milestone 3 diperbarui | Belum Dikerjakan |

## Prosedur uji pakai

### Sesi pertama

1. Ekspor cadangan jika browser sudah memiliki progres.
2. Buka halaman Hari Ini.
3. Mulai pelajaran yang tersedia.
4. Baca penjelasan tanpa membuka Referensi.
5. Selesaikan latihan terbimbing.
6. Jawab cek pemahaman secara jujur.
7. Catat bagian yang membingungkan atau terlalu panjang.

### Sesi remediasi

1. Gunakan pelajaran yang belum lulus.
2. Baca alasan untuk setiap jawaban yang salah.
3. Selesaikan lima latihan perbaikan.
4. Jalankan set cek berikutnya.
5. Catat apakah penjelasan memperbaiki kesalahan awal.

### Sesi pengulangan

1. Buka halaman Ulangi pada tanggal kartu jatuh tempo.
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
| P1 | Kelulusan, penguncian, jadwal, atau kunci jawaban salah | Perbaiki sebelum milestone selesai |
| P2 | Alur membingungkan atau menghambat pemahaman | Perbaiki jika didukung bukti penggunaan |
| P3 | Perbaikan kecil tanpa dampak nyata pada belajar | Simpan untuk milestone berikutnya |

## Aturan materi

Gunakan [CONTENT-AUDIT.md](CONTENT-AUDIT.md) untuk setiap pemeriksaan materi.

- Pertahankan ID pelajaran setelah progres pengguna tersimpan.
- Naikkan `revision` jika tujuan atau kunci jawaban berubah.
- Naikkan `contentVersion` jika perubahan membutuhkan evaluasi ulang lintas pelajaran.
- Naikkan `formatVersion` hanya jika bentuk data progres berubah.
- Jangan jadikan materi yang belum disetujui sebagai kunci baru.
- Jangan menghasilkan bentuk tashrif umum dari contoh terkurasi.

## Pemeriksaan sebelum rilis

1. Jalankan `npm run check`.
2. Jalankan `npm test`.
3. Jalankan `npm run build`.
4. Uji tampilan desktop dan mobile.
5. Uji navigasi dengan keyboard.
6. Uji alamat langsung ke satu pelajaran terkunci.
7. Ekspor cadangan dari versi lama.
8. Impor cadangan ke build baru.
9. Pastikan bahwa kelulusan dan tanggal kartu tetap sama.
10. Perbarui `TASKS.md`, `ROADMAP.md`, dan catatan audit.

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
