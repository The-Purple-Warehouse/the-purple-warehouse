import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2023 from "./accuracy";

export function categories() {
    return [
        { name: "Leaves Community", identifier: "23-0", dataType: "boolean" },
        { name: "Ground Pick-Up", identifier: "23-1", dataType: "boolean" },
        {
            name: "Auto Scoring Locations",
            identifier: "23-2",
            dataType: "array"
        },
        { name: "Auto Game Pieces", identifier: "23-3", dataType: "array" },
        {
            name: "Teleop Scoring Locations",
            identifier: "23-4",
            dataType: "array"
        },
        { name: "Teleop Game Pieces", identifier: "23-5", dataType: "array" },
        { name: "Auto Count", identifier: "23-6" },
        { name: "Teleop Count", identifier: "23-7" },
        { name: "Auto Charge Station Level", identifier: "23-8" },
        { name: "Teleop Charge Station Level", identifier: "23-9" },
        { name: "Teleop Charge Station Time", identifier: "23-10" },
        { name: "Brick Time", identifier: "23-11" },
        { name: "Defense Time", identifier: "23-12" },
        { name: "Drive Skill Rating", identifier: "23-13" },
        { name: "Defense Skill Rating", identifier: "23-14" },
        { name: "Robot Speed Rating", identifier: "23-15" },
        { name: "Robot Stability Rating", identifier: "23-16" },
        { name: "Intake Consistency Rating", identifier: "23-17" }
    ];
}

