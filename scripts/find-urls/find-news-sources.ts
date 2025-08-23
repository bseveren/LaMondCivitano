// find-news-sources.ts
import { callStructuredJSON } from "./OpenaiCall";
import { NewsSourceList } from "./types";
import { NewsSourceListSchema } from "./schema";

/**
 * Builds the system+user prompts and calls OpenAI once
 * to produce a schema-conformant NewsSourceList.
 *
 * Returns the JSON object; you can then write it to disk elsewhere.
 */
export async function findNewsSources(country: string, requestedCount: number): Promise<NewsSourceList> {
  if (!country?.trim()) throw new Error("country is required");
  if (!Number.isFinite(requestedCount) || requestedCount < 1) {
    throw new Error("requestedCount must be a positive integer");
  }

  const system = [
    "You are a meticulous research agent tasked with compiling news websites for a given country.",
    "HARD REQUIREMENTS:",
    "• Sites must be non-paywalled for reading articles (no hard or metered paywall).",
    "• Sites must be legally scrapable: check robots.txt for '*' user-agent.",
    "  - If '/' or key news paths are disallowed, mark robots_status='disallowed'.",
    "  - If not explicitly disallowed and general crawling appears OK, 'allowed' or 'likely_allowed'.",
    "  - If unclear or missing robots.txt, mark 'unclear'.",
    "• Prefer sites that are widely read domestically (popularity proxy).",
    "• Exclude pure aggregators, social networks, and sites requiring login.",
    "• Output EXACTLY the requested number of DISTINCT domains where possible.",
    "",
    "METHOD:",
    "Use the web_search tool to (a) discover candidates, (b) open robots.txt,",
    "(c) open one recent article page to confirm free reading, and (d) find RSS if present.",
    "Return a strict JSON object matching the provided schema.",
  ].join("\n");

  const user = [
    `Country: ${country}`,
    `Number of URLs: ${requestedCount}`,
    "Return results in descending 'domestic interest' (your best judgement).",
    "Prefer official homepages; include https scheme.",
  ].join("\n");

  // Call OpenAI with structured output
  const raw = await callStructuredJSON<NewsSourceList>({
    system,
    user,
    jsonSchema: NewsSourceListSchema,
    useWebSearchTool: true,
  });

  // Post-process: dedupe by registrable domain; cap to requestedCount; echo country & count
  const seen = new Set<string>();
  const deduped = [];
  for (const site of raw.sites ?? []) {
    try {
      const u = new URL(site.homepage);
      const domain = u.hostname.replace(/^www\./, "");
      if (!seen.has(domain)) {
        seen.add(domain);
        deduped.push(site);
      }
      if (deduped.length >= requestedCount) break;
    } catch {
      // skip invalid URL
    }
  }

  return {
    country,
    requested_count: requestedCount,
    sites: deduped,
  };
}
