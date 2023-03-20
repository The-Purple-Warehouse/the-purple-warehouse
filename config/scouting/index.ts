import scouting2023 from "./2023";

const scoutingConfig: any = {
    "2023": scouting2023
};

let year = new Date().toLocaleDateString().split("/")[2];
scoutingConfig.categories = scoutingConfig[year].categories;
scoutingConfig.layout = scoutingConfig[year].layout;
scoutingConfig.preload = scoutingConfig[year].preload;
scoutingConfig.formatData = scoutingConfig[year].formatData;
scoutingConfig.notes = scoutingConfig[year].notes;
scoutingConfig.analysis = scoutingConfig[year].analysis;
scoutingConfig.accuracy = scoutingConfig[year].accuracy;

export default scoutingConfig;