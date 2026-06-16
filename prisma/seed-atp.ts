import { PrismaClient, SoloLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.production" });

const url = process.env.DATABASE_URL!;
const parsed = new URL(url);
const pool = new pg.Pool({
  host: parsed.hostname,
  port: Number(parsed.port) || 5432,
  database: parsed.pathname.slice(1),
  user: parsed.username,
  password: parsed.password,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAntropologi() {
  const cp = await prisma.learningOutcome.upsert({
    where: { subject_phase: { subject: "Antropologi", phase: "Fase F" } },
    update: {},
    create: {
      subject: "Antropologi",
      phase: "Fase F",
      level: "SMA/MA",
      elements: {
        create: [
          {
            name: "Pemahaman Konsep",
            description:
              "Meliputi kemampuan menjelaskan konsep dasar (sejarah, ruang lingkup, prinsip emik/etik, relativisme, thick description, holistik), metode penelitian etnografi, kebudayaan sebagai objek kajian (unsur dan dinamika), sistem bahasa dan religi sebagai simbol, organisasi sosial (keluarga/kekerabatan), serta problematika masyarakat multikultural dan digital.",
          },
          {
            name: "Keterampilan Proses",
            description:
              "Meliputi kemampuan mengaplikasikan metode etnografi sederhana, menerapkan relativisme budaya, menggunakan pendekatan emik/etik dalam praktik, mengevaluasi temuan lapangan, serta memberikan rekomendasi solusi untuk mempromosikan pemahaman lintas budaya.",
          },
        ],
      },
      chapters: {
        create: [
          // ── KELAS XI ─────────────────────────────────────
          {
            number: 1,
            name: "Pengantar Antropologi",
            grade: "XI",
            semester: 1,
            objectives: {
              create: [
                {
                  code: "XI.1.1",
                  shortTitle: "Konsep dasar & ruang lingkup antropologi",
                  title:
                    "Mendeskripsikan konsep dasar, sejarah perkembangan, dan ruang lingkup antropologi sebagai ilmu pengetahuan sosial yang bersifat holistik.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Penalaran Kritis", "Komunikasi"],
                  formativeAssessment: "Kuis konsep (5 soal tertulis)",
                  summativeAssessment:
                    "Esai singkat 300 kata tentang relevansi antropologi di era modern",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Eksplorasi mandiri pengertian antropologi, tokoh, dan cabang ilmu melalui teks dan video pendek.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          'Diskusi kelompok: "Mengapa antropologi disebut ilmu yang holistik? Berikan contoh nyata!"',
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Menulis jurnal reflektif: relevansi antropologi bagi kehidupan sebagai pelajar era modern.",
                      },
                    ],
                  },
                },
                {
                  code: "XI.1.2",
                  shortTitle: "Prinsip emik, etik & relativisme budaya",
                  title:
                    "Menganalisis prinsip emik dan etik serta relativisme budaya dalam mengkaji fenomena sosial-budaya di masyarakat.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: ["Penalaran Kritis", "Kewargaan"],
                  formativeAssessment: "Lembar observasi role-play",
                  summativeAssessment:
                    "Analisis pendek (400 kata) menggunakan pendekatan emik/etik pada satu tradisi budaya lokal",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Guru menghadirkan 2 kasus budaya berbeda. Siswa membedakan perspektif orang dalam (emik) vs luar (etik).",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Role-play: satu kelompok sebagai peneliti etik, kelompok lain sebagai narasumber emik.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Refleksi: "Kapan pendekatan emik lebih tepat? Apa bahaya menghakimi budaya lain?"',
                      },
                    ],
                  },
                },
                {
                  code: "XI.1.3",
                  shortTitle: "Thick description & pendekatan holistik",
                  title:
                    "Mengevaluasi penerapan thick description dan pendekatan holistik dalam memahami kompleksitas fenomena budaya secara mendalam.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Komunikasi",
                  ],
                  formativeAssessment: "Peer-review tulisan",
                  summativeAssessment:
                    "Produk tulisan thick description (500 kata) tentang tradisi lokal pilihan siswa",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Membaca dan mendiskusikan kutipan Clifford Geertz tentang thick description.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Tulis 2 versi deskripsi ritual: thin description (faktual) vs thick description (interpretatif).",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Presentasi mini + peer-review: "Mana yang lebih kaya makna? Mengapa?"',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            number: 2,
            name: "Etnografi",
            grade: "XI",
            semester: 1,
            objectives: {
              create: [
                {
                  code: "XI.2.1",
                  shortTitle: "Metode pengumpulan data etnografi",
                  title:
                    "Mendeskripsikan pengertian, prinsip dasar, dan jenis-jenis metode pengumpulan data dalam penelitian etnografi.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Penalaran Kritis", "Kemandirian"],
                  formativeAssessment: "Checklist panduan wawancara",
                  summativeAssessment:
                    "Kuis identifikasi metode dari contoh kasus penelitian lapangan",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Presentasi + infografis: jenis-jenis metode (observasi partisipatif, wawancara mendalam, catatan lapangan, dokumentasi).",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Latihan menyusun panduan wawancara sederhana berkelompok untuk topik kebudayaan di lingkungan sekolah.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Diskusi: "Apa tantangan terbesar saat melakukan observasi partisipatif?"',
                      },
                    ],
                  },
                },
                {
                  code: "XI.2.2",
                  shortTitle: "Praktek etnografi sederhana",
                  title:
                    "Mengaplikasikan metode etnografi sederhana melalui kegiatan observasi dan wawancara untuk mengkaji fenomena budaya di lingkungan sekitar.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 6,
                  cpElements: ["Keterampilan Proses"],
                  profileDimensions: [
                    "Kolaborasi",
                    "Penalaran Kritis",
                    "Komunikasi",
                    "Kemandirian",
                  ],
                  formativeAssessment: "Catatan lapangan (field notes)",
                  summativeAssessment:
                    "Laporan mini etnografi (600–800 kata) + refleksi pengalaman lapangan",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Panduan etika penelitian lapangan dan cara menulis catatan lapangan (field notes).",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Projek lapangan: observasi 45 menit + wawancara 2–3 narasumber di komunitas sekitar sekolah.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Presentasi temuan. Refleksi: "Apa yang berbeda antara persepsi awal dengan temuan nyata?"',
                      },
                    ],
                  },
                },
                {
                  code: "XI.2.3",
                  shortTitle: "Netnografi & etnografi digital",
                  title:
                    "Menganalisis karya etnografi kontemporer dan perkembangan netnografi sebagai pendekatan kajian budaya di era digital.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Komunikasi",
                  ],
                  formativeAssessment: "Jurnal observasi online",
                  summativeAssessment:
                    "Esai komparatif (500 kata): etnografi konvensional vs netnografi",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Perkenalan konsep netnografi (Robert Kozinets). Eksplorasi contoh komunitas online.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Observasi online 1 minggu: pilih satu komunitas digital, catat interaksi budayanya.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Diskusi kritis: apakah netnografi bisa menggantikan etnografi konvensional?",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            number: 3,
            name: "Kebudayaan & Dinamikanya",
            grade: "XI",
            semester: 2,
            objectives: {
              create: [
                {
                  code: "XI.3.1",
                  shortTitle: "Konsep dasar & unsur universal kebudayaan",
                  title:
                    "Menjelaskan konsep dasar kebudayaan, termasuk unsur-unsur universal dan wujud kebudayaan menurut para ahli antropologi.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Penalaran Kritis", "Kewargaan"],
                  formativeAssessment: "Tabel analisis 7 unsur kebudayaan",
                  summativeAssessment:
                    "Presentasi visual (poster/infografis digital) tentang kebudayaan daerah pilihan",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Peta konsep bersama: 7 unsur kebudayaan universal (Koentjaraningrat) dan 3 wujud kebudayaan.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Analisis satu kebudayaan daerah Indonesia menggunakan kerangka 7 unsur universal (tabel analisis).",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Refleksi: "Unsur kebudayaan mana yang paling rentan berubah? Mengapa?"',
                      },
                    ],
                  },
                },
                {
                  code: "XI.3.2",
                  shortTitle: "Dinamika perubahan sosial budaya",
                  title:
                    "Menganalisis dinamika perubahan sosial budaya (akulturasi, asimilasi, inovasi budaya) dan faktor-faktor yang mendorong terjadinya perubahan.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Kewargaan",
                  ],
                  formativeAssessment: "Lembar analisis kasus",
                  summativeAssessment:
                    "Makalah analisis (700 kata) tentang satu fenomena perubahan budaya nyata",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Studi kasus: akulturasi (batik + pengaruh Belanda), asimilasi (peranakan), inovasi budaya (tari kreasi).",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Analisis kelompok: 1 contoh perubahan budaya lokal, identifikasi jenis dan faktor pendorongnya.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Debat mini: "Apakah perubahan budaya selalu berdampak positif?"',
                      },
                    ],
                  },
                },
                {
                  code: "XI.3.3",
                  shortTitle: "Globalisasi vs kebudayaan lokal",
                  title:
                    "Mengevaluasi dampak globalisasi terhadap eksistensi kebudayaan lokal dan merancang rekomendasi upaya pelestarian budaya yang relevan.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 6,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Kolaborasi",
                    "Kewargaan",
                  ],
                  formativeAssessment: "Lembar perencanaan projek",
                  summativeAssessment:
                    "Produk kampanye + laporan refleksi (400 kata)",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Analisis data: berita tentang hilangnya bahasa daerah, lunturnya tradisi lokal, masuknya budaya asing.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Projek kolaboratif: rancang kampanye pelestarian budaya lokal (poster, video, atau proposal komunitas).",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Pameran karya grade: presentasi kampanye + umpan balik konstruktif dari teman.",
                      },
                    ],
                  },
                },
              ],
            },
          },
          // ── KELAS XII ────────────────────────────────────
          {
            number: 4,
            name: "Sistem Bahasa & Religi",
            grade: "XII",
            semester: 1,
            objectives: {
              create: [
                {
                  code: "XII.4.1",
                  shortTitle: "Bahasa sebagai sistem simbol budaya",
                  title:
                    "Menjelaskan bahasa sebagai sistem simbol budaya, fungsi bahasa dalam kehidupan sosial, dan hubungannya dengan identitas budaya suatu masyarakat.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Komunikasi", "Kewargaan"],
                  formativeAssessment: "Peta fungsi bahasa",
                  summativeAssessment:
                    "Esai reflektif (400 kata): hubungan bahasa dengan identitas budaya",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          'Eksplorasi ungkapan bahasa daerah yang tidak memiliki padanan. Diskusi: "Apa yang hilang ketika bahasa itu hilang?"',
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Pemetaan fungsi bahasa (komunikasi, identitas, ritualistik, estetis) menggunakan contoh bahasa daerah sendiri.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Refleksi personal: bahasa yang digunakan di rumah, sekolah, dan media sosial beserta maknanya.",
                      },
                    ],
                  },
                },
                {
                  code: "XII.4.2",
                  shortTitle: "Ancaman kepunahan bahasa daerah",
                  title:
                    "Menganalisis ancaman kepunahan bahasa daerah di Indonesia dan mengevaluasi upaya pelestarian bahasa daerah dalam konteks era globalisasi digital.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kewargaan",
                    "Kreativitas",
                  ],
                  formativeAssessment: "Lembar analisis kasus",
                  summativeAssessment:
                    "Presentasi studi kasus + rekomendasi pelestarian (slide + narasi verbal)",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Data UNESCO: jumlah bahasa terancam punah di Indonesia + analisis faktor penyebab.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Studi kasus kelompok: pilih 1 bahasa daerah terancam punah, analisis status dan upaya pelestariannya.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          'Forum: "Siapa yang paling bertanggung jawab: pemerintah, keluarga, atau generasi muda?"',
                      },
                    ],
                  },
                },
                {
                  code: "XII.4.3",
                  shortTitle: "Dinamika sistem religi & masyarakat plural",
                  title:
                    "Mengevaluasi dinamika sistem religi sebagai sistem kepercayaan dan simbol budaya, serta implikasinya dalam kehidupan masyarakat modern yang plural.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 6,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Keimanan",
                    "Penalaran Kritis",
                    "Kewargaan",
                    "Kolaborasi",
                  ],
                  formativeAssessment: "Jurnal analisis ritual",
                  summativeAssessment:
                    "Makalah analisis (700 kata): dinamika satu sistem religi lokal di era modern",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Konsep Durkheim tentang fungsi religi. Analisis satu upacara ritual lokal.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Dialog antar perspektif: analisis fenomena keagamaan modern dari sudut pandang antropologi.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Refleksi kritis: menghormati kepercayaan orang lain tanpa meninggalkan keyakinan sendiri.",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            number: 5,
            name: "Organisasi Sosial",
            grade: "XII",
            semester: 1,
            objectives: {
              create: [
                {
                  code: "XII.5.1",
                  shortTitle: "Struktur organisasi & sistem kekerabatan",
                  title:
                    "Mendeskripsikan struktur organisasi sosial, konsep keluarga sebagai unit sosial terkecil, dan ragam sistem kekerabatan dalam masyarakat Indonesia.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Penalaran Kritis", "Kewargaan"],
                  formativeAssessment: "Genogram keluarga",
                  summativeAssessment:
                    "Laporan komparatif (500 kata): perbandingan sistem kekerabatan tiga suku berbeda",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Penjelasan 3 sistem kekerabatan: patrilineal, matrilineal, dan bilateral.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Buat silsilah keluarga (genogram) dan identifikasi sistem kekerabatan, lalu bandingkan dengan 2 teman dari suku berbeda.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Diskusi: bagaimana sistem kekerabatan mempengaruhi hak waris dan pengambilan keputusan keluarga?",
                      },
                    ],
                  },
                },
                {
                  code: "XII.5.2",
                  shortTitle: "Fungsi org. sosial & penyelesaian konflik",
                  title:
                    "Menganalisis peran dan fungsi organisasi sosial serta sistem kekerabatan dalam mengatur dinamika kehidupan sosial dan penyelesaian konflik masyarakat.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kolaborasi",
                    "Kewargaan",
                  ],
                  formativeAssessment: "Rubrik simulasi",
                  summativeAssessment:
                    "Analisis kasus (600 kata): efektivitas organisasi sosial dalam konflik nyata",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Studi kasus: penyelesaian sengketa tanah adat melalui lembaga adat (kerapatan adat Minangkabau, dewan adat Papua).",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Simulasi: siswa berperan sebagai majelis adat yang menyelesaikan konflik warisan.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Evaluasi: apakah sistem adat masih relevan dan efektif di era modern?",
                      },
                    ],
                  },
                },
                {
                  code: "XII.5.3",
                  shortTitle: "Transformasi org. sosial di era digital",
                  title:
                    "Mengevaluasi transformasi struktur organisasi sosial dan sistem kekerabatan di era digital serta implikasinya terhadap kohesi sosial masyarakat Indonesia.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 4,
                  cpElements: ["Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Komunikasi",
                    "Kemandirian",
                  ],
                  formativeAssessment: "Catatan wawancara",
                  summativeAssessment:
                    "Esai analitis (700 kata) + data wawancara sebagai lampiran",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Analisis fenomena: komunitas diaspora di media sosial, pernikahan lintas suku via aplikasi, 'keluarga digital'.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Riset mini: wawancara 3 narasumber dari generasi berbeda tentang perubahan makna 'keluarga' dan 'komunitas'.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Esai reflektif: apa yang tetap dan apa yang berubah dari konsep kekerabatan di era digital?",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            number: 6,
            name: "Keberagaman & Integrasi Nasional",
            grade: "XII",
            semester: 2,
            objectives: {
              create: [
                {
                  code: "XII.6.1",
                  shortTitle: "Faktor penyebab keberagaman budaya Indonesia",
                  title:
                    "Menjelaskan faktor-faktor geografis, historis, dan sosial yang menjadi penyebab keberagaman budaya di Indonesia serta kekayaannya sebagai modal sosial bangsa.",
                  soloLevel: SoloLevel.MULTISTRUCTURAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep"],
                  profileDimensions: ["Kewargaan", "Penalaran Kritis"],
                  formativeAssessment: "Analisis peta budaya",
                  summativeAssessment:
                    "Presentasi (5–7 menit): faktor penyebab keberagaman di provinsi pilihan",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Eksplorasi peta: persebaran suku, bahasa, dan agama di Indonesia. Diskusi: mengapa Indonesia sangat beragam?",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Analisis bagaimana faktor geografis kepulauan, migrasi historis, dan perdagangan membentuk keberagaman satu provinsi pilihan.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Refleksi: apakah keberagaman kekuatan atau kelemahan? Argumen berdasarkan bukti historis.",
                      },
                    ],
                  },
                },
                {
                  code: "XII.6.2",
                  shortTitle: "Problematika masyarakat multikultural",
                  title:
                    "Menganalisis problematika masyarakat multikultural Indonesia: potensi konflik, tantangan integrasi, serta dinamika identitas di era masyarakat digital.",
                  soloLevel: SoloLevel.RELATIONAL,
                  allocationHours: 4,
                  cpElements: ["Pemahaman Konsep", "Keterampilan Proses"],
                  profileDimensions: [
                    "Penalaran Kritis",
                    "Kewargaan",
                    "Kolaborasi",
                  ],
                  formativeAssessment: "Rubrik diskusi panel",
                  summativeAssessment:
                    "Policy brief (600 kata): rekomendasi penanganan konflik SARA dari perspektif antropologi",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Analisis kasus konflik horizontal berbasis SARA. Identifikasi akar masalah dari perspektif antropologi.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "Diskusi panel: siswa berperan sebagai pemangku kepentingan berbeda yang mencari solusi konflik multikultural.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "Evaluasi: apakah pendidikan multikultural yang ada sudah cukup dalam mencegah konflik?",
                      },
                    ],
                  },
                },
                {
                  code: "XII.6.3",
                  shortTitle: "Solusi inovatif untuk integrasi nasional ★",
                  title:
                    "Merancang solusi inovatif berbasis relativisme budaya dan pendekatan lintas budaya untuk mempromosikan integrasi nasional dan harmoni di masyarakat Indonesia.",
                  soloLevel: SoloLevel.EXTENDED_ABSTRACT,
                  allocationHours: 8,
                  cpElements: ["Keterampilan Proses"],
                  profileDimensions: [
                    "Keimanan",
                    "Kewargaan",
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Kolaborasi",
                    "Kemandirian",
                    "Kesehatan",
                    "Komunikasi",
                  ],
                  formativeAssessment: "Lembar perencanaan projek akhir fase",
                  summativeAssessment:
                    "Laporan projek lengkap + presentasi publik + portofolio refleksi individual Fase F",
                  learningFlow: {
                    create: [
                      {
                        sequence: 1,
                        phase: "Memahami",
                        description:
                          "Sintesis seluruh materi Fase F: relativisme budaya, thick description, etnografi, dinamika kebudayaan, religi, kekerabatan, multikultural.",
                      },
                      {
                        sequence: 2,
                        phase: "Mengaplikasi",
                        description:
                          "PROJEK AKHIR FASE F: rancang dan eksekusi satu inisiatif nyata untuk mempromosikan pemahaman lintas budaya di sekolah/komunitas.",
                      },
                      {
                        sequence: 3,
                        phase: "Merefleksi",
                        description:
                          "PAMERAN KARYA: presentasi projek akhir kepada audiens. Evaluasi dampak dan refleksi perjalanan belajar Fase F.",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✓ Seed CP Antropologi Fase F selesai:", cp.id);
}

async function main() {
  await seedAntropologi();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
