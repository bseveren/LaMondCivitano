import { countries} from "../../countries_data";
import {run} from "./find-news-sources.run";

async function generateNewSourcesAllCountries() {
    const maxCount = 25;
    let count = 0;
    for (const countryObj of countries) {
        const country = countryObj.country;
        console.log(`Country: ${country}`);

        await run(country, 5, true);

        count++;
        if (count === maxCount) {
            break;
        }
    }
}

generateNewSourcesAllCountries().then(r => {});