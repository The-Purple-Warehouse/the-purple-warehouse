import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2024 from "./accuracy";

export function categories() {
    return [];
}

export function layout() {
    return [
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: "COMING SOON"
                },
                {
                    type: "text",
                    label: "We are working to release the new interface for this year's scouting app on the same day as kickoff!"
                },
                {
                    type: "pagebutton",
                    label: "Home",
                    page: -2
                }
            ]
        }
    ];
}

export function preload() {
    return ["/img/star-outline.png", "/img/star-filled.png"];
}

let categoriesInSingular = {
    abilities: "ability",
    data: "data",
    counters: "counter",
    timers: "timer",
    ratings: "rating"
};
function find(entry, type, categories, category, fallback: any = "") {
    let value = entry[type].find((d) => d.category == categories[category]);
    if (value == null) {
        return fallback;
    } else {
        return value[categoriesInSingular[type]];
    }
}

export function formatData(data, categories, teams) {
    return `"coming soon"\n"We are working to release the new data format for this year's scouting app on the same day as kickoff!"`;
}

export function notes() {
    return ``;
}

let cache;

try {
    cache = JSON.parse(fs.readFileSync("../analysiscache.json").toString());
} catch (err) {
    cache = {};
}

function pruneCache() {
    let cacheKeys = Object.keys(cache);
    for (let i = 0; i < cacheKeys.length; i++) {
        if (
            new Date().getTime() >
            cache[cacheKeys[i]].timestamp + 1000 * 60 * 60
        ) {
            delete cache[cacheKeys[i]];
        }
    }
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));
}

pruneCache();

function run(command) {
    return new Promise(async (resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

async function syncAnalysisCache(event, teamNumber) {
    let analyzed = [];
    let data: any = {
        offenseRankings: [],
        predictions: []
    };
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let allScoutingData = await getAllDataByEvent(event);
        let allScoutedTeams = [
            ...new Set(
                allScoutingData
                    .split("\n")
                    .slice(1)
                    .map((entry) => entry.split(",")[2])
            )
        ];
        let pending = [];
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, allScoutingData);
        let allTeams = [
            ...new Set(
                matchesFull
                    .map(
                        (match) =>
                            `${match.alliances.red.team_keys
                                .map((team) => team.replace("frc", ""))
                                .join(",")},${match.alliances.blue.team_keys
                                .map((team) => team.replace("frc", ""))
                                .join(",")}`
                    )
                    .join(",")
                    .split(",")
            )
        ];
        let hasAllTeams = true;
        for (let i = 0; i < allTeams.length && hasAllTeams; i++) {
            hasAllTeams = allScoutedTeams.includes(allTeams[i]);
        }
        let matches = matchesFull
            .filter((match: any) => match.comp_level == "qm")
            .filter(
                (match: any) =>
                    match.alliances.blue.team_keys.includes(
                        `frc${teamNumber}`
                    ) ||
                    match.alliances.red.team_keys.includes(`frc${teamNumber}`)
            )
            .sort((a: any, b: any) => a.match_number - b.match_number);
        let predictions = [];
        data.predictions = predictions;
        let rankingsArr = [];
        let offense = rankingsArr
            .sort((a, b) => b.offenseScore - a.offenseScore)
            .map((ranking) => ranking.teamNumber);
        let defense = rankingsArr
            .sort((a, b) => b.defenseScore - a.defenseScore)
            .map((ranking) => ranking.teamNumber);
        data.offenseRankings = offense;
        // let tableRankings = [["Offense", "Defense"]];
        let tableRankings = [
            ["TPW Calculated Offense Rank<br>(NOT COMPETITION RANK)"]
        ];
        function ending(num) {
            if (num % 100 >= 4 && num % 100 <= 20) {
                return "th";
            } else if (num % 10 == 1) {
                return "st";
            } else if (num % 10 == 2) {
                return "nd";
            } else if (num % 10 == 3) {
                return "rd";
            } else {
                return "th";
            }
        }
        for (let i = 0; i < offense.length; i++) {
            // tableRankings.push([offense[i], defense[i]]);
            tableRankings.push([
                `${i + 1}${ending(i + 1)} - <b>${offense[i]}</b>`
            ]);
        }
        let graphs = "";
        let radarStandard = "";
        let radarMax = "";
        analyzed.push({
            type: "html",
            label: "Coming Soon",
            value: "<h3>2024 analysis is under development!</h3>"
        });
    } catch (err) {
        console.error(err);
    }
    /*cache[`${event}-${teamNumber}`] = {
        value: {
            display: analyzed,
            data: data
        },
        timestamp: new Date().getTime()
    };
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));
    */
    pruneCache();
}

async function syncCompareCache(event, teamNumbers) {
    let comparison = [];
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let pending = [];
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, await getAllDataByEvent(event));
        let radarStandard = "";
        let radarMax = "";
        comparison.push({
            type: "html",
            label: "Coming Soon",
            value: "<h3>2024 analysis is under development!</h3>"
        });
    } catch (err) {
        console.error(err);
    }
    /*cache[`${event}-compare-${teamNumbers.join(",")}`] = {
        value: {
            display: comparison,
            data: {}
        },
        timestamp: new Date().getTime()
    };
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));*/
    pruneCache();
}

