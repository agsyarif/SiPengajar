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
  const mntPenutup = Math.round(input.menit * 0.15);

  return `Kamu adalah ahli kurikulum Indonesia. Buat Modul Ajar LENGKAP format Merdeka Belajar Kemendikbud.

DATA MODUL:
- Mata Pelajaran : ${input.mapel}
- Jenjang/Kelas  : ${input.jenjang} Kelas ${input.kelas}
- Fase           : ${input.fase}
- Topik/Materi   : ${input.topik}
- Tujuan         : ${input.tujuan}
- Model          : ${input.model}
- Alokasi        : ${input.pertemuan} pertemuan × ${input.menit} menit
${input.cp ? `- CP: ${input.cp}` : ""}

OUTPUT: HTML mentah langsung. Gunakan PERSIS struktur class dan tag berikut:

<table class="header-box"><tr><td>
<p class="header-label">MODUL AJAR</p>
<p class="header-mapel">${input.mapel.toUpperCase()}</p>
<p class="header-topik">${input.topik.toUpperCase()}</p>
<p class="header-subtitle">[isi: deskripsi singkat 1 kalimat kontekstual tentang topik]</p>
</td></tr></table>

<table class="summary-table"><tr>
<td class="summary-cell"><p class="summary-label">🏫 Fase / Kelas</p><p class="summary-value">${input.fase} / Kelas ${input.kelas}</p></td>
<td class="summary-cell"><p class="summary-label">⏱ Alokasi Waktu</p><p class="summary-value">${input.pertemuan} Pertemuan &times; ${input.menit} Menit</p></td>
<td class="summary-cell"><p class="summary-label">📚 Mata Pelajaran</p><p class="summary-value">${input.mapel}</p></td>
</tr></table>

<h2 class="section-header">A.  INFORMASI UMUM</h2>

<h3 class="subsection-title">1. Identitas Modul</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Nama Penyusun</td><td>[Nama Guru]</td></tr>
<tr><td class="label-cell">Satuan Pendidikan</td><td>[Nama Sekolah]</td></tr>
<tr><td class="label-cell">Mata Pelajaran</td><td>${input.mapel}</td></tr>
<tr><td class="label-cell">Fase / Kelas</td><td>${input.fase} / Kelas ${input.kelas} ${input.jenjang}</td></tr>
<tr><td class="label-cell">Topik</td><td>${input.topik}</td></tr>
<tr><td class="label-cell">Alokasi Waktu</td><td>${input.pertemuan} Pertemuan &times; ${input.menit} Menit</td></tr>
<tr><td class="label-cell">Semester / T.A.</td><td>Semester 1 (Ganjil) / 2024-2025</td></tr>
</tbody></table>

<h3 class="subsection-title">2. Capaian Pembelajaran (CP) ${input.fase}</h3>
<p>[isi: teks CP resmi sesuai fase dan mata pelajaran, 2-3 kalimat spesifik]</p>

<h3 class="subsection-title">3. Tujuan Pembelajaran</h3>
<p>${input.tujuan}</p>

<h3 class="subsection-title">4. Profil Pelajar Pancasila</h3>
<table class="data-table"><tbody>
[isi: 3 baris — masing-masing <tr><td class="label-cell">[Dimensi PPP]</td><td>[Implementasi konkret dalam pembelajaran ini]</td></tr>]
</tbody></table>

<h3 class="subsection-title">5. Sarana &amp; Prasarana</h3>
<ul>[isi: 4-6 item alat/bahan spesifik sebagai <li> terpisah]</ul>

<h3 class="subsection-title">6. Target Peserta Didik</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Siswa Reguler</td><td>[deskripsi alur pembelajaran standar]</td></tr>
<tr><td class="label-cell">Siswa Kesulitan Belajar</td><td>[deskripsi diferensiasi/scaffolding]</td></tr>
<tr><td class="label-cell">Siswa Cepat (Advanced)</td><td>[deskripsi pengayaan/tantangan tambahan]</td></tr>
</tbody></table>

<h3 class="subsection-title">7. Model &amp; Metode Pembelajaran</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Model Pembelajaran</td><td>${input.model}</td></tr>
<tr><td class="label-cell">Metode</td><td>[isi: 3-4 metode konkret sesuai model]</td></tr>
<tr><td class="label-cell">Pendekatan</td><td>[isi: pendekatan pembelajaran, mis. Saintifik / TPACK / dll]</td></tr>
</tbody></table>

<h2 class="section-header">B.  KOMPONEN INTI</h2>

<h3 class="subsection-title">1. Pemahaman Bermakna</h3>
<p>[isi: pernyataan pemahaman bermakna utama, 2 kalimat]</p>
<ul>[isi: 3 poin pemahaman konkret yang diharapkan bertahan setelah pembelajaran]</ul>

<h3 class="subsection-title">2. Pertanyaan Pemantik</h3>
<ul>
[isi: 3 pertanyaan pemantik open-ended yang memicu rasa ingin tahu, format: <li>❓ [pertanyaan]</li>]
</ul>

<h3 class="subsection-title">3. Kegiatan Pembelajaran</h3>

[Buat SEMUA ${input.pertemuan} pertemuan. Untuk setiap pertemuan gunakan PERSIS format berikut:]
<h4 class="meeting-header">PERTEMUAN [N]  —  [Judul Singkat Topik Pertemuan] (${input.menit} Menit)</h4>
<p class="meeting-goal"><strong>Tujuan Pertemuan:</strong> [tujuan spesifik dan terukur untuk pertemuan ini]</p>
<table class="activity-table">
<thead><tr><th>FASE</th><th>WAKTU</th><th>DESKRIPSI KEGIATAN</th></tr></thead>
<tbody>
<tr><td class="phase-cell">Pembuka<br/>(Apersepsi)</td><td class="time-cell">${mntPendahuluan} menit</td><td>[isi: kegiatan pembuka detail — apersepsi, motivasi, penyampaian tujuan]</td></tr>
<tr><td class="phase-cell">Inti<br/>(Eksplorasi)</td><td class="time-cell">${mntInti} menit</td><td>[isi: kegiatan inti detail sesuai model ${input.model} — langkah-langkah, aktivitas siswa, bahan]</td></tr>
<tr><td class="phase-cell">Penutup<br/>(Afirmasi)</td><td class="time-cell">${mntPenutup} menit</td><td>[isi: kegiatan penutup — simpulan, asesmen formatif, refleksi singkat]</td></tr>
</tbody></table>
<p class="assessment-note"><strong>Asesmen Formatif Pertemuan [N]:</strong> [deskripsi instrumen asesmen spesifik]</p>

<h3 class="subsection-title">4. Asesmen</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Asesmen Diagnostik</td><td>[deskripsi asesmen awal untuk mengetahui prior knowledge]</td></tr>
<tr><td class="label-cell">Asesmen Formatif</td><td>[deskripsi per pertemuan: observasi, exit ticket, kuis lisan, dll.]</td></tr>
<tr><td class="label-cell">Asesmen Sumatif</td><td>[deskripsi tes/proyek akhir — bentuk, cakupan, bobot]</td></tr>
</tbody></table>

<h3 class="subsection-title">5. Pengayaan &amp; Remedial</h3>
<table class="data-table"><tbody>
<tr><td class="label-cell">Pengayaan</td><td>[deskripsi kegiatan tambahan untuk siswa yang telah mencapai tujuan]</td></tr>
<tr><td class="label-cell">Remedial</td><td>[deskripsi kegiatan perbaikan untuk siswa yang belum mencapai tujuan]</td></tr>
</tbody></table>

<h3 class="subsection-title">6. Refleksi</h3>
<p><strong>Refleksi Guru:</strong></p>
<ul>[isi: 3 pertanyaan refleksi untuk evaluasi praktik mengajar guru]</ul>
<p><strong>Refleksi Peserta Didik:</strong></p>
<ul>[isi: 3 pertanyaan refleksi sederhana untuk siswa]</ul>

ATURAN WAJIB:
1. Output HANYA HTML mentah — TIDAK ada <style>, TIDAK ada markdown, TIDAK ada komentar HTML (<!-- -->)
2. Ganti semua teks [dalam kurung kotak] dengan konten NYATA yang spesifik, kontekstual, dan siap dilaksanakan
3. JANGAN ubah nama class — header-box, header-label, header-mapel, header-topik, header-subtitle, summary-table, summary-cell, summary-label, summary-value, section-header, subsection-title, data-table, label-cell, activity-table, phase-cell, time-cell, meeting-header, meeting-goal, assessment-note
4. Buat SEMUA ${input.pertemuan} pertemuan dengan konten berbeda dan lengkap
5. Bahasa Indonesia baku, spesifik, kontekstual`;
}

function getActiveProvider(): LLMProvider {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error(
    "No LLM API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY.",
  );
}

const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
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
          "Kamu adalah ahli kurikulum dan pengembang modul ajar Indonesia.",
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      lastError = err;
      const is429 = err instanceof Error && err.message.includes("429");
      if (!is429) throw err;
      console.warn(`[ai] ${modelName} quota exceeded, trying next model...`);
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
          "Kamu adalah ahli kurikulum dan pengembang modul ajar Indonesia.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
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
