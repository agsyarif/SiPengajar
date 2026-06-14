import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type LLMProvider = "openai" | "gemini";

export interface ModulInput {
  mapel: string;
  jenjang: string;
  kelas: string;
  fase: string;
  topik: string;
  tujuan: string;
  model: string;
  pertemuan: number;
  menit: number;
  cp?: string;
}

export function buildModulPrompt(input: ModulInput): string {
  const mntPendahuluan = Math.round(input.menit * 0.15);
  const mntInti = Math.round(input.menit * 0.7);
  const mntPenutup = input.menit - mntPendahuluan - mntInti;

  return `Kamu adalah ahli kurikulum Indonesia berpengalaman yang paham mendalam tentang Kurikulum Merdeka Belajar Kemendikbud. Buat Modul Ajar LENGKAP, SPESIFIK, dan SIAP PAKAI.

DATA MODUL:
- Mata Pelajaran : ${input.mapel}
- Jenjang/Kelas  : ${input.jenjang} Kelas ${input.kelas}
- Fase           : ${input.fase}
- Topik/Materi   : ${input.topik}
- Tujuan         : ${input.tujuan}
- Model          : ${input.model}
- Alokasi        : ${input.pertemuan} pertemuan × ${input.menit} menit
${input.cp ? `- CP (gunakan ini sebagai dasar): ${input.cp}` : `- CP: Tulis CP resmi Kurikulum Merdeka yang TEPAT untuk ${input.mapel} ${input.fase}, bukan CP generik`}

STANDAR KUALITAS WAJIB — baca sebelum menulis:
• Tujuan Pembelajaran harus SMART: Spesifik, Measurable, Achievable, Relevant, Time-bound
• Setiap pertemuan WAJIB memiliki tujuan pertemuan yang BERBEDA dan TERUKUR
• Kegiatan inti harus BERBEDA di setiap pertemuan, tidak boleh copy-paste struktur yang sama
• Semua instruksi kegiatan harus LANGSUNG BISA DILAKSANAKAN guru tanpa perlu interpretasi ulang
• Asesmen sumatif WAJIB menyertakan rubrik penilaian dan KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
• Diferensiasi untuk siswa reguler/kesulitan/advanced WAJIB terlihat nyata di langkah kegiatan inti, bukan hanya di tabel target peserta didik

OUTPUT: HTML mentah langsung. Gunakan PERSIS struktur class dan tag berikut:

<div class="modul-content">

<table class="header-box"><tbody><tr><td>
<p class="header-label">MODUL AJAR</p>
<p class="header-mapel">${input.mapel.toUpperCase()}</p>
<p class="header-topik">${input.topik.toUpperCase()}</p>
<p class="header-subtitle">[isi: 1 kalimat deskripsi kontekstual dan menarik tentang topik ini — bukan definisi kamus, tapi relevansi topik bagi kehidupan peserta didik]</p>
</td></tr></tbody></table>

<table class="summary-table"><tbody><tr>
<td class="summary-cell"><p class="summary-label">🏫 Fase / Kelas</p><p class="summary-value">${input.fase} / Kelas ${input.kelas}</p></td>
<td class="summary-cell"><p class="summary-label">⏱ Alokasi Waktu</p><p class="summary-value">${input.pertemuan} Pertemuan &times; ${input.menit} Menit</p></td>
<td class="summary-cell"><p class="summary-label">📚 Mata Pelajaran</p><p class="summary-value">${input.mapel}</p></td>
<td class="summary-cell"><p class="summary-label">🧩 Model</p><p class="summary-value">${input.model}</p></td>
</tr></tbody></table>

<h2 class="section-header">A.  INFORMASI UMUM</h2>

<h3 class="subsection-title">1. Identitas Modul</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Nama Penyusun</td><td>[Nama Guru]</td></tr>
<tr><td class="label-cell">Satuan Pendidikan</td><td>[Nama Sekolah]</td></tr>
<tr><td class="label-cell">Mata Pelajaran</td><td>${input.mapel}</td></tr>
<tr><td class="label-cell">Fase / Kelas</td><td>${input.fase} / Kelas ${input.kelas} ${input.jenjang}</td></tr>
<tr><td class="label-cell">Topik</td><td>${input.topik}</td></tr>
<tr><td class="label-cell">Alokasi Waktu</td><td>${input.pertemuan} Pertemuan &times; ${input.menit} Menit (Total ${input.pertemuan * input.menit} Menit)</td></tr>
<tr><td class="label-cell">Semester / T.A.</td><td>Semester 1 (Ganjil) / 2024-2025</td></tr>
</tbody></table>

<h3 class="subsection-title">2. Kompetensi Awal</h3>
<p>[isi: 1 kalimat pengantar tentang apa yang perlu sudah dikuasai siswa sebelum topik ini]</p>
<ul>
[isi: 3–4 kompetensi prasyarat spesifik sebagai <li> — bukan kompetensi umum, harus terkait langsung dengan ${input.topik}. Contoh format: "Peserta didik telah memahami konsep X dari topik Y di kelas sebelumnya."]
</ul>

<h3 class="subsection-title">3. Capaian Pembelajaran (CP) ${input.fase}</h3>
<p>[isi: CP resmi Kurikulum Merdeka ${input.mapel} ${input.fase} yang relevan — tulis 2–3 kalimat SPESIFIK mengacu pada kompetensi yang diukur dalam topik ${input.topik}, bukan pernyataan umum. Jika CP input sudah diberikan, kembangkan dan kontekstualkan]</p>

<h3 class="subsection-title">4. Tujuan Pembelajaran</h3>
<p>[isi: 1 kalimat tujuan umum unit yang mencakup keseluruhan ${input.pertemuan} pertemuan]</p>
<p>Setelah mengikuti seluruh pembelajaran, peserta didik mampu:</p>
<ul>
[isi: buat tepat ${input.pertemuan} butir tujuan pembelajaran — satu per pertemuan — format wajib: <li><strong>TP ${input.fase.replace(/\D/g, "")}.X (Pertemuan N):</strong> [kata kerja operasional Bloom C2–C5] + [objek spesifik] + [kondisi/cara] + [kriteria keberhasilan terukur]</li>]
</ul>

<h3 class="subsection-title">5. Profil Pelajar Pancasila</h3>
<table class="data-table"><tbody>
[isi: 3 baris dimensi PPP yang PALING RELEVAN dengan ${input.topik} — bukan pilihan generik. Format: <tr><td class="label-cell">[Dimensi PPP]</td><td>[Deskripsi konkret: aktivitas SPESIFIK dalam modul ini yang mengembangkan dimensi tersebut — sebutkan nama kegiatannya]</td></tr>]
</tbody></table>

<h3 class="subsection-title">6. Sarana &amp; Prasarana</h3>
<ul>
[isi: 5–7 item spesifik sebagai <li>. Setiap item harus menyebutkan nama bahan/alat + fungsinya dalam pembelajaran + keterangan "disiapkan guru" atau "dibawa siswa" jika relevan. JANGAN tulis item generik seperti "alat tulis" saja]
</ul>

<h3 class="subsection-title">7. Target Peserta Didik</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Siswa Reguler</td><td>[deskripsi alur pembelajaran standar — sebutkan aktivitas kunci yang akan diikuti]</td></tr>
<tr><td class="label-cell">Siswa Kesulitan Belajar</td><td>[deskripsi scaffolding KONKRET: jenis bantuan apa, kapan diberikan, berupa apa — bukan hanya "dibimbing guru"]</td></tr>
<tr><td class="label-cell">Siswa Cepat (Advanced)</td><td>[deskripsi pengayaan KONKRET: tantangan tambahan spesifik yang berbeda secara substantif, bukan sekadar "soal lebih sulit"]</td></tr>
</tbody></table>

<h3 class="subsection-title">8. Model &amp; Metode Pembelajaran</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Model Pembelajaran</td><td>${input.model}</td></tr>
<tr><td class="label-cell">Metode</td><td>[isi: 3–4 metode konkret yang SESUAI dengan model ${input.model} dan topik ${input.topik} — jelaskan kapan setiap metode digunakan]</td></tr>
<tr><td class="label-cell">Pendekatan</td><td>[isi: pendekatan yang digunakan, mis. Saintifik / TPACK / Diferensiasi / Kontekstual — pilih yang paling sesuai dan jelaskan singkat alasannya]</td></tr>
</tbody></table>

<h2 class="section-header">B.  KOMPONEN INTI</h2>

<h3 class="subsection-title">1. Pemahaman Bermakna</h3>
<p>[isi: 2–3 kalimat "big idea" — pernyataan bermakna yang menghubungkan ${input.topik} dengan kehidupan nyata peserta didik, bukan ringkasan materi. Harus menjawab: "Mengapa topik ini penting bagi hidupku?"]</p>
<ul>
[isi: 3 poin pemahaman konkret yang diharapkan BERTAHAN setelah pembelajaran selesai — format: <li>[Pernyataan pemahaman yang bisa diterapkan siswa di luar kelas, bukan sekadar hafalan fakta]</li>]
</ul>

<h3 class="subsection-title">2. Pertanyaan Pemantik</h3>
<ul>
[isi: 4 pertanyaan pemantik — format: <li>❓ [pertanyaan]</li>
Syarat: (1) open-ended, tidak bisa dijawab ya/tidak; (2) memancing rasa ingin tahu dan koneksi ke pengalaman nyata siswa; (3) setiap pertanyaan memancing aspek BERBEDA dari topik ${input.topik}; (4) satu pertanyaan bersifat kontroversial atau provocative untuk memicu debat]
</ul>

<h3 class="subsection-title">3. Kegiatan Pembelajaran</h3>

[INSTRUKSI PENTING — baca sebelum menulis kegiatan:
- Buat SEMUA ${input.pertemuan} pertemuan secara berurutan, setiap pertemuan LENGKAP
- Setiap pertemuan harus memiliki FOKUS TOPIK YANG BERBEDA, bukan variasi aktivitas dari materi yang sama
- Kegiatan inti harus mencerminkan model ${input.model} secara autentik dengan langkah-langkah bernomor
- Di setiap kegiatan inti, tambahkan 1 catatan diferensiasi eksplisit: "Untuk siswa kesulitan belajar: [...] | Untuk siswa advanced: [...]"
- Waktu untuk setiap sub-kegiatan harus disebutkan dalam kurung, total HARUS pas ${input.menit} menit
Untuk setiap pertemuan, gunakan PERSIS format ini:]

<h4 class="meeting-header">PERTEMUAN [N]  —  [Judul Singkat yang UNIK dan SPESIFIK untuk pertemuan ini] (${input.menit} Menit)</h4>
<p class="meeting-goal"><strong>Tujuan Pertemuan:</strong> [tujuan SPESIFIK DAN TERUKUR untuk pertemuan ini saja — harus berbeda dari pertemuan lain, harus menyebutkan kriteria keberhasilan yang bisa diamati]</p>
<table class="activity-table">
<thead><tr><th>FASE</th><th>WAKTU</th><th>DESKRIPSI KEGIATAN</th></tr></thead>
<tbody>
<tr><td class="phase-cell">Pembuka<br/>(Apersepsi)</td><td class="time-cell">${mntPendahuluan} menit</td><td>[isi: kegiatan pembuka SPESIFIK — tulis teks langsung, gunakan <br/> untuk baris baru, gunakan <strong> untuk nama sub-langkah. JANGAN gunakan tag <p> di dalam sel ini. Contoh: "(1) Guru mengucapkan salam...<br/>(2) Apersepsi: [teknik spesifik berbeda tiap pertemuan]...<br/>(3) Penyampaian tujuan pembelajaran."]</td></tr>
<tr><td class="phase-cell">Inti<br/>(Eksplorasi)</td><td class="time-cell">${mntInti} menit</td><td>[isi: langkah-langkah bernomor DETAIL sesuai model ${input.model} — gunakan <strong>Nama Sub-aktivitas (X mnt):</strong> diikuti deskripsi, pisahkan dengan <br/> antara sub-aktivitas. JANGAN gunakan <p> di dalam sel. Di akhir tambahkan: <br/>📌 <strong>Diferensiasi:</strong> Siswa kesulitan — [instruksi] | Siswa advanced — [tantangan]]</td></tr>
<tr><td class="phase-cell">Penutup<br/>(Afirmasi)</td><td class="time-cell">${mntPenutup} menit</td><td>[isi: (1) teknik simpulan berbeda tiap pertemuan<br/>(2) asesmen formatif spesifik dengan contoh pertanyaan<br/>(3) preview pertemuan berikutnya — gunakan <br/> bukan <p>]</td></tr>
</tbody></table>
<p class="assessment-note"><strong>Asesmen Formatif Pertemuan [N]:</strong> [nama instrumen] — [deskripsi spesifik: apa yang diukur, bagaimana caranya, dan bagaimana guru menggunakan hasilnya untuk tindak lanjut pembelajaran]</p>

<h3 class="subsection-title">4. Asesmen</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Asesmen Diagnostik</td><td>[deskripsi teknik asesmen awal yang SPESIFIK: kapan dilakukan (awal pertemuan ke berapa), instrumen apa, pertanyaan/aktivitasnya seperti apa, dan bagaimana hasilnya digunakan untuk menyesuaikan pembelajaran]</td></tr>
<tr><td class="label-cell">Asesmen Formatif</td><td>[ringkasan instrumen per pertemuan: P1: [nama instrumen + fokus penilaian] | P2: [nama instrumen + fokus penilaian] | dst. Sebutkan aspek yang dinilai di setiap pertemuan]</td></tr>
<tr><td class="label-cell">Asesmen Sumatif</td><td>[deskripsi lengkap: (1) bentuk tes/proyek, (2) topik/kompetensi yang diukur, (3) jumlah dan jenis soal, (4) bobot nilai, (5) KKTP: nilai minimal yang menunjukkan ketercapaian tujuan pembelajaran, mis. "Peserta didik dinyatakan kompeten jika mencapai nilai ≥ 75 dari 100"]</td></tr>
</tbody></table>

<h3 class="subsection-title">4a. Rubrik Asesmen Sumatif</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Sangat Kompeten (86–100)</td><td>[deskripsi konkret kemampuan yang ditunjukkan — bukan hanya "menjawab dengan benar", tapi BAGAIMANA kualitas jawabannya]</td></tr>
<tr><td class="label-cell">Kompeten (75–85)</td><td>[deskripsi konkret kemampuan yang ditunjukkan]</td></tr>
<tr><td class="label-cell">Cukup Kompeten (60–74)</td><td>[deskripsi konkret — apa yang sudah bisa dan apa yang masih lemah]</td></tr>
<tr><td class="label-cell">Belum Kompeten (&lt;60)</td><td>[deskripsi konkret — indikasi kesulitan utama yang dialami siswa]</td></tr>
</tbody></table>

<h3 class="subsection-title">5. Pengayaan &amp; Remedial</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Pengayaan</td><td>[deskripsi KONKRET dan BERBEDA secara substantif dari materi inti — bukan soal lebih sulit dari topik yang sama. Sebutkan: (1) aktivitas/produk yang dibuat, (2) sumber belajar tambahan yang spesifik, (3) kompetensi lebih tinggi yang dikembangkan]</td></tr>
<tr><td class="label-cell">Remedial</td><td>[deskripsi bertahap: (1) identifikasi kesulitan berdasarkan hasil asesmen, (2) strategi pembelajaran ulang yang BERBEDA dari cara pertama, (3) instrumen/aktivitas remedial yang spesifik, (4) kriteria untuk dinyatakan sudah remedial]</td></tr>
</tbody></table>

<h3 class="subsection-title">6. Refleksi</h3>
<p><strong>Refleksi Guru:</strong></p>
<ul>
[isi: 3 pertanyaan refleksi praktik mengajar — format: <li>[pertanyaan yang mendorong guru mengevaluasi KEPUTUSAN PEDAGOGIS spesifik dalam modul ini, bukan pertanyaan generik seperti "apakah pembelajaran berhasil?"]</li>]
</ul>
<p><strong>Refleksi Peserta Didik:</strong></p>
<ul>
[isi: 3 pertanyaan refleksi siswa — format: <li>[pertanyaan yang menghubungkan pembelajaran dengan kehidupan nyata atau mendorong metakognisi — bukan "apa yang dipelajari hari ini?"]</li>]
</ul>

<h3 class="subsection-title">7. Lampiran: Garis Besar LKPD</h3>
[Buat outline LKPD untuk setiap pertemuan. Format per pertemuan:]
<h4 class="meeting-header">LKPD Pertemuan [N] — [Judul]</h4>
<ul>
[isi: 3–5 komponen LKPD sebagai <li> — sebutkan: nama bagian LKPD, instruksi singkat untuk siswa, dan jenis respons yang diharapkan (tabel isian, diagram, pertanyaan esai, dll)]
</ul>

</div>

ATURAN WAJIB:
1. Output HANYA HTML mentah — TIDAK ada tag <style>, TIDAK ada markdown, TIDAK ada komentar HTML
2. Ganti SEMUA teks [dalam kurung kotak] dengan konten NYATA — DILARANG menyisakan placeholder apapun
3. JANGAN ubah nama class: header-box, header-label, header-mapel, header-topik, header-subtitle, summary-table, summary-cell, summary-label, summary-value, section-header, subsection-title, data-table, label-cell, activity-table, phase-cell, time-cell, meeting-header, meeting-goal, assessment-note
4. DILARANG menggunakan tag tanpa class yang ditentukan: <h2> wajib class="section-header", <h3> wajib class="subsection-title", <h4> wajib class="meeting-header", <table> wajib class yang sesuai
5. Buat SEMUA ${input.pertemuan} pertemuan — konten berbeda, lengkap, dan berurutan
6. Total waktu per pertemuan WAJIB ${input.menit} menit (${mntPendahuluan} + ${mntInti} + ${mntPenutup})
7. Seluruh output dibungkus dalam <div class="modul-content">...</div>
8. Bahasa Indonesia baku, spesifik, langsung bisa dilaksanakan — HINDARI kalimat abstrak atau ambigu
9. DILARANG menambahkan atribut style="" pada elemen apapun — styling ditangani CSS eksternal
10. DILARANG menggunakan tag <colgroup> atau <col> dalam tabel apapun
11. Di dalam sel tabel <td>, DILARANG membungkus konten dengan <p> — tulis teks langsung atau gunakan <br/> untuk baris baru
`;
}

