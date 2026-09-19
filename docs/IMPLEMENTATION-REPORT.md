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
| Ukuran Arab tidak berubah | Variabel ukuran diwariskan dari elemen root aplikasi | Implementasi pewarisan ukuran; 48 px, refresh, dan tabel menunggu smoke test manual |
| Parameter referensi tidak reaktif | Query hash dibaca menjadi state aplikasi | Implementasi state query; pergantian parameter pada rute yang sama menunggu smoke test manual |
| Referensi hilang di HP | Tautan tiap pelajaran tetap tampil; tabel punya area gulir keyboard | Cakupan data otomatis; tampilan 320/390 px siap diuji manual |
| Refresh mengulang latihan | Draft menyimpan pertanyaan, pilihan, jawaban, posisi, dan feedback | Tes penyimpanan draft; refresh dan referensi–kembali menunggu smoke test manual |

## Integritas data

Cadangan lengkap yang dibuat oleh engine v1 asli diuji sebagai fixture. Seluruh 24 riwayat lulus dan 120 kartu dipertahankan beserta tanggal dan intervalnya. Pemeriksaan kelulusan baru memerlukan cek revisi terbaru; ini disengaja karena bank penilaian berubah.

Migrasi menyalin byte data lama sebelum penyimpanan versi 2. Jika penyalinan atau penyimpanan gagal, UI memberi jalur ekspor dan tidak menimpa data lama otomatis. Pemulihan cadangan menghapus sesi aktif sebelumnya. Pembaruan tab lain mengganti sesi yang tidak cocok; data eksternal yang tidak valid dilindungi.

## Pemeriksaan

Hasil otomatis berikut dicatat pada implementasi 19 September 2026. Hasil ini bukan bukti pengujian browser.

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

## Status UI/UX

Implementasi redesign tersedia. Validasi visual dan interaksi browser masih menunggu [smoke test manual](UI-UX-SMOKE-TEST.md).

- Navigasi utama: Beranda, Materi, Latihan, Referensi, dan Progres. Pengaturan tersedia melalui header.
- Fase pelajaran: Materi → Latihan → Cek. Langkah Ingat kembali berada dalam fase Latihan.
- Tailwind, komponen shadcn-svelte, dan font lokal membentuk fondasi UI. Stylesheet global berada di `src/styles.css`.
- Format progres v2, kunci penyimpanan, dan URL lama tetap dipertahankan. `#review` dan `#mixed` membuka tab pada Latihan.
- Langkah lama 0–2 dipetakan ke Materi, 3–4 ke Latihan, dan 5 ke Cek. `Draft.index` menyimpan nomor soal aktif.
- Perubahan visual tidak menaikkan revisi materi.

Bagian ini menggantikan roadmap UI/UX terpisah agar status implementasi tidak dicatat di dua tempat.

## Dokumen terkait

- [Matriks cakupan lengkap](CURRICULUM-COVERAGE.md)
- [Catatan verifikasi scan terdahulu](reviews/M2-CONTENT-REVIEW.md)
- [Arah produk](../PRODUCT.md)
- [Cara menjalankan dan memeriksa](../README.md)
