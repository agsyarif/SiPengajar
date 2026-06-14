# CLAUDE CODE PROMPT — FITUR LEARNING PATH (CP · ATP · TP)

# SiPengajar — Tambahan dari prompt utama

> Ini adalah FASE 11 — jalankan setelah FASE 0–10 dari prompt utama selesai.
> Fitur ini hidup di `/template/atp` dan terintegrasi ke form generate modul.

---

## ════════════════════════════════════

## KONTEKS & ARSITEKTUR FITUR

## ════════════════════════════════════

```
Fitur ini menambahkan halaman Learning Path ke SiPengajar.
Guru bisa browse CP → lihat ATP & TP per mapel → klik TP → form generate
ter-prefill otomatis dari data TP yang dipilih.

Posisi di navigasi:
  Template (sidebar)
  ├── Template Modul Ajar   ← sudah ada
  └── ATP & TP per CP       ← fitur baru ini (/template/atp)

Alur user:
  1. Guru buka /template/atp
  2. Pilih Mata Pelajaran + Fase (filter)
  3. Lihat CP overview (sticky header)
  4. Scroll horizontal rail: Unit → TP nodes (warna = SOLO level)
  5. Klik TP node → detail panel muncul di bawah rail
  6. Klik "Buat Modul Ajar dari TP ini" → redirect ke /modul/baru
     dengan query params yang pre-fill form
```

---

## ════════════════════════════════════

## FASE 11.1 — PRISMA SCHEMA TAMBAHAN

## ════════════════════════════════════

Tambahkan model berikut ke `prisma/schema.prisma` (append setelah model yang sudah ada):

```prisma
model LearningOutcome {
  id         String    @id @default(cuid())
  subject    String                        // mata pelajaran
  phase      String                        // fase kurikulum (e.g. "Fase F")
  level      String                        // jenjang (e.g. "SMA/MA")
  elements   LearningOutcomeElement[]
  chapters   Chapter[]
  createdAt  DateTime  @default(now())

  @@unique([subject, phase])
  @@map("learning_outcomes")
}

model LearningOutcomeElement {
  id               String          @id @default(cuid())
  learningOutcomeId String
  name             String                  // nama elemen CP
  description      String          @db.Text
  learningOutcome  LearningOutcome @relation(fields: [learningOutcomeId], references: [id], onDelete: Cascade)

  @@map("learning_outcome_elements")
}

model Chapter {
  id               String          @id @default(cuid())
  learningOutcomeId String
  number           Int                     // nomor urut chapter
  name             String                  // nama chapter / unit
  grade            String                  // kelas (e.g. "XI", "XII")
  semester         Int                     // semester (1 atau 2)
  objectives       LearningObjective[]
  learningOutcome  LearningOutcome @relation(fields: [learningOutcomeId], references: [id], onDelete: Cascade)

  @@map("chapters")
}

model LearningObjective {
  id               String            @id @default(cuid())
  chapterId        String
  code             String            @unique   // e.g. "XI.1.1"
  title            String            @db.Text  // rumusan TP lengkap
  shortTitle       String                      // judul ringkas
  soloLevel        SoloLevel
  allocationHours  Int                         // alokasi JP
  learningFlow     LearningFlow[]
  formativeAssessment String         @db.Text
  summativeAssessment String         @db.Text
  profileDimensions   String[]                // dimensi profil pelajar
  cpElements          String[]                // elemen CP yang dicakup
  chapter          Chapter           @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  @@map("learning_objectives")
}

model LearningFlow {
  id                  String            @id @default(cuid())
  learningObjectiveId String
  sequence            Int               // urutan (1, 2, 3)
  phase               String            // "Memahami" | "Mengaplikasi" | "Merefleksi"
  description         String            @db.Text
  learningObjective   LearningObjective @relation(fields: [learningObjectiveId], references: [id], onDelete: Cascade)

  @@map("learning_flows")
}

enum SoloLevel {
  MULTISTRUCTURAL
  RELATIONAL
  EXTENDED_ABSTRACT
}
```

