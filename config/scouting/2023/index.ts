import { execSync } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";

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
        { name: "Break Time", identifier: "23-11" },
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
                    label: "Break Time",
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
                    options: [
                        {
                            label: "Cube",
                            value: "b",
                            type: "toggle"
                        },
                        {
                            label: "Cone",
                            value: "y",
                            type: "toggle"
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
                    type: "timer",
                    label: "Defense Time",
                    default: 0,
                    data: "23-12",
                    name: "defense_time",
                    restricts: ["charge_time", "break_time"]
                },
                {
                    type: "timer",
                    label: "Break Time",
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
                    options: [
                        {
                            label: "Cube",
                            value: "b",
                            type: "toggle"
                        },
                        {
                            label: "Cone",
                            value: "y",
                            type: "toggle"
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
                    label: "Please give any important information about this robot or its performance in the match including:\n\n- Ability to score against defense\n- Robot stability\n- Fouls or other issues\n- Anything else that is relevant"
                },
                {
                    type: "textbox",
                    placeholder: "Enter notes here...",
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

export function formatData(data, categories, teams) {
    let categoriesInSingular = {
        abilities: "ability",
        data: "data",
        counters: "counter",
        timers: "timer",
        ratings: "rating"
    };
    function find(entry, type, category, fallback: any = "") {
        return (entry[type].find((d) => d.category == categories[category]) ||
            fallback)[categoriesInSingular[type]];
    }
    let locationConversion = {
        red: [
            19, 10, 1, 20, 11, 2, 21, 12, 3, 22, 13, 4, 32, 14, 5, 24, 15, 6,
            25, 16, 7, 26, 17, 8, 27, 18, 9
        ],
        blue: [
            1, 10, 19, 2, 11, 20, 3, 12, 21, 4, 13, 22, 5, 14, 32, 6, 15, 24, 7,
            16, 25, 8, 17, 26, 9, 18, 27
        ],
        unknown: [
            19, 10, 1, 20, 11, 2, 21, 12, 3, 22, 13, 4, 32, 14, 5, 24, 15, 6,
            25, 16, 7, 26, 17, 8, 27, 18, 9
        ]
    };
    return `,match,team,"team color","mobility","ground pick-up",locations,"game piece","auto count","auto climb","end climb","climb time","break time","defense time","drive skill","defense skill",speed,stability,"intake consistency",scouter,comments\n${data
        .map((entry, i) => {
            let locations = [
                ...find(entry, "data", "23-2", []),
                ...find(entry, "data", "23-4", [])
            ];
            let pieces = [
                ...find(entry, "data", "23-3", []),
                ...find(entry, "data", "23-5", [])
            ];
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", "23-0", "FALSE") ? "TRUE" : "FALSE",
                find(entry, "abilities", "23-1", "FALSE") ? "TRUE" : "FALSE",
                `"[${locations
                    .map((d) => locationConversion[entry.color || "unknown"][d])
                    .join(", ")}]"`,
                `"[${pieces.map((d) => `'${d}'`).join(", ")}]"`,
                find(entry, "counters", "23-6", 0),
                find(entry, "abilities", "23-8", 0),
                find(entry, "abilities", "23-9", 0),
                Math.round(parseInt(find(entry, "timers", "23-10", 0)) / 1000),
                Math.round(parseInt(find(entry, "timers", "23-11", 0)) / 1000),
                Math.round(parseInt(find(entry, "timers", "23-12", 0)) / 1000),
                find(entry, "ratings", "23-13", ""),
                find(entry, "ratings", "23-14", ""),
                find(entry, "ratings", "23-15", ""),
                find(entry, "ratings", "23-16", ""),
                find(entry, "ratings", "23-17", ""),
                JSON.stringify(
                    `${entry.contributor.username || "username"} (${
                        teams[entry.contributor.team] || 0
                    })`
                ),
                JSON.stringify(entry.comments || "")
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

export async function analysis(event, teamNumber) {
    let analyzed = [];
    try {
        fs.writeFileSync(
            `../${event}-tba.json`,
            JSON.stringify(await getMatchesFull(event))
        );
        let rankingCommand = `python3 config/scouting/2023/rankings.py --event ${event} --baseFilePath ../`;
        execSync(rankingCommand);
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
        let tableRankings = [["Offense", "Defense"]];
        for (let i = 0; i < offense.length; i++) {
            tableRankings.push([offense[i], defense[i]]);
        }
        analyzed.push({
            type: "table",
            label: "Rankings",
            values: tableRankings
        });
    } catch (err) {}
    return analyzed;
}

const scouting2023 = {
    categories,
    layout,
    preload,
    formatData,
    notes,
    analysis
};
export default scouting2023;
