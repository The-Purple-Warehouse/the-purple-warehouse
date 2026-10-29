import { any } from "joi";
import { getAllDataByEvent } from "../../../helpers/scouting";

const sum = (numbers: number[]) =>
    numbers.reduce((total, aNumber) => total + aNumber, 0);
const avg = (numbers: number[]) => sum(numbers) / numbers.length;
const std = (arr) => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr
            .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0) / arr.length
    );
};
const min = (arr: number[]) => {
    let m = arr[0];
    for (let i=0; i<arr.length; i++) {
        if (m > arr[i]) m = arr[i]
    }
    return m;
}

const max = (arr: number[]) => {
    let m = arr[0];
    for (let i=0; i<arr.length; i++) {
        if (m < arr[i]) m = arr[i]
    }
    return m;
}

interface teamData {
    [key: string]: any[];
}

export interface parsedRow {
    match: number;
    team: string;
    alliance: string;
    leave: boolean;
    "fuel ground intake": boolean;
    "outpost intake": boolean;
    "passing from neutral zone": boolean;
    "traverse under trench": boolean;
    "traverse over bump": boolean;
    "l1 climb": boolean;
    "auto fuel scoring": string;
    "teleop fuel scoring": string;
    "climb level": number;
    "climb time": number;
    "brick time": number;
    "defense time": number;
    "driver skill": number;
    "defense skill": number;
    speed: number;
    stability: number;
    "intake consistency": number;
    "balls per second": number;
    scouter: string;
    comments: string;
    accuracy: number | "";
    timestamp: number;
}

interface chartConfig {
    type: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[] | number[][];
            backgroundColor?: string | string[];
            borderColor?: string | string[];
            borderWidth?: number;
        }[];
    };
    options: {
        plugins?: {
            title?: {
                display: boolean;
                text: string;
                font?: {
                    size?: number;
                    family?: string;
                }
            };
            legend?: {
                display: boolean;
                position: string;
                labels?: {
                    font: {
                        size: number;
                        family?: string;
                    };
                };
            };
            tooltip?: {
                bodyFont?: {
                    size: number;
                    family?: string;
                };
                titleFont?: {
                    size: number;
                    family?: string;
                };
            };
        };
        aspectRatio?: number;
        onResize?: (chart: any, size: any) => void;
        responsive: boolean;
        maintainAspectRatio?: boolean;
        scales?: {
            x?: {
                title: {
                    display: boolean;
                    text: string;
                };
                type?: string;
                ticks?: {
                    display?: boolean;
                    stepSize?: number;
                    min?: number;
                    maxTicksLimit?: number;
                    precision?: number;
                }
            };
            y?: {
                title: {
                    display: boolean;
                    text: string;
                };
                ticks?: {
                    stepSize?: number;
                    min?: number;
                    maxTicksLimit?: number;
                    precision?: number;
                };
                min?: number;
                max?: number;
                suggestedMin?: number;
                suggestedMax?: number;
                beginAtZero: boolean;
            };
            r?: {
                beginAtZero: boolean;
                max?: number;
            };
        };
    };
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
        "avg-climb": number;
        "avg-def": number;
        "avg-driv": number;
        "avg-speed": number;
        "avg-stab": number;
        "avg-inta": number;
        "avg-upt": number;
        matches: any;
        "tpw-std": number;
        "tpw-score": number;
    };
}

interface shotSummary {
    Match: string;
    AutoScored: number;
    TeleopScored: number;
    TeleopPassed: number;
    TotalFuel: number;
}

function getBest(parsed_data: parsedTPWData): number[] {
    let auto = 0;
    let tele = 0;
    let total = 0;
    let drive = 0;
    let defe = 0;
    let stab = 0;
    let upt = 0;
    let speed = 0;
    let inta = 0;
    for (const team in parsed_data) {
        const stats = parsed_data[team];
        if (stats["avg-auto"] > auto) auto = stats["avg-auto"];
        if (stats["avg-tele"] > tele) tele = stats["avg-tele"];
        if (stats["tpw-score"] > total) total = stats["tpw-score"];
        if (stats["avg-driv"] > drive) drive = stats["avg-driv"];
        if (stats["avg-def"] > defe) defe = stats["avg-def"];
        if (stats["avg-stab"] > stab) stab = stats["avg-stab"];
        if (stats["avg-upt"] > upt) upt = stats["avg-upt"];
        if (stats["avg-speed"] > speed) speed = stats["avg-speed"];
        if (stats["avg-inta"] > inta) inta = stats["avg-inta"];
    }
    return [auto, tele, total, drive, defe, stab, upt, speed, inta];
}