Jalankan setelah menambahkan:

```bash
npx prisma generate
npx prisma db push
```

---

## ════════════════════════════════════

## FASE 11.2 — SEED DATA

## ════════════════════════════════════

Buat `prisma/seed-atp.ts`:

```typescript
import { PrismaClient, SoloLevel } from "@prisma/client";

const prisma = new PrismaClient();

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
```

Tambahkan ke `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed-atp.ts"
}
```

Jalankan:

```bash
npx prisma db seed
```

---

## ════════════════════════════════════

## FASE 11.3 — TYPE DEFINITIONS

## ════════════════════════════════════

Tambahkan ke `src/types/index.ts`:

```typescript
export type SoloLevel = "MULTISTRUCTURAL" | "RELATIONAL" | "EXTENDED_ABSTRACT";

export interface LearningFlowItem {
  sequence: number;
  phase: "Memahami" | "Mengaplikasi" | "Merefleksi";
  description: string;
}

export interface ObjectiveDetail {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  soloLevel: SoloLevel;
  allocationHours: number;
  cpElements: string[];
  profileDimensions: string[];
  formativeAssessment: string;
  summativeAssessment: string;
  learningFlow: LearningFlowItem[];
}

export interface ChapterWithObjectives {
  id: string;
  number: number;
  name: string;
  grade: string;
  semester: number;
  objectives: ObjectiveDetail[];
}

export interface LearningOutcomeWithChapters {
  id: string;
  subject: string;
  phase: string;
  level: string;
  elements: { name: string; description: string }[];
  chapters: ChapterWithObjectives[];
}

// Untuk pre-fill form generate dari TP
export interface GenerateFromObjectiveParams {
  objectiveCode: string;
  subject: string;
  level: string;
  grade: string;
  phase: string;
  topik: string;
  tujuan: string;
  allocationHours: number;
  model?: string;
}

// SOLO level display config
export const SOLO_CONFIG = {
  MULTISTRUCTURAL: {
    label: "Multistructural",
    short: "M",
    sublabel: "Surface",
    bgClass: "bg-[#E6F1FB]",
    borderClass: "border-[#185FA5]",
    textClass: "text-[#0C447C]",
    dotColor: "#185FA5",
  },
  RELATIONAL: {
    label: "Relational",
    short: "R",
    sublabel: "Deep",
    bgClass: "bg-teal-50",
    borderClass: "border-teal-600",
    textClass: "text-teal-800",
    dotColor: "#0F6E56",
  },
  EXTENDED_ABSTRACT: {
    label: "Extended Abstract",
    short: "EA",
    sublabel: "Deep+",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-600",
    textClass: "text-violet-800",
    dotColor: "#534AB7",
  },
} as const;
```

---

## ════════════════════════════════════

## FASE 11.4 — API ROUTES

## ════════════════════════════════════

