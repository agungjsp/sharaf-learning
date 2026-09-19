import type { Fact, Lesson } from "./types.ts";
import { sectionByPrefix, sourceSections, sourceTable, stableId } from "./source.ts";
export type Application = { id: string; cue: string; answer: string; options: string[]; why: string; headers: string[]; cells: string[] };
export const applications: Record<string, Application[]> = {};
function pairs(id: string, entries: [string, string][], why: string) {
  const options = [...new Set(entries.map(([, answer]) => answer))];
  applications[id] = entries.map(([cue, answer]) => ({ id: stableId(cue), cue, answer, options, why, headers: ["Konteks", "Bentuk / fungsi"], cells: [cue, "…"] }));
}
function tableApplications(id: string, prefix: string, answerColumn: number, cueColumns: number[], rows?: number[]) {
  const table = sourceTable(prefix), selected = rows ? rows.map(i => table.rows[i]) : table.rows;
  const options = [...new Set(table.rows.map(row => row[answerColumn]))];
  applications[id] = selected.map(row => {
    const cue = cueColumns.map(i => `${table.headers[i]}: ${row[i]}`).join(" · ");
    return { id: stableId(cue), cue, answer: row[answerColumn], options,
      why: `Pada ${table.section.title}, ${cue} berpasangan dengan ${row[answerColumn]}.`,
      headers: [...cueColumns.map(i => table.headers[i]), table.headers[answerColumn]], cells: [...cueColumns.map(i => row[i]), "…"] };
  });
}
const references: Record<string, string[]> = {
  harakat: ["2. الح"], "tanda-lanjutan": ["2. الح", "4. المُ"],
  "dhamir-sudut-pandang": ["1.1 ", "1.2 "], "dhamir-jumlah": ["1.2 "], "dhamir-peta": ["1.2 ", "Lampiran B"],
  "wazan-tiga-huruf": ["4. المُ", "Fi’il Ruba’i"], "huruf-asli-tambahan": ["Huruf tambahan", "8.8 "],
  "illat-dan-tadhif": ["3.1 ", "3.2 "], "bina-dasar": ["5.1 ", "5.2 ", "5.3 ", "5.4 ", "5.5 "],
  "bina-lanjutan": ["5.6 ", "5.7 ", "5.8 ", "5.9 "],
  "ushul-fiil-mashdar": ["6.1 ", "6.2 "], "ushul-pelaku-objek": ["7.4 ", "7.5 "],
  "ushul-perintah-tempat": ["6.1 ", "7.6 ", "7.7 ", "7.8 ", "7.9 "], "ushul-majhul": ["7.10 ", "7.11 "],
  "lughawi-madhi": ["1.4 ", "7.1 "], "lughawi-mudhari": ["1.5 ", "7.2 "], "lughawi-enam-tiga": ["7.3 ", "7.4 ", "7.5 ", "7.6 ", "7.7 ", "7.8 ", "7.9 "],
  "dhamir-objek": ["1.3 ", "1.8 "], "dhamir-idhafah": ["1.9 "], "dhamir-huruf-jar": ["1.10 "],
  "bab-satu-tiga": ["Ringkasan Enam", "8.1 الب", "8.2 الب", "8.3 الب"], "bab-empat-enam": ["Ringkasan Enam", "8.4 الب", "8.5 الب", "8.6 الب"],
  "kaidah-amr-nahyi": ["8.7.1 ", "8.7.2 "], "batas-materi": ["7.12 ", "8.8 "]
};
references["wazan-tiga-huruf"][1] = "Fi'il Ruba'i";