function parseFormatted(format: string): parsedRow[] {
    const parseArr = (value: string): string[] => {
        return value.replace(/\[|\]/g, "").split(/,\s*/).filter(Boolean);
    };
    const simplify = (row: string): string[] => {
        const vals: string[] = [];
        let current = "",
            iq = false;
        for (let i = 0; i < row.length; ++i) {
            const char = row[i],
                n = row[i + 1];
            if (char === '"' && iq && n === '"') (current += '"'), i++;
            else if (char === '"') iq = !iq;
            else if (char === "," && !iq)
                vals.push(current.trim()), (current = "");
            else current += char;
        }
        return current ? [...vals, current.trim()] : vals;
    };

    const rows = format.split("\n").slice(1);
    return rows.map((row, i) => {
        const columns = simplify(row);
        return {
            entry: i,
            match: parseInt(columns[1], 10),
            team: columns[2],
            alliance: columns[3],
            leave: columns[4] === "true",
            "fuel ground intake": columns[5] === "true",
            "outpost intake": columns[6] === "true",
            "passing from neutral zone": columns[7] === "true",
            "traverse under trench": columns[8] === "true",
            "traverse over bump": columns[9] === "true",
            "l1 climb": columns[10] === "true",
            "auto fuel scoring": columns[11],
            "teleop fuel scoring": columns[12],
            "climb level": parseInt(columns[13], 10),
            "climb time": parseInt(columns[14], 10),
            "brick time": parseInt(columns[15], 10),
            "defense time": parseInt(columns[16], 10),
            "driver skill": parseInt(columns[17], 10),
            "defense skill": parseInt(columns[18], 10),
            speed: parseInt(columns[19], 10),
            stability: parseInt(columns[20], 10),
            "intake consistency": parseInt(columns[21], 10),
            "balls per second": parseInt(columns[22], 10),
            scouter: columns[23]?.replace(/^"|"$/g, ""),
            comments: columns[24]?.replace(/^"|"$/g, ""),
            accuracy: columns[25] ? parseFloat(columns[25]) : "",
            timestamp: parseInt(columns[26], 10)
        };
    });
}

