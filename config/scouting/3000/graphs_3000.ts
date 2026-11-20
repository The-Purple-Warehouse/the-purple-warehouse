import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
        "avg-upt": number;
        matches: any;
        "tpw-std": number;
        "tpw-score": number;
    };
}

interface shotSummary {
    Match: string;
    L1: number;
    L2: number;
    L3: number;
    L4: number;
    Missed: number;
    MissedL1: number;
    MissedL2: number;
    MissedL3: number;
    MissedL4: number;
    "Total Shots": number;
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
            };
            legend?: {
                display: boolean;
                position: string;
                labels?: {
                    font: {
                        size: number;
                    };
                };
            };
            tooltip?: {
                bodyFont?: {
                    size: number;
                };
                titleFont?: {
                    size: number;
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
                };
                min?: number;
                max?: number;
                suggestedMin?: number;
                suggestedMax?: number;
                beginAtZero: boolean;
            };
            r?: {
                beginAtZero: boolean;
            };
        };
    };
}

// sum and average taken from https://gist.github.com/dggluz/365527824f9f521055baa3532b1d46e7
const sum = (numbers: number[]) =>
    numbers.reduce((total, aNumber) => total + aNumber, 0);
const avg = (numbers: number[]) => sum(numbers) / numbers.length;

// std taken from https://decipher.dev/30-seconds-of-typescript/docs/standardDeviation/
const std = (arr) => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr
            .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0) / arr.length
    );
};

