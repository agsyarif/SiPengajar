import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

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

const SUBJECTS = [
  { name: "Matematika", order: 1 },
  { name: "IPA", order: 2 },
  { name: "IPS", order: 3 },
  { name: "Bahasa Indonesia", order: 4 },
  { name: "Bahasa Inggris", order: 5 },
  { name: "PPKn", order: 6 },
  { name: "Seni Budaya", order: 7 },
  { name: "PJOK", order: 8 },
  { name: "Informatika", order: 9 },
  { name: "Prakarya", order: 10 },
  { name: "Fisika", order: 11 },
  { name: "Kimia", order: 12 },
  { name: "Biologi", order: 13 },
  { name: "Ekonomi", order: 14 },
  { name: "Sejarah", order: 15 },
  { name: "Geografi", order: 16 },
  { name: "Sosiologi", order: 17 },
  { name: "Pendidikan Agama", order: 18 },
];

async function main() {
  for (const subject of SUBJECTS) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: { order: subject.order },
      create: { ...subject, active: true },
    });
  }
  console.log(`✓ Seeded ${SUBJECTS.length} subjects`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
