import type { Fact, Lesson, Question } from './types.ts';
import { stableId } from './source.ts';
import { applications, enrichCurriculum } from './curriculum.ts';
import { conceptIds } from './concept-ids.ts';
export const modules = [
  ['Bekal membaca pola', 'Perhatikan tanda, temukan perbedaannya.'],
  ['Mengenal dhamir', 'Siapa, berapa orang, dan kepada siapa?'],
  ['Akar dan wazan', 'Kenali huruf asal di balik sebuah pola.'],
  ['Struktur kata', 'Pahami keluarga bentuk dan cirinya.'],
  ['Tashrif ushul', 'Satu akar, berbagai fungsi.'],
  ['Tashrif lughawi', 'Bentuk berubah bersama maknanya.'],
  ['Dhamir bersambung', 'Kenali pelaku, objek, dan kepemilikan.'],
  ['Enam bab', 'Bandingkan pasangan madhi dan mudhari’.'],
  ['Penguatan', 'Hubungkan yang dipahami, ulangi yang terlupa.'],
];
// Examples stay separate from the question bank; forms come from the source.
export function fact(term: string, meaning: string, why: string): Fact {
  return { id: `f-${stableId(term)}`, term, meaning, why };
}
export const lessons: Lesson[] = [];
export function add(id: string, module: number, title: string, goal: string, source: string, intro: string, analogy: string, contrast: string, facts: Fact[], summary: string[], verification = 'Dicocokkan dengan transkripsi; belum diverifikasi terhadap scan asli.', revision = 1) {
  lessons.push({ id, module, title, goal, source, intro, analogy, contrast, facts, summary,
    sourceIds: [], prerequisite: lessons.at(-1)?.id ?? null, revision, verification });
}
const f = fact;
add('harakat', 0, 'Tanda kecil, bunyi berbeda', 'Membedakan lima tanda dasar pada huruf Arab.', '§2 — Harakat',
  'Huruf yang sama dapat dibaca berbeda karena tanda kecil di sekitarnya. Dalam sharaf, perubahan tanda ini dapat mengubah pola. Mulailah dengan melihat satu huruf dan tandanya sebagai satu kesatuan.',
  'Bayangkan huruf sebagai bahan dan harakat sebagai petunjuk membacanya. Ini alat bantu membayangkan, bukan definisi tata bahasa.',
  'بَ dibaca ba, بِ dibaca bi, dan بُ dibaca bu. Hurufnya tetap ba; yang berubah adalah harakatnya.', [
  f('بَ', 'Fathah: bunyi a', 'Garis di atas ba adalah fathah.'),
  f('بِ', 'Kasrah: bunyi i', 'Garis di bawah ba adalah kasrah.'),
  f('بُ', 'Dhammah: bunyi u', 'Tanda kecil menyerupai wawu di atas ba adalah dhammah.'),
  f('بْ', 'Sukun: tanpa vokal pendek', 'Sukun menunjukkan konsonan tanpa vokal pendek sesudahnya.'),
  f('بّ', 'Syaddah: penggandaan konsonan', 'Syaddah menandai penggandaan konsonan; harakat lain menentukan vokalnya.'),
], ['Lihat huruf dan harakat bersama-sama.', 'Fathah a, kasrah i, dhammah u.', 'Sukun dan syaddah memiliki fungsi berbeda.'], 'Diverifikasi visual terhadap Sharaf Part 1.pdf, halaman PDF 16.', 1);
add('tanda-lanjutan', 0, 'Tanwin, maddah, dan pola', 'Mengenali tanda lanjutan dan posisi yang dibandingkan.', '§2; §4 — Harakat dan Muqabalah',
 'Naskah mencantumkan sembilan tanda, termasuk tiga tanwin dan maddah. Ketika membandingkan pola, sebutkan tepat bagian mana yang berbeda; jangan hanya berkata “kelihatannya sama”.',
 'Untuk perbandingan, tutup bagian yang sama lalu amati bagian yang berubah. Tetap baca kata lengkap setelahnya.',
 'فَعَلَ dan فَعِلَ berbeda pada harakat huruf tengah. Jangan tertukar antara nama posisi ‘ain fi’il dan huruf ع yang benar-benar muncul dalam kata lain.', [
 f('بٌ', 'Tanwin dhammah', 'Tanwin dhammah ditulis ٌ dan lazim dibaca un saat disambung.'),
 f('بً', 'Tanwin fathah', 'Contoh ini mengisolasi tanda tanwin fathah; bukan kata utuh.'),
 f('بٍ', 'Tanwin kasrah', 'Tanwin kasrah ditulis ٍ.'),
 f('مَدَّةٌ', 'Maddah: tanda pemanjangan', 'Scan menuliskan مَدَّةٌ sebagai tanda kesembilan.'),
 f('ع pada فَعَلَ', 'Posisi ‘ain fi’il', '‘Ain fi’il adalah nama posisi kedua pada wazan tiga huruf.'),
], ['Tanwin memiliki tiga macam.', 'Maddah adalah tanda pemanjangan.', 'Sebutkan posisi dan tanda ketika membandingkan pola.'], 'Diverifikasi visual terhadap Sharaf Part 1.pdf, halaman PDF 16–18.', 2);
add('dhamir-sudut-pandang', 1, 'Dia, kamu, dan saya', 'Membedakan orang yang dibicarakan, diajak bicara, dan berbicara.', '§1.1–1.2 — Dhamir',
 'Dhamir adalah kata ganti. Mulai dari percakapan sederhana: saya berbicara kepada kamu tentang dia. Setelah sudut pandangnya jelas, barulah tambahkan jumlah dan jenisnya.',
 'Bayangkan tiga posisi dalam percakapan: yang berbicara, yang diajak bicara, dan yang dibicarakan. Ini membantu mengelompokkan, bukan menentukan lokasi fisik setiap orang.',
 'هُوَ berarti dia laki-laki, sedangkan أَنْتَ berarti kamu laki-laki. Jenis dan jumlahnya sama, tetapi sudut pandangnya berbeda.', [
 f('هُوَ', 'Dia seorang laki-laki', 'هُوَ adalah mufrad mudzakkar ghaib.'),
 f('هِيَ', 'Dia seorang perempuan', 'هِيَ adalah mufrad muannats ghaibah.'),
 f('أَنْتَ', 'Kamu seorang laki-laki', 'Fathah pada ta membedakan أَنْتَ dari أَنْتِ.'),
 f('أَنْتِ', 'Kamu seorang perempuan', 'Kasrah pada ta menunjukkan mukhatabah tunggal.'),
 f('أَنَا', 'Saya, laki-laki atau perempuan', 'أَنَا dipakai pembicara tunggal, tanpa dibedakan gender.'),
], ['Dia: هُوَ atau هِيَ.', 'Kamu: أَنْتَ atau أَنْتِ.', 'Saya: أَنَا.'], 'Diverifikasi visual terhadap Sharaf Part 1.pdf, halaman PDF 1–2.', 1);
add('dhamir-jumlah', 1, 'Satu, dua, dan banyak', 'Menghubungkan jumlah dan kelompok dengan dhamir.', '§1.2; Lampiran B',
 'Sesudah mengetahui siapa yang dimaksud, tanyakan jumlahnya. Mufrad berarti satu, mutsanna dua, dan jama’ banyak. Beberapa bentuk digunakan untuk lebih dari satu posisi makna.',
 'Kelompokkan dahulu: satu → dua → banyak. Urutan membantu mengingat; tidak semua kelompok memiliki bentuk berbeda untuk tiap gender.',
 'هُمَا dipakai untuk dua laki-laki maupun dua perempuan yang dibicarakan. Karena itu soal perlu menyebutkan konteks, bukan memaksa satu gender dari هُمَا saja.', [
 f('هُمَا', 'Mereka berdua', 'Bentuk هُمَا sama untuk kelompok dua laki-laki dan dua perempuan.'),
 f('هُمْ', 'Mereka banyak laki-laki', 'هُمْ menempati posisi jama’ mudzakkar ghaib.'),
 f('هُنَّ', 'Mereka banyak perempuan', 'هُنَّ menempati posisi jama’ muannats ghaibah.'),
 f('أَنْتُمَا', 'Kalian berdua', 'أَنْتُمَا sama untuk dua mukhatab laki-laki maupun perempuan.'),
 f('نَحْنُ', 'Kami atau kita', 'نَحْنُ adalah mutakallim bersama pihak lain.'),
], ['Mufrad satu, mutsanna dua, jama’ banyak.', 'هُمَا dan أَنْتُمَا memiliki posisi makna berulang.', 'نَحْنُ berarti kami/kita.'], 'Diverifikasi visual terhadap Sharaf Part 1.pdf, halaman PDF 1–2.', 1);
add('dhamir-peta', 1, 'Melengkapi peta 14 posisi', 'Mengingat istilah dan kelompok dhamir tanpa mencampur bentuk dan posisi.', '§1.2; Lampiran B',
 'Peta naskah terdiri dari 14 posisi makna. Dua bentuk tertulis, هُمَا dan أَنْتُمَا, masing-masing muncul pada dua posisi. Menghafal urutan berguna, tetapi makna tiap posisi tetap harus dipahami.',
 'Susun peta sebagai kelompok dia, lalu kamu, lalu pembicara. Ucapkan artinya bersama bentuknya.',
 'أَنْتُمْ dan أَنْتُنَّ sama-sama “kalian”, tetapi kelompoknya berbeda. Adapun 14 posisi makna bukan berarti 14 ejaan yang semuanya unik.', [
 f('أَنْتُمْ', 'Kalian banyak laki-laki', 'أَنْتُمْ adalah jama’ mudzakkar mukhatab.'),
 f('أَنْتُنَّ', 'Kalian banyak perempuan', 'أَنْتُنَّ adalah jama’ muannats mukhatabah.'),
 f('مُفْرَدٌ', 'Satu atau seorang', 'Mufrad menunjuk jumlah satu.'),
 f('مُثَنَّى', 'Dua atau berdua', 'Mutsanna menunjuk jumlah dua.'),
 f('جَمْعٌ', 'Banyak atau jama’', 'Dalam peta dasar ini jama’ dibedakan dari satu dan dua.'),
], ['Hafalkan bentuk bersama artinya.', '14 adalah jumlah posisi makna dalam sumber.', 'Buka tabel referensi untuk melihat peta utuh.'], 'Diverifikasi visual terhadap Sharaf Part 1.pdf, halaman PDF 1–2.', 1);