function getData(data): any {
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
        let agps = [];
        let tgps = [];
        let agpts = {};
        let tgpts = {};
        //let egcpts = [];
        let uptime = [];
        let avg_auto_points = [];
        let avg_tele_points = [];
        let matches = {};
        for (let x of team_data[team]) {
            let auto_pieces = x["auto scoring"]
                .slice(1, x["auto scoring"].length - 1)
                .split(", ");
            console.log(auto_pieces);
            let tele_pieces = x["teleop scoring"]
                .slice(1, x["teleop scoring"].length - 1)
                .split(", ");
            console.log(tele_pieces);
            let game_pieces = auto_pieces.concat(tele_pieces);
            agps.push(auto_pieces);
            tgps.push(tele_pieces);
            try {
                uptime.push(153000 - parseInt(x["brick time"]));
            } catch {
                uptime.push(100);
            }
            try {
                matches[x["match"]][x[""]] = game_pieces;
            } catch {
                matches[x["match"]] = { [x[""]]: game_pieces };
            }
        }
        for (let i = 0; i < agps.length; ++i) {
            for (let j = 0; j < agps[i].length; ++j) {
                let val = agps[i][j];
                if (val == "cs1") {
                    agpts[i] = (agpts[i] || 0) + 8;
                } else if (val == "cs2") {
                    agpts[i] = (agpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    agpts[i] = (agpts[i] || 0) + 8;
                } else if (val == "cs4") {
                    agpts[i] = (agpts[i] || 0) + 12;
                } else {
                    agpts[i] = (agpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(agpts[i]);
        }
        for (let i = 0; i < tgps.length; i++) {
            for (let j = 0; j < tgps[i].length; ++j) {
                let val = tgps[i][j];
                if (val == "cs1") {
                    tgpts[i] = (tgpts[i] || 0) + 8;
                } else if (val == "cs2") {
                    tgpts[i] = (tgpts[i] || 0) + 2;
                } else if (val == "cs3") {
                    tgpts[i] = (tgpts[i] || 0) + 5;
                } else if (val == "cs4") {
                    tgpts[i] = (tgpts[i] || 0) + 10;
                } else {
                    tgpts[i] = (tgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tgpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-upt": avg(uptime),
            matches: matches,
            "tpw-std": std(avg_auto_points) + std(avg_tele_points),
            "tpw-score": 0
        };
        data_tpw["tpw-score"] = data_tpw["avg-auto"] + data_tpw["avg-tele"];
        parsed_tpw_data[team] = data_tpw;
    }
    return parsed_tpw_data;
}

function shotSummary(parsed_data: parsedTPWData, team: string): shotSummary[] {
    const data = parsed_data[team];
    const gamePieces: shotSummary[] = [];

    if (!data || !data.matches) {
        throw new Error(`No data found for team: ${team}`);
    }

    for (const match in data.matches) {
        const level1: number[] = [];
        const level2: number[] = [];
        const level3: number[] = [];
        const level4: number[] = [];
        const missed: number[] = [];
        const missedl1: number[] = [];
        const missedl2: number[] = [];
        const missedl3: number[] = [];
        const missedl4: number[] = [];
        for (const x in data.matches[match]) {
            let l1 = 0,
                l2 = 0,
                l3 = 0,
                l4 = 0,
                mi = 0,
                l1miss = 0,
                l2miss = 0,
                l3miss = 0,
                l4miss = 0;
            for (const e of data.matches[match][x]) {
                console.log(e);
                switch (e) {
                    case "fs":
                        console.log("1");
                        l1 += 1;
                        break;
                    case "cs2":
                        l2 += 1;
                        break;
                    case "cs3":
                        l3 += 1;
                        break;
                    case "cs4":
                        console.log("2");
                        l4 += 1;
                        break;
                    case "cm1":
                        l1miss += 1;
                        mi += 1;
                        break;
                    case "cm2":
                        l2miss += 1;
                        mi += 1;
                        break;
                    case "cm3":
                        l3miss += 1;
                        mi += 1;
                        break;
                    case "cm4":
                        l4miss += 1;
                        mi += 1;
                        break;
                }
            }
            level1.push(l1);
            level2.push(l2);
            level3.push(l3);
            level4.push(l4);
            missed.push(mi);
            missedl1.push(l1miss);
            missedl2.push(l2miss);
            missedl3.push(l3miss);
            missedl4.push(l4miss);
        }
        const l1avg = avg(level1);
        const l2avg = avg(level2);
        const l3avg = avg(level3);
        const l4avg = avg(level4);
        const mavg = avg(missed);
        const ml1avg = avg(missedl1);
        const ml2avg = avg(missedl2);
        const ml3avg = avg(missedl3);
        const ml4avg = avg(missedl4);
        const total = l1avg + l2avg + l3avg + l4avg + mavg;
        gamePieces.push({
            Match: match,
            L1: l1avg,
            L2: l2avg,
            L3: l3avg,
            L4: l4avg,
            Missed: mavg,
            MissedL1: ml1avg,
            MissedL2: ml2avg,
            MissedL3: ml3avg,
            MissedL4: ml4avg,
            "Total Shots": total
        });
    }
    return gamePieces;
}

function radarChartSpread(
    parsed_data: parsedTPWData,
    teams: string[]
): chartConfig {
    const categories = ["auto points", "teleop points", "total points"];
    const datasets = teams.map((team) => {
        const t = parsed_data[team];
        if (!t) {
            throw new Error(`No data found for team: ${team}`);
        }
        const tvals = [t["avg-auto"], t["avg-tele"], t["tpw-score"]];
        const color = () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
        const border = color();
        const background = border.replace("0.5", "0.2");
        return {
            label: `Team ${team}`,
            data: tvals,
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2
        };
    });
    return {
        type: "radar",
        data: {
            labels: categories,
            datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Average Point Spread"
                }
            },
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    };
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
        if (stats["avg-upt"] > upt) upt = stats["avg-upt"];
    }
    return [auto, tele, total, drive, defe, stab, upt, speed, inta];
}

function radarChartCTB(parsed_data: parsedTPWData, teams: string[]): any {
    const categories = ["auto pts", "teleop pts", "total pts", "uptime"];
    let maxes = getBest(parsed_data).map((value) =>
        value === 0 ? 1e-9 : value
    );
    const datasets = teams.map((team) => {
        const t = parsed_data[team];
        if (!t) {
            throw new Error(`No data found for team: ${team}`);
        }
        const s_team = [
            t["avg-auto"] / maxes[0],
            t["avg-tele"] / maxes[1],
            t["tpw-score"] / maxes[2],
            t["avg-upt"] / maxes[3]
        ];
        const color = () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
        const border = color();
        const background = border.replace("0.5", "0.2");

        return {
            label: `Team ${team}`,
            data: s_team,
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2
        };
    });
    const avgspread = Array(categories.length).fill(1);
    datasets.push({
        label: "Best Achieved",
        data: avgspread,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(0, 0, 0, 0.7)",
        borderWidth: 2
    });
    return {
        type: "radar",
        data: {
            labels: categories,
            datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Stats Percent of Best"
                }
            },
            responsive: true,
            scales: {
                r: {
                    max: 1
                }
            }
        }
    };
}

function overTimeChart(parsed_data: parsedTPWData, team: string): chartConfig {
    const dataS = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);
    const datasets = [
        {
            label: "Ground",
            data: dataS.map((x) => x.L1),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Stack",
            data: dataS.map((x) => x.L2),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Low",
            data: dataS.map((x) => x.L3),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "High",
            data: dataS.map((x) => x.L4),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Missed Shots",
            data: dataS.map(
                (x) => x.MissedL1 + x.MissedL2 + x.MissedL3 + x.MissedL4
            ),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Total Shots",
            data: dataS.map((x) => x["Total Shots"]),
            backgroundColor: "rgba(201, 203, 207, 0.2)",
            borderColor: "rgba(201, 203, 207, 1)",
            borderWidth: 2,
            fill: false
        }
    ];

    return {
        type: "line",
        data: {
            labels,
            datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Scoring Over Time for Team ${team}`
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            aspectRatio: 2,
            maintainAspectRatio: true,
            responsive: true,
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
                        text: "Num"
                    },
                    beginAtZero: true
                }
            }
        }
    };
}

function scoreProportions(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const dataS = shotSummary(parsed_data, team);
    const avgs = {
        Ground: avg(dataS.map((x) => x.L1)),
        Stack: avg(dataS.map((x) => x.L2)),
        Low: avg(dataS.map((x) => x.L3)),
        High: avg(dataS.map((x) => x.L4))
    };
    const labels = Object.keys(avgs);
    const data = Object.values(avgs);
    return {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Scoring",
                    data: data,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Average Scoring Proportion for Team ${team}`
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            responsive: true
        }
    };
}

function shotAccuracy(parsed_data: parsedTPWData, team: string): chartConfig {
    const dataS: shotSummary[] = shotSummary(parsed_data, team);
    const accuracy = (successful: number, missed: number): number => {
        const total = successful + missed;
        return total === 0 ? 0 : (successful / total) * 100;
    };
    const accuracyL1 = dataS.map((x) => accuracy(x.L1, x.MissedL1));
    const accuracyL2 = dataS.map((x) => accuracy(x.L2, x.MissedL2));
    const accuracyL3 = dataS.map((x) => accuracy(x.L3, x.MissedL3));
    const accuracyL4 = dataS.map((x) => accuracy(x.L4, x.MissedL4));
    return {
        type: "boxplot",
        data: {
            labels: ["L1", "L2", "L3", "L4", "Processor", "Net"],
            datasets: [
                {
                    label: `${team}`,
                    data: [accuracyL1, accuracyL2, accuracyL3, accuracyL4],
                    backgroundColor: "rgba(125, 64, 144, 0.5)",
                    borderColor: "rgb(125, 64, 144)",
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Shot Accuracy Distribution for Team ${team}`
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
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Accuracy %"
                    }
                }
            }
        }
    };
}

export function getGraph(
    mode: number,
    parsed_data: parsedRow[],
    teamS: string | string[]
) {
    const array_modes = [1, 2];
    if (array_modes.includes(mode))
        teamS = typeof teamS == "string" ? [teamS] : teamS;

    const allowed_modes = typeof teamS == "string" ? [0, 3, 4, 5] : [1, 2];
    if (!allowed_modes.includes(mode)) {
        throw new Error(`Invalid mode: ${mode} in getGraph func`);
    }
    const tpw_data = getData(parsed_data);
    if (mode == 1) return radarChartSpread(tpw_data, teamS as string[]);
    if (mode == 2) return radarChartCTB(tpw_data, teamS as string[]);
    if (mode == 3) return overTimeChart(tpw_data, teamS as string);
    if (mode == 4) return scoreProportions(tpw_data, teamS as string);
    if (mode == 5) return shotAccuracy(tpw_data, teamS as string);
}
