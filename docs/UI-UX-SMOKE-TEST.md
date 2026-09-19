# Smoke test redesign UI/UX

Jalankan pemeriksaan ini secara manual sesuai `AGENTS.md`. Gunakan progres cadangan sebelum menguji pemulihan data.

## Navigasi dan perangkat

1. Buka Beranda pada HP dan laptop. Pastikan hanya satu tindakan utama yang paling menonjol.
2. Periksa lima tujuan utama: Beranda, Materi, Latihan, Referensi, dan Progres.
3. Pada HP, pastikan navigasi bawah tidak menutup tombol terakhir. Buka Pengaturan melalui header.
4. Gunakan Tab dan Enter. Fokus harus terlihat dan urutannya mengikuti tampilan.
5. Uji zoom 200% serta lebar sekitar 320 px dan 390 px. Halaman tidak boleh menggulir horizontal.

## Materi

1. Cari istilah Indonesia dan Arab tanpa harakat.
2. Pilih setiap filter status dan buka/tutup beberapa bagian.
3. Buka pelajaran, lalu kembali ke peta. Bagian dan pelajaran asal harus muncul kembali.
4. Buka pelajaran yang prasyaratnya belum lulus. Materi tetap dapat dibaca dan saran prasyarat terlihat.

## Alur belajar

1. Jalankan Materi → Latihan → Recall → Cek.
2. Pada latihan kedua, refresh halaman. Soal, pilihan, dan feedback harus tetap.
3. Saat latihan, buka Referensi. Tutup dengan Escape dan tombol close; posisi latihan harus tetap.
4. Pada soal cek ketiga, refresh. Nomor soal dan jawaban harus tetap.
5. Pindah ke soal sebelumnya, ubah jawaban, lalu tinjau ringkasan. Submit hanya aktif setelah semua soal terjawab.
6. Pilih Mulai ulang. Batalkan sekali, lalu konfirmasi. Hanya draft aktif yang dihapus.
7. Buat satu hasil gagal dan periksa remediasi; kemudian lulus dan periksa rekomendasi berikutnya.

## Referensi dan keterbacaan

1. Buka referensi pelajaran sebagai Sheet pada desktop dan HP.
2. Buka Referensi lengkap, ganti tab Penjelasan/Sumber asli, dan gunakan pencarian.
3. Ubah ukuran Arab ke 24 dan 48 px. Contoh, soal, dan tabel harus tetap terbaca.
4. Periksa judul Arab panjang dan tabel lebar. Kata Arab tidak boleh terpotong di tengah.

## Progres dan cadangan

1. Pastikan jumlah penguasaan, riwayat pernah lulus, retensi, dan jadwal sama seperti sebelum redesign.
2. Ekspor cadangan, ubah progres, lalu impor kembali.
3. Batalkan dialog pemulihan sekali; progres tidak boleh berubah.
4. Pulihkan cadangan dan pastikan sesi aktif sebelumnya ditutup dengan aman.
