import * as fs from "node:fs/promises";
import * as path from "node:path";
import { findNewsSources } from "./find-news-sources.js";
import { access } from 'fs/promises';
import { constants } from 'fs';

async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function run(country: string = "Belgium", count: number = 3, skipIfExists: boolean = true) {
  console.log(`Country: ${country}, Count: ${count}`);

  const outDir = path.join(__dirname, '..', '..', 'out');
  const outFile = path.join(outDir,
    `news-sources-${country.toLowerCase().replace(/\s+/g, "-")}.json`,
  );

    // Skip if outFile already exists
    if (await fileExists(outFile) && skipIfExists) {
        await access(outFile, constants.F_OK);
        console.log('File already exists. Skipping.');
        return;
    }

    const result = await findNewsSources(country, count);


  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(result, null, 2), "utf8");

  console.log(`✅ Wrote ${result.sites.length} sites for ${country} → ${outFile}`);
}