add('wazan-tiga-huruf', 2, 'Menimbang kata dengan فَعَلَ', 'Menentukan fa’, ‘ain, dan lam fi’il pada kata tiga huruf.', '§4 — Muqabalah',
 'Wazan adalah pola pembanding. Untuk kata tiga huruf, sejajarkan huruf pertama dengan ف, huruf kedua dengan ع, dan huruf ketiga dengan ل. Nama posisi ini tetap dipakai walaupun huruf kata aslinya bukan ف ع ل.',
 'Seperti tiga kotak bernama fa’, ‘ain, dan lam. Masukkan huruf kata dari kanan sesuai urutannya; kotak membantu melihat posisi, bukan arti katanya.',
 'Pada مَنَعَ, م adalah fa’ fi’il, ن adalah ‘ain fi’il, dan ع adalah lam fi’il. Huruf ع di akhir tetap disebut lam fi’il karena yang dimaksud adalah posisinya.', [
 f('فَاءُ الفِعْلِ', 'Posisi huruf asli pertama', 'Fa’ fi’il adalah nama posisi pertama pada wazan.'),
 f('عَيْنُ الفِعْلِ', 'Posisi huruf asli kedua', '‘Ain fi’il adalah nama posisi kedua pada wazan.'),
 f('لَامُ الفِعْلِ', 'Posisi huruf asli ketiga', 'Lam fi’il adalah nama posisi ketiga pada wazan.'),
 f('مَنَعَ ↔ فَعَلَ', 'م pertama, ن kedua, ع ketiga', 'Ketiga huruf asli disejajarkan menurut urutannya.'),
 f('فَعْلَلَ', 'Wazan dasar untuk fi’il empat huruf', 'Sumber memakai فَعْلَلَ untuk empat huruf asli.'),
], ['Wazan adalah pola; mauzun adalah kata yang ditimbang.', 'Fa’, ‘ain, dan lam adalah nama posisi.', 'Empat huruf asli memakai pola فَعْلَلَ.']);

