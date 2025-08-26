import * as path from "node:path";
import {CallOptions, callStructuredJSON} from "../utils/openAIcall";
import {ArticleListSchema} from "./schema";
import {promises as fs} from "node:fs";

export async function extractArticleTitles(country: string, targetNumArticlesPerUrl: number): Promise<void> {
    const anchorUrlsFilePath = path.join(__dirname, '..', '..', 'out', `news-sources-${country.toLowerCase().replace(/\s+/g, "-")}.json`);
    const newsSources = JSON.parse(await fs.readFile(anchorUrlsFilePath, 'utf-8'));
    const articlesPerNewsSource: Record<string, Array<{title: string, url: string}>> = {};

    let count = 0;
    for (const newsSource of newsSources.sites) {
        const newsSourceShort = {
            'homepage': newsSource.homepage,
            'rss_feeds': newsSource.rss_feeds,
        }
        console.log(`Finding articles for ${JSON.stringify(newsSourceShort, null, 2)} ...`);

        const prompt = `Extract the titles of ${targetNumArticlesPerUrl} articles from the following news source:
        ${JSON.stringify(newsSourceShort, null, 2)}
        If you don't find that many titles, return all found titles. 
        Assign an articleId to each title (1, 2, 3, ...), which helps to kreep track of the number of articles found.`;

        const callOptions: CallOptions<string[]> = {
            model: "gpt-4.1-mini",
            system: "You are a research agent tasked with extracting article titles from news sources.",
            user: prompt,
            jsonSchema: ArticleListSchema,
            useWebSearchTool: true,
        }
        try {
            articlesPerNewsSource[newsSource.homepage] = await callStructuredJSON<Array<{
                title: string,
                url: string
            }>>(callOptions);
        } catch (err) {
            console.error(`Failed for ${newsSource.homepage}:`, err);
        }

        count++;
        // if (count == 2) {
        //     break;
        // }
    }
    const today = new Date().toISOString().split('T')[0];
    const outputDir = path.join(__dirname, '..', '..', 'data', today);
    // Create outputDir if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    const fileName = `titles-${country.toLowerCase().replace(/\s+/g, "-")}.json`;
    const filePath = path.join(outputDir, fileName);
    const content = JSON.stringify(articlesPerNewsSource, null, 2);
    // Write the response to a file
    await fs.writeFile(filePath, content);
}

extractArticleTitles('Belgium', 30).then(() => {});