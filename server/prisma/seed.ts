import { prisma } from "../src/utils/prisma";
import fs from "fs";
import path from "path";
import vm from "vm";
import 'dotenv/config';   // <-- enables reading .env or .env.production

async function loadSlangTerms() {
  // Attempt to load from JSON data file first
  const jsonPath = path.resolve(__dirname, "./data/slangTerms.json");
  if (fs.existsSync(jsonPath)) {
    try {
      const jsonRaw = fs.readFileSync(jsonPath, "utf-8");
      const jsonData = JSON.parse(jsonRaw);
      if (Array.isArray(jsonData) && jsonData.length) {
        return jsonData as any[];
      }
    } catch (e) {
      console.warn("⚠️  Failed to parse slangTerms.json, falling back to legacy extraction.");
    }
  }

  // Legacy fallback: extract from old frontend file if present
  const filePath = path.resolve(__dirname, "../../client/src/app/slang/page.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract the slangTerms array using a regex
  const match = content.match(/const\s+slangTerms[^=]*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error("Failed to locate slangTerms array in frontend file");
  }

  // Evaluate the array safely within a VM context to obtain the data
  const sandbox: { slang: any } = { slang: [] };
  vm.createContext(sandbox);
  sandbox.slang = vm.runInContext(match[1], sandbox);

  if (!Array.isArray(sandbox.slang)) {
    throw new Error("Parsed slangTerms is not an array");
  }

  return sandbox.slang as any[];
}

async function main() {
  const slangTerms = await loadSlangTerms();
  // Clear existing data (optional – comment out if you prefer to keep)
  const prismaAny = prisma as any;
  const deleted = await prismaAny.slangTerm.deleteMany();
  console.log(`Cleared existing slang terms (${deleted.count}).`);

  console.log(`Seeding ${slangTerms.length} slang terms...`);

  const createOps = slangTerms.map((t: any) =>
    prismaAny.slangTerm.create({
      data: {
        term: t.term,
        canonical: t.canonical ?? null,
        meaning: t.meaning ?? t.definition ?? "",
        context: t.context ?? null,
        examples: Array.isArray(t.examples) ? t.examples : [],
        type: (t.type ?? "genz") as string,
        youtubeUrl: t.youtubeUrl ?? null,
      },
    })
  );

  await Promise.all(createOps);

  console.log(`✅ All ${slangTerms.length} slang terms seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 