function getActiveProvider(): LLMProvider {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error(
    "No LLM API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY.",
  );
}

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);

  let lastError: unknown;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction:
          "Kamu adalah ahli kurikulum Kurikulum Merdeka Indonesia yang berpengalaman. Kamu menghasilkan modul ajar yang LENGKAP, SPESIFIK, dan SIAP PAKAI — bukan template berisi placeholder. Setiap konten yang kamu tulis harus langsung bisa dilaksanakan guru di kelas tanpa modifikasi tambahan.",
      });

      // Untuk model yang mendukung thinking/reasoning, aktifkan
      const generationConfig: Record<string, unknown> = {
        temperature: 0.7,
        maxOutputTokens: 16000,
      };

      // gemini-2.5-flash mendukung thinking budget
      if (modelName === "gemini-2.5-flash") {
        generationConfig.thinkingConfig = { thinkingBudget: 8000 };
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });
      return result.response.text();
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const is429 = msg.includes("429");
      const isNotFound =
        msg.includes("404") ||
        msg.includes("not found") ||
        msg.includes("Unknown model");
      if (!is429 && !isNotFound) throw err;
      console.warn(
        `[ai] ${modelName} failed (${is429 ? "quota" : "not found"}), trying next...`,
      );
    }
  }

  throw lastError;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah ahli kurikulum Kurikulum Merdeka Indonesia yang berpengalaman. Kamu menghasilkan modul ajar yang LENGKAP, SPESIFIK, dan SIAP PAKAI — bukan template berisi placeholder. Setiap konten yang kamu tulis harus langsung bisa dilaksanakan guru di kelas tanpa modifikasi tambahan.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 12000,
  });
  return completion.choices[0].message.content ?? "";
}

export async function generateModulAjar(
  input: ModulInput,
  provider?: LLMProvider,
): Promise<string> {
  const activeProvider = provider ?? getActiveProvider();
  const prompt = buildModulPrompt(input);

  if (activeProvider === "gemini") return generateWithGemini(prompt);
  return generateWithOpenAI(prompt);
}

/**
 * Strips markdown code fences and leading/trailing whitespace from LLM output.
 * LLMs sometimes wrap HTML output in ```html ... ``` blocks despite instructions.
 */
export function cleanLLMOutput(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
