# Smoke test aplikasi versi 2

Status: **Menunggu pengujian manual**.

Jalankan pemeriksaan ini sesuai [AGENTS.md](../AGENTS.md). Ekspor cadangan sebelum menguji pemulihan data.
Catat tanggal, versi aplikasi atau commit, perangkat, browser, hasil, dan langkah reproduksi jika gagal.

## Navigasi dan perangkat

1. Buka Beranda pada HP dan laptop. Pastikan hanya satu tindakan utama yang paling menonjol.
2. Periksa lima tujuan utama: Beranda, Materi, Latihan, Referensi, dan Progres.
3. Pada HP, pastikan navigasi bawah tidak menutup tombol terakhir. Buka Pengaturan melalui header.
4. Gunakan Tab dan Enter. Fokus harus terlihat dan urutannya mengikuti tampilan.
5. Aktifkan tautan lewati navigasi. Fokus harus berpindah ke konten utama tanpa mengubah rute.
6. Uji zoom 200% serta lebar sekitar 320 px dan 390 px. Halaman tidak boleh menggulir horizontal.

## Materi

1. Cari istilah Indonesia dan Arab tanpa harakat.
2. Pilih setiap filter status dan buka/tutup beberapa bagian.
3. Buka pelajaran, lalu kembali ke peta. Bagian dan pelajaran asal harus muncul kembali.
4. Buka pelajaran yang prasyaratnya belum lulus. Materi tetap dapat dibaca dan saran prasyarat terlihat.

## Alur belajar

1. Jalankan Materi → Latihan → Ingat kembali → Cek. Ingat kembali berada dalam fase Latihan.
2. Pada latihan kedua, refresh halaman. Soal, pilihan, dan feedback harus tetap.
3. Saat latihan, buka Referensi. Tutup dengan Escape dan tombol tutup; posisi latihan harus tetap.
4. Pada soal cek ketiga, refresh. Nomor soal dan jawaban harus tetap.
5. Pindah ke soal sebelumnya, ubah jawaban, lalu tinjau ringkasan. Submit hanya aktif setelah semua soal terjawab.
6. Pilih Mulai ulang. Batalkan sekali, lalu konfirmasi. Hanya draft aktif yang dihapus.
7. Buat satu hasil gagal dan periksa remediasi; kemudian lulus dan periksa rekomendasi berikutnya.

## Referensi dan keterbacaan

1. Buka referensi pelajaran sebagai Sheet pada desktop dan HP.
2. Buka Referensi lengkap, ganti tab Penjelasan/Sumber asli, dan gunakan pencarian.
3. Ubah ukuran Arab ke 24 dan 48 px. Contoh, soal, dan tabel harus tetap terbaca.
4. Buka dua tautan referensi pelajaran secara berurutan pada rute yang sama. Isi harus mengikuti pelajaran yang dipilih.
5. Periksa judul Arab panjang dan tabel lebar. Kata Arab tidak boleh terpotong di tengah.

## Progres dan cadangan

1. Pastikan jumlah penguasaan, riwayat pernah lulus, retensi, dan jadwal sama seperti sebelum redesign.
2. Ekspor cadangan, ubah progres, lalu impor kembali.
3. Batalkan dialog pemulihan sekali; progres tidak boleh berubah.
4. Pulihkan cadangan dan pastikan sesi aktif sebelumnya ditutup dengan aman.

## Penyimpanan dan kompatibilitas

Gunakan profil browser khusus pengujian untuk skenario data rusak atau kegagalan penyimpanan.

1. Impor cadangan v1. Riwayat lulus tetap ada, tetapi materi revisi baru meminta cek ulang.
2. Periksa bahwa kartu revisi lama tidak masuk antrean sebelum cek ulang lulus.
3. Pilih berkas JSON rusak atau cadangan tidak valid. Pesan kesalahan harus muncul tanpa mengganti progres.
4. Buka dua tab. Simpan progres di satu tab, lalu gunakan tab lain. Progres terbaru tidak boleh tertimpa data lama.
5. Simulasikan kegagalan penyimpanan. Periksa pesan kegagalan dan jalur ekspor data yang masih tersedia.
6. Setelah pemulihan cadangan, periksa antrean pengulangan dan draft. Sesi lama tidak boleh menilai kartu yang tidak sesuai.
7. Buka `#review` dan `#mixed` secara langsung. Keduanya harus membuka tab Latihan yang sesuai.
8. Pada pergantian tanggal, periksa kartu jatuh tempo dan jumlah pengulangan. Retensi hanya bertambah pada tanggal yang berbeda.

Uji belajar 7–14 hari dan pengulangan pada tiga tanggal mengikuti [panduan validasi belajar](MILESTONE-2.md).
