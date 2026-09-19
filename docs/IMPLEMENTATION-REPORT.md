# Implementasi penyempurnaan Sharaf

Tanggal: 19 September 2026. Versi aplikasi: 2.0.0.

## Hasil

- 63 pelajaran; 24 ID lama dipertahankan.
- 116 bagian sumber memiliki alamat unik dan tercatat di matriks cakupan: 53 terhubung langsung ke pelajaran, 63 tersedia sebagai referensi dengan alasan.
- 1.072 soal dalam bank cek, termasuk varian mencocokkan dan tabel. Angka ini menghitung varian pertanyaan, bukan jumlah konsep yang berbeda.
- Setiap cek mengambil lima soal, sedikitnya dua penerapan. Penguasaan memerlukan empat benar dan semua konsep wajib. Latihan dan cek memakai ID serta arah pertanyaan yang berbeda.
- Semua posisi pada tabel utama dipertahankan, termasuk ejaan dhamir yang muncul pada dua posisi. Tujuh rangkaian huruf jar kini disajikan sebagai tabel 14 posisi tanpa membuat bentuk baru.

## Penutupan temuan awal

| Temuan | Perbaikan | Bukti |
|---|---|---|
| Progres gagal dimuat setelah gagal cek revisi | Riwayat kelulusan, revisi percobaan, dan revisi penguasaan dipisahkan; kartu lama ditangguhkan | Tes failed revision recheck, backup round trip, dan pemulihan keadaan bug v1 |
| Posisi jawaban benar seragam | Fisher–Yates saat sesi dimulai; urutan disimpan dalam draft | Tes RNG berseed dan pemulihan draft |
| Pertanyaan tidak cocok dengan kunci | Prompt lama yang tidak sesuai dihapus; bank eksplisit membedakan pengetahuan dan konteks penerapan | Validasi seluruh bank; uji konteks tunggal dan bentuk berulang |
| Latihan sama dengan cek | Bank latihan terpisah; cek memakai penerapan; remediasi memuat konteks yang gagal | Tes setiap pelajaran dan perjalanan gagal → remediasi → lulus |
| Skip-link membuka rute salah | Fokus langsung ke main tanpa mengganti hash | Pemeriksaan implementasi; siap diuji lewat keyboard |
| Ukuran Arab tidak berubah | Variabel ukuran diwariskan dari elemen root aplikasi | Tes 48 px, refresh, dan ukuran maksimum pada tabel |
| Parameter referensi tidak reaktif | Query hash dibaca menjadi state aplikasi | Tes dua parameter pelajaran pada rute yang sama |
| Referensi hilang di HP | Tautan tiap pelajaran tetap tampil; tabel punya area gulir keyboard | Cakupan data otomatis; tampilan 320/390 px siap diuji manual |
| Refresh mengulang latihan | Draft menyimpan pertanyaan, pilihan, jawaban, posisi, dan feedback | Tes latihan kedua, refresh, referensi–kembali, serta draft cek |

## Integritas data

Cadangan lengkap yang dibuat oleh engine v1 asli diuji sebagai fixture. Seluruh 24 riwayat lulus dan 120 kartu dipertahankan beserta tanggal dan intervalnya. Pemeriksaan kelulusan baru memerlukan cek revisi terbaru; ini disengaja karena bank penilaian berubah.

Migrasi menyalin byte data lama sebelum penyimpanan versi 2. Jika penyalinan atau penyimpanan gagal, UI memberi jalur ekspor dan tidak menimpa data lama otomatis. Pemulihan cadangan menghapus sesi aktif sebelumnya. Pembaruan tab lain mengganti sesi yang tidak cocok; data eksternal yang tidak valid dilindungi.

## Pemeriksaan

- `npm test`: 16 tes logika, kurikulum, dan kompatibilitas.
- `npm run check`: Svelte dan TypeScript tanpa error/warning; sumber yang dibundel harus cocok dengan Markdown asli.
- `npm run build`: build produksi statis.
- Detektor Impeccable pada UI baru hanya menandai Inter sebagai font yang umum; Inter dipertahankan karena menjadi keputusan desain eksplisit.
- Tampilan desktop 1280 px, HP 390/320 px, zoom 200%, fokus keyboard, dan tabel panjang tercakup dalam `UI-UX-SMOKE-TEST.md` dan menunggu pengujian manual.
- Cadangan rusak, ekspor/impor, antrean review setelah pemulihan, dua tab, kegagalan penyimpanan, dan pergantian tanggal tercakup dalam tes logika atau checklist manual sesuai jenis perilakunya.

Redesign ini belum diklaim lolos pengujian visual browser. Proyek melarang agen menjalankan server atau browser; pengembang melakukan smoke test manual menggunakan checklist yang disediakan.

## Batas materi dan validasi belajar

Sumber tunggal penambahan ini adalah `docs/sumber.md`. Catatan pemeriksaan PDF lama M0–M1 tetap tersedia, tetapi tidak dianggap verifikasi scan atas soal baru. Entri dengan batas atau ketidakjelasan transkripsi tetap menjadi referensi. Mazid hanya pengantar; tidak ada klaim seluruh rincian 22 bab atau mesin tashrif untuk akar sembarang.

Uji belajar nyata 7–14 hari masih diperlukan untuk menilai durasi sesi, pemahaman setelah remediasi, dan retensi pada tiga tanggal berbeda. Tes teknis memastikan perilaku aplikasi, bukan membuktikan hasil belajar.

## Dokumen terkait

- [Matriks cakupan lengkap](CURRICULUM-COVERAGE.md)
- [Catatan verifikasi scan terdahulu](reviews/M2-CONTENT-REVIEW.md)
- [Arah produk](../PRODUCT.md)
- [Cara menjalankan dan memeriksa](../README.md)