add('huruf-asli-tambahan', 2, 'Huruf asli dan huruf tambahan', 'Mempertahankan tiga posisi akar ketika bentuk mendapat tambahan.', '§4; §8.8',
 'Sebuah bentuk dapat mempunyai huruf lebih banyak daripada akarnya. Huruf tambahan tidak mengganti identitas tiga huruf asli; ketiganya tetap dicocokkan dengan ف ع ل.',
 'Bayangkan akar sebagai tiga pasak. Bentuk baru boleh memasang bagian tambahan di sekelilingnya, tetapi ketiga pasak tetap dapat ditelusuri.',
 'Tsulatsi mujarrad memiliki tiga huruf asli tanpa tambahan pada bentuk asal. Tsulatsi mazid fih berasal dari tiga huruf asli yang mendapat tambahan.', [
 f('مُجَرَّدٌ', 'Tanpa huruf tambahan pada bentuk asal', 'Mujarrad berarti bentuk asalnya tidak diberi huruf tambahan.'),
 f('مَزِيدٌ فِيهِ', 'Mendapat satu atau lebih huruf tambahan', 'Mazid fih berarti ada huruf tambahan pada huruf asal.'),
 f('ثُلَاثِيٌّ', 'Memiliki tiga huruf asli', 'Tsulatsi menunjuk jumlah tiga huruf asli.'),
 f('رُبَاعِيٌّ', 'Memiliki empat huruf asli', 'Ruba’i menunjuk jumlah empat huruf asli.'),
 f('دَحْرَجَ', 'Contoh fi’il ruba’i', 'دَحْرَجَ disejajarkan dengan فَعْلَلَ.'),
], ['Hitung huruf asli, bukan sekadar seluruh huruf yang tampak.', 'Mujarrad tidak mendapat tambahan pada bentuk asal.', 'Mazid fih diperkenalkan, tetapi rinciannya belum tersedia.']);

add('illat-dan-tadhif', 3, 'Huruf yang mudah berubah', 'Membedakan huruf ‘illat dan tadh’if.', '§3 — Huruf ‘Illat dan Tadh’if',
 'Huruf ‘illat adalah ي و ا. Dalam tashrif, ketiganya sering menjadi sebab perubahan bentuk. Tadh’if terjadi ketika dua huruf sejenis digabung dan ditulis dengan tasydid.',
 'Huruf ‘illat seperti bagian lentur yang dapat berubah ketika pola berubah. Ini hanya gambaran; perubahan sebenarnya mengikuti kaidah sharaf.',
 'Huruf ‘illat adalah jenis huruf. Tadh’if adalah keadaan dua huruf sejenis yang digabung. Keduanya bukan istilah yang sama.', [
 f('ي و ا', 'Tiga huruf ‘illat', 'Sumber menyebut ya, wawu, dan alif.'),
 f('التَّضْعِيفُ', 'Dua huruf sejenis digabung', 'Tadh’if berkaitan dengan dua huruf sejenis.'),
 f('الإِدْغَامُ', 'Proses memasukkan huruf sejenis', 'Sumber menyebut proses ini idgham.'),
 f('فَرَرَ → فَرَّ', 'Contoh tadh’if pertama', 'Dua ra digabung menjadi ra bertasydid.'),
 f('عَدَدَ → عَدَّ', 'Contoh tadh’if kedua', 'Dua dal berurutan digabung menjadi dal bertasydid.'),
], ['Huruf ‘illat: ي و ا.', 'Tadh’if menggabungkan dua huruf sejenis.', 'Proses penggabungannya disebut idgham.']);

add('bina-dasar', 3, 'Peta struktur kata', 'Mengenali lima bina’ dasar dari posisi huruf ‘illat atau penggandaan.', '§5.1–5.5 — Abniyah',
 'Abniyah melihat susunan huruf asli. Shahih tidak mengandung huruf ‘illat. Mitsal, ajwaf, dan naqish dibedakan berdasarkan letak huruf ‘illat. Mudha’af mempunyai ‘ain dan lam fi’il sejenis.',
 'Periksa tiga tempat secara berurutan: awal, tengah, akhir. Letak huruf ‘illat memberi nama yang berbeda.',
 'Shahih berarti huruf aslinya bukan huruf ‘illat, tetapi istilah salim lebih ketat karena juga selamat dari tadh’if dan hamzah.', [
 f('صَحِيحٌ', 'Huruf asli bukan huruf ‘illat', 'Shahih menyoroti tidak adanya huruf ‘illat.'),
 f('مُضَاعَفٌ', '‘Ain dan lam fi’il sejenis', 'Dua huruf sejenis dapat diidghamkan.'),
 f('مِثَالٌ', 'Fa’ fi’il berupa huruf ‘illat', 'Pada mitsal, huruf ‘illat berada di awal akar.'),
 f('أَجْوَفُ', '‘Ain fi’il berupa huruf ‘illat', 'Pada ajwaf, huruf ‘illat berada di tengah akar.'),
 f('نَاقِصٌ', 'Lam fi’il berupa huruf ‘illat', 'Pada naqish, huruf ‘illat berada di akhir akar.'),
], ['Mitsal: awal.', 'Ajwaf: tengah.', 'Naqish: akhir.']);

