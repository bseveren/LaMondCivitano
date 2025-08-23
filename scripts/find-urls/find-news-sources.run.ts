// find-news-sources.run.ts
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { findNewsSources } from "./find-news-sources.js";

console.log("DEBUG: Starting find-news-sources.run.ts");

async function run() {
  console.log("DEBUG: Starting find-news-sources.run.ts");
  // 🔧 Define your parameters here (no CLI)
  const country = "Belgium";
  const count = 1;

  const result = await findNewsSources(country, count);

  // const outDir = path.resolve("out");
  // const outFile = path.join(
  //   outDir,
  //   `news-sources-${country.toLowerCase().replace(/\s+/g, "-")}.json`,
  // );

  // await fs.mkdir(outDir, { recursive: true });
  // await fs.writeFile(outFile, JSON.stringify(result, null, 2), "utf8");

  // console.log(`✅ Wrote ${result.sites.length} sites for ${country} → ${outFile}`);
}

run();