### GET list CP (`src/app/api/atp/route.ts`)

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mapel = searchParams.get("mapel");
  const fase = searchParams.get("fase");
  const kelas = searchParams.get("kelas");

  const cps = await prisma.learningOutcome.findMany({
    where: {
      ...(mapel && { mapel }),
      ...(fase && { fase }),
    },
    include: {
      elements: true,
      chapters: {
        where: kelas ? { kelas } : undefined,
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
    orderBy: { subject: "asc" },
  });

  return NextResponse.json(cps);
}
```

### GET detail CP (`src/app/api/atp/[id]/route.ts`)

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const cp = await prisma.learningOutcome.findUnique({
    where: { id: params.id },
    include: {
      elements: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
  });

  if (!cp)
    return NextResponse.json({ error: "CP tidak ditemukan" }, { status: 404 });
  return NextResponse.json(cp);
}
```

---

## ════════════════════════════════════

## FASE 11.5 — KOMPONEN LEARNING PATH

## ════════════════════════════════════

### 11.5.1 — CP Header Bar

Buat `src/components/features/atp/learning-outcome-header.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { BookOpen, List, Target, Clock } from "lucide-react";
import type { LearningOutcomeWithChapters } from "@/types";

interface LearningOutcomeHeaderProps {
  learningOutcome: LearningOutcomeWithChapters;
  totalJP: number;
  totalTP: number;
}

export function LearningOutcomeHeader({
  cp,
  totalJP,
  totalTP,
}: LearningOutcomeHeaderProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3 flex-wrap">
        <Badge
          variant="teal"
          className="text-xs px-3 py-1 rounded-full flex-shrink-0"
        >
          CP · {cp.fase}
        </Badge>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-base font-semibold text-stone-900">
            {cp.mapel} — {cp.jenjang}
          </h2>
          <div className="flex gap-2 flex-wrap mt-1.5">
            {[
              { icon: BookOpen, label: `${cp.elemen.length} Elemen CP` },
              { icon: List, label: `${cp.units.length} Unit` },
              { icon: Target, label: `${totalTP} TP` },
              { icon: Clock, label: `${totalJP} JP total` },
            ].map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1 text-xs text-stone-500
                           bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full"
              >
                <m.icon size={11} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Elemen CP */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3
                      border-t border-stone-100"
      >
        {cp.elemen.map((el) => (
          <div key={el.nama} className="bg-stone-50 rounded-lg p-3">
            <p className="text-xs font-medium text-stone-700 mb-0.5">
              {el.nama}
            </p>
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {el.deskripsi}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 11.5.2 — TP Node

Buat `src/components/features/atp/objective-node.tsx`:

```tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SOLO_CONFIG } from "@/types";
import type { ObjectiveDetail } from "@/types";

interface ObjectiveNodeProps {
  tp: ObjectiveDetail;
  isActive: boolean;
  onClick: () => void;
}

export function ObjectiveNode({ tp, isActive, onClick }: ObjectiveNodeProps) {
  const cfg = SOLO_CONFIG[objective.soloLevel];
  const isCapstone = objective.code === "XII.6.3";

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "w-11 h-11 rounded-full border-2 flex items-center justify-center",
          "text-xs font-semibold select-none transition-shadow duration-150",
          cfg.bgClass,
          cfg.borderClass,
          cfg.textClass,
          isActive && "ring-4 ring-offset-1",
          isActive &&
            objective.soloLevel === "MULTISTRUCTURAL" &&
            "ring-blue-200",
          isActive && objective.soloLevel === "RELATIONAL" && "ring-teal-200",
          isActive &&
            objective.soloLevel === "EXTENDED_ABSTRACT" &&
            "ring-violet-200",
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.97 }}
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        title={objective.titleRingkas}
      >
        {isCapstone ? "EA★" : cfg.short}
      </motion.div>

      <span
        className="text-2xs text-stone-400 group-hover:text-stone-600
                       transition-colors whitespace-nowrap font-mono"
      >
        {objective.code}
      </span>
      <span className="text-2xs text-stone-300 whitespace-nowrap">
        {objective.allocationHours} JP
      </span>
    </div>
  );
}
```

### 11.5.3 — Unit Block

Buat `src/components/features/atp/chapter-block.tsx`:

```tsx
import { ObjectiveNode } from "./objective-node";
import type { ChapterWithObjectives, ObjectiveDetail } from "@/types";

interface ChapterBlockProps {
  unit: ChapterWithObjectives;
  activeObjectiveKode: string | null;
  onTPClick: (tp: ObjectiveDetail) => void;
}