add('bina-lanjutan', 3, 'Dua huruf ‘illat, hamzah, dan salim', 'Mengenali lafif, multawi, mahmuz, dan salim sesuai istilah sumber.', '§5.6–5.9 — Abniyah',
 'Sumber membedakan akar dengan dua huruf ‘illat, akar berhamzah, dan bentuk yang selamat dari ‘illat, tadh’if, serta hamzah. Beberapa istilah memiliki nama lain yang lebih umum.',
 'Gunakan pemeriksaan bertahap: ada huruf ‘illat? ada dua? ada hamzah? ada dua huruf sejenis? Jangan paksa semua nama menjadi kotak yang saling meniadakan.',
 'Lafif pada sumber dipakai untuk dua huruf ‘illat berdekatan. Multawi dipakai untuk huruf ‘illat yang terpisah pada fa’ dan lam; istilah umum masing-masing adalah lafif maqrun dan mafruq.', [
 f('لَفِيفٌ', 'Dua huruf ‘illat berdekatan', 'Sumber mengaitkannya dengan lafif maqrun.'),
 f('مُلْتَوِي', 'Huruf ‘illat pada fa’ dan lam', 'Istilah lebih umum untuk pola ini adalah lafif mafruq.'),
 f('مَهْمُوزٌ', 'Salah satu huruf asli berupa hamzah', 'Mahmuz dapat terjadi pada posisi pertama, kedua, atau ketiga.'),
 f('سَالِمٌ', 'Selamat dari ‘illat, tadh’if, dan hamzah', 'Salim lebih khusus daripada sekadar tidak memiliki huruf ‘illat.'),
 f('مَهْمُوزُ اللَّامِ', 'Hamzah pada huruf asli ketiga', 'Hamzah قَرَأَ berada pada posisi ketiga.'),
], ['Dua ‘illat dapat berdekatan atau terpisah.', 'Mahmuz ditentukan oleh posisi hamzah.', 'Salim bebas dari ‘illat, tadh’if, dan hamzah.']);

add('ushul-fiil-mashdar', 4, 'Waktu dan makna dasar', 'Membedakan madhi, mudhari’, dan mashdar dalam tashrif ushul.', '§6.1–6.2',
 'Tashrif ushul memindahkan satu akar ke fungsi yang berbeda. Madhi menunjukkan pekerjaan yang telah terjadi, mudhari’ menunjukkan sedang atau akan, sedangkan mashdar menunjukkan perbuatan tanpa terikat waktu.',
 'Bayangkan akar sebagai gagasan kerja. Madhi memberi tanda “sudah”, mudhari’ memberi “sedang atau akan”, dan mashdar hanya menyebut perbuatannya.',
 'ضَرَبَ adalah “telah memukul”, يَضْرِبُ adalah “sedang atau akan memukul”, dan ضَرْبًا adalah pukulan atau memukul sebagai makna dasar.', [
 f('فَعَلَ', 'Fi’il madhi ma’ruf', 'Pola pertama menunjukkan madhi ma’ruf.'),
 f('يَفْعِلُ', 'Fi’il mudhari’ ma’ruf', 'Mudhari’ menunjukkan sedang atau akan.'),
 f('فَعْلًا', 'Mashdar', 'Mashdar menyatakan perbuatan atau kejadian.'),
 f('ضَرَبَ', 'Telah memukul', 'Harakat dan bentuknya menunjukkan madhi ma’ruf.'),
 f('ضَرْبًا', 'Pukulan atau memukul', 'Mashdar tidak menentukan pelaku atau waktu.'),
], ['Madhi: telah.', 'Mudhari’: sedang atau akan.', 'Mashdar: makna perbuatan tanpa waktu.']);

add('ushul-pelaku-objek', 4, 'Pelaku dan yang dikenai', 'Membedakan isim fa’il dan isim maf’ul.', '§6.2; §7.4–7.5',
 'Isim fa’il menunjukkan pelaku pekerjaan. Isim maf’ul menunjukkan orang atau benda yang dikenai pekerjaan. Keduanya adalah isim dan tidak menunjukkan waktu seperti fi’il.',
 'Dalam peristiwa memukul, ضَارِبٌ adalah pihak yang memukul dan مَضْرُوبٌ adalah pihak yang dipukul.',
 'Jangan menebak semua bentuk sifat hanya dari satu pola. Sumber mengingatkan bahwa pemakaian nyata dapat mengikuti bentuk lain yang didengar dari bahasa Arab.', [
 f('فَاعِلٌ', 'Pola umum isim fa’il', 'فَاعِلٌ adalah pola dasar isim fa’il dalam rangkaian ini.'),
 f('مَفْعُولٌ', 'Pola umum isim maf’ul', 'مَفْعُولٌ adalah pola dasar isim maf’ul.'),
 f('ضَارِبٌ', 'Yang memukul', 'ضَارِبٌ menunjuk pelaku perbuatan memukul.'),
 f('مَضْرُوبٌ', 'Yang dipukul', 'مَضْرُوبٌ menunjuk pihak yang dikenai pukulan.'),
 f('مَنْصُورٌ', 'Yang ditolong', 'مَنْصُورٌ berasal dari contoh نَصَرَ.'),
], ['Isim fa’il menunjukkan pelaku.', 'Isim maf’ul menunjukkan yang dikenai.', 'Pemakaian nyata tetap harus diperiksa.']);

add('ushul-perintah-tempat', 4, 'Perintah, larangan, waktu, tempat, dan alat', 'Membedakan lima fungsi turunan praktis.', '§6.1–6.2; §7.6–7.9',
 'Lima bentuk ini menjawab lima pertanyaan berbeda: lakukan apa, jangan lakukan apa, kapan, di mana, dan dengan alat apa. Kesamaan tulisan tidak selalu berarti kesamaan fungsi.',
 'Tanyakan fungsi sebelum menerjemahkan. Bentuk مَفْعِلٌ dapat menjadi waktu atau tempat; kontekslah yang menjelaskan.',
 'Isim zaman dan isim makan dapat memakai pola yang sama. Karena itu latihan selalu memberi konteks fungsi, bukan hanya satu bentuk terpisah.', [
 f('اِفْعِلْ', 'Fi’il amr: lakukanlah', 'Fi’il amr ditujukan kepada lawan bicara.'),
 f('لَا تَفْعِلْ', 'Fi’il nahyi: jangan lakukan', 'Nahyi diawali la nahiyah.'),
 f('مَفْعِلٌ sebagai zaman', 'Waktu berlangsungnya pekerjaan', 'Konteks waktu menjadikannya isim zaman.'),
 f('مَفْعِلٌ sebagai makan', 'Tempat berlangsungnya pekerjaan', 'Konteks tempat menjadikannya isim makan.'),
 f('مِفْعَلٌ', 'Alat untuk melakukan pekerjaan', 'Isim alat menunjukkan benda atau perantara pekerjaan.'),
], ['Amr memerintah; nahyi melarang.', 'Zaman menjawab kapan; makan menjawab di mana.', 'Bentuk yang sama perlu konteks.']);