export function enrichCurriculum(lessons: Lesson[]) {
  for (const lesson of lessons) {
    lesson.sourceIds = references[lesson.id].map(prefix => sectionByPrefix(prefix).id);
    lesson.revision += 1;
  }
  pairs("harakat", [["Bunyi ba", "بَ"], ["Bunyi bi", "بِ"], ["Bunyi bu", "بُ"], ["Ba tanpa vokal pendek", "بْ"]], "Perhatikan posisi dan bentuk harakat pada huruf ba.");
  pairs("tanda-lanjutan", [["Ba dengan tanwin un", "بٌ"], ["Ba dengan tanwin an", "بً"], ["Ba dengan tanwin in", "بٍ"], ["Nama tanda pemanjangan dalam sumber", "مَدَّةٌ"]], "Bedakan tiga tanwin dan nama tanda maddah sesuai daftar sumber.");
  tableApplications("dhamir-sudut-pandang", "1.2 ", 1, [3], [0,3,6,9,12]);
  tableApplications("dhamir-jumlah", "1.2 ", 1, [3], [1,2,4,5,7,13]);
  tableApplications("dhamir-peta", "1.2 ", 1, [3]);
  tableApplications("wazan-tiga-huruf", "4. المُ", 2, [0,1]);
  pairs("huruf-asli-tambahan", [["دَحْرَجَ: jumlah huruf asli", "Empat"], ["فَعَلَ: jumlah posisi akar", "Tiga"], ["Tiga huruf asli tanpa tambahan pada bentuk asal", "Tsulatsi mujarrad"], ["Tiga huruf asli dengan tambahan", "Tsulatsi mazid fih"]], "Hitung huruf asli; huruf tambahan tidak dihitung sebagai akar baru.");
  pairs("illat-dan-tadhif", [["Gabungkan dua ra pada فَرَرَ", "فَرَّ"], ["Gabungkan dua dal pada عَدَدَ", "عَدَّ"], ["Huruf yang diperiksa sebagai huruf ‘illat", "ي و ا"], ["Nama proses memasukkan huruf sejenis", "الإِدْغَامُ"]], "Tadh’if menggabungkan huruf sejenis; berbeda dari kelompok huruf ‘illat.");
  pairs("bina-dasar", [["Huruf ‘illat berada di awal akar", "Mitsal"], ["Huruf ‘illat berada di tengah akar", "Ajwaf"], ["Huruf ‘illat berada di akhir akar", "Naqish"], ["‘Ain dan lam fi’il sejenis", "Mudha’af"]], "Periksa posisi huruf asli, bukan sekadar panjang kata.");
  pairs("bina-lanjutan", [["Akar mengandung hamzah", "Mahmuz"], ["Selamat dari ‘illat, hamzah, dan tadh’if", "Salim"], ["Dua huruf ‘illat berdampingan menurut istilah sumber", "Lafif"], ["Dua huruf ‘illat terpisah menurut istilah sumber", "Multawi"]], "Gunakan istilah abniyah sebagaimana dibedakan di sumber; jangan menyamakan shahih dengan salim.");
  tableApplications("ushul-fiil-mashdar", "6.1 ", 2, [3], [0,1,2,10,11]);
  pairs("ushul-pelaku-objek", [["Yang memukul", "ضَارِبٌ"], ["Yang dipukul", "مَضْرُوبٌ"], ["Pola orang yang melakukan pekerjaan", "فَاعِلٌ"], ["Pola pihak yang dikenai pekerjaan", "مَفْعُولٌ"]], "Isim fa’il menunjuk pelaku; isim maf’ul menunjuk pihak yang dikenai pekerjaan.");
  tableApplications("ushul-perintah-tempat", "6.1 ", 2, [3], [5,6,7,8,9]);
  pairs("ushul-majhul", [["Telah memukul", "ضَرَبَ"], ["Telah dipukul", "ضُرِبَ"], ["Sedang/akan memukul", "يَضْرِبُ"], ["Sedang/akan dipukul", "يُضْرَبُ"]], "Bandingkan harakat aktif dan pasif; majhul tidak menyebut pelaku.");
  tableApplications("lughawi-madhi", "7.1 ", 1, [2,3]);
  tableApplications("lughawi-mudhari", "7.2 ", 1, [2,3]);
  tableApplications("lughawi-enam-tiga", "6.1 ", 4, [1], [2,3,4,5,6,7,8,9]);
  tableApplications("dhamir-objek", "1.8 ", 1, [3]);
  tableApplications("dhamir-idhafah", "1.9 ", 1, [2]);
  pairs("dhamir-huruf-jar", [["Dari dia laki-laki", "مِنْهُ"], ["Kepada dia laki-laki", "إِلَيْهِ"], ["Tentang dia laki-laki", "عَنْهُ"], ["Di dalamnya (rujukan mudzakkar)", "فِيهِ"]], "Baca makna huruf jar terlebih dahulu, lalu dhamir yang melekat.");
  tableApplications("bab-satu-tiga", "Ringkasan Enam", 0, [3], [0,1,2]);
  tableApplications("bab-empat-enam", "Ringkasan Enam", 0, [3], [3,4,5]);
  pairs("kaidah-amr-nahyi", [["Amr dari تَفْعِلُ", "اِفْعِلْ"], ["Amr dari تَفْعُلُ", "اُفْعُلْ"], ["Amr dari تَفْعَلُ", "اِفْعَلْ"], ["Nahyi dari تَفْعَلُ", "لَا تَفْعَلْ"]], "Amr membuang ta mudhara’ah; nahyi mempertahankannya dan memakai la nahiyah. Akhirnya dijazmkan.");
  pairs("batas-materi", [["Mencari rincian bab mazid pada akhir dokumen", "Belum tersedia; hanya pengantar"], ["Menentukan mashdar setiap kata hanya dari satu rumus", "Perlu mengikuti pemakaian yang diriwayatkan"], ["Menentukan bab hanya dari madhi", "Perlu pasangan madhi dan mudhari’"], ["Memaksakan isim alat untuk setiap fi’il", "Perlu memperhatikan makna dan pemakaian"]], "Batas sumber dan pemakaian bahasa membatasi penerapan pola.");

  const tables: [string, string, number, number, number][] = [
    ["peta-dhamir", "1.2 ", 1, 1, 3], ["nashab-terpisah", "1.3 ", 6, 1, 3],
    ["madhi-lengkap", "7.1 ", 5, 1, 4], ["mudhari-lengkap", "7.2 ", 5, 1, 4],
    ["mashdar-jumlah", "7.3 ", 5, 1, 3], ["fail-jumlah", "7.4 ", 5, 1, 3], ["maful-jumlah", "7.5 ", 5, 1, 3],
    ["amr-lengkap", "7.6 ", 5, 1, 4], ["nahyi-lengkap", "7.7 ", 5, 1, 4],
    ["zaman-jumlah", "A. Isim Zaman", 5, 1, 3], ["makan-jumlah", "B. Isim Makan", 5, 1, 3], ["alat-jumlah", "7.9 ", 5, 1, 3],
    ["madhi-majhul-lengkap", "7.10 ", 5, 1, 4], ["mudhari-majhul-lengkap", "7.11 ", 5, 1, 4],
    ["objek-lengkap", "1.8 ", 6, 1, 3], ["pemilik-lengkap", "1.9 ", 6, 1, 2],
    ["ushul-lengkap", "6.1 ", 4, 2, 3],
    ["contoh-bab-dua", "8.2.3 ", 7, 1, 0], ["contoh-bab-empat", "8.4.2 ", 7, 1, 0], ["contoh-bab-enam", "8.6.2 ", 7, 0, 1]
  ];
  for (const [id, prefix, module, termCol, meaningCol] of tables) {
    const table = sourceTable(prefix);
    const groups = table.rows.length === 14 ? [[0,6], [6,12], [12,14]] : Array.from({length: Math.ceil(table.rows.length / 6)}, (_, i) => [i*6, Math.min(i*6+6,table.rows.length)]);
    // Keep a final pair of speaker positions with its preceding group.
    if (groups.at(-1)![1] - groups.at(-1)![0] < 3 && groups.length > 1) { groups[groups.length-2][1] = groups.at(-1)![1]; groups.pop(); }
    for (const [groupIndex, [start, end]] of groups.entries()) {
      const lessonId = `${id}-${groupIndex + 1}`, rows = table.rows.slice(start, end);
      const facts: Fact[] = rows.map((row,i) => ({ id: `row-${start+i+1}`, term: row[termCol], meaning: row[meaningCol],
        why: `${table.headers[meaningCol]}: ${row[meaningCol]}; ${table.headers[termCol]}: ${row[termCol]}.` }));
      lessons.push({ id: lessonId, revision: 1, module, title: `${table.section.title.replace(/^[\d.]+\s*/, "").split(" — ").at(-1)} · bagian ${groupIndex+1}`,
        goal: `Melengkapi ${table.headers[termCol].toLowerCase()} untuk ${table.headers[meaningCol].toLowerCase()} pada baris ${start+1}–${end}.`,
        intro: `Pelajari baris ${start+1}–${end} dari ${table.section.title}. Baca konteks setiap baris; bentuk yang sama dapat menempati posisi makna berbeda.`,
        analogy: "Baca konteks di satu sisi, tutup bentuk pasangannya, lalu coba pilih dari ingatan. Buka tabel sumber untuk melihat rangkaian lengkap.",
        contrast: "Jangan menentukan makna hanya dari satu potongan bentuk. Gunakan jenis, jumlah, fungsi, dan konteks yang diberikan.",
        summary: ["Baca konteks sebelum memilih bentuk.", "Bentuk yang sama dapat mengisi posisi berbeda.", "Latihan ini mengikuti contoh sumber, bukan rumus untuk semua kata."],
        source: table.section.title, sourceIds: [table.section.id], verification: "Dicocokkan dengan transkripsi; belum diverifikasi ulang terhadap scan.", facts, prerequisite: null });
      tableApplications(lessonId, prefix, termCol, [meaningCol], Array.from({length:end-start}, (_,i)=>start+i));
    }
  }
  const babExamples = [
    ['ضَرَبَ يَضْرِبُ', 'فَعَلَ يَفْعِلُ', 'اِفْعِلْ', 'لَا تَفْعِلْ', 'a-i', '8.1 الب'],
    ['نَصَرَ يَنْصُرُ', 'فَعَلَ يَفْعُلُ', 'اُفْعُلْ', 'لَا تَفْعُلْ', 'a-u', '8.2 الب'],
    ['فَتَحَ يَفْتَحُ', 'فَعَلَ يَفْعَلُ', 'اِفْعَلْ', 'لَا تَفْعَلْ', 'a-a', '8.3 الب'],
    ['سَمِعَ يَسْمَعُ', 'فَعِلَ يَفْعَلُ', 'اِفْعَلْ', 'لَا تَفْعَلْ', 'i-a', '8.4 الب'],
    ['حَسِبَ يَحْسِبُ', 'فَعِلَ يَفْعِلُ', 'اِفْعِلْ', 'لَا تَفْعِلْ', 'i-i', '8.5 الب'],
    ['كَرُمَ يَكْرُمُ', 'فَعُلَ يَفْعُلُ', 'اُفْعُلْ', 'لَا تَفْعُلْ', 'u-u', '8.6 الب'],
  ];
  babExamples.forEach(([example,wazan,amr,nahyi,vowels,prefix],i) => {
    const id = `penerapan-bab-${i+1}`, section=sectionByPrefix(prefix);
    const entries: [string,string][] = [['Pasangan wazan',wazan],['Contoh utama',example],['Pola amr mukhatab tunggal',amr],['Pola nahyi mukhatab tunggal',nahyi]];
    const caution = i===5 ? 'Bab enam umumnya lazim; sifat dapat memakai pola فَعِيلٌ atau pola lain sesuai pemakaian. Jangan memaksakan maf’ul atau alat.' : 'Mashdar dan turunan lain mengikuti pemakaian sumber; pasangan madhi–mudhari’ harus diketahui lebih dahulu.';
    lessons.push({id,revision:1,module:7,title:`Menerapkan bab ${i+1} · ${vowels}`,goal:`Menghubungkan contoh bab ${i+1}, pasangan wazan, dan pola amr/nahyi.`,
      intro:`Baca pasangan ${example}. Perhatikan bunyi ‘ain pada madhi dan mudhari’: ${vowels}. ${caution}`,
      analogy:'Bandingkan pasangan lengkap sebelum memilih pola perintah atau larangan. Kaidah amr/nahyi di sini diterapkan pada wazan dasar, bukan pada setiap akar secara otomatis.',
      contrast:`Pola amr ${amr} berbeda dari nahyi ${nahyi}. ${caution}`,
      summary:[`Pasangan bab ${i+1}: ${wazan}.`,`Contoh sumber: ${example}.`,caution],source:`${section.title}; §8.7`,sourceIds:[section.id,sectionByPrefix('8.7.1 ').id,sectionByPrefix('8.7.2 ').id],verification:'Dicocokkan dengan transkripsi; penerapan pola dasar mengikuti §8.7. Belum diverifikasi ulang terhadap scan.',
      facts:entries.map(([meaning,term],n)=>({id:`pattern-${n+1}`,term,meaning,why:`Pada bab ${i+1}, ${meaning.toLowerCase()} adalah ${term}. ${caution}`})),prerequisite:null});
    const mukhatab = ['تَفْعِلُ','تَفْعُلُ','تَفْعَلُ','تَفْعَلُ','تَفْعِلُ','تَفْعُلُ'][i];
    pairs(id,[[`Timbang contoh ${example}: pasangan wazan`,wazan],[`Contoh sumber yang mengikuti ${wazan}`,example],[`Ubah ${mukhatab} menjadi pola perintah`,amr],[`Ubah ${mukhatab} menjadi pola larangan`,nahyi]],`Bab ${i+1} mengikuti pasangan ${wazan}; kaidah amr/nahyi mengikuti §8.7. ${caution}`);
  });
  const order = [0,1,2,3,4,7,5,6,8];
  lessons.sort((a,b) => order.indexOf(a.module)-order.indexOf(b.module));
  lessons.forEach((lesson,i) => lesson.prerequisite = lessons[i-1]?.id ?? null);
}
export function coverage(lessons: Lesson[]) {
  return sourceSections.map(section => {
    const direct = lessons.filter(l => l.sourceIds.includes(section.id));
    return { section, lessons: direct, status: direct.length ? "Materi dan latihan" : "Referensi", reason: direct.length ? "Contoh dan cek terhubung ke bagian ini." : "Teks sumber utuh tersedia sebagai penjelasan, rincian, atau batas materi; tidak menjadi kunci tambahan tanpa kurasi." };
  });
}
