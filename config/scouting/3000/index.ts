import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2026 from "./accuracy";
import { getGraph } from "./graphs_3000";
import { computePrediction } from "./predictions_3000";
import { computeRankings } from "./rankings_3000";

export interface parsedRow {
    match: number;
    team: string;
    alliance: string;
    "left zone": boolean;
    balanced: boolean;
    park: boolean;
    "auto scoring": string;
    "teleop scoring": string;
    "defense time": number;
    scouter: string;
    comments: string;
    accuracy: number | "";
    timestamp: number;
}

export function categories() {
    return [
        {
            name: "Left zone",
            identifier: "26-0",
            dataType: "boolean"
        },
        {
            name: "Balanced",
            identifier: "26-1",
            dataType: "boolean"
        },
        {
            name: "Auto scoring",
            identifier: "26-2",
            dataType: "array"
        },
        {
            name: "Teleop scoring",
            identifier: "26-3",
            dataType: "array"
        },
        { name: "Defense time", identifier: "26-4" },
        {
            name: "Auto Scoring Locations",
            identifier: "26-5",
            dataType: "array"
        },
        {
            name: "Teleop Scoring Locations",
            identifier: "26-6",
            dataType: "array"
        },
        /*
         * LOCATIONS
         * (0 = high) (1 = low) (2 = stack) (3 = ground)
         */
        { name: "Auto Count", identifier: "26-7" },
        { name: "Teleop Count", identifier: "26-8" },
        { name: "Park", identifier: "26-9" }
    ];
}