add('ushul-majhul', 4, 'Aktif dan pasif', 'Membedakan ma’ruf dan majhul pada madhi dan mudhari’.', '§6.1–6.2; §7.10–7.11',
 'Ma’ruf menampilkan pelaku melalui bentuknya. Majhul mengalihkan perhatian kepada pihak yang dikenai dan tidak menyebut pelaku. Perubahan harakat dapat mengubah pasangan aktif menjadi pasif.',
 'Bandingkan “dia memukul” dengan “dia dipukul”. Kejadiannya berkaitan, tetapi arah perhatian kalimat berubah.',
 'ضَرَبَ berarti telah memukul, sedangkan ضُرِبَ berarti telah dipukul. يَضْرِبُ dan يُضْرَبُ membuat perbandingan serupa pada mudhari’.', [
 f('مَعْرُوفٌ', 'Pelaku diketahui dari bentuk', 'Ma’ruf mengacu pada bentuk aktif dalam rangkaian ini.'),
 f('مَجْهُولٌ', 'Pelaku tidak disebut', 'Majhul mengalihkan perhatian dari pelaku.'),
 f('فُعِلَ', 'Fi’il madhi majhul', 'Fathah awal berubah menjadi dhammah dan ‘ain berkasrah pada pola ini.'),
 f('يُفْعَلُ', 'Fi’il mudhari’ majhul', 'Pola ini adalah mudhari’ majhul.'),
 f('ضُرِبَ', 'Telah dipukul', 'Pelaku pukulan tidak disebut dalam bentuk ini.'),
], ['Ma’ruf menampilkan pelaku.', 'Majhul tidak menyebut pelaku.', 'Harakat membedakan pasangan aktif dan pasif.']);

add('lughawi-madhi', 5, 'Pelaku pada fi’il madhi', 'Membaca beberapa penanda pelaku pada madhi.', '§1.4; §7.1',
 'Tashrif lughawi mengubah satu bentuk menurut dhamir, jumlah, dan gender. Pada madhi, akhiran membantu menunjukkan pelakunya. Sebagian dhamir tampak dan sebagian tersembunyi.',
 'Pegang makna akar, lalu baca penanda orangnya. Pada ضَرَبُوا, akar memberi makna memukul dan وا menunjukkan kelompok laki-laki.',
 'Pada فَعَلَ dhamir هُوَ tersembunyi. Pada فَعَلَتْ, تْ adalah tanda perempuan, bukan dhamir tersendiri.', [
 f('فَعَلَ', 'Dia laki-laki telah berbuat', 'Dhamir هُوَ tersembunyi pada bentuk pertama.'),
 f('فَعَلُوا', 'Mereka laki-laki telah berbuat', 'Wawu adalah dhamir; alif sesudahnya tanda tulisan.'),
 f('فَعَلَتْ', 'Dia perempuan telah berbuat', 'Ta sukun adalah tanda ta’nits, sementara هِيَ tersembunyi.'),
 f('فَعَلْتَ', 'Kamu laki-laki telah berbuat', 'Akhiran تَ menunjuk lawan bicara laki-laki tunggal.'),
 f('فَعَلْنَا', 'Kami atau kita telah berbuat', 'Akhiran نا menunjuk pembicara bersama pihak lain.'),
], ['Akar memberi makna kerja.', 'Akhiran membantu mengenali pelaku.', 'Sebagian dhamir tersembunyi.']);

add('lughawi-mudhari', 5, 'Awalan dan akhiran mudhari’', 'Membaca beberapa penanda pelaku pada mudhari’.', '§1.5; §7.2',
 'Mudhari’ memakai huruf awal ي ت أ ن yang disebut huruf mudhara’ah. Akhiran dan konteks dhamir melengkapi informasi tentang jumlah dan gender.',
 'Ingat empat huruf awal sebagai ي ت أ ن. Setelah melihat awal, periksa akhir kata untuk membedakan dua, banyak, atau perempuan tunggal.',
 'تَفْعِلُ dapat berarti dia perempuan atau kamu laki-laki. Bentuk yang sama harus dibaca bersama konteks.', [
 f('يَفْعِلُ', 'Dia laki-laki sedang atau akan berbuat', 'Ya awal dipakai pada posisi ghaib laki-laki tunggal.'),
 f('يَفْعِلُونَ', 'Mereka laki-laki sedang atau akan berbuat', 'Wawu menunjukkan jama’ mudzakkar.'),
 f('تَفْعِلِينَ', 'Kamu perempuan sedang atau akan berbuat', 'Ya sebelum nun menandai lawan bicara perempuan tunggal.'),
 f('أَفْعِلُ', 'Saya sedang atau akan berbuat', 'Hamzah awal dipakai untuk pembicara tunggal.'),
 f('نَفْعِلُ', 'Kami atau kita sedang atau akan berbuat', 'Nun awal dipakai untuk pembicara bersama pihak lain.'),
], ['Huruf mudhara’ah: ي ت أ ن.', 'Awal dan akhir dibaca bersama.', 'Konteks membedakan bentuk yang sama.']);

