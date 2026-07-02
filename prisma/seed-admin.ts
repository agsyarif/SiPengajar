import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "agsyarif.dev@gmail.com";
const ADMIN_NAME  = process.env.ADMIN_NAME  ?? "Admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", name: ADMIN_NAME },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hash,
      role: "ADMIN",
      plan: "PRO",
    },
  });

  console.log(`✓ Admin user upserted: ${user.email} (role: ${user.role})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