export function layout() {
    return [
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: {
                        type: "function",
                        definition: ((state) =>
                            `AUTO (${state.teamNumber})`).toString()
                    }
                },
                {
                    type: "checkbox",
                    label: "Leaves Community",
                    default: false,
                    data: "23-0"
                },
                {
                    type: "checkbox",
                    label: "Ground Pick-Up",
                    default: false,
                    data: "23-1"
                },
                {
                    type: "timer",
                    label: "Brick Time",
                    default: 0,
                    data: "23-11",
                    name: "break_time",
                    restricts: ["charge_time", "defense_time"]
                },
                {
                    type: "locations",
                    src: {
                        type: "function",
                        definition: ((state) =>
                            `/img/2023grid-${state.color}.png`).toString()
                    },

                    default: {
                        locations: [],
                        values: [],
                        counter: 0
                    },
                    data: {
                        locations: "23-2",
                        values: "23-3",
                        counter: "23-6"
                    },
                    rows: 9,
                    columns: 3,
                    orientation: 0,
                    marker: {
                        type: "function",
                        definition: ((state) => {
                            return `${state.locations
                                .slice(0, 2)
                                .map((location) => {
                                    if (location.value == "y") {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 22px solid #fff600;"></div>`;
                                    } else if (location.value == "b") {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: 20px; height: 20px; background-color: #9000ff; border: 1px solid #ffffff; border-radius: 3px;"></div>`;
                                    }
                                })
                                .join("")}`;
                        }).toString()
                    },
                    options: [
                        {
                            label: "Cube",
                            value: "b",
                            // type: "toggle"
                            type: "counter",
                            max: 2,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return {
                                        red: [
                                            0, 3, 4, 5, 6, 9, 12, 13, 14, 15,
                                            18, 21, 22, 23, 24
                                        ],
                                        blue: [
                                            2, 3, 4, 5, 8, 11, 12, 13, 14, 17,
                                            20, 21, 22, 23, 26
                                        ],
                                        unknown: [
                                            0, 3, 4, 5, 6, 9, 12, 13, 14, 15,
                                            18, 21, 22, 23, 24
                                        ]
                                    }[state.color].includes(state.index);
                                }).toString()
                            }
                        },
                        {
                            label: "Cone",
                            value: "y",
                            // type: "toggle"
                            type: "counter",
                            max: 2,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return {
                                        red: [
                                            0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12,
                                            15, 16, 17, 18, 19, 20, 21, 24, 25,
                                            26
                                        ],
                                        blue: [
                                            0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 14,
                                            15, 16, 17, 18, 19, 20, 23, 24, 25,
                                            26
                                        ],
                                        unknown: [
                                            0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12,
                                            15, 16, 17, 18, 19, 20, 21, 24, 25,
                                            26
                                        ]
                                    }[state.color].includes(state.index);
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "m",
                            type: "counter"
                        }
                    ]
                },
                {
                    type: "select",
                    label: "Charge Station Level",
                    data: "23-8",
                    default: 0,
                    options: [
                        {
                            label: "None"
                        },
                        {
                            label: "Docked"
                        },
                        {
                            label: "Level"
                        }
                    ]
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Back",
                            page: -1
                        },
                        {
                            type: "pagebutton",
                            label: "Teleop >",
                            page: 1
                        }
                    ]
                },
                {
                    type: "separator",
                    style: "dashed"
                },
                {
                    type: "header",
                    label: "Notes (Optional)"
                },
                {
                    type: "textbox",
                    placeholder:
                        "Enter notes here (and include team number if scouting practice matches)...",
                    default: "",
                    data: "comments"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Back",
                            page: -1
                        },
                        {
                            type: "pagebutton",
                            label: "Teleop >",
                            page: 1
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: {
                        type: "function",
                        definition: ((state) =>
                            `TELEOP (${state.teamNumber})`).toString()
                    }
                },
                {
                    type: "checkbox",
                    label: "Ground Pick-Up",
                    default: false,
                    data: "23-1"
                },
                {
                    type: "timer",
                    label: "Defense Time",
                    default: 0,
                    data: "23-12",
                    name: "defense_time",
                    restricts: ["charge_time", "break_time"]
                },
                {
                    type: "timer",
                    label: "Brick Time",
                    default: 0,
                    data: "23-11",
                    name: "break_time",
                    restricts: ["charge_time", "defense_time"]
                },
                {
                    type: "locations",
                    src: {
                        type: "function",
                        definition: ((state) =>
                            `/img/2023grid-${state.color}.png`).toString()
                    },
                    default: {
                        locations: [],
                        values: [],
                        counter: 0
                    },
                    data: {
                        locations: "23-4",
                        values: "23-5",
                        counter: "23-7"
                    },
                    rows: 9,
                    columns: 3,
                    orientation: 0,
                    marker: {
                        type: "function",
                        definition: ((state) => {
                            return `${state.locations
                                .slice(0, 2)
                                .map((location) => {
                                    if (location.value == "y") {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 22px solid #fff600;"></div>`;
                                    } else if (location.value == "b") {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: 20px; height: 20px; background-color: #9000ff; border: 1px solid #ffffff; border-radius: 3px;"></div>`;
                                    }
                                })
                                .join("")}`;
                        }).toString()
                    },
                    options: [
                        {
                            label: "Cube",
                            value: "b",
                            // type: "toggle"
                            type: "counter",
                            max: 2,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return {
                                        red: [
                                            0, 3, 4, 5, 6, 9, 12, 13, 14, 15,
                                            18, 21, 22, 23, 24
                                        ],
                                        blue: [
                                            2, 3, 4, 5, 8, 11, 12, 13, 14, 17,
                                            20, 21, 22, 23, 26
                                        ],
                                        unknown: [
                                            0, 3, 4, 5, 6, 9, 12, 13, 14, 15,
                                            18, 21, 22, 23, 24
                                        ]
                                    }[state.color].includes(state.index);
                                }).toString()
                            }
                        },
                        {
                            label: "Cone",
                            value: "y",
                            // type: "toggle"
                            type: "counter",
                            max: 2,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return {
                                        red: [
                                            0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12,
                                            15, 16, 17, 18, 19, 20, 21, 24, 25,
                                            26
                                        ],
                                        blue: [
                                            0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 14,
                                            15, 16, 17, 18, 19, 20, 23, 24, 25,
                                            26
                                        ],
                                        unknown: [
                                            0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12,
                                            15, 16, 17, 18, 19, 20, 21, 24, 25,
                                            26
                                        ]
                                    }[state.color].includes(state.index);
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "m",
                            type: "counter"
                        }
                    ]
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Auto",
                            page: 0
                        },
                        {
                            type: "pagebutton",
                            label: "Endgame >",
                            page: 2
                        }
                    ]
                },
                {
                    type: "separator",
                    style: "dashed"
                },
                {
                    type: "header",
                    label: "Notes (Optional)"
                },
                {
                    type: "textbox",
                    placeholder:
                        "Enter notes here (and include team number if scouting practice matches)...",
                    default: "",
                    data: "comments"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Auto",
                            page: 0
                        },
                        {
                            type: "pagebutton",
                            label: "Endgame >",
                            page: 2
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: {
                        type: "function",
                        definition: ((state) =>
                            `ENDGAME (${state.teamNumber})`).toString()
                    }
                },
                {
                    type: "timer",
                    label: "Charge Station Time",
                    default: 0,
                    data: "23-10",
                    name: "charge_time",
                    restricts: ["defense_time", "break_time"]
                },
                {
                    type: "select",
                    label: "Charge Station Level",
                    data: "23-9",
                    default: 0,
                    options: [
                        {
                            label: "None"
                        },
                        {
                            label: "Docked"
                        },
                        {
                            label: "Level"
                        }
                    ]
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Teleop",
                            page: 1
                        },
                        {
                            type: "pagebutton",
                            label: "Notes >",
                            page: 3
                        }
                    ]
                },
                {
                    type: "separator",
                    style: "dashed"
                },
                {
                    type: "header",
                    label: "Notes (Optional)"
                },
                {
                    type: "textbox",
                    placeholder:
                        "Enter notes here (and include team number if scouting practice matches)...",
                    default: "",
                    data: "comments"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Teleop",
                            page: 1
                        },
                        {
                            type: "pagebutton",
                            label: "Notes >",
                            page: 3
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: {
                        type: "function",
                        definition: ((state) =>
                            `NOTES (${state.teamNumber})`).toString()
                    }
                },
                {
                    type: "rating",
                    label: "Drive Skill Rating",
                    default: 0,
                    data: "23-13",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Defense Skill Rating",
                    default: 0,
                    data: "23-14",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Robot Speed Rating",
                    default: 0,
                    data: "23-15",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Robot Stability Rating",
                    default: 0,
                    data: "23-16",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Intake Consistency Rating",
                    default: 0,
                    data: "23-17",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "header",
                    label: "Other Notes"
                },
                {
                    type: "text",
                    label: "Please give any important information about this robot or its performance in the match including:\n\n- Ability to score against defense\n- Robot stability\n- Fouls or other issues\n"
                },
                {
                    type: "textbox",
                    placeholder:
                        "Enter notes here (and include team number if scouting practice matches)...",
                    default: "",
                    data: "comments"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Endgame",
                            page: 2
                        },
                        {
                            type: "pagebutton",
                            label: "Send >",
                            page: 4
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "pagebutton",
                    label: "Upload (Online)",
                    page: 5
                },
                {
                    type: "pagebutton",
                    label: "QR Code (Offline)",
                    page: 6
                },
                {
                    type: "pagebutton",
                    label: "Copy Data (Offline)",
                    page: 7
                },
                {
                    type: "pagebutton",
                    label: "< Notes",
                    page: 3
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: "UPLOAD"
                },
                {
                    type: "upload"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Send",
                            page: 4
                        },
                        {
                            type: "pagebutton",
                            label: "Home",
                            page: -2
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: "QR CODE"
                },
                {
                    type: "qrcode",
                    chunkLength: 30,
                    interval: 500
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Send",
                            page: 4
                        },
                        {
                            type: "pagebutton",
                            label: "Home",
                            page: -2
                        }
                    ]
                }
            ]
        },
        {
            type: "layout",
            direction: "rows",
            components: [
                {
                    type: "title",
                    label: "COPY DATA"
                },
                {
                    type: "data"
                },
                {
                    type: "layout",
                    direction: "columns",
                    components: [
                        {
                            type: "pagebutton",
                            label: "< Send",
                            page: 4
                        },
                        {
                            type: "pagebutton",
                            label: "Home",
                            page: -2
                        }
                    ]
                }
            ]
        }
    ];
}

export function preload() {
    return [
        "/img/2023grid-red.png",
        "/img/2023grid-blue.png",
        "/img/star-outline.png",
        "/img/star-filled.png"
    ];
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
let locationConversion = {
    red: [
        19, 10, 1, 20, 11, 2, 21, 12, 3, 22, 13, 4, 23, 14, 5, 24, 15, 6, 25,
        16, 7, 26, 17, 8, 27, 18, 9
    ],
    blue: [
        1, 10, 19, 2, 11, 20, 3, 12, 21, 4, 13, 22, 5, 14, 23, 6, 15, 24, 7, 16,
        25, 8, 17, 26, 9, 18, 27
    ],
    unknown: [
        19, 10, 1, 20, 11, 2, 21, 12, 3, 22, 13, 4, 23, 14, 5, 24, 15, 6, 25,
        16, 7, 26, 17, 8, 27, 18, 9
    ]
};

export function formatData(data, categories, teams) {
    return `,match,team,"team color","mobility","ground pick-up",locations,"game piece","auto count","auto climb","end climb","climb time","break time","defense time","drive skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            let locations = [
                ...find(entry, "data", categories, "23-2", []),
                ...find(entry, "data", categories, "23-4", [])
            ];
            let pieces = [
                ...find(entry, "data", categories, "23-3", []),
                ...find(entry, "data", categories, "23-5", [])
            ];
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "23-0", false)
                    ? "TRUE"
                    : "FALSE",
                find(entry, "abilities", categories, "23-1", false)
                    ? "TRUE"
                    : "FALSE",
                `"[${locations
                    .map((d) => locationConversion[entry.color || "unknown"][d])
                    .join(", ")}]"`,
                `"[${pieces.map((d) => `'${d}'`).join(", ")}]"`,
                find(entry, "counters", categories, "23-6", 0),
                find(entry, "abilities", categories, "23-8", 0),
                find(entry, "abilities", categories, "23-9", 0),
                Math.round(
                    parseInt(find(entry, "timers", categories, "23-10", 0)) /
                        1000
                ),
                Math.round(
                    parseInt(find(entry, "timers", categories, "23-11", 0)) /
                        1000
                ),
                Math.round(
                    parseInt(find(entry, "timers", categories, "23-12", 0)) /
                        1000
                ),
                find(entry, "ratings", categories, "23-13", ""),
                find(entry, "ratings", categories, "23-14", ""),
                find(entry, "ratings", categories, "23-15", ""),
                find(entry, "ratings", categories, "23-16", ""),
                find(entry, "ratings", categories, "23-17", ""),
                JSON.stringify(
                    `${entry.contributor.username || "username"} (${
                        teams[entry.contributor.team] || 0
                    })`
                ),
                JSON.stringify(entry.comments || ""),
                entry.accuracy && entry.accuracy.calculated
                    ? parseFloat(entry.accuracy.percentage.toFixed(4))
                    : "",
                entry.serverTimestamp
            ].join(",");
        })
        .join("\n")}`;
}

export function notes() {
    return `- For game pieces, b = cube, y = cone, m = missed