add('lughawi-enam-tiga', 5, 'Mengapa ada enam dan tiga bentuk?', 'Membedakan kelompok enam bentuk dan tiga bentuk dalam tashrif lughawi.', '§7.3–7.9',
 'Amr dan nahyi hanya untuk lawan bicara, sehingga memiliki enam posisi. Isim fa’il dan maf’ul memiliki enam bentuk berdasarkan gender dan jumlah. Mashdar, zaman, makan, dan alat diringkas menjadi tiga jumlah.',
 'Tanya dahulu: apakah bentuk ini berbicara kepada orang, menyebut pelaku/objek, atau hanya menghitung satu-dua-banyak?',
 'Jumlah bentuk tidak selalu sama dengan jumlah ejaan unik. Bentuk dua laki-laki dan dua perempuan dapat tampak sama pada beberapa rangkaian.', [
 f('6 bentuk amr', 'Enam posisi lawan bicara', 'Perintah hanya diarahkan kepada mukhatab dan mukhatabah.'),
 f('6 bentuk nahyi', 'Enam posisi larangan', 'Larangan juga hanya diarahkan kepada lawan bicara.'),
 f('6 bentuk isim fa’il', 'Gender dan jumlah pelaku', 'Ada mudzakkar dan muannats, masing-masing satu, dua, banyak.'),
 f('3 bentuk mashdar', 'Mufrad, mutsanna, jama’', 'Mashdar diringkas menjadi satu, dua, dan banyak.'),
 f('3 bentuk isim alat', 'Satu, dua, banyak alat', 'Isim alat juga dikelompokkan menurut jumlah.'),
], ['Amr dan nahyi: enam lawan bicara.', 'Isim pelaku/objek: enam gender dan jumlah.', 'Mashdar, zaman, makan, alat: tiga jumlah.']);

add('dhamir-objek', 6, 'Dhamir sebagai objek', 'Mengenali dhamir nashab terpisah dan melekat.', '§1.3; §1.8',
 'Dhamir objek dapat berdiri terpisah seperti إِيَّاهُ atau melekat pada fi’il seperti نَصَرَهُ. Keduanya menunjuk pihak yang dikenai pekerjaan, bukan pelaku.',
 'Dalam “dia menolongnya”, kata kerja menunjukkan tindakan dan akhiran menunjukkan siapa yang ditolong.',
 'نَصَرَهُ berarti dia menolong dia laki-laki. Akhiran ـهُ adalah objek; pelaku bentuk dasar نَصَرَ tetap هُوَ yang tersembunyi.', [
 f('إِيَّاهُ', 'Kepada atau akan dia laki-laki', 'Dalam bahasa sumber, “akan” menandai objek, bukan masa depan.'),
 f('نَصَرَهُ', 'Dia menolong dia laki-laki', 'Akhiran ـهُ adalah dhamir objek yang melekat.'),
 f('نَصَرَهَا', 'Dia menolong dia perempuan', 'Akhiran ـهَا menunjuk objek perempuan tunggal.'),
 f('نَصَرَكُمْ', 'Dia menolong kalian laki-laki', 'Akhiran ـكُمْ menunjuk lawan bicara jama’ mudzakkar sebagai objek.'),
 f('نَصَرَنِي', 'Dia menolong saya', 'Akhiran ـنِي menunjuk pembicara tunggal sebagai objek.'),
], ['Objek adalah pihak yang dikenai pekerjaan.', 'Munfashil berdiri terpisah.', 'Muttashil melekat pada kata.']);

add('dhamir-idhafah', 6, 'Dhamir sebagai pemilik', 'Membaca dhamir khafdh yang melekat pada isim.', '§1.9',
 'Ketika dhamir melekat pada isim, hubungan itu dapat menunjukkan kepemilikan. Sumber memakai بَيْتٌ, rumah, sebagai contoh.',
 'Baca kata bendanya dahulu, lalu akhiran pemiliknya: rumah + dia, rumah + kamu, rumah + kami.',
 'Akhiran ـهُ dapat muncul pada fungsi yang berbeda menurut kata yang ditempelinya. Pada بَيْتُهُ, ia berkaitan dengan isim dan berarti rumahnya.', [
 f('بَيْتُهُ', 'Rumahnya laki-laki tunggal', 'Dhamir ـهُ melekat pada isim بَيْت.'),
 f('بَيْتُهَا', 'Rumahnya perempuan tunggal', 'Akhiran ـهَا menunjuk pemilik perempuan tunggal.'),
 f('بَيْتُكَ', 'Rumahmu laki-laki tunggal', 'Akhiran ـكَ menunjuk lawan bicara laki-laki.'),
 f('بَيْتِي', 'Rumahku', 'Akhiran ي menunjuk pembicara tunggal sebagai pemilik.'),
 f('بَيْتُنَا', 'Rumah kami atau kita', 'Akhiran نا menunjuk pembicara bersama pihak lain.'),
], ['Isim + dhamir dapat menunjukkan kepemilikan.', 'Baca benda lalu pemilik.', 'Fungsi akhiran bergantung pada kata yang ditempelinya.']);

add('dhamir-huruf-jar', 6, 'Dhamir setelah huruf jar', 'Mengenali arti hubungan huruf jar dan dhamir.', '§1.10',
 'Dhamir dapat melekat pada huruf jar. Hurufnya memberi hubungan seperti dari, ke, tentang, atas, atau di; akhirannya menunjukkan pihak yang dimaksud.',
 'Pisahkan makna menjadi dua bagian: arah atau hubungan dari huruf jar, lalu orang dari dhamir.',
 'مِنْهُ berarti “dari dia”, sedangkan إِلَيْهِ berarti “kepadanya”. Dhamirnya sama-sama menunjuk dia laki-laki; hubungan huruf jarnya berbeda.', [
 f('مِنْهُ', 'Dari dia laki-laki', 'مِنْ berarti dari dan ـهُ menunjuk dia laki-laki.'),
 f('إِلَيْهِ', 'Ke atau kepada dia laki-laki', 'إِلَى memberi hubungan menuju atau sampai.'),
 f('عَنْهُ', 'Dari atau tentang dia laki-laki', 'عَنْ dapat berarti dari atau tentang.'),
 f('عَلَيْهِ', 'Atas dia laki-laki', 'عَلَى memberi hubungan atas.'),
 f('فِيهِ', 'Di atau dalam dia laki-laki', 'فِي memberi hubungan pada, di, atau dalam.'),
], ['Huruf jar memberi hubungan.', 'Dhamir menunjukkan pihak.', 'Baca kedua bagian bersama.']);