function getData(data : parsedRow[]): parsedTPWData {
    let team_data: teamData = {};
    if (!data) {
        throw new Error("No data given to getData()");
    }
    for (let x of data) {
        if (team_data[x["team"]] == null) {
            team_data[x["team"]] = [x];
        } else {
            team_data[x["team"]].push(x);
        }
    }
    let parsed_tpw_data: parsedTPWData = {};
    for (let team in team_data) {
        let afgps = [];
        let tfgps = [];
        let afgpts = {};
        let tfgpts = {};
        let l1climbs = [];
        let egcpts = [];
        let defe = [];
        let speed = [];
        let driver = [];
        let stab = [];
        let inta = [];
        let uptime = [];
        let avg_auto_points = [];
        let avg_tele_points = [];
        let matches = {};
        for (let x of team_data[team]) {
            let auto_fuel_pieces = x["auto fuel scoring"]?.slice(1, x["auto fuel scoring"].length - 1)
                .split(", ");
            let tele_fuel_pieces = x["teleop fuel scoring"]?.slice(1, x["teleop fuel scoring"].length - 1)
                .split(", ");
            let game_pieces = auto_fuel_pieces?.concat(tele_fuel_pieces);
            afgps.push(auto_fuel_pieces);
            tfgps.push(tele_fuel_pieces);
            l1climbs.push(x["l1 climb"] === true || x["l1 climb"] === "true");
            let climb_lev = x["climb level"] ? parseInt(x["climb level"]) : 0;
            if (climb_lev == 0) {
                egcpts.push(0);
            } else if (climb_lev == 1) {
                egcpts.push(10);
            } else if (climb_lev == 2) {
                egcpts.push(20);
            } else if (climb_lev >= 3) {
                egcpts.push(30);
            }

            try {
                defe.push(parseInt(x["defense skill"]));
                speed.push(parseInt(x["speed"]));
                stab.push(parseInt(x["stability"]));
                inta.push(parseInt(x["intake consistency"]));
                driver.push(parseInt(x["driver skill"]));
                uptime.push(153000 - parseInt(x["brick time"]));
            } catch {
                defe.push(3);
                speed.push(3);
                stab.push(3);
                inta.push(3);
                driver.push(3);
                uptime.push(100);
            }

            try {
                matches[x["match"]][x[""]] = {
                    auto: auto_fuel_pieces,
                    teleop: tele_fuel_pieces,
                };
            } catch {
                matches[x["match"]] = {
                    [x[""]]: {
                        auto: auto_fuel_pieces,
                        teleop: tele_fuel_pieces,
                    }
                };
            }
        }
        for (let i = 0; i < afgps.length; ++i) {
            for (let j = 0; j < afgps[i]?.length; ++j) {
                let val = afgps[i][j];
                if (val == "fsa") {
                    afgpts[i] = (afgpts[i] || 0) + 1;
                } else {
                    afgpts[i] = (afgpts[i] || 0) + 0;
                }
            }
            if (l1climbs[i]) {
                afgpts[i] = (afgpts[i] || 0) + 15;
            }
            avg_auto_points.push(afgpts[i]);
        }
        for (let i = 0; i < tfgps.length; ++i) {
            for (let j = 0; j < tfgps[i]?.length; ++j) {
                let val = tfgps[i][j];
                if (val == "fsa") {
                    tfgpts[i] = (tfgpts[i] || 0) + 1;
                } else if (val == "fp") {
                    tfgpts[i] = (tfgpts[i] || 0) + 0;
                } else {
                    tfgpts[i] = (tfgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tfgpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-climb": avg(egcpts),
            "avg-def": avg(defe),
            "avg-driv": avg(driver),
            "avg-speed": avg(speed),
            "avg-stab": avg(stab),
            "avg-inta": avg(inta),
            "avg-upt": avg(uptime),
            matches: matches,
            "tpw-std":
                std(avg_auto_points) + std(avg_tele_points) + std(egcpts),
            "tpw-score": 0
        };
        data_tpw["tpw-score"] =
            data_tpw["avg-auto"] + data_tpw["avg-tele"] + data_tpw["avg-climb"];
        parsed_tpw_data[team] = data_tpw;
    }
    return parsed_tpw_data;
}

function shotSummary(parsed_data: parsedTPWData, team: string): shotSummary[] {
    const data = parsed_data[team];
    const gamePieces: shotSummary[] = [];

    if (!data || !data.matches) {
        return [{
            Match: "",
            AutoScored: 0,
            TeleopScored: 0,
            TeleopPassed: 0,
            TotalFuel: 0
        }];
        //throw new Error(`No data found for team: ${team}`);
    }

    for (const match in data.matches) {
        const autoScoredArr: number[] = [];
        const teleScoredArr: number[] = [];
        const telePassedArr: number[] = [];
        for (const x in data.matches[match]) {
            const entry = data.matches[match][x];
            let aScored = 0;
            for (const e of entry.auto) {
                if (e == "fsa") {
                    aScored += 1;
                }
            }
            let tScored = 0;
            let tPassed = 0;
            for (const e of entry.teleop) {
                if (e == "fsa") {
                    tScored += 1;
                } else if (e == "fp") {
                    tPassed += 1;
                }
            }
            autoScoredArr.push(aScored);
            teleScoredArr.push(tScored);
            telePassedArr.push(tPassed);
        }
        const autoAvg = avg(autoScoredArr);
        const teleAvg = avg(teleScoredArr);
        const passAvg = avg(telePassedArr);
        const total = autoAvg + teleAvg + passAvg;
        gamePieces.push({
            Match: match,
            AutoScored: autoAvg,
            TeleopScored: teleAvg,
            TeleopPassed: passAvg,
            TotalFuel: total
        });
    }
    return gamePieces;
}

function getBrickedTimeData(data : parsedRow[], team: string) {
    const teamMatches = data.filter((row) => row.team==team)
    const matchEntries = {};
    teamMatches.forEach((m) => {
        if (!(matchEntries.hasOwnProperty(m.match))) {
            matchEntries[`${m.match}`] = [m];
        }
        else {
            matchEntries[`${m.match}`].push(m)
        }
    })
    const bricked = [];
    for (const m in matchEntries) {
        let sum = 0;
        matchEntries[m].forEach((e) => {sum += e["brick time"] / 1000});
        bricked.push(sum / (matchEntries[m].length));
    }
    return bricked;
}

function hasClimb(data: parsedRow[], team: string) {
    const teamMatches = data.filter((row) => row.team==team)
    const matchEntries = {};
    teamMatches.forEach((m) => {
        if (!(matchEntries.hasOwnProperty(m.match))) {
            matchEntries[`${m.match}`] = [m];
        }
        else {
            matchEntries[`${m.match}`].push(m)
        }
    })
    for (const m in matchEntries) {
        matchEntries[m].forEach((e) => {
            if (e["avg-climb"] > 0) return true;
        });
    }
    return false;
}

function getBrickedPercentage(data : parsedRow[], team: string) {
    const teamMatches = data.filter((row) => row.team==team)
    const matchEntries = {};
    teamMatches.forEach((m) => {
        if (!(matchEntries.hasOwnProperty(m.match))) {
            matchEntries[`${m.match}`] = [m];
        }
        else {
            matchEntries[`${m.match}`].push(m)
        }
    })
    let bricked = 0, total = 0;
    for (const m in matchEntries) {
        matchEntries[m].forEach((e) => {
            if (e["brick time"] > 0) {bricked++;}
            total++;
        });
    }
    return bricked / total;
}

function getAverageDefenseTime(data : parsedRow[], team: string) {
    const teamMatches = data.filter((row) => row.team==team)
    const matchEntries = {};
    teamMatches.forEach((m) => {
        if (!(matchEntries.hasOwnProperty(m.match))) {
            matchEntries[`${m.match}`] = [m];
        }
        else {
            matchEntries[`${m.match}`].push(m)
        }
    })
    let time = 0, total = 0;
    for (const m in matchEntries) {
        matchEntries[m].forEach((e) => {time += e["defense time"] / 1000});
        total++;
    }
    return time/total;
}

function getDefenseTimeData(data : parsedRow[], team: string) {
    const teamMatches = data.filter((row) => row.team==team)
    const matchEntries = {};
    teamMatches.forEach((m) => {
        if (!(matchEntries.hasOwnProperty(m.match))) {
            matchEntries[`${m.match}`] = [m];
        }
        else {
            matchEntries[`${m.match}`].push(m)
        }
    })
    const defense = [];
    for (const m in matchEntries) {
        let sum = 0;
        matchEntries[m].forEach((e) => {sum += e["defense time"] / 1000});
        defense.push(sum / (matchEntries[m].length));
    }
    return defense;
}

function lineChart(
    datasets: any[], 
    labels: any[], 
    title: string, 
    minimum : number = 0, 
    maximum : number = 1000,
    xaxis = "Match Num",
    yaxis = "Num") : chartConfig {
    
    maximum += Math.max(Math.trunc(maximum/10), 5);
    const fontString = "'Rubik', Times, serif";

    return {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 20, 
                        family: fontString
                    }
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 14,
                            family: fontString
                        }
                    }
                }
            },
            // aspectRatio: 2,
            // maintainAspectRatio: true,
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xaxis
                    },
                    type: "linear",
                    ticks: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yaxis
                    },
                    ticks: {
                        precision: 0
                    },
                    beginAtZero: true,
                    min: 0,
                    max: maximum
                }
            }
        }
    };
}