- For the 5 ratings at the end, they are exported on a 0-4 scale, so add 1 to each number to translate to a 1-5 scale.
- For climb (charge station), 0 = None, 1 = Docked, 2 = Level
- Times are all exported in seconds
- Locations are mapped to spots 1-27 on a grid in the following order:

19 10 1
20 11 2
21 12 3&nbsp;&nbsp;&nbsp;U
22 13 4&nbsp;&nbsp;&nbsp;P
23 14 5&nbsp;&nbsp;&nbsp;P
24 15 6&nbsp;&nbsp;&nbsp;E
25 16 7&nbsp;&nbsp;&nbsp;R
26 17 8
27 18 9`;
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
        let rankingCommand;
        if (hasAllTeams && false) {
            rankingCommand = `python3 config/scouting/2023/rankings_v2.py --event ${event} --baseFilePath ../ --csv ${event}.csv`;
        } else {
            rankingCommand = `python3 config/scouting/2023/rankings.py --event ${event} --baseFilePath ../`;
        }
        pending.push(run(rankingCommand));
        let graphsCommand = `python3 config/scouting/2023/graphs_v2.py --mode 0 --event ${event} --team ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(graphsCommand));
        let radarStandardCommand = `python3 config/scouting/2023/graphs_v2.py --mode 1 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2023/graphs_v2.py --mode 2 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarMaxCommand));

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
        for (let i = 0; i < matches.length; i++) {
            let match = matches[i] as any;
            let r1 = match.alliances.red.team_keys[0].replace("frc", "");
            let r2 = match.alliances.red.team_keys[1].replace("frc", "");
            let r3 = match.alliances.red.team_keys[2].replace("frc", "");
            let b1 = match.alliances.blue.team_keys[0].replace("frc", "");
            let b2 = match.alliances.blue.team_keys[1].replace("frc", "");
            let b3 = match.alliances.blue.team_keys[2].replace("frc", "");
            // let predictionsCommand = `python3 config/scouting/2023/predictions_v2.py --event ${event} --baseFilePath ../ --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3} --match ${match.match_number} --csv ${event}.csv`;
            let predictionsCommand = `python3 config/scouting/2023/predictions.py --event ${event} --baseFilePath ../ --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
            pending.push(run(predictionsCommand));
        }

        await Promise.all(pending);

        for (let i = 0; i < matches.length; i++) {
            let match = matches[i] as any;
            let r1 = match.alliances.red.team_keys[0].replace("frc", "");
            let r2 = match.alliances.red.team_keys[1].replace("frc", "");
            let r3 = match.alliances.red.team_keys[2].replace("frc", "");
            let b1 = match.alliances.blue.team_keys[0].replace("frc", "");
            let b2 = match.alliances.blue.team_keys[1].replace("frc", "");
            let b3 = match.alliances.blue.team_keys[2].replace("frc", "");
            let prediction = JSON.parse(
                fs
                    .readFileSync(
                        `../${event}-${r1}-${r2}-${r3}-${b1}-${b2}-${b3}-prediction.json`
                    )
                    .toString()
            );
            prediction.match = match.match_number;
            prediction.win = match.alliances[
                prediction.winner
            ].team_keys.includes(`frc${teamNumber}`);
            if (prediction.red > 0.85) {
                prediction.red = 0.75 + ((prediction.red - 0.85) / 0.15) * 0.1;
                prediction.blue = 1 - prediction.red;
            } else if (prediction.blue > 0.85) {
                prediction.blue =
                    0.75 + ((prediction.blue - 0.85) / 0.15) * 0.1;
                prediction.red = 1 - prediction.blue;
            }
            predictions.push(prediction);
        }

        data.predictions = predictions;

        let rankings = JSON.parse(
            fs.readFileSync(`../${event}-rankings.json`).toString()
        );
        let rankingsTeams = Object.keys(rankings);
        let rankingsArr = [];
        for (let i = 0; i < rankingsTeams.length; i++) {
            rankingsArr.push({
                teamNumber: rankingsTeams[i],
                offenseScore: rankings[rankingsTeams[i]]["off-score"],
                defenseScore: rankings[rankingsTeams[i]]["def-score"]
            });
        }
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
        let graphs = fs
            .readFileSync(`../${event}-${teamNumber}-analysis.html`)
            .toString();
        let radarStandard = fs
            .readFileSync(`../${event}-${teamNumber}-standard-radar.html`)
            .toString();
        let radarMax = fs
            .readFileSync(`../${event}-${teamNumber}-max-radar.html`)
            .toString();
        analyzed.push({
            type: "html",
            label: "Scoring Graph",
            value: graphs
        });
        analyzed.push({
            type: "html",
            label: "Radar Chart<br>(Single Team)",
            value: radarStandard
        });
        analyzed.push({
            type: "html",
            label: "Radar Chart<br>(Compared to Best Scores)",
            value: radarMax
        });
        analyzed.push({
            type: "predictions",
            label: "Predictions",
            values: predictions
        });
        analyzed.push({
            type: "table",
            label: "Rankings",
            values: tableRankings
        });
    } catch (err) {
        console.error(err);
    }
    cache[`${event}-${teamNumber}`] = {
        value: {
            display: analyzed,
            data: data
        },
        timestamp: new Date().getTime()
    };
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));
    pruneCache();
}

