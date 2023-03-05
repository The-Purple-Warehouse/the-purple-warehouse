import { removeAllCategories } from "../helpers/scouting";

removeAllCategories().then(() => {
    console.log("Removed all categories");
});
