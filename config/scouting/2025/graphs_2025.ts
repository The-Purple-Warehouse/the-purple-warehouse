import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
        "avg-cage": number;
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
    L1: number;
    L2: number;
    L3: number;
    L4: number;
    Processor: number;
    Net: number;
    Missed: number;
    MissedL1: number;
    MissedL2: number;
    MissedL3: number;
    MissedL4: number;
    MissedProcessor: number;
    MissedNet: number;
    "Total Coral": number;
    "Total Algae": number;
    "Total Shots": number;
}

interface chartConfig {
    type: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string | string[];
            borderColor: string | string[];
            borderWidth: number;
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
        let acgps = [];
        let aagps = [];
        let tcgps = [];
        let tagps = [];
        let acgpts = {};
        let aagpts = {};
        let tcgpts = {};
        let tagpts = {};
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
            let auto_algae_pieces = x["auto algae scoring"]
                .slice(1, x["auto algae scoring"].length - 1)
                .split(", ");
            let auto_coral_pieces = x["auto coral scoring"]
                .slice(1, x["auto coral scoring"].length - 1)
                .split(", ");
            let tele_algae_pieces = x["teleop algae scoring"]
                .slice(1, x["teleop algae scoring"].length - 1)
                .split(", ");
            let tele_coral_pieces = x["teleop coral scoring"]
                .slice(1, x["teleop coral scoring"].length - 1)
                .split(", ");
            let game_algae_pieces = auto_algae_pieces.concat(tele_algae_pieces);
            let game_coral_pieces = auto_coral_pieces.concat(tele_coral_pieces);
            let game_pieces = game_algae_pieces.concat(game_coral_pieces);
            acgps.push(auto_coral_pieces);
            aagps.push(auto_algae_pieces);
            tcgps.push(tele_coral_pieces);
            tagps.push(tele_algae_pieces);
            let cage_lev = parseInt(x["cage level"]);
            if (cage_lev == 0) {
                egcpts.push(0);
            } else if (cage_lev == 1) {
                egcpts.push(2);
            } else if (cage_lev == 2) {
                egcpts.push(6);
            } else if (cage_lev >= 3) {
                egcpts.push(12);
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
                matches[x["match"]][x[""]] = game_pieces;
            } catch {
                matches[x["match"]] = { [x[""]]: game_pieces };
            }
        }
        for (let i = 0; i < acgps.length; ++i) {
            for (let j = 0; j < acgps[i].length; ++j) {
                let val = acgps[i][j];
                if (val == "cs1") {
                    acgpts[i] = (acgpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    acgpts[i] = (acgpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    acgpts[i] = (acgpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    acgpts[i] = (acgpts[i] || 0) + 7;
                } else {
                    acgpts[i] = (acgpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(acgpts[i]);
        }
        for (let i = 0; i < aagps.length; i++) {
            for (let j = 0; j < aagps[i].length; ++j) {
                let val = aagps[i][j];
                if (val == "asn") {
                    aagpts[i] = (aagpts[i] || 0) + 4;
                } else if (val == "asp") {
                    aagpts[i] = (aagpts[i] || 0) + 6;
                } else {
                    aagpts[i] = (aagpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(aagpts[i]);
        }
        for (let i = 0; i < tcgps.length; i++) {
            for (let j = 0; j < tcgps[i].length; ++j) {
                let val = tcgps[i][j];
                if (val == "cs1") {
                    tcgpts[i] = (tcgpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    tcgpts[i] = (tcgpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    tcgpts[i] = (tcgpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    tcgpts[i] = (tcgpts[i] || 0) + 7;
                } else {
                    tcgpts[i] = (tcgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tcgpts[i]);
        }
        for (let i = 0; i < tagps.length; i++) {
            for (let j = 0; j < tagps[i].length; ++j) {
                let val = tagps[i][j];
                if (val == "asn") {
                    tagpts[i] = (tagpts[i] || 0) + 4;
                } else if (val == "asp") {
                    tagpts[i] = (tagpts[i] || 0) + 6;
                } else {
                    tagpts[i] = (tagpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tagpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-cage": avg(egcpts),
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
            data_tpw["avg-auto"] + data_tpw["avg-tele"] + data_tpw["avg-cage"];
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
        const processor: number[] = [];
        const net: number[] = [];
        const missed: number[] = [];
        const missednet: number[] = [];
        const missedprocessor: number[] = [];
        const missedl1: number[] = [];
        const missedl2: number[] = [];
        const missedl3: number[] = [];
        const missedl4: number[] = [];
        for (const x in data.matches[match]) {
            let l1 = 0,
                l2 = 0,
                l3 = 0,
                l4 = 0,
                pr = 0,
                nt = 0,
                mi = 0,
                ntmiss = 0,
                prmiss = 0,
                l1miss = 0,
                l2miss = 0,
                l3miss = 0,
                l4miss = 0;
            for (const e of data.matches[match][x]) {
                switch (e) {
                    case "asn":
                        nt += 1;
                        break;
                    case "asp":
                        pr += 1;
                        break;
                    case "cs1":
                        l1 += 1;
                        break;
                    case "cs2":
                        l2 += 1;
                        break;
                    case "cs3":
                        l3 += 1;
                        break;
                    case "cs4":
                        l4 += 1;
                        break;
                    case "amn":
                        ntmiss += 1;
                        mi += 1;
                        break;
                    case "amp":
                        prmiss += 1;
                        mi += 1;
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
            processor.push(pr);
            net.push(nt);
            missed.push(mi);
            missednet.push(ntmiss);
            missedprocessor.push(prmiss);
            missedl1.push(l1miss);
            missedl2.push(l2miss);
            missedl3.push(l3miss);
            missedl4.push(l4miss);
        }
        const l1avg = avg(level1);
        const l2avg = avg(level2);
        const l3avg = avg(level3);
        const l4avg = avg(level4);
        const pavg = avg(processor);
        const navg = avg(net);
        const mavg = avg(missed);
        const mnetavg = avg(missednet);
        const mpravg = avg(missedprocessor);
        const ml1avg = avg(missedl1);
        const ml2avg = avg(missedl2);
        const ml3avg = avg(missedl3);
        const ml4avg = avg(missedl4);
        const cototal = l1avg + l2avg + l3avg + l4avg + mavg;
        const altotal = pavg + navg + mavg;
        const total = l1avg + l2avg + l3avg + l4avg + pavg + navg + mavg;
        gamePieces.push({
            Match: match,
            L1: l1avg,
            L2: l2avg,
            L3: l3avg,
            L4: l4avg,
            Processor: pavg,
            Net: navg,
            Missed: mavg,
            MissedL1: ml1avg,
            MissedL2: ml2avg,
            MissedL3: ml3avg,
            MissedL4: ml4avg,
            MissedProcessor: mpravg,
            MissedNet: mnetavg,
            "Total Coral": cototal,
            "Total Algae": altotal,
            "Total Shots": total
        });
    }
    return gamePieces;
}

function radarChartSpread(
    parsed_data: parsedTPWData,
    teams: string[]
): chartConfig {
    const categories = [
        "auto points",
        "teleop points",
        "cage points",
        "total points"
    ];
    const datasets = teams.map((team) => {
        const t = parsed_data[team];
        if (!t) {
            throw new Error(`No data found for team: ${team}`);
        }
        const tvals = [
            t["avg-auto"],
            t["avg-tele"],
            t["avg-cage"],
            t["tpw-score"]
        ];
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
        if (stats["avg-driv"] > drive) drive = stats["avg-driv"];
        if (stats["avg-def"] > defe) defe = stats["avg-def"];
        if (stats["avg-stab"] > stab) stab = stats["avg-stab"];
        if (stats["avg-upt"] > upt) upt = stats["avg-upt"];
        if (stats["avg-speed"] > speed) speed = stats["avg-speed"];
        if (stats["avg-inta"] > inta) inta = stats["avg-inta"];
    }
    return [auto, tele, total, drive, defe, stab, upt, speed, inta];
}

function radarChartCTB(parsed_data: parsedTPWData, teams: string[]): any {
    const categories = [
        "auto pts",
        "teleop pts",
        "total pts",
        "drive skill",
        "defense",
        "stability",
        "uptime",
        "speed",
        "intake"
    ];
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
            t["avg-driv"] / maxes[3],
            t["avg-def"] / maxes[4],
            t["avg-stab"] / maxes[5],
            t["avg-upt"] / maxes[6],
            t["avg-speed"] / maxes[7],
            t["avg-inta"] / maxes[8]
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

function overTimeAlgaeChart(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const dataS: shotSummary[] = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);
    const datasets = [
        {
            label: "Processor",
            data: dataS.map((x) => x.Processor),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Net",
            data: dataS.map((x) => x.Net),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Missed Algae",
            data: dataS.map((x) => x.MissedNet + x.MissedProcessor),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Total Algae Shots",
            data: dataS.map((x) => x["Total Algae"]),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
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
                    text: `Algae Scoring Over Time for Team ${team}`
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

function overTimeCoralChart(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const dataS = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);
    const datasets = [
        {
            label: "L1",
            data: dataS.map((x) => x.L1),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "L2",
            data: dataS.map((x) => x.L2),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "L3",
            data: dataS.map((x) => x.L3),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "L4",
            data: dataS.map((x) => x.L4),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Missed Coral",
            data: dataS.map((x) => x.MissedL1 + x.MissedL2 + x.MissedL3 + x.MissedL4),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Total Coral Shots",
            data: dataS.map((x) => x["Total Coral"]),
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
                    text: `Coral Scoring Over Time for Team ${team}`
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
        L1: avg(dataS.map((x) => x.L1)),
        L2: avg(dataS.map((x) => x.L2)),
        L3: avg(dataS.map((x) => x.L3)),
        L4: avg(dataS.map((x) => x.L4)),
        Processor: avg(dataS.map((x) => x.Processor)),
        Net: avg(dataS.map((x) => x.Net))
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
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)",
                        "rgba(255, 159, 64, 0.5)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
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

export function getGraph(
    mode: number,
    parsed_data: parsedRow[],
    teamS: string | string[]
) {
    const array_modes = [1, 2];
    if (array_modes.includes(mode))
        teamS = typeof teamS == "string" ? [teamS] : teamS;

    const allowed_modes = typeof teamS == "string" ? [0, 3, 4] : [1, 2];
    if (!allowed_modes.includes(mode)) {
        throw new Error(`Invalid mode: ${mode} in getGraph func`);
    }
    const tpw_data = getData(parsed_data);
    if (mode == 0) return overTimeAlgaeChart(tpw_data, teamS as string);
    if (mode == 1) return radarChartSpread(tpw_data, teamS as string[]);
    if (mode == 2) return radarChartCTB(tpw_data, teamS as string[]);
    if (mode == 3) return overTimeCoralChart(tpw_data, teamS as string);
    if (mode == 4) return scoreProportions(tpw_data, teamS as string);
}