function barChart(datasets: any[], labels: any[], title: string) : chartConfig {
    return ({
        type: "bar",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    bodyFont: {
                        size: 10
                    },
                    titleFont: {
                        size: 14
                    }
                }
            },
            aspectRatio: 2,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Match Num"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Count"
                    },
                    ticks: {
                        precision: 0
                    },
                    beginAtZero: true
                }
            }
        }
    })
}

function radarChart(datasets:any[], labels: any[], title: string) : chartConfig {
    return {
        type: "radar",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            responsive: false,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    }
}

function getOffenseRankings(parsed_data: parsedTPWData, teamNumber: number) {
    
    let best = getBest(parsed_data);
    const color = () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
    const border = color();
    const background = border.replace("0.5", "0.2");
    let robotData = parsed_data[teamNumber];
    if (!robotData) {
        return [{
            label: `Team ${teamNumber}`,
            data: [0,0,0,0,0,0,0,0],
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2,
            fill: true
        }]
    }
    //auto, tele, total, drive, defe, stab, upt, speed, inta
    let data = [
        robotData['avg-auto'] / best[0],
        robotData['avg-tele'] / best[1],
        robotData['avg-driv'] / best[3],
        robotData['avg-def'] / best[4],
        robotData['avg-stab'] / best[5],
        robotData['avg-upt'] / best[6],
        robotData['avg-speed'] / best[7],
        robotData['avg-inta'] / best[8]
    ]

    return [{
            label: `Team ${teamNumber}`,
            data: data,
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2,
            fill: true
        }];
}