add('bab-satu-tiga', 7, 'Tiga bab pertama: a sebagai awal', 'Membedakan pasangan pola bab satu sampai tiga.', '§8.1–8.3; Lampiran Peta Cepat',
 'Tiga bab pertama sama-sama memakai fathah pada ‘ain fi’il madhi: a. Perbedaannya tampak pada mudhari’: i, u, atau a.',
 'Mnemonic a-i, a-u, a-a membantu mengingat daftar. Ia bukan alat untuk menebak bab sebuah kata yang belum dikenal; pasangan madhi dan mudhari’ perlu diketahui.',
 'ضَرَبَ يَضْرِبُ adalah bab satu, نَصَرَ يَنْصُرُ bab dua, dan فَتَحَ يَفْتَحُ bab tiga.', [
 f('فَعَلَ يَفْعِلُ', 'Bab 1: a-i', 'Bab pertama berubah dari a pada madhi ke i pada mudhari’.'),
 f('فَعَلَ يَفْعُلُ', 'Bab 2: a-u', 'Bab kedua berubah dari a ke u.'),
 f('فَعَلَ يَفْعَلُ', 'Bab 3: a-a', 'Bab ketiga mempertahankan bunyi a.'),
 f('ضَرَبَ يَضْرِبُ', 'Contoh utama bab 1', 'Pasangan ini mengikuti a-i.'),
 f('نَصَرَ يَنْصُرُ', 'Contoh utama bab 2', 'Pasangan ini mengikuti a-u.'),
], ['Bab 1: a-i.', 'Bab 2: a-u.', 'Bab 3: a-a.']);

add('bab-empat-enam', 7, 'Tiga bab berikutnya: i dan u', 'Membedakan pasangan pola bab empat sampai enam.', '§8.4–8.6; Lampiran Peta Cepat',
 'Bab empat dan lima memakai kasrah pada ‘ain fi’il madhi. Mudhari’ bab empat berbunyi a, sedangkan bab lima i. Bab enam memakai u pada madhi dan mudhari’.',
 'Lanjutkan mnemonic sebelumnya: i-a, i-i, u-u. Ucapkan pasangan lengkap agar harakat tidak terlepas dari polanya.',
 'Bab enam banyak dipakai untuk sifat atau keadaan yang menetap dan umumnya lazim. Bentuk turunannya tidak boleh dipaksakan seperti fi’il muta’addi.', [
 f('فَعِلَ يَفْعَلُ', 'Bab 4: i-a', 'Bab keempat berubah dari i ke a.'),
 f('فَعِلَ يَفْعِلُ', 'Bab 5: i-i', 'Bab kelima mempertahankan bunyi i.'),
 f('فَعُلَ يَفْعُلُ', 'Bab 6: u-u', 'Bab keenam mempertahankan bunyi u.'),
 f('سَمِعَ يَسْمَعُ', 'Contoh utama bab 4', 'Pasangan ini mengikuti i-a.'),
 f('كَرُمَ يَكْرُمُ', 'Contoh utama bab 6', 'Pasangan ini mengikuti u-u dan bermakna mulia.'),
], ['Bab 4: i-a.', 'Bab 5: i-i.', 'Bab 6: u-u.']);

add('kaidah-amr-nahyi', 8, 'Dari mudhari’ menuju perintah', 'Menjelaskan langkah dasar membentuk amr dan nahyi menurut sumber.', '§8.7',
 'Amr dibentuk dari mudhari’ mukhatab dengan membuang huruf mudhara’ah. Jika awal hasilnya sukun dan sulit diucapkan, tambahkan hamzah washal. Nahyi memakai لَا nahiyah dan bentuk mudhari’ yang dijazmkan.',
 'Untuk belajar, mulai dari bentuk mukhatab yang sudah diketahui. Ikuti perubahan langkah demi langkah; jangan mulai dari terjemahan saja.',
 'Dari تَفْعِلُ menjadi اِفْعِلْ. Dari تَفْعُلُ menjadi اُفْعُلْ. Nahyi mempertahankan ta awal karena ia tetap bentuk mudhari’ setelah لَا.', [
 f('تَفْعِلُ → اِفْعِلْ', 'Amr bab dengan mudhari’ i', 'Ta mudhara’ah dibuang dan hamzah washal ditambahkan.'),
 f('تَفْعُلُ → اُفْعُلْ', 'Amr bab dengan mudhari’ u', 'Harakat hamzah washal menyesuaikan kaidah dalam sumber.'),
 f('تَفْعَلُ → اِفْعَلْ', 'Amr bab dengan mudhari’ a', 'Ta mudhara’ah dibuang dan akhir dijazmkan.'),
 f('لَا تَفْعَلْ', 'Pola nahyi mukhatab tunggal', 'لَا nahiyah masuk pada mudhari’ mukhatab.'),
 f('اِضْرِبْ', 'Contoh perintah: pukullah', 'Bentuk ini memerintah satu lawan bicara laki-laki.'),
], ['Amr berangkat dari mudhari’ mukhatab.', 'Hamzah washal membantu awal yang sukun.', 'Nahyi memakai لَا nahiyah dan jazm.']);

add('batas-materi', 8, 'Apa yang sudah dan belum tersedia', 'Menyebutkan batas sumber dan batas penerapan pola.', '§7.12; §8.8; Catatan Akhir',
 'Sumber lengkap sampai enam bab tsulatsi mujarrad. Bagian tsulatsi mazid fih baru dibuka dan belum dirinci. Sumber juga mengingatkan bahwa mashdar serta beberapa turunan mengikuti pemakaian yang didengar dan sifat lazim atau muta’addi.',
 'Ilmu yang kuat juga tahu batasnya. Jika sumber belum memberi rincian, tandai sebagai pengantar dan cari sumber tepercaya sebelum membuat aturan baru.',
 'Pola membantu menurunkan bentuk setelah bab diketahui. Pola tidak membenarkan kita menciptakan setiap mashdar, isim alat, atau isim maf’ul secara otomatis untuk semua kata.', [
 f('6 bab', 'Jumlah tsulatsi mujarrad yang dirinci', 'Sumber merangkum enam pasangan pola.'),
 f('22 bab', 'Jumlah bab sharaf yang disebut', 'Angka 22 disebut, tetapi tidak semuanya tersedia dalam dokumen.'),
 f('4 bagian', 'Pembagian keseluruhan bab menurut pembukaan', 'Dokumen menyatakan bab itu terbagi empat bagian.'),
 f('ثُلَاثِيٌّ مَزِيدٌ فِيهِ', 'Baru diperkenalkan, belum dirinci', 'Dokumen berakhir tepat setelah pengantar mazid fih.'),
 f('السَّمَاعُ', 'Pemakaian yang didengar dari bahasa Arab', 'Mashdar dan sifat tertentu perlu mengikuti riwayat pemakaian.'),
], ['Enam bab mujarrad tersedia.', 'Mazid baru diperkenalkan.', 'Pola tidak menggantikan pemakaian bahasa.']);

