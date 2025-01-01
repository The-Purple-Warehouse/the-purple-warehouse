import scouting2023 from "./2023";
import scouting2024 from "./2024";
import config from "../";

const scoutingConfig: any = {
    "2023": scouting2023,
    "2024": scouting2024
};

// let year = new Date().toLocaleDateString().split("/")[2];
let year = config.year;
scoutingConfig.categories = scoutingConfig[year].categories;
scoutingConfig.layout = scoutingConfig[year].layout;
if (year >= 2024)
    scoutingConfig.legacy_layout = scoutingConfig[year].legacy_layout;
scoutingConfig.preload = scoutingConfig[year].preload;
scoutingConfig.formatData = scoutingConfig[year].formatData;
if (scoutingConfig[year].formatParsedData != null) {
    scoutingConfig.formatParsedData = scoutingConfig[year].formatParsedData;
} else {
    scoutingConfig.formatParsedData = scoutingConfig[year].formatData;
}
scoutingConfig.notes = scoutingConfig[year].notes;
scoutingConfig.analysis = scoutingConfig[year].analysis;
scoutingConfig.accuracy = scoutingConfig[year].accuracy;
scoutingConfig.compare = scoutingConfig[year].compare;
scoutingConfig.predict = scoutingConfig[year].predict;

export default scoutingConfig;