function radarChartData(
    parsed_data: parsedTPWData,
    teams: string[]
): any[] {
    const categories = [
        "auto points",
        "teleop points",
        "climb points",
        "total points"
    ];
    const color = () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
    const border = color();
    const background = border.replace("0.5", "0.2");
    const datasets = teams.map((team) => {
        const t = parsed_data[team];
        if (!t) {
            return {
                label: `Team ${team}`,
                data: [],
                backgroundColor: background,
                borderColor: border,
                borderWidth: 2
            }   
        }
        const tvals = [
            t["avg-auto"],
            t["avg-tele"],
            t["avg-climb"]
        ];
        return {
            label: `Team ${team}`,
            data: tvals,
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2
        };
    });
    return datasets;
}

export function getGraph() {

}

interface graphDataset {
    label: string, 
    backgroundColor: any, 
    borderColor: any, 
    data: any[], 
    borderWidth? : number, 
    fill?: boolean,
    spanGap?: boolean
}

function dataSet(
    label: string, 
    bgColor: any, 
    borderColor: any, 
    data: any[], 
    borderWidth : number = 1, 
    fill: boolean = true
) : graphDataset {
    return {
        label: label,
        data: data,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
        fill: fill,
        spanGap: true
    }
}

export async function analysisNew(event : string, teamNumber : number) {

    // Retrieve all (parsed) data first
    let allScoutingData;
    try {
        allScoutingData = await getAllDataByEvent(event);
    } catch (e) {
        console.log(e);
        return {display: [], data: {}};
    }
    const allParsedData = parseFormatted(allScoutingData);
    const allParsedTPWData = getData(allParsedData);

    const analysisGraphs = [];
    const statGraphs = [];

    // Total fuel, auto fuel, teleop fuel, brick time, defense time
    const shotSummaryData = shotSummary(allParsedTPWData, `${teamNumber}`) || [{}];
    const matches = shotSummaryData.map((x) => x.Match);
    const totalFuelScored = shotSummaryData.map((x) => x.TotalFuel);
    const autoFuelScored = shotSummaryData.map((x) => x.AutoScored);
    const teleopFuelScored = shotSummaryData.map((x) => x.TeleopScored);
    const brickTime = getBrickedTimeData(allParsedData, `${teamNumber}`);
    const brickedPercentage = getBrickedPercentage(allParsedData, `${teamNumber}`);
    const climbs = hasClimb(allParsedData, `${teamNumber}`);
    const defenseTime = getDefenseTimeData(allParsedData, `${teamNumber}`);
    const averageDefenseTime = getAverageDefenseTime(allParsedData, `${teamNumber}`);

    /*
        All of these graphs will still be under category "score". As of now, there isn't really a
        use for categories; might rename to "overall" later
    */
    // Total fuel
    analysisGraphs.push(
        {
            type: "config",
            category: "score",
            label: "Total Fuel Scored",
            graph: lineChart(
                [
                    dataSet(
                        "Total fuel scored", 
                        "rgba(153, 102, 255, 0.2)", 
                        "rgba(153, 102, 255, 1)",
                        totalFuelScored
                    )
                ], 
                matches,
                `Total Fuel Scored for Team ${teamNumber}`,
                min(totalFuelScored),
                max(totalFuelScored)
            )
        }
    );
    // Auto fuel
    // do you hear the flibbity jibbity jibber jabber
    analysisGraphs.push(
        {
            type: "config",
            category: "score",
            label: "Auto Fuel Scored",
            graph: lineChart(
                [
                    dataSet(
                        "Auto fuel scored", 
                        "rgba(102, 125, 255, 0.2)", 
                        "rgb(102, 156, 255)",
                        autoFuelScored
                    )
                ], 
                matches,
                `Auto Fuel Scored for Team ${teamNumber}`,
                min(autoFuelScored),
                max(autoFuelScored)
            )
        }
    );
    // Teleop fuel
    analysisGraphs.push(
        {
            type: "config",
            category: "score",
            label: "Teleop Fuel Scored",
            graph: lineChart(
                [
                    dataSet(
                        "Teleop fuel scored", 
                        "rgba(102, 255, 209, 0.2)", 
                        "rgb(102, 255, 135)",
                        teleopFuelScored
                    )
                ], 
                matches,
                `Teleop Fuel Scored for Team ${teamNumber}`,
                min(teleopFuelScored),
                max(teleopFuelScored)
            )
        }
    );
    // Bricked time
    analysisGraphs.push(
        {
            type: "config",
            category: "score",
            label: "Bricked Time",
            graph: lineChart(
                [
                    dataSet(
                        "Bricked Time", 
                        "rgba(102, 255, 209, 0.2)", 
                        "rgb(102, 255, 135)",
                        brickTime
                    )
                ], 
                matches,
                `Bricked Time for Team ${teamNumber}`,
                min(brickTime),
                max(brickTime),
                "Match Num",
                "Bricked Time (s)"
            )
        }
    );
    // Defense time
    analysisGraphs.push(
        {
            type: "config",
            category: "score",
            label: "Defense Time",
            graph: lineChart(
                [
                    dataSet(
                        "Defense Time", 
                        "rgba(102, 255, 209, 0.2)", 
                        "rgb(102, 255, 135)",
                        defenseTime
                    )
                ], 
                matches,
                `Defense Time for Team ${teamNumber}`,
                min(defenseTime),
                max(defenseTime),
                "Match Num",
                "Defense Time (s)"
            )
        }
    );
    // avg match behavior
    statGraphs.push({
        type: "config",
        category: "score",
        label: "Average Match Behavior",
        graph: radarChart(
                radarChartData(allParsedTPWData, [`${teamNumber}`])
            ,
            ["Auto points", "Teleop Points", "Climb Points"],
            "Average Match Behavior"   
        )
    })
    // overall performance
    statGraphs.push({
        type: "config",
        category: "score",
        label: "Overall Performance",
        graph: radarChart(
                getOffenseRankings(allParsedTPWData, teamNumber)
            ,
            [
                "Auto", 
                "Teleop", 
                "Driving",
                "Defense",
                "Stability",
                "Uptime",
                "Speed",
                "Intake"
            ],
            `Overall Stats for Team ${teamNumber}`   
        )
    })
    // return everything
    // data contains rankings, predictions <-- only important for comparison

    return {
        data: {
            parsed: {
                ...allParsedTPWData[teamNumber],
                "bricked-percent": brickedPercentage,
                "has-climb": climbs,
                "average-defense-time": averageDefenseTime
            }
        },
        display: {
            graphs: analysisGraphs,
            stats: statGraphs
        }
    }

}