for (const lesson of lessons) lesson.facts.forEach((fact,i) => fact.id = conceptIds[lesson.id][i]);
export const legacyCards = Object.fromEntries(lessons.flatMap(l => l.facts.map((f, i) => [`${l.id}:${i}`, `${l.id}:${f.id}`])));
export const legacyRevisions = Object.fromEntries(lessons.map(l => [l.id, l.revision]));
enrichCurriculum(lessons);

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function allQuestions(lesson: Lesson): Question[] {
  const meanings = [...new Set(lesson.facts.map(f => f.meaning))];
  const terms = [...new Set(lesson.facts.map(f => f.term))];
  const knowledge: Question[] = lesson.facts.map(f => ({
    id: `${lesson.id}:understand:${f.id}`, lesson: lesson.id, concept: f.id, purpose: 'check', kind: 'choice',
    prompt: `Pada pelajaran ini, apa pasangan makna atau keterangan untuk “${f.term}”?`,
    options: meanings, answer: f.meaning, why: f.why, required: false,
  }));
  // Repeated written forms need the source context; do not test an ambiguous inverse mapping.
  const uniqueKnowledge = knowledge.filter(q => lesson.facts.filter(f => f.term === lesson.facts.find(f => f.id === q.concept)?.term).length === 1);
  const applied: Question[] = applications[lesson.id].flatMap(a => (['match', 'table'] as const).map(kind => ({
    id: `${lesson.id}:${kind}:${a.id}`, lesson: lesson.id, concept: `${lesson.id}:apply`, purpose: 'check', kind,
    prompt: kind === 'match' ? `Cocokkan dengan bentuk atau fungsi yang tepat: ${a.cue}.` : 'Lengkapi sel kosong sesuai konteks pada tabel.',
    options: a.options, answer: a.answer, why: a.why, required: true,
    ...(kind === 'table' ? { context: { headers: a.headers, cells: a.cells } } : {}),
  })));
  const practice: Question[] = lesson.facts.map(f => ({
    id: `${lesson.id}:practice:${f.id}`, lesson: lesson.id, concept: f.id, purpose: 'practice', kind: 'choice',
    prompt: `Pilih bentuk yang cocok dengan keterangan: ${f.meaning}.`, options: terms, answer: f.term, why: f.why, required: false,
  }));
  const remediation = applied.map(q => ({ ...q, id: q.id.replace(`${lesson.id}:`, `${lesson.id}:remediate:`), purpose: 'practice' as const, required: false }));
  return [...uniqueKnowledge, ...applied, ...practice, ...remediation].map(q => ({ ...q, options: [q.answer, ...q.options.filter(option=>option !== q.answer).slice(0,4)] }));
}
export function questions(lesson: Lesson, attempt: number, purpose: 'practice' | 'check' = 'check', random = Math.random, wrong: string[] = []): Question[] {
  const bank = allQuestions(lesson);
  const rotate = <T>(items: T[], offset: number) => [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)];
  let selected: Question[];
  if (purpose === 'practice') {
    const repairIds = new Set(wrong.map(id=>id.replace(`${lesson.id}:`, `${lesson.id}:remediate:`)));
    const repairs = bank.filter(q=>repairIds.has(q.id));
    selected = [...repairs, ...rotate(bank.filter(q => q.purpose === purpose && !q.id.includes(':remediate:')), attempt * 2)];
  }
  else {
    const concepts = rotate(bank.filter(q => q.purpose === 'check' && q.kind === 'choice'), attempt * 3).slice(0, 3);
    const matching = bank.filter(q => q.purpose === 'check' && q.kind === 'match'), tables = bank.filter(q => q.purpose === 'check' && q.kind === 'table');
    const first = attempt * 2 % matching.length, second = (first + 1) % tables.length;
    selected = [...concepts, matching[first], tables[second]];
    // Small source tables may repeat a form; fill the check with contextual questions instead.
    for (const q of rotate([...matching, ...tables], first + 2)) {
      if (selected.length >= 5) break;
      if (!selected.some(item => item.id === q.id)) selected.push(q);
    }
  }
  return selected.map(q => ({ ...q, options: shuffle(q.options, random) }));
}
export function validateContent() {
  const ids = new Set<string>();
  for (const l of lessons) {
    if (ids.has(l.id) || (l.prerequisite && !ids.has(l.prerequisite))) throw Error(`ID/prasyarat tidak valid: ${l.id}`);
    if (l.facts.length < 3 || new Set(l.facts.map(f=>f.id)).size !== l.facts.length) throw Error(`Konsep ambigu: ${l.id}`);
    const bank = allQuestions(l);
    if (new Set(bank.map(q=>q.id)).size !== bank.length) throw Error(`ID soal berulang: ${l.id}`);
    for (const q of bank) if (!q.prompt || !q.answer || !q.why || q.options.length < 2 || new Set(q.options).size !== q.options.length || !q.options.includes(q.answer)) throw Error(`Soal tidak lengkap: ${q.id}`);
    const exam = questions(l,0);
    if (exam.length !== 5 || exam.filter(q=>q.kind !== 'choice').length < 2 || !exam.some(q=>q.required)) throw Error(`Cakupan cek tidak lengkap: ${l.id}`);
    ids.add(l.id);
  }
}
