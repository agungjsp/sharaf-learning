# Sistem Tampilan Sharaf

Sharaf adalah ruang belajar pribadi yang minimal, modern, dan terang. Antarmuka membantu pengguna selalu mengetahui posisi, langkah berikutnya, dan jalur kembali tanpa mengganggu bacaan Arab.

## Fondasi

- Tailwind CSS 4 mengatur layout dan utility. Komponen dasar berasal dari shadcn-svelte dan disimpan di `src/lib/components/ui`.
- Token semantik berada di `src/styles.css`. Latar memakai zinc sangat muda, permukaan putih, teks zinc gelap, dan hijau gelap sebagai satu-satunya aksen aksi.
- Radius kontrol 8 px, panel 12 px, garis tipis, dan bayangan hanya untuk panel mengambang.
- Inter Variable adalah font UI. Noto Naskh Arabic Variable adalah font Arab. Keduanya disimpan sebagai dependency lokal.
- Target sentuh utama minimal 44 × 44 px. Fokus keyboard memakai ring hijau yang terlihat.
- Tema terang adalah satu-satunya tema pada versi ini.

## Navigasi

- Lima tujuan utama konsisten: Beranda, Materi, Latihan, Referensi, dan Progres.
- Desktop memakai sidebar 240 px. HP dan tablet memakai header ringkas serta navigasi bawah yang menghormati safe area.
- Pengaturan berada di bawah sidebar desktop dan di header HP.
- Navigasi aktif memakai bentuk, warna, label, dan `aria-current`.

## Pembelajaran

- Pelajaran mempunyai tiga fase: Materi, Latihan, dan Cek.
- Materi menyatukan Pahami, Contoh, dan Bandingkan dalam satu ruang baca maksimal sekitar 720 px.
- Latihan menampilkan satu soal per layar dan feedback langsung. Recall mandiri menjadi penutup fase Latihan.
- Cek menampilkan satu soal per layar, menyimpan setiap pilihan, dan menyediakan ringkasan sebelum submit.
- Membaca fase lain atau membuka referensi tidak menghapus draft. Mulai ulang selalu menggunakan dialog konfirmasi.

## Arab dan konten dwibahasa

- Ukuran Arab materi mengikuti pengaturan 24–48 px. Arab pada kontrol navigasi memakai skala UI tetap.
- Semua Arab memakai `lang="ar"`, `dir="rtl"`, Noto Naskh Arabic, dan isolasi bidi; halaman Indonesia tetap LTR.
- Kata Arab dalam tabel tidak dipotong. Tabel menggulir di dalam panel saat ruang tidak cukup.
- Judul sumber menempatkan Indonesia sebagai label utama, Arab pada baris tersendiri, dan nomor bagian terpisah.

## Komponen dan state

- Gunakan Button, Badge, Card, Accordion, Tabs, Input, Table, Sheet, Alert, dan Alert Dialog dari sistem shadcn-svelte yang telah dipasang.
- Gunakan HTML native ketika primitive library tidak menambah perilaku: details, select, radio, progress, dan range tetap native dengan token visual yang sama.
- Empty, error, success, disabled, dan recovery state harus menjelaskan tindakan berikutnya.
- Animasi hanya dipakai untuk Sheet dan disclosure; `prefers-reduced-motion` menghapus gerak panel tanpa menyembunyikan perubahan state.

## Responsive

- Desain harus utuh pada 320 px, 390 px, tablet, dan desktop 1280–1600 px.
- Grid beralih menjadi satu kolom sebelum ruang membaca atau target sentuh mengecil.
- Navigasi bawah tidak boleh menutup tombol akhir halaman.
- Zoom 200% harus mempertahankan urutan baca dan tidak menimbulkan scroll horizontal pada halaman.