interface xy {x: any, y: any}

export async function compareNew(event: string, teamNumbers: number[]) {

    console.log("here");    
    

    const colorPair = () =>
    {
        const c = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        return [
            `rgba(${c[0]}, ${c[1]}, ${c[2]})`,
            `rgba(${Math.max(c[0]-50, 0)}, ${Math.max(c[1]-50, 0)}, ${Math.max(c[2]-50, 0)}, 0.2)`
        ]
    }

    const 
        totalFuelData : graphDataset[] = [],
        autoFuelData : graphDataset[] = [],
        teleopFuelData : graphDataset[] = [],
        brickedTimeData : graphDataset[] = [],
        defenseTimeData : graphDataset[] = [];

    let allScoutingData;
    try {
        allScoutingData = await getAllDataByEvent(event);
    } catch (e) {
        console.log(e);
        return {display: [], data: {}};
    }
    const allParsedData = parseFormatted(allScoutingData);
    const allParsedTPWData = getData(allParsedData);

    let maxAll = 0,
        maxAuto = 0,
        maxTele = 0,
        maxBricked = 0,
        maxDef = 0;

    teamNumbers.forEach(team => {

        const shotData = shotSummary(allParsedTPWData, `${team}`);

        // sort shot data by match #
        shotData.sort((a, b) => {
            if (a.Match > b.Match) return 1;
            return -1;
        })

        const 
            allScored = shotData.map(x => {
                maxAll = Math.max(maxAll, x.TotalFuel); 
                return {x: parseInt(x.Match), y: x.TotalFuel}}),
            autoScored = shotData.map(x => {
                maxAuto = Math.max(maxAuto, x.AutoScored);
                return {x: parseInt(x.Match), y: x.AutoScored}}),
            teleopScored = shotData.map(x => {
                maxTele = Math.max(maxTele, x.TeleopScored)
                return {x: parseInt(x.Match), y: x.TeleopScored}}),
            bricked = getBrickedTimeData(allParsedData, `${team}`),
            defense = getDefenseTimeData(allParsedData, `${team}`);
        const teamColor = colorPair();
        const brickedTime : xy[] = [], defenseTime : xy[] = [];
        
        allScored.forEach((m, i) => {
            // Only match # is required, assign this to bricked/defense time :)
            maxBricked = Math.max(maxBricked, bricked[i]);
            maxDef = Math.max(maxDef, defense[i]);
            brickedTime.push({x: m.x, y: bricked[i]});
            defenseTime.push({x: m.x, y: defense[i]});
        })

        totalFuelData.push(
            dataSet(
                `Total fuel scored for Team ${team}`, 
                teamColor[1], 
                teamColor[0],
                allScored
            ));
        autoFuelData.push(
            dataSet(
                `Auto fuel scored for Team ${team}`, 
                teamColor[1], 
                teamColor[0],
                autoScored
            )
        );
        teleopFuelData.push(
            dataSet(
                `Teleop fuel scored for Team ${team}`, 
                teamColor[1], 
                teamColor[0],
                teleopScored
            )
        );
        brickedTimeData.push(
            dataSet(
                `Bricked time for Team ${team}`, 
                teamColor[1], 
                teamColor[0],
                brickedTime
            )
        );
        defenseTimeData.push(
            dataSet(
                `Defense time for Team ${team}`, 
                teamColor[1], 
                teamColor[0],
                defenseTime
            )
        );     
    })

    const graphs = [   
            {data: totalFuelData, title: "Total Fuel Scored", max: maxAll}, 
            {data: autoFuelData, title: "Auto Fuel Scored", max: maxAuto}, 
            {data: teleopFuelData, title: "Teleop Fuel Scored", max: maxTele}, 
            {data: brickedTimeData, title: "Bricked Time", max: maxBricked}, 
            {data: defenseTimeData, title: "Defense Time", max: maxDef}
        ].map((group, i) => {
                return {
                    type: "config",
                    category: "score",
                    label: group.title,
                    graph: lineChart(
                        group.data, 
                        [], 
                        group.title,
                        0,
                        group.max
                    )
                } 
        })

    return {
        data: {
            parsed: allParsedTPWData
        },
        display: {
            graphs: graphs
        }
    }
}