async function syncPredictCache(event, redTeamNumbers, blueTeamNumbers) {
    let analyzed = [];
    let data: any = {
        predictions: []
    };
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let pending = [];
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, await getAllDataByEvent(event));

        let predictions = [];
        let r1 = redTeamNumbers[0];
        let r2 = redTeamNumbers[1];
        let r3 = redTeamNumbers[2];
        let b1 = blueTeamNumbers[0];
        let b2 = blueTeamNumbers[1];
        let b3 = blueTeamNumbers[2];

        let prediction = {
            red: 0,
            blue: 0
        };
        if (prediction.red > 0.85) {
            prediction.red = 0.75 + ((prediction.red - 0.85) / 0.15) * 0.1;
            prediction.blue = 1 - prediction.red;
        } else if (prediction.blue > 0.85) {
            prediction.blue = 0.75 + ((prediction.blue - 0.85) / 0.15) * 0.1;
            prediction.red = 1 - prediction.blue;
        }
        predictions.push(prediction);

        data.predictions = predictions;

        analyzed.push({
            type: "html",
            label: "Coming Soon",
            value: "<h3>2024 analysis is under development!</h3>"
        });
    } catch (err) {
        console.error(err);
    }
    /*cache[
        `${event}-predict--${redTeamNumbers.join(",")}-${blueTeamNumbers.join(
            ","
        )}`
    ] = {
        value: {
            display: analyzed,
            data: data
        },
        timestamp: new Date().getTime()
    };
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));*/
    pruneCache();
}

export async function analysis(event, teamNumber) {
    if (cache[`${event}-${teamNumber}`] == null) {
        await syncAnalysisCache(event, teamNumber);
    } else if (
        new Date().getTime() >
        cache[`${event}-${teamNumber}`].timestamp + 150000
    ) {
        syncAnalysisCache(event, teamNumber);
    }
    return cache[`${event}-${teamNumber}`].value;
}

export async function compare(event, teamNumbers) {
    teamNumbers = [...new Set(teamNumbers)].sort((a: string, b: string) =>
        a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    if (cache[`${event}-compare-${teamNumbers.join(",")}`] == null) {
        await syncCompareCache(event, teamNumbers);
    } else if (
        new Date().getTime() >
        cache[`${event}-compare-${teamNumbers.join(",")}`].timestamp + 150000
    ) {
        syncCompareCache(event, teamNumbers);
    }
    return cache[`${event}-compare-${teamNumbers.join(",")}`].value;
}

export async function predict(event, redTeamNumbers, blueTeamNumbers) {
    redTeamNumbers = [...new Set(redTeamNumbers)].sort((a: string, b: string) =>
        a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    blueTeamNumbers = [...new Set(blueTeamNumbers)].sort(
        (a: string, b: string) =>
            a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    if (
        cache[
            `${event}-predict-${redTeamNumbers.join(
                ","
            )}-${blueTeamNumbers.join(",")}`
        ] == null
    ) {
        await syncPredictCache(event, redTeamNumbers, blueTeamNumbers);
    } else if (
        new Date().getTime() >
        cache[
            `${event}-predict-${redTeamNumbers.join(
                ","
            )}-${blueTeamNumbers.join(",")}`
        ].timestamp +
            150000
    ) {
        syncPredictCache(event, redTeamNumbers, blueTeamNumbers);
    }
    return cache[
        `${event}-predict--${redTeamNumbers.join(",")}-${blueTeamNumbers.join(
            ","
        )}`
    ].value;
}

export async function accuracy(event, matches, data, categories, teams) {
    return await accuracy2024(event, matches, data, categories, teams);
}

const scouting2024 = {
    categories,
    layout,
    preload,
    formatData,
    notes,
    analysis,
    compare,
    predict,
    accuracy
};
export default scouting2024;