export function ChapterBlock({
  unit,
  activeObjectiveKode,
  onTPClick,
}: ChapterBlockProps) {
  return (
    <div
      className="bg-stone-50 border border-stone-200 rounded-xl
                    px-4 pt-2.5 pb-4 flex-shrink-0"
    >
      {/* Unit label */}
      <p
        className="text-2xs font-medium text-stone-400 tracking-wider
                    uppercase text-center mb-3"
      >
        Unit {unit.nomor} · {unit.nama}
      </p>

      {/* TP nodes dalam unit */}
      <div className="flex items-start gap-0">
        {unit.tps.map((tp, idx) => (
          <div key={objective.code} className="flex items-center">
            <ObjectiveNode
              tp={tp}
              isActive={activeObjectiveKode === objective.code}
              onClick={() => onTPClick(tp)}
            />
            {idx < unit.tps.length - 1 && (
              <div className="w-5 h-0.5 bg-stone-200 mx-0 mb-7 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 11.5.4 — Semester Divider

Buat `src/components/features/atp/semester-divider.tsx`:

```tsx
export function SemesterDivider({ from, to }: { from: number; to: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center
                    px-3 pb-6 flex-shrink-0 self-stretch"
    >
      <div className="flex-1 w-px border-l-2 border-dashed border-stone-200" />
      <p
        className="text-2xs text-stone-300 [writing-mode:vertical-rl]
                    rotate-180 tracking-wider uppercase py-2 whitespace-nowrap"
      >
        Sem {from} → Sem {to}
      </p>
    </div>
  );
}
```

### 11.5.5 — TP Detail Panel

Buat `src/components/features/atp/objective-detail-panel.tsx`:

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOLO_CONFIG } from "@/types";
import type { ObjectiveDetail } from "@/types";

interface ObjectiveDetailPanelProps {
  tp: ObjectiveDetail | null;
  subject: string;
  level: string;
  onClose: () => void;
}

const ALUR_LABELS = ["Memahami", "Mengaplikasi", "Merefleksi"] as const;

export function ObjectiveDetailPanel({
  tp,
  mapel,
  jenjang,
  onClose,
}: ObjectiveDetailPanelProps) {
  const router = useRouter();

  function handleGenerate() {
    if (!tp) return;
    // Kelas diambil dari kode TP (XI atau XII)
    const kelas = objective.code.startsWith("XII") ? "XII" : "XI";
    const params = new URLSearchParams({
      from_objective: "true",
      tp_code: objective.code,
      mapel,
      jenjang,
      kelas,
      topik: objective.titleRingkas,
      tujuan: objective.title,
      allocationHours: objective.allocationHours.toString(),
    });
    router.push(`/modul/baru?${params.toString()}`);
  }

  return (
    <AnimatePresence>
      {tp && (
        <motion.div
          key={objective.code}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-white border border-stone-200 rounded-xl p-4 mt-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 flex-wrap mb-2">
                <Badge
                  className={`text-xs rounded-full ${SOLO_CONFIG[objective.soloLevel].textClass}
                               ${SOLO_CONFIG[objective.soloLevel].bgClass}
                               border ${SOLO_CONFIG[objective.soloLevel].borderClass}`}
                >
                  {SOLO_CONFIG[objective.soloLevel].label}
                </Badge>
                <Badge variant="stone" className="text-xs rounded-full">
                  <Clock size={10} className="mr-1" />
                  {objective.allocationHours} JP
                </Badge>
              </div>
              <p className="text-sm font-medium text-stone-900 leading-relaxed">
                <span className="font-mono text-stone-400 mr-1.5">
                  {objective.code}
                </span>
                {objective.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 transition-colors
                         hover:bg-stone-100 rounded-md p-1 flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Alur belajar */}
          <div className="mb-3">
            <p className="label-section mb-2">Alur belajar</p>
            <div className="flex items-start gap-2 flex-wrap">
              {objective.learningFlow.map((alur, idx) => (
                <div key={flow.sequence} className="flex items-center gap-2">
                  <div
                    className="bg-stone-50 border border-stone-200
                                  rounded-lg px-3 py-2 min-w-0 max-w-[200px]"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className="w-4 h-4 rounded-full bg-teal-600
                                      flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-2xs font-semibold text-white">
                          {flow.sequence}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-stone-700">
                        {ALUR_LABELS[idx]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                      {flow.description}
                    </p>
                  </div>
                  {idx < objective.learningFlow.length - 1 && (
                    <ChevronRight
                      size={14}
                      className="text-stone-300 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Asesmen */}
          <div className="mb-3">
            <p className="label-section mb-2">Asesmen</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Formatif", value: objective.formativeAssessment },
                { label: "Sumatif", value: objective.summativeAssessment },
              ].map((a) => (
                <div key={a.label} className="bg-stone-50 rounded-lg p-3">
                  <p className="text-2xs text-stone-400 mb-1">{a.label}</p>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {a.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Profil Pelajar */}
          <div className="mb-4">
            <p className="label-section mb-2">Profil Pelajar Pancasila</p>
            <div className="flex flex-wrap gap-1.5">
              {objective.profileDimensions.map((p) => (
                <span
                  key={p}
                  className="text-xs text-stone-500 bg-stone-100
                             border border-stone-200 px-2.5 py-1 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Generate */}
          <Button onClick={handleGenerate} className="w-full gap-2" size="lg">
            <Sparkles size={15} />
            Buat Modul Ajar dari TP ini
          </Button>
          <p className="text-2xs text-stone-400 text-center mt-2">
            Form akan ter-isi otomatis dari data TP ini. Kamu bisa edit sebelum
            generate.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 11.5.6 — Learning Path Rail (komponen utama)

Buat `src/components/features/atp/learning-path-rail.tsx`:

```tsx
"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChapterBlock } from "./chapter-block";
import { SemesterDivider } from "./semester-divider";
import { ObjectiveDetailPanel } from "./objective-detail-panel";
import { LearningOutcomeHeader } from "./learning-outcome-header";
import { SOLO_CONFIG } from "@/types";
import type {
  LearningOutcomeWithChapters,
  ObjectiveDetail,
  ChapterWithObjectives,
} from "@/types";
import { cn } from "@/lib/utils";

interface LearningPathRailProps {
  learningOutcome: LearningOutcomeWithChapters;
}

type Kelas = "XI" | "XII";

export function LearningPathRail({ cp }: LearningPathRailProps) {
  const [activeKelas, setActiveKelas] = useState<Kelas>("XI");
  const [activeObjective, setActiveTP] = useState<ObjectiveDetail | null>(null);

  const filteredChapters = useMemo(
    () => cp.units.filter((u) => u.kelas === activeKelas),
    [cp.units, activeKelas],
  );

  const totalJP = cp.units
    .flatMap((u) => u.tps)
    .reduce((s, t) => s + t.alokasi, 0);
  const totalTP = cp.units.flatMap((u) => u.tps).length;

  function handleObjectiveClick(tp: ObjectiveDetail) {
    setActiveTP((prev) => (prev?.kode === objective.code ? null : tp));
  }

  // Cari titik semester break dalam unit yang terfilter
  function hasSemBreakAfter(
    unit: ChapterWithObjectives,
    chapters: ChapterWithObjectives[],
  ) {
    const idx = units.indexOf(unit);
    if (idx < 0 || idx === units.length - 1) return false;
    return chapter.semester !== units[idx + 1].semester;
  }

  return (
    <div>
      <LearningOutcomeHeader cp={cp} totalJP={totalJP} totalTP={totalTP} />

      {/* Kelas toggle */}
      <div
        className="flex gap-1 bg-stone-100 border border-stone-200
                      rounded-lg p-1 w-fit mb-4"
      >
        {(["XI", "XII"] as Kelas[]).map((k) => (
          <button
            key={k}
            onClick={() => {
              setActiveKelas(k);
              setActiveTP(null);
            }}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
              activeKelas === k
                ? "bg-white text-teal-600 border border-stone-200 shadow-sm"
                : "text-stone-500 hover:text-stone-700",
            )}
          >
            Kelas {k}
          </button>
        ))}
      </div>

      {/* SOLO legend */}
      <div className="flex gap-4 flex-wrap mb-4 items-center">
        <span className="text-xs font-medium text-stone-400">Level SOLO:</span>
        {(["MULTISTRUCTURAL", "RELATIONAL", "EXTENDED_ABSTRACT"] as const).map(
          (s) => {
            const cfg = SOLO_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.dotColor }}
                />
                <span className="text-xs text-stone-500">
                  {cfg.label}
                  <span className="text-stone-400 ml-1">({cfg.sublabel})</span>
                </span>
              </div>
            );
          },
        )}
      </div>

      {/* Horizontal rail — scrollable */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-start gap-0 min-w-max">
          {filteredChapters.map((unit, idx) => (
            <div key={chapter.id} className="flex items-start">
              <ChapterBlock
                unit={unit}
                activeObjectiveKode={activeObjective?.kode ?? null}
                onTPClick={handleObjectiveClick}
              />
              {/* Connector atau semester divider */}
              {idx < filteredChapters.length - 1 &&
                (hasSemBreakAfter(unit, filteredChapters) ? (
                  <SemesterDivider
                    from={chapter.semester}
                    to={filteredChapters[idx + 1].semester}
                  />
                ) : (
                  <div className="w-6 h-0.5 bg-stone-200 mt-[34px] flex-shrink-0" />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hint saat belum ada yang dipilih */}
      {!activeObjective && (
        <div
          className="mt-3 text-center py-4 text-stone-400 bg-stone-50
                        border border-dashed border-stone-200 rounded-xl"
        >
          <p className="text-xs">
            Klik salah satu node TP untuk melihat detail dan membuat Modul Ajar.
          </p>
        </div>
      )}

      {/* Detail panel */}
      <ObjectiveDetailPanel
        tp={activeObjective}
        mapel={cp.mapel}
        jenjang={cp.jenjang}
        onClose={() => setActiveTP(null)}
      />
    </div>
  );
}
```

---

## ════════════════════════════════════

## FASE 11.6 — HALAMAN ATP

## ════════════════════════════════════

Buat `src/app/(dashboard)/template/atp/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { LearningPathRail } from "@/components/features/atp/learning-path-rail";
import { BookOpen, ChevronRight } from "lucide-react";

export default async function ATPPage() {
  const cps = await prisma.learningOutcome.findMany({
    include: {
      elements: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
    orderBy: { subject: "asc" },
  });

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
            <span>Template</span>
            <ChevronRight size={12} />
            <span className="text-stone-600">ATP & TP per CP</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Learning Path — ATP & TP
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-lg">
            Contoh jabaran Capaian Pembelajaran (CP) menjadi Alur Tujuan
            Pembelajaran (ATP) dan Tujuan Pembelajaran (TP). Pilih TP yang
            sesuai untuk langsung generate Modul Ajar.
          </p>
        </div>
      </FadeIn>

      {/* Empty state */}
      {cps.length === 0 && (
        <FadeIn delay={0.06}>
          <div className="text-center py-16 text-stone-400">
            <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-stone-500">
              Belum ada data CP tersedia.
            </p>
            <p className="text-xs mt-1">
              Jalankan{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                npx prisma db seed
              </code>{" "}
              untuk menambahkan data contoh.
            </p>
          </div>
        </FadeIn>
      )}

      {/* CP list */}
      <FadeInStagger staggerDelay={0.08}>
        {cps.map((cp) => (
          <FadeInItem key={cp.id}>
            <div className="mb-8">
              <LearningPathRail cp={cp as any} />
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  );
}
```

---

## ════════════════════════════════════

## FASE 11.7 — INTEGRASI KE FORM GENERATE

## ════════════════════════════════════

Update `src/app/(dashboard)/modul/baru/page.tsx` — tambahkan logika
untuk membaca query params dari TP dan pre-fill form:

```tsx
// Tambahkan di bagian atas komponen BuatModulPage
"use client";
import { useSearchParams } from "next/navigation";

// Di dalam komponen, setelah deklarasi useForm:
const searchParams = useSearchParams();
const fromTP = searchParams.get("from_objective") === "true";

// Override defaultValues jika dari TP
const defaultValues = fromTP
  ? {
      subject: searchParams.get("mapel") ?? "",
      level: searchParams.get("jenjang") ?? "",
      grade: searchParams.get("kelas") ?? "",
      topik: searchParams.get("topik") ?? "",
      tujuan: searchParams.get("tujuan") ?? "",
      pertemuan: Number(searchParams.get("alokasi")) || 2,
      menit: 45,
      model: "",
    }
  : {};

// Tambahkan banner "pre-filled dari TP" jika fromTP === true
// Tampilkan di atas form card:
{
  fromTP && (
    <div
      className="flex items-center gap-2 bg-teal-50 border border-teal-100
                  rounded-lg px-4 py-2.5 mb-4"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0" />
      <p className="text-xs text-teal-700">
        Form diisi otomatis dari TP{" "}
        <span className="font-mono font-medium">
          {searchParams.get("objective_code")}
        </span>
        . Kamu bisa edit sebelum generate.
      </p>
    </div>
  );
}
```

---

## ════════════════════════════════════

## FASE 11.8 — UPDATE SIDEBAR NAVIGASI

## ════════════════════════════════════

Update `src/components/layout/sidebar.tsx` — tambahkan sub-item di Template:

```tsx
// Ganti nav item Template menjadi:
{
  href: "/template",
  label: "Template Modul Ajar",
  icon: BookOpen,
},
{
  href: "/template/atp",
  label: "ATP & TP per CP",
  icon: GitBranch,    // import dari lucide-react
},
```

---

## ════════════════════════════════════

## FASE 11.9 — CHECKLIST SELESAI

## ════════════════════════════════════

Setelah semua fase di atas dijalankan, verifikasi:

- [ ] `prisma db push` berhasil — tabel cp, cp_elemen, unit, tp, alur_belajar terbentuk
- [ ] `prisma db seed` berhasil — 1 CP, 2 elemen, 6 unit, 18 TP, 54 alur belajar ter-insert
- [ ] `/template/atp` dapat diakses dan menampilkan CP Antropologi Fase F
- [ ] Toggle Kelas XI / XII berfungsi — rail berubah sesuai kelas
- [ ] Klik node TP → detail panel muncul dengan animasi spring
- [ ] Klik TP lain → detail panel switch dengan smooth
- [ ] Klik node yang sama → detail panel menutup
- [ ] Tombol "Buat Modul Ajar dari TP ini" → redirect ke `/modul/baru` dengan query params
- [ ] Di halaman form, banner "pre-filled dari TP" muncul dan field sudah terisi
- [ ] Guru tetap bisa edit semua field sebelum klik Generate
- [ ] SOLO color coding konsisten: Biru (M) · Teal (R) · Ungu (EA)
- [ ] Semester divider tampil di antara unit yang berbeda semester
- [ ] Horizontal scroll berfungsi di mobile (min-width: max-content)
- [ ] Animasi Framer Motion spring pada semua interaksi node

---

## CATATAN UNTUK CLAUDE CODE

1. Seed data di atas hanya untuk Antropologi Fase F sebagai contoh.
   Tambahkan mapel lain secara bertahap menggunakan pola yang sama.

2. Untuk production, data CP/ATP/TP sebaiknya di-manage via admin panel
   atau file JSON yang di-import — bukan hardcode di seed.

3. Query params di URL sengaja dipilih daripada Zustand/state karena
   user bisa back/forward dan URL bisa di-bookmark.

4. Komponen `LearningPathRail` adalah server component yang menerima
   data CP lengkap — tidak ada client-side fetching di halaman utama.
   Interaktivitas (klik node, toggle kelas) di-handle di sub-komponen
   yang "use client".
