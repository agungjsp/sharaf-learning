import { writeFileSync } from 'node:fs';
import { lessons, allQuestions } from '../src/content.ts';
import { coverage } from '../src/curriculum.ts';
const clean=(value:string)=>value.replaceAll('|','/').replaceAll('\n',' ');
const lines=[
 '# Cakupan kurikulum Sharaf', '',
 'Dihasilkan oleh `npm run coverage`. Acuan tunggal: `docs/sumber.md`.', '',
 `Tersedia ${lessons.length} pelajaran. Setiap cek terdiri dari lima soal, sedikitnya dua penerapan. Latihan mencakup seluruh fakta kelompok, ditambah remediasi jika diperlukan.`, '',
 '## Pelajaran, tujuan, sumber, dan verifikasi', '',
 '| ID | Tujuan | Bagian sumber | Contoh | Latihan dasar | Bank cek | Verifikasi |',
 '|---|---|---|---:|---:|---:|---|',
 ...lessons.map(l=>`| ${l.id} | ${clean(l.goal)} | ${l.sourceIds.join(', ')} | ${l.facts.length} | ${allQuestions(l).filter(q=>q.purpose==='practice'&&!q.id.includes(':remediate:')).length} | ${allQuestions(l).filter(q=>q.purpose==='check').length} | ${clean(l.verification)} |`),
 '', '## Seluruh bagian sumber', '',
 'ID bagian juga dapat dibuka di aplikasi melalui `#reference?section=ID`. Baris mengacu pada Markdown sumber. Bagian referensi tetap tersedia utuh dan tidak secara otomatis menghasilkan soal.', '',
 '| ID | Bagian sumber | Baris | Peran | Pelajaran | Alasan |',
 '|---|---|---:|---|---|---|',
 ...coverage(lessons).map(({section,lessons:linked,status,reason})=>`| ${section.id} | ${clean(section.title)} | ${section.line} | ${status} | ${linked.map(l=>l.id).join(', ')||'—'} | ${reason} |`),
 '', '## Batas verifikasi', '',
 '- Catatan verifikasi scan terdahulu M0–M1 tetap disimpan di `docs/reviews/M2-CONTENT-REVIEW.md`. Soal baru bukan hasil pemeriksaan ulang PDF.',
 '- Semua penambahan dicocokkan dengan transkripsi. Mazid hanya pengantar; rincian 22 bab tidak diklaim tersedia.',
 '- Bentuk yang sama pada dua posisi dhamir dipertahankan. Soal kontekstual memakai arti/jenis posisi; soal invers yang ambigu tidak digunakan.',
 '- Mashdar dan sifat memakai contoh sumber. Pola amr/nahyi bab 1–6 menerapkan wazan dasar pada kaidah §8.7, bukan mesin tashrif untuk akar sembarang.',
 '- Rangkaian 14 bentuk yang sebelumnya berupa teks disajikan sebagai tabel sejajar dengan 14 posisi §1.2. Bentuknya tidak dihasilkan ulang.',
 ''
];
writeFileSync(new URL('../docs/CURRICULUM-COVERAGE.md',import.meta.url),lines.join('\n'));
