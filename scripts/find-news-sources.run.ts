// find-news-sources.run.ts
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { findNewsSources } from "./find-news-sources";

async function run() {
  // 🔧 Define your parameters here (no CLI)
  const country = "Belgium";
  const count = 15;

  const result = await findNewsSources(country, count);

  const outDir = path.resolve("out");
  const outFile = path.join(
    outDir,
    `news-sources-${country.toLowerCase().replace(/\s+/g, "-")}.json`,
  );

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(result, null, 2), "utf8");

  console.log(`✅ Wrote ${result.sites.length} sites for ${country} → ${outFile}`);
}

run().catch((err) => {
  console.error("❌ Error:", err?.message || err);
  process.exit(1);
});
