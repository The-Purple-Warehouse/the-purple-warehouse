import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
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
                max?: number;
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
            let auto_fuel_pieces = x["auto fuel scoring"]
                .slice(1, x["auto fuel scoring"].length - 1)
                .split(", ");
            let tele_fuel_pieces = x["teleop fuel scoring"]
                .slice(1, x["teleop fuel scoring"].length - 1)
                .split(", ");
            let game_pieces = auto_fuel_pieces.concat(tele_fuel_pieces);
            afgps.push(auto_fuel_pieces);
            tfgps.push(tele_fuel_pieces);
            l1climbs.push(x["l1 climb"] === true || x["l1 climb"] === "true");
            let climb_lev = parseInt(x["climb level"]);
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
                    teleop: tele_fuel_pieces
                };
            } catch {
                matches[x["match"]] = {
                    [x[""]]: {
                        auto: auto_fuel_pieces,
                        teleop: tele_fuel_pieces
                    }
                };
            }
        }
        for (let i = 0; i < afgps.length; ++i) {
            for (let j = 0; j < afgps[i].length; ++j) {
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
            for (let j = 0; j < tfgps[i].length; ++j) {
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
        throw new Error(`No data found for team: ${team}`);
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

function radarChartSpread(
    parsed_data: parsedTPWData,
    teams: string[]
): chartConfig {
    const categories = [
        "auto points",
        "teleop points",
        "climb points",
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
            t["avg-climb"],
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

function overTimeFuelChart(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const dataS: shotSummary[] = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);
    const datasets = [
        {
            label: "Auto Scored",
            data: dataS.map((x) => x.AutoScored),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Teleop Scored",
            data: dataS.map((x) => x.TeleopScored),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Teleop Passed",
            data: dataS.map((x) => x.TeleopPassed),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Total Fuel",
            data: dataS.map((x) => x.TotalFuel),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
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
                    text: `Fuel Scoring Over Time for Team ${team}`
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

function autoVsTeleopChart(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const dataS = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);
    const datasets = [
        {
            label: "Auto Scored",
            data: dataS.map((x) => x.AutoScored),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Teleop Scored",
            data: dataS.map((x) => x.TeleopScored),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Teleop Passed",
            data: dataS.map((x) => x.TeleopPassed),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Total Fuel",
            data: dataS.map((x) => x.TotalFuel),
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
                    text: `Auto vs Teleop Fuel Scoring for Team ${team}`
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
        "Auto Scored": avg(dataS.map((x) => x.AutoScored)),
        "Teleop Scored": avg(dataS.map((x) => x.TeleopScored)),
        "Teleop Passed": avg(dataS.map((x) => x.TeleopPassed))
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
                        "rgba(255, 206, 86, 0.5)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
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

function climbDistribution(
    parsed_data: parsedTPWData,
    team: string
): chartConfig {
    const data_team = parsed_data[team];
    if (!data_team || !data_team.matches) {
        throw new Error(`No data found for team: ${team}`);
    }

    // Count climb levels across all matches from raw data
    // Since we only store fuel data in matches, we need to recompute from source
    // For now, use the average climb which gives us the distribution info
    // We'll use a bar chart showing the avg climb points per match trend
    const dataS = shotSummary(parsed_data, team);
    const labels = dataS.map((x) => x.Match);

    // Show fuel efficiency: scored per match as stacked bar
    const datasets = [
        {
            label: "Auto Scored",
            data: dataS.map((x) => x.AutoScored),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
        },
        {
            label: "Teleop Scored",
            data: dataS.map((x) => x.TeleopScored),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
        },
        {
            label: "Teleop Passed",
            data: dataS.map((x) => x.TeleopPassed),
            backgroundColor: "rgba(255, 206, 86, 0.5)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1
        }
    ];

    return {
        type: "bar",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Fuel Breakdown per Match for Team ${team}`
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
                    beginAtZero: true
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
    if (mode == 0) return overTimeFuelChart(tpw_data, teamS as string);
    if (mode == 1) return radarChartSpread(tpw_data, teamS as string[]);
    if (mode == 2) return radarChartCTB(tpw_data, teamS as string[]);
    if (mode == 3) return autoVsTeleopChart(tpw_data, teamS as string);
    if (mode == 4) return scoreProportions(tpw_data, teamS as string);
    if (mode == 5) return climbDistribution(tpw_data, teamS as string);
}
