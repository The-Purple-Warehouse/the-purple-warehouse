import { removeAllCategories, addCategory } from "../helpers/scouting";
import scoutingConfig from "../config/scouting";

async function initializeCategories(year) {
    const categories = scoutingConfig[year].categories();
    for (let i = 0; i < categories.length; i++) {
        let category = await addCategory(categories[i].name, categories[i].identifier, categories[i].dataType) as any;
        console.log(`Added category: ${category.name} (${category.identifier})`);
    }
    return;
}

initializeCategories(2023);
