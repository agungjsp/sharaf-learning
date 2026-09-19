---
version: 1
slug: "src-app-svelte"
primary_target: "src/App.svelte"
related_targets: ["src/app.css"]
---

Scope: seluruh aplikasi Sharaf. Mode utama Operate untuk navigasi dan latihan; Read untuk materi dan referensi.

Audience: satu pembelajar dewasa di HP dan laptop. Job: selalu memahami posisi, tindakan berikutnya, dan jalur kembali tanpa kehilangan draft. Constraints: progres v2, ID, hash URL lama, materi, dan penilaian tetap kompatibel.

THESIS: Ruang belajar yang tenang dan tegas, dibangun di sekitar satu aktivitas berikutnya. Menolak dashboard berisi banyak ajakan yang sama kuat dan daftar materi tanpa orientasi.

OWN-WORLD: Zinc sangat muda dan putih, teks zinc gelap, satu hijau gelap untuk aksi, garis tipis, radius 8/12, Inter untuk UI, Noto Naskh Arabic untuk Arab. Komponen memakai token shadcn dan Tailwind; dekorasi tidak bersaing dengan materi.

STORY: Pengguna tiba, melanjutkan satu aktivitas, bergerak melalui Materi → Latihan → Cek, membuka referensi tanpa kehilangan konteks, lalu kembali atau menuju rekomendasi berikutnya.

FIRST VIEWPORT: Desktop memakai sidebar 240 px dan satu kolom konten terarah; HP memakai header ringkas dan lima tujuan di navigasi bawah. Beranda membuka dengan satu panel aktivitas utama, lalu pengulangan dan progres.

FORM: Aplikasi belajar minimal modern yang dipilih pengguna; code-led. Seed key: user-pinned-minimal-modern. Signature interaction: indikator tiga fase dan referensi kontekstual dalam panel samping/Sheet.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