export function layout() {
    return [
        {
            type: "layout",
            direction: "preset-manager",
            components: [
                {
                    type: "layout",
                    direction: "preset",
                    name: "auto",
                    team: {
                        type: "function",
                        definition: ((state) =>
                            `AUTO (${state.teamNumber})`).toString()
                    },
                    components: [
                        {
                            type: "layout",
                            direction: "rows",
                            components: [
                                {
                                    type: "checkbox",
                                    label: "Left zone",
                                    default: false,
                                    data: "26-0"
                                },
                                {
                                    type: "checkbox",
                                    label: "Balanced",
                                    default: false,
                                    data: "26-1"
                                },
                                {
                                    type: "locations",
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2026ma-grid.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "26-2",
                                        locations: "26-5",
                                        counter: "26-7"
                                    },
                                    rows: 4,
                                    columns: 1,
                                    orientation: 0,
                                    flip: false,
                                    disabled: [],
                                    marker: {
                                        type: "function",
                                        definition: ((state) => {
                                            return `${state.locations
                                                .filter((location) =>
                                                    [
                                                        "cs1",
                                                        "cs2",
                                                        "cs3",
                                                        "cs4"
                                                    ].includes(location.value)
                                                )
                                                .map((location, i, arr) => {
                                                    if (i > 5) {
                                                        return "";
                                                    } else {
                                                        let colors = [
                                                            "#ebebeb",
                                                            "#fd3f0d",
                                                            "#b700ff",
                                                            "#5300ff",
                                                            "#000000"
                                                        ];
                                                        if (
                                                            arr.length > 18 ||
                                                            i + 12 < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;">
                                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                                            </div>`;
                                                        } else if (
                                                            arr.length > 12 ||
                                                            i + 6 < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;">
                                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: rgba(0, 0, 0, 0); border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                                            </div>`;
                                                        } else if (
                                                            arr.length > 6 ||
                                                            i < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;"></div>`;
                                                        }
                                                    }
                                                    return "";
                                                })
                                                .filter(
                                                    (marker) => marker != ""
                                                )
                                                .slice(0, 6)
                                                .join("")}`;
                                        }).toString()
                                    },
                                    options: [
                                        {
                                            label: "Scored",
                                            value: "cs4",
                                            tracks: ["cs1", "cs2", "cs3"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm4",
                                            tracks: ["cm1", "cm2", "cm3"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs3",
                                            tracks: ["cs1", "cs2", "cs4"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 1;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm3",
                                            tracks: ["cm1", "cm2", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 1;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs2",
                                            tracks: ["cs1", "cs3", "cs4"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 2;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm2",
                                            tracks: ["cm1", "cm3", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 2;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs1",
                                            tracks: ["cs2", "cs3", "cs4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 3;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm1",
                                            tracks: ["cm2", "cm3", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 3;
                                                }).toString()
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "layout",
                    direction: "preset",
                    name: "teleop",
                    team: {
                        type: "function",
                        definition: ((state) =>
                            `TELEOP (${state.teamNumber})`).toString()
                    },
                    components: [
                        {
                            type: "layout",
                            direction: "rows",
                            components: [
                                {
                                    type: "checkbox",
                                    label: "Park",
                                    default: false,
                                    data: "26-9"
                                },
                                {
                                    type: "checkbox",
                                    label: "Balanced",
                                    default: false,
                                    data: "26-1"
                                },
                                {
                                    type: "timer",
                                    label: "Defense time",
                                    default: 0,
                                    data: "26-4",
                                    name: "defense_time"
                                },
                                {
                                    type: "locations",
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2026ma-grid.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "26-2",
                                        locations: "26-5",
                                        counter: "26-7"
                                    },
                                    rows: 4,
                                    columns: 1,
                                    orientation: 0,
                                    flip: false,
                                    disabled: [],
                                    marker: {
                                        type: "function",
                                        definition: ((state) => {
                                            return `${state.locations
                                                .filter((location) =>
                                                    [
                                                        "cs1",
                                                        "cs2",
                                                        "cs3",
                                                        "cs4"
                                                    ].includes(location.value)
                                                )
                                                .map((location, i, arr) => {
                                                    if (i > 5) {
                                                        return "";
                                                    } else {
                                                        let colors = [
                                                            "#ebebeb",
                                                            "#fd3f0d",
                                                            "#b700ff",
                                                            "#5300ff",
                                                            "#000000"
                                                        ];
                                                        if (
                                                            arr.length > 18 ||
                                                            i + 12 < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;">
                                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                                            </div>`;
                                                        } else if (
                                                            arr.length > 12 ||
                                                            i + 6 < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;">
                                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: rgba(0, 0, 0, 0); border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                                            </div>`;
                                                        } else if (
                                                            arr.length > 6 ||
                                                            i < arr.length
                                                        ) {
                                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: min(calc(2px + 3.66vw), 65px); height: min(calc(2px + 3.66vw), 65px); background-color: rgba(0, 0, 0, 0); border: min(calc(2px + 0.66vw), 13px) solid ${colors[0]}; border-radius: 50%;"></div>`;
                                                        }
                                                    }
                                                    return "";
                                                })
                                                .filter(
                                                    (marker) => marker != ""
                                                )
                                                .slice(0, 6)
                                                .join("")}`;
                                        }).toString()
                                    },
                                    options: [
                                        {
                                            label: "Scored",
                                            value: "cs4",
                                            tracks: ["cs1", "cs2", "cs3"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm4",
                                            tracks: ["cm1", "cm2", "cm3"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs3",
                                            tracks: ["cs1", "cs2", "cs4"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 1;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm3",
                                            tracks: ["cm1", "cm2", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 1;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs2",
                                            tracks: ["cs1", "cs3", "cs4"],
                                            type: "counter",
                                            max: 1000,
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 2;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm2",
                                            tracks: ["cm1", "cm3", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 2;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Scored",
                                            value: "cs1",
                                            tracks: ["cs2", "cs3", "cs4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 3;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "cm1",
                                            tracks: ["cm2", "cm3", "cm4"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 3;
                                                }).toString()
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "layout",
                    direction: "preset",
                    name: "comments",
                    team: {
                        type: "function",
                        definition: ((state) =>
                            `COMMENTS (${state.teamNumber})`).toString()
                    },
                    components: [
                        {
                            type: "layout",
                            direction: "rows",
                            components: [
                                {
                                    type: "textbox",
                                    placeholder:
                                        "Enter notes here (and include team number if scouting practice matches)...",
                                    default: "",
                                    data: "comments"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "pagebar",
                    direction: "columns",
                    options: [
                        {
                            name: "Auto",
                            html: '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><rect fill="none" height="160" rx="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" width="192" x="32" y="56"/><rect fill="none" height="40" rx="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" width="112" x="72" y="144"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="148" x2="148" y1="144" y2="184"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="108" x2="108" y1="144" y2="184"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="128" x2="128" y1="56" y2="16"/><circle cx="84" cy="108" r="12" fill="currentColor"/><circle cx="172" cy="108" r="12" fill="currentColor"/></svg>',
                            refers: "auto",
                            active: true
                        },
                        {
                            name: "Teleop",
                            html: '<svg id="Layer_1" style="enable-background:new 0 0 30 30;" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="15" cy="12" r="2" fill="currentColor"/><line style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="15" x2="15" y1="13" y2="25"/><path d="M19.316,15.7  C20.342,14.79,21,13.48,21,12s-0.658-2.79-1.684-3.7" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M22.91,18.78  C24.801,17.13,26,14.707,26,12s-1.199-5.13-3.09-6.78" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M10.684,15.7  C9.658,14.79,9,13.48,9,12s0.658-2.79,1.684-3.7" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M7.09,18.78  C5.199,17.13,4,14.707,4,12s1.199-5.13,3.09-6.78" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/></svg>',
                            refers: "teleop",
                            active: false
                        },
                        {
                            name: "Comments",
                            html: '<svg fill="none" height="24" stroke-width="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8 14L16 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10L10 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18L12 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3H6C4.89543 3 4 3.89543 4 5V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V5C20 3.89543 19.1046 3 18 3H14.5M10 3V1M10 3V5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                            refers: "comments",
                            active: false
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
                    page: 2
                },
                {
                    type: "pagebutton",
                    label: "QR Code (Offline)",
                    page: 3
                },
                {
                    type: "pagebutton",
                    label: "Copy Data (Offline)",
                    page: 4
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
                    type: "pagebutton",
                    label: "Home",
                    page: -2
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
                    type: "pagebutton",
                    label: "Home",
                    page: -2
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
                    type: "pagebutton",
                    label: "Home",
                    page: -2
                }
            ]
        }
    ];
}

export function preload() {
    return ["/img/2026hub.png"];
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
    return `entry,match,team,alliance,"left zone",balanced,park,"auto scoring","teleop scoring","defense time",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "26-0", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-1", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-9", false)
                    ? "true"
                    : "false",
                `"[${find(entry, "data", categories, "26-2", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "26-3", []).join(", ")}]"`,
                parseInt(find(entry, "timers", categories, "26-4", 0)),
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

export function parseFormatted(format: string): parsedRow[] {
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
            "left zone": columns[5] === "true",
            balanced: columns[6] === "true",
            park: columns[7] == "true",
            "auto scoring": parseArr(columns[8]).join(", "),
            "teleop scoring": parseArr(columns[9]).join(", "),
            "defense time": parseInt(columns[10], 10),
            scouter: columns[11].replace(/^"|"$/g, ""),
            comments: columns[12].replace(/^"|"$/g, ""),
            accuracy: columns[13] ? parseFloat(columns[13]) : "",
            timestamp: parseInt(columns[14], 10)
        };
    });
}

let parsedScoring = {
    cs1: "Ground score",
    cs2: "Stack score",
    cs3: "Low score",
    cs4: "High score",
    cm1: "Ground missed",
    cm2: "Stack missed",
    cm3: "Low missed",
    cm4: "High missed"
};

export function formatParsedData(data, categories, teams) {
    return `entry,match,team,alliance,"left zone",balanced,park,"auto scoring","teleop scoring","defense time",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "26-0", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-1", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-9", false)
                    ? "true"
                    : "false",
                `"${(() => {
                    const arr = find(entry, "data", categories, "26-2", []);
                    const ground = arr.filter((e) => e === "cs1").length;
                    const stack = arr.filter((e) => e === "cs2").length;
                    const low = arr.filter((e) => e === "cs3").length;
                    const high = arr.filter((e) => e === "cs4").length;
                    return `${ground} Ground | ${stack} Stack | ${low} Low | ${high} High`;
                })()} "`,
                `"${(() => {
                    const arr = find(entry, "data", categories, "26-3", []);
                    const ground = arr.filter((e) => e === "cs1").length;
                    const stack = arr.filter((e) => e === "cs2").length;
                    const low = arr.filter((e) => e === "cs3").length;
                    const high = arr.filter((e) => e === "cs4").length;
                    return `${ground} Ground | ${stack} Stack | ${low} Low | ${high} High`;
                })()} "`,
                `${(
                    parseInt(find(entry, "timers", categories, "26-4", 0)) /
                    1000
                ).toFixed(3)}s`,
                JSON.stringify(
                    `${entry.contributor.username || "username"} (${
                        teams[entry.contributor.team] || 0
                    })`
                ),
                JSON.stringify(entry.comments || ""),
                entry.accuracy && entry.accuracy.calculated
                    ? `${parseFloat(
                          (entry.accuracy.percentage * 100).toFixed(2)
                      )}%`
                    : "",
                entry.serverTimestamp
            ].join(",");
        })
        .join("\n")}`;
}

export interface picklist {
    team: string;
    "avg-auto-fuel": number;
    "avg-tele-fuel": number;
    "avg-tele-passed": number;
    "high-climbs": number;
}

export async function formPicklist(
    data: { [team: string]: any[] },
    categories,
    teams: any[]
) {
    let analysis: picklist[] = [];
    console.log(teams);
    for (const t1 of teams) {
        const t = t1.team_number;
        let dat = data[t];
        if (!dat) continue;
        let autoFuel = 0;
        let teleFuel = 0;
        let telePassed = 0;
        let highClimbs = 0;
        let total = 0;
        for (const d of dat) {
            if (!d || !d.accuracy || !d.accuracy.calculated) {
                continue;
            }
            let acc = d.accuracy.percentage;

            let autoFuelData = find(d, "data", categories, "26-7", []);
            let teleFuelData = find(d, "data", categories, "26-8", []);
            let autoScored = autoFuelData.filter((el) => el === "fsa").length;
            let teleScored = teleFuelData.filter((el) => el === "fsa").length;
            let telePas = teleFuelData.filter((el) => el === "fp").length;
            autoFuel += acc * autoScored;
            teleFuel += acc * teleScored;
            telePassed += acc * telePas;
            let climb = parseInt(find(d, "abilities", categories, "26-9", 0));
            if (acc > 0.5) highClimbs += climb >= 3 ? 1 : 0;

            total += acc;
        }
        if (dat.length == 0 || total == 0) {
            analysis.push({
                team: t,
                "avg-auto-fuel": NaN,
                "avg-tele-fuel": NaN,
                "avg-tele-passed": NaN,
                "high-climbs": NaN
            });
        } else {
            analysis.push({
                team: t,
                "avg-auto-fuel": autoFuel / total,
                "avg-tele-fuel": teleFuel / total,
                "avg-tele-passed": telePassed / total,
                "high-climbs": highClimbs
            });
        }
    }

    return formatPicklist(analysis);
}

function formatPicklist(analysis) {
    return `entry,team,"avg auto fuel","avg tele fuel","avg tele passed","# of high climbs"\n${analysis
        .map((entry, i) => {
            return [
                i,
                entry.team || 0,
                entry["avg-auto-fuel"],
                entry["avg-tele-fuel"],
                entry["avg-tele-passed"],
                entry["high-climbs"]
            ].join(",");
        })
        .join("\n")}`;
}

export function notes() {
    return ``;
}

function run(command) {
    return new Promise(async (resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

export async function analysis(event, teamNumber) {
    let analyzed = [];
    let data: any = {
        offenseRankings: [],
        predictions: []
    };
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let allScoutingData = await getAllDataByEvent(event);
        let allParsedData = parseFormatted(allScoutingData);
        let allScoutedTeams = [
            ...new Set(
                allScoutingData
                    .split("\n")
                    .slice(1)
                    .map((entry) => entry.split(",")[2])
            )
        ];
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
        const rankings = computeRankings(allParsedData);

        const processRankings = async (rs) => {
            let rankingsTeams = Object.keys(rs);
            let rankingsArr = [];
            for (let i = 0; i < rankingsTeams.length; i++) {
                rankingsArr.push({
                    teamNumber: rankingsTeams[i],
                    offenseScore: rs[rankingsTeams[i]]["off-score"],
                    defenseScore: rs[rankingsTeams[i]]["def-score"]
                });
            }
            let offense = rankingsArr
                .sort((a, b) => b.offenseScore - a.offenseScore)
                .map((ranking) => ({
                    team: ranking.teamNumber,
                    offense: ranking.offenseScore.toFixed(2)
                }));
            let defense = rankingsArr
                .sort((a, b) => b.defenseScore - a.defenseScore)
                .map((ranking) => ranking.teamNumber);
            data.offenseRankings = offense;
            let tableRankings = [["Team", "TPW Offense Score"]];
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
                tableRankings.push([
                    `<b>${offense[i].team}</b>`,
                    offense[i].offense
                ]);
            }
            return tableRankings;
        };

        // undefined teamNumber means we are just requesting the rankings
        // all processing underneath of graphs+predictions requires teamNumber
        if (teamNumber == undefined) {
            analyzed.push({
                type: "table",
                category: "rank",
                label: "Rankings",
                values: await processRankings(rankings)
            });
            return { display: analyzed, data: data }; // return only the rankings
        }

        const graph0 = getGraph(0, allParsedData, teamNumber);
        const graph3 = getGraph(3, allParsedData, teamNumber);
        const graph4 = getGraph(4, allParsedData, teamNumber);
        const graph5 = getGraph(5, allParsedData, teamNumber);
        const graph1 = getGraph(1, allParsedData, teamNumber);
        const graph2 = getGraph(2, allParsedData, teamNumber);

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
            if (
                !allScoutedTeams.includes(r1) ||
                !allScoutedTeams.includes(r2) ||
                !allScoutedTeams.includes(r3) ||
                !allScoutedTeams.includes(b1) ||
                !allScoutedTeams.includes(b2) ||
                !allScoutedTeams.includes(b3)
            )
                continue;
            let prediction = computePrediction(
                b1,
                b2,
                b3,
                r1,
                r2,
                r3,
                allParsedData,
                "../",
                event as string
            );
            prediction.match = match.match_number;
            prediction.win = match.alliances[
                prediction.winner
            ].team_keys.includes(`frc${teamNumber}`);
            let predictionRed =
                prediction.red / (prediction.red + prediction.blue);
            let predictionBlue =
                prediction.blue / (prediction.blue + prediction.red);
            if (predictionRed > 0.85) {
                predictionRed = 0.75 + ((predictionRed - 0.85) / 0.15) * 0.1;
                predictionBlue = 1 - predictionRed;
            } else if (predictionBlue > 0.85) {
                predictionBlue = 0.75 + ((predictionBlue - 0.85) / 0.15) * 0.1;
                predictionRed = 1 - predictionBlue;
            }
            prediction.red = predictionRed;
            prediction.blue = predictionBlue;
            predictions.push(prediction);
        }

        data.predictions = predictions;

        analyzed.push({
            type: "config",
            category: "score",
            label: "Fuel Scoring",
            value: graph0
        });
        analyzed.push({
            type: "config",
            category: "score",
            label: "Auto vs Teleop",
            value: graph3
        });
        analyzed.push({
            type: "config",
            category: "score",
            label: "Score Proportion",
            value: graph4
        });
        analyzed.push({
            type: "config",
            category: "score",
            label: "Fuel Breakdown",
            value: graph5
        });
        analyzed.push({
            type: "config",
            category: "overall",
            label: "Radar Chart<br>(Single Team)",
            value: graph1
        });
        analyzed.push({
            type: "config",
            category: "overall",
            label: "Radar Chart<br>(Compared to Best Scores)",
            value: graph2
        });
        analyzed.push({
            type: "predictions",
            category: "predict",
            label: "Predictions",
            values: predictions
        });
        analyzed.push({
            type: "table",
            category: "rank",
            label: "Rankings",
            values: processRankings(rankings)
        });
    } catch (err) {
        console.error(err);
    }
    return { display: analyzed, data: data };
}

export async function compare(event, teamNumbers) {
    teamNumbers = [...new Set(teamNumbers)].sort((a: string, b: string) =>
        a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    let comparison = [];
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let allScoutingData = await getAllDataByEvent(event);
        let allParsedData = parseFormatted(allScoutingData);
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, await getAllDataByEvent(event));
        const graph1 = getGraph(1, allParsedData, teamNumbers as string[]);
        const graph2 = getGraph(2, allParsedData, teamNumbers as string[]);
        comparison.push({
            type: "config",
            category: "overall",
            label: `Radar Chart<br>(${
                teamNumbers.length == 1
                    ? "Single Team"
                    : `${teamNumbers.length} Teams`
            })`,
            value: graph1
        });
        comparison.push({
            type: "config",
            category: "overall",
            label: "Radar Chart<br>(Compared to Best Scores)",
            value: graph2
        });
    } catch (err) {
        console.error(err);
    }
    return { display: comparison, data: {} };
}

export async function predict(event, redTeamNumbers, blueTeamNumbers) {
    redTeamNumbers = [...new Set(redTeamNumbers)].sort((a: string, b: string) =>
        a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    blueTeamNumbers = [...new Set(blueTeamNumbers)].sort(
        (a: string, b: string) =>
            a.length != b.length ? a.length - b.length : a.localeCompare(b)
    );
    let analyzed = [];
    let data: any = {
        predictions: []
    };
    try {
        let matchesFull = (await getMatchesFull(event)) as any;
        let allScoutingData = await getAllDataByEvent(event);
        fs.writeFileSync(`../${event}-tba.json`, JSON.stringify(matchesFull));
        fs.writeFileSync(`../${event}.csv`, allScoutingData);
        let allParsedData = parseFormatted(allScoutingData);

        let predictions = [];
        let r1 = redTeamNumbers[0];
        let r2 = redTeamNumbers[1];
        let r3 = redTeamNumbers[2];
        let b1 = blueTeamNumbers[0];
        let b2 = blueTeamNumbers[1];
        let b3 = blueTeamNumbers[2];
        let prediction = computePrediction(
            b1,
            b2,
            b3,
            r1,
            r2,
            r3,
            allParsedData,
            "../",
            event as string
        );
        let predictionRed = prediction.red / (prediction.red + prediction.blue);
        let predictionBlue =
            prediction.blue / (prediction.blue + prediction.red);
        if (predictionRed > 0.85) {
            predictionRed = 0.75 + ((predictionRed - 0.85) / 0.15) * 0.1;
            predictionBlue = 1 - predictionRed;
        } else if (predictionBlue > 0.85) {
            predictionBlue = 0.75 + ((predictionBlue - 0.85) / 0.15) * 0.1;
            predictionRed = 1 - predictionBlue;
        }
        prediction.red = predictionRed;
        prediction.blue = predictionBlue;
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
    return { display: analyzed, data: data };
}

export async function accuracy(event, matches, data, categories, teams) {
    return await accuracy2026(event, matches, data, categories, teams);
}

export async function tps(data, categories, teams) {
    return data.map((entry) => {
        if (!entry.event.startsWith("2026")) {
            return {
                silentlyFail: true,
                hash: entry.hash
            };
        }
        return {
            silentlyFail: false,
            hash: entry.hash,
            entry: {
                metadata: {
                    event: entry.event || "2026all-prac",
                    match: {
                        level: "qm",
                        number: entry.match || 0,
                        set: 1
                    },
                    bot: entry.team || 0,
                    timestamp: entry.clientTimestamp,
                    scouter: {
                        name: entry.contributor.username || "username",
                        team: teams[entry.contributor.team] || 0,
                        app: "thepurplewarehouse.com"
                    }
                },
                abilities: {
                    "auto-leave-starting-zone": find(
                        entry,
                        "abilities",
                        categories,
                        "26-0",
                        false
                    ),
                    "fuel-ground-intake": find(
                        entry,
                        "abilities",
                        categories,
                        "26-1",
                        false
                    ),
                    "outpost-intake": find(
                        entry,
                        "abilities",
                        categories,
                        "26-2",
                        false
                    ),
                    "passing-from-neutral-zone": find(
                        entry,
                        "abilities",
                        categories,
                        "26-3",
                        false
                    ),
                    "traverse-under-trench": find(
                        entry,
                        "abilities",
                        categories,
                        "26-4",
                        false
                    ),
                    "traverse-over-bump": find(
                        entry,
                        "abilities",
                        categories,
                        "26-5",
                        false
                    ),
                    "l1-climb": find(
                        entry,
                        "abilities",
                        categories,
                        "26-6",
                        false
                    ),
                    "climb-level-2026": parseInt(
                        find(entry, "abilities", categories, "26-9", 0)
                    )
                },
                counters: {
                    "auto-fuel-count": parseInt(
                        find(entry, "counters", categories, "26-19", 0)
                    ),
                    "teleop-fuel-count": parseInt(
                        find(entry, "counters", categories, "26-21", 0)
                    )
                },
                data: {
                    "auto-fuel-scoring-2026": find(
                        entry,
                        "data",
                        categories,
                        "26-7",
                        []
                    ),
                    "teleop-fuel-scoring-2026": find(
                        entry,
                        "data",
                        categories,
                        "26-8",
                        []
                    ),
                    "auto-fuel-locations": find(
                        entry,
                        "data",
                        categories,
                        "26-18",
                        []
                    ),
                    "teleop-fuel-locations": find(
                        entry,
                        "data",
                        categories,
                        "26-20",
                        []
                    ),
                    notes: entry.comments || ""
                },
                ratings: {
                    "driver-skill": parseInt(
                        find(entry, "ratings", categories, "26-13", 0)
                    ),
                    "defense-skill": parseInt(
                        find(entry, "ratings", categories, "26-14", 0)
                    ),
                    speed: parseInt(
                        find(entry, "ratings", categories, "26-15", 0)
                    ),
                    stability: parseInt(
                        find(entry, "ratings", categories, "26-16", 0)
                    ),
                    "intake-consistency": parseInt(
                        find(entry, "ratings", categories, "26-17", 0)
                    ),
                    "balls-per-second": parseInt(
                        find(entry, "ratings", categories, "26-22", 0)
                    )
                },
                timers: {
                    "climb-time": parseInt(
                        find(entry, "timers", categories, "26-10", 0)
                    ),
                    "brick-time": parseInt(
                        find(entry, "timers", categories, "26-11", 0)
                    ),
                    "defense-time": parseInt(
                        find(entry, "timers", categories, "26-12", 0)
                    )
                }
            },
            privacy: [
                {
                    path: "data.notes",
                    private: true,
                    type: "redacted",
                    detail: "[redacted for privacy]",
                    teams: [entry.team]
                },
                {
                    path: "metadata.scouter.name",
                    private: true,
                    type: "scrambled",
                    detail: 16,
                    teams: [entry.team]
                }
            ],
            threshold: 10,
            serverTimestamp: entry.serverTimestamp
        };
    });
}

const scouting2026 = {
    categories,
    layout,
    preload,
    formatData,
    formatParsedData,
    notes,
    formPicklist,
    analysis,
    compare,
    predict,
    accuracy,
    tps
};
export default scouting2026;