async function syncCompareCache(event, teamNumbers) {
    let comparison = [];
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let pending = [];
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, await getAllDataByEvent(event));
        let radarStandardCommand = `python3 config/scouting/2023/graphs_v2.py --mode 1 --event ${event} --teamList ${teamNumbers.join(
            ","
        )} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2023/graphs_v2.py --mode 2 --event ${event} --teamList ${teamNumbers.join(
            ","
        )} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarMaxCommand));

        await Promise.all(pending);

        let radarStandard = fs
            .readFileSync(
                `../${event}-${teamNumbers.join("-")}-standard-radar.html`
            )
            .toString();
        let radarMax = fs
            .readFileSync(`../${event}-${teamNumbers.join("-")}-max-radar.html`)
            .toString();
        comparison.push({
            type: "html",
            label: `Radar Chart<br>(${
                teamNumbers.length == 1
                    ? "Single Team"
                    : `${teamNumbers.length} Teams`
            })`,
            value: radarStandard
        });
        comparison.push({
            type: "html",
            label: "Radar Chart<br>(Compared to Best Scores)",
            value: radarMax
        });
    } catch (err) {
        console.error(err);
    }
    cache[`${event}-compare-${teamNumbers.join(",")}`] = {
        value: {
            display: comparison,
            data: {}
        },
        timestamp: new Date().getTime()
    };
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));
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
        let predictionsCommand = `python3 config/scouting/2023/predictions.py --event ${event} --baseFilePath ../ --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
        pending.push(run(predictionsCommand));

        await Promise.all(pending);

        let prediction = JSON.parse(
            fs
                .readFileSync(
                    `../${event}-${r1}-${r2}-${r3}-${b1}-${b2}-${b3}-prediction.json`
                )
                .toString()
        );
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
            type: "predictions",
            label: "Prediction",
            values: predictions
        });
    } catch (err) {
        console.error(err);
    }
    cache[
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
    fs.writeFileSync("../analysiscache.json", JSON.stringify(cache));
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
    return await accuracy2023(event, matches, data, categories, teams);
}

const scouting2023 = {
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
export default scouting2023;
