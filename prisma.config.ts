import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  migrations: {
    seed: "npx tsx prisma/seed-atp.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
