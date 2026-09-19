# Audit Materi Sharaf

> Catatan versi 2 (19 September 2026): dokumen ini menyimpan baseline milestone terdahulu. Keputusan jalur terbuka, revisi penilaian, dan cakupan 63 pelajaran mengikuti [laporan implementasi](IMPLEMENTATION-REPORT.md) serta [matriks terbaru](CURRICULUM-COVERAGE.md). Catatan verifikasi scan lama tetap berlaku untuk materi yang diperiksa saat itu, bukan soal baru.


Dokumen ini mencatat status keakuratan setiap pelajaran. Jangan samakan keberhasilan build dengan keakuratan materi.

## Status

Gunakan urutan ini:

**Belum Diperiksa → Sedang Diperiksa → Perlu Diperbaiki → Disetujui**

`Disetujui` berarti semua kondisi ini terpenuhi:

- Bentuk Arab dan harakat cocok dengan sumber scan.
- Arti Indonesia mempertahankan maksud sumber.
- Contoh mendukung tujuan pelajaran.
- Setiap soal memiliki satu jawaban yang sah.
- Penjelasan tidak mengubah mnemonic menjadi kaidah umum.
- Pemeriksa memahami materi sharaf yang diperiksa.

## Aturan perubahan

- Jangan ubah `lesson.id` setelah progres tersimpan.
- Perbaiki teks tanpa mengganti ID jika tujuan dan jawaban tetap sama.
- Naikkan `lesson.revision` jika tujuan atau kunci jawaban berubah.
- Catat alasan perubahan pada kolom Catatan.
- Jalankan semua pemeriksaan proyek setelah perubahan materi.

## Daftar audit

| No. | Modul | ID | Pelajaran | Rujukan | Status | Pemeriksa | Tanggal | Catatan |
|---:|---:|---|---|---|---|---|---|---|
| 1 | M0 | `harakat` | Tanda kecil, bunyi berbeda | §2 — Harakat | Disetujui | Codex, scan visual | 2026-09-15 | Nama dan tanda cocok. Contoh ba adalah adaptasi latihan. |
| 2 | M0 | `tanda-lanjutan` | Tanwin, maddah, dan pola | §2 dan §4 | Disetujui | Codex, scan visual | 2026-09-15 | Kunci maddah diperbaiki dan revisi dinaikkan. |
| 3 | M1 | `dhamir-sudut-pandang` | Dia, kamu, dan saya | §1.1–1.2 | Disetujui | Codex, scan visual | 2026-09-15 | Bentuk dan makna cocok. |
| 4 | M1 | `dhamir-jumlah` | Satu, dua, dan banyak | §1.2 dan Lampiran B | Disetujui | Codex, scan visual | 2026-09-15 | Bentuk ganda memiliki konteks yang jelas. |
| 5 | M1 | `dhamir-peta` | Melengkapi peta 14 posisi | §1.2 dan Lampiran B | Disetujui | Codex, scan visual | 2026-09-15 | Istilah jumlah dan posisi 14 makna cocok. |
| 6 | M2 | `wazan-tiga-huruf` | Menimbang kata dengan فَعَلَ | §4 | Belum Diperiksa | — | — | — |
| 7 | M2 | `huruf-asli-tambahan` | Huruf asli dan huruf tambahan | §4 dan §8.8 | Belum Diperiksa | — | — | — |
| 8 | M3 | `illat-dan-tadhif` | Huruf yang mudah berubah | §3 | Belum Diperiksa | — | — | — |
| 9 | M3 | `bina-dasar` | Peta struktur kata | §5.1–5.5 | Belum Diperiksa | — | — | — |
| 10 | M3 | `bina-lanjutan` | Dua huruf ‘illat, hamzah, dan salim | §5.6–5.9 | Belum Diperiksa | — | — | — |
| 11 | M4 | `ushul-fiil-mashdar` | Waktu dan makna dasar | §6.1–6.2 | Belum Diperiksa | — | — | — |
| 12 | M4 | `ushul-pelaku-objek` | Pelaku dan yang dikenai | §6.2 dan §7.4–7.5 | Belum Diperiksa | — | — | — |
| 13 | M4 | `ushul-perintah-tempat` | Perintah, larangan, waktu, tempat, dan alat | §6.1–6.2 dan §7.6–7.9 | Belum Diperiksa | — | — | Periksa konteks zaman dan makan |
| 14 | M4 | `ushul-majhul` | Aktif dan pasif | §6.1–6.2 dan §7.10–7.11 | Belum Diperiksa | — | — | — |
| 15 | M5 | `lughawi-madhi` | Pelaku pada fi’il madhi | §1.4 dan §7.1 | Belum Diperiksa | — | — | — |
| 16 | M5 | `lughawi-mudhari` | Awalan dan akhiran mudhari’ | §1.5 dan §7.2 | Belum Diperiksa | — | — | Periksa bentuk yang sama dengan konteks berbeda |
| 17 | M5 | `lughawi-enam-tiga` | Mengapa ada enam dan tiga bentuk? | §7.3–7.9 | Belum Diperiksa | — | — | — |
| 18 | M6 | `dhamir-objek` | Dhamir sebagai objek | §1.3 dan §1.8 | Belum Diperiksa | — | — | — |
| 19 | M6 | `dhamir-idhafah` | Dhamir sebagai pemilik | §1.9 | Belum Diperiksa | — | — | — |
| 20 | M6 | `dhamir-huruf-jar` | Dhamir setelah huruf jar | §1.10 | Belum Diperiksa | — | — | — |
| 21 | M7 | `bab-satu-tiga` | Tiga bab pertama: a sebagai awal | §8.1–8.3 dan Lampiran | Belum Diperiksa | — | — | Mnemonic bukan kaidah penentuan bab |
| 22 | M7 | `bab-empat-enam` | Tiga bab berikutnya: i dan u | §8.4–8.6 dan Lampiran | Belum Diperiksa | — | — | Mnemonic bukan kaidah penentuan bab |
| 23 | M8 | `kaidah-amr-nahyi` | Dari mudhari’ menuju perintah | §8.7 | Belum Diperiksa | — | — | Periksa hamzah washal dan jazm |
| 24 | M8 | `batas-materi` | Apa yang sudah dan belum tersedia | §7.12 dan §8.8 | Belum Diperiksa | — | — | Mazid hanya pengantar |

## Ringkasan audit

| Status | Jumlah awal |
|---|---:|
| Belum Diperiksa | 19 |
| Sedang Diperiksa | 0 |
| Perlu Diperbaiki | 0 |
| Disetujui | 5 |

Perbarui jumlah ini setelah setiap sesi audit.
