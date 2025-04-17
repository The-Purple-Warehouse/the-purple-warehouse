import scouting2023 from "./2023";
import scouting2024 from "./2024";
import scouting2025 from "./2025";
import config from "../";

const scoutingConfig: any = {
    "2023": scouting2023,
    "2024": scouting2024,
    "2025": scouting2025
};

// let year = new Date().toLocaleDateString().split("/")[2];
let year = config.year;
scoutingConfig.categories = scoutingConfig[year].categories;
scoutingConfig.layout = scoutingConfig[year].layout;
scoutingConfig.preload = scoutingConfig[year].preload;
scoutingConfig.formatData = scoutingConfig[year].formatData;
if (scoutingConfig[year].formatParsedData != null) {
    scoutingConfig.formatParsedData = scoutingConfig[year].formatParsedData;
} else {
    scoutingConfig.formatParsedData = scoutingConfig[year].formatData;
}
if (scoutingConfig[year].formPicklist != null) {
    scoutingConfig.formPicklist = scoutingConfig[year].formPicklist;
} else {
    scoutingConfig.formPicklist = async (data, teams) => {
        return "";
    };
}
scoutingConfig.notes = scoutingConfig[year].notes;
scoutingConfig.analysis = scoutingConfig[year].analysis;
scoutingConfig.accuracy = scoutingConfig[year].accuracy;
scoutingConfig.compare = scoutingConfig[year].compare;
scoutingConfig.predict = scoutingConfig[year].predict;

export default scoutingConfig;
