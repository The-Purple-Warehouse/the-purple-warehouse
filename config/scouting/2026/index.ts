import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2025 from "./accuracy";

export interface parsedRow {
    match: number;
    team: string;
    alliance: string;
    leave: boolean;
    "fuel ground intake": boolean;
    "fuel station intake": boolean;
    "can ferry": boolean;
    "traverse under trench": boolean;
    "traverse over bump": boolean;
    "auto l1 climb": boolean;
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
    scouter: string;
    comments: string;
    accuracy: number | "";
    timestamp: number;
}

export function categories() {
    return [
        {
            name: "Leave Starting Zone",
            identifier: "26-0",
            dataType: "boolean"
        },
        {
            name: "Fuel Ground Intake",
            identifier: "26-1",
            dataType: "boolean"
        },
        {
            name: "Fuel Station Intake",
            identifier: "26-2",
            dataType: "boolean"
        },
        {
            name: "Can Ferry",
            identifier: "26-3",
            dataType: "boolean"
        },
        {
            name: "Traverse Under Trench",
            identifier: "26-4",
            dataType: "boolean"
        },
        {
            name: "Traverse Over Bump",
            identifier: "26-5",
            dataType: "boolean"
        },
        {
            name: "Auto L1 Climb",
            identifier: "26-6",
            dataType: "boolean"
        },
        { name: "Auto Fuel Scoring", identifier: "26-7", dataType: "array" }, // 'asf' 'amf' | auto score, auto miss
        { name: "Teleop Fuel Scoring", identifier: "26-8", dataType: "array" }, // 'saf', 'maf', 'hif' | score active, miss active, shot inactive
        { name: "Climb Level", identifier: "26-9" },
        { name: "Climb Time", identifier: "26-10" },
        { name: "Brick Time", identifier: "26-11" },
        { name: "Defense Time", identifier: "26-12" },
        { name: "Driver Skill Rating", identifier: "26-13" },
        { name: "Defense Skill Rating", identifier: "26-14" },
        { name: "Robot Speed Rating", identifier: "26-15" },
        { name: "Robot Stability Rating", identifier: "26-16" },
        { name: "Intake Consistency Rating", identifier: "26-17" },
        {
            name: "Auto Fuel Scoring Locations",
            identifier: "26-18",
            dataType: "array"
        },
        /*
         * LOCATIONS
         * (0 = Hub)
         */
        { name: "Auto Fuel Count", identifier: "26-19" },
        {
            name: "Teleop Fuel Scoring Locations",
            identifier: "26-20",
            dataType: "array"
        },
        { name: "Teleop Fuel Count", identifier: "26-21" }
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
                                    label: "Leave Starting Zone",
                                    default: false,
                                    data: "26-0"
                                },
                                {
                                    type: "checkbox",
                                    label: "Fuel Ground Intake",
                                    default: false,
                                    data: "26-1"
                                },
                                {
                                    type: "checkbox",
                                    label: "Fuel Station Intake",
                                    default: false,
                                    data: "26-2"
                                },
                                {
                                    type: "checkbox",
                                    label: "Can Ferry?",
                                    default: false,
                                    data: "26-3"
                                },
                                {
                                    type: "checkbox",
                                    label: "Traverse Under Trench",
                                    default: false,
                                    data: "26-4"
                                },
                                {
                                    type: "checkbox",
                                    label: "Traverse Over Bump",
                                    default: false,
                                    data: "26-5"
                                },
                                {
                                    type: "checkbox",
                                    label: "Did L1 Climb?",
                                    default: false,
                                    data: "26-6"
                                },
                                {
                                    type: "timer",
                                    label: "Brick Time",
                                    default: 0,
                                    data: "26-11",
                                    name: "brick_time",
                                    restricts: ["cage_time", "defense_time"]
                                },
                                {
                                    type: "locations",
                                    increment: 8,
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2026hub.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "26-7",
                                        locations: "26-18",
                                        counter: "26-19"
                                    },
                                    rows: 1,
                                    columns: 1,
                                    orientation: 0,
                                    flip: false,
                                    disabled: [],
                                    marker: {
                                        type: "function",
                                        definition: ((state) => {
                                            return `${state.locations
                                                .filter((location) =>
                                                    ["fsa", "fsi"].includes(
                                                        location.value
                                                    )
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
                                    // TODO: Score Active, Missed Active, Shot Inactive
                                    options: [
                                        {
                                            label: "Scored",
                                            value: "fsa",
                                            tracks: ["fsi"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed",
                                            value: "fma",
                                            tracks: ["fmi"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
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
                                    label: "Fuel Ground Intake",
                                    default: false,
                                    data: "26-1"
                                },
                                {
                                    type: "checkbox",
                                    label: "Fuel Station Intake",
                                    default: false,
                                    data: "26-2"
                                },
                                {
                                    type: "checkbox",
                                    label: "Can Ferry?",
                                    default: false,
                                    data: "26-3"
                                },
                                {
                                    type: "checkbox",
                                    label: "Traverse Under Trench",
                                    default: false,
                                    data: "26-4"
                                },
                                {
                                    type: "checkbox",
                                    label: "Traverse Over Bump",
                                    default: false,
                                    data: "26-5"
                                },
                                {
                                    type: "timer",
                                    label: "Brick Time",
                                    default: 0,
                                    data: "26-11",
                                    name: "brick_time",
                                    restricts: ["cage_time", "defense_time"]
                                },
                                {
                                    type: "timer",
                                    label: "Defense Time",
                                    default: 0,
                                    data: "26-12",
                                    name: "defense_time",
                                    restricts: ["cage_time", "brick_time"]
                                },
                                {
                                    type: "locations",
                                    increment: 5,
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2026hub.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "26-8",
                                        locations: "26-20",
                                        counter: "26-21"
                                    },
                                    rows: 1,
                                    columns: 1,
                                    orientation: 0,
                                    flip: false,
                                    disabled: [],
                                    marker: {
                                        type: "function",
                                        definition: ((state) => {
                                            return `${state.locations
                                                .filter((location) =>
                                                    ["fsa", "fma", "fhi"].includes(
                                                        location.value
                                                    )
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
                                    // TODO: Score Active, Missed Active, Shot Inactive
                                    options: [
                                        {
                                            label: "Scored (Active)",
                                            value: "fsa",
                                            tracks: ["fma", "fhi"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Missed (Active)",
                                            value: "fma",
                                            tracks: ["fsa", "fhi"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
                                                }).toString()
                                            }
                                        },
                                        {
                                            label: "Shot (Inactive)",
                                            value: "fhi",
                                            tracks: ["fsa", "fma"],
                                            type: "counter",
                                            show: {
                                                type: "function",
                                                definition: ((state) => {
                                                    return state.index == 0;
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
                    name: "endgame",
                    team: {
                        type: "function",
                        definition: ((state) =>
                            `ENDGAME (${state.teamNumber})`).toString()
                    },
                    components: [
                        {
                            type: "layout",
                            direction: "rows",
                            components: [
                                {
                                    type: "select",
                                    label: "Climb Level",
                                    data: "26-9",
                                    default: 0,
                                    options: [
                                        {
                                            label: "None"
                                        },
                                        {
                                            label: "Level 1"
                                        },
                                        {
                                            label: "Level 2"
                                        },
                                        {
                                            label: "Level 3"
                                        }
                                    ]
                                },
                                {
                                    type: "timer",
                                    label: "Climb Time",
                                    default: 0,
                                    data: "26-10",
                                    name: "cage_time",
                                    restricts: ["defense_time", "brick_time"]
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
                                    type: "rating",
                                    label: "Driver Skill Rating",
                                    default: 0,
                                    data: "26-13",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Defense Skill Rating",
                                    default: 0,
                                    data: "26-14",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Robot Speed Rating",
                                    default: 0,
                                    data: "26-15",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Robot Stability Rating",
                                    default: 0,
                                    data: "26-16",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Intake Consistency Rating",
                                    default: 0,
                                    data: "26-17",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
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
                            html: '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><rect fill="none" height="160" rx="24" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" width="192" x="32" y="56"/><rect fill="none" height="40" rx="20" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" width="112" x="72" y="144"/><line fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="148" x2="148" y1="144" y2="184"/><line fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="108" x2="108" y1="144" y2="184"/><line fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="128" x2="128" y1="56" y2="16"/><circle cx="84" cy="108" r="12"/><circle cx="172" cy="108" r="12"/></svg>',
                            refers: "auto",
                            active: true
                        },
                        {
                            name: "Teleop",
                            html: '<svg id="Layer_1" style="enable-background:new 0 0 30 30;" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="15" cy="12" r="2"/><line style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="15" x2="15" y1="13" y2="25"/><path d="M19.316,15.7  C20.342,14.79,21,13.48,21,12s-0.658-2.79-1.684-3.7" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M22.91,18.78  C24.801,17.13,26,14.707,26,12s-1.199-5.13-3.09-6.78" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M10.684,15.7  C9.658,14.79,9,13.48,9,12s0.658-2.79,1.684-3.7" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/><path d="M7.09,18.78  C5.199,17.13,4,14.707,4,12s1.199-5.13,3.09-6.78" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/></svg>',
                            refers: "teleop",
                            active: false
                        },
                        {
                            name: "Endgame",
                            html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z"/></svg>',
                            refers: "endgame",
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
    return `entry,match,team,alliance,leave,"fuel ground intake","fuel station intake","can ferry","traverse under trench","traverse over bump","auto l1 climb","auto fuel scoring","teleop fuel scoring","climb level","climb time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
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
                find(entry, "abilities", categories, "26-2", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-3", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-4", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-5", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-6", false)
                    ? "true"
                    : "false",
                `"[${find(entry, "data", categories, "26-7", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "26-8", []).join(", ")}]"`,
                parseInt(find(entry, "abilities", categories, "26-9", 0)),
                parseInt(find(entry, "timers", categories, "26-10", 0)),
                parseInt(find(entry, "timers", categories, "26-11", 0)),
                parseInt(find(entry, "timers", categories, "26-12", 0)),
                parseInt(find(entry, "ratings", categories, "26-13", "")),
                parseInt(find(entry, "ratings", categories, "26-14", "")),
                parseInt(find(entry, "ratings", categories, "26-15", "")),
                parseInt(find(entry, "ratings", categories, "26-16", "")),
                parseInt(find(entry, "ratings", categories, "26-17", "")),
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
            "fuel ground intake": columns[5] === "true",
            "fuel station intake": columns[6] === "true",
            "can ferry": columns[7] === "true",
            "traverse under trench": columns[8] === "true",
            "traverse over bump": columns[9] === "true",
            "auto l1 climb": columns[10] === "true",
            "auto fuel scoring": parseArr(columns[11]).join(", "),
            "teleop fuel scoring": parseArr(columns[12]).join(", "),
            "climb level": parseInt(columns[13], 10),
            "climb time": parseInt(columns[14], 10),
            "brick time": parseInt(columns[15], 10),
            "defense time": parseInt(columns[16], 10),
            "driver skill": parseInt(columns[17], 10),
            "defense skill": parseInt(columns[18], 10),
            speed: parseInt(columns[19], 10),
            stability: parseInt(columns[20], 10),
            "intake consistency": parseInt(columns[21], 10),
            scouter: columns[22].replace(/^"|"$/g, ""),
            comments: columns[23].replace(/^"|"$/g, ""),
            accuracy: columns[24] ? parseFloat(columns[24]) : "",
            timestamp: parseInt(columns[25], 10)
        };
    });
}

let parsedScoring = {
    fsa: "Scored when Active",
    fma: "Missed when Active",
    fhi: "Shot when Inactive"
};

export function formatParsedData(data, categories, teams) {
    return `entry,match,team,alliance,leave,"fuel ground intake","fuel station intake","can ferry","traverse under trench","traverse over bump","auto l1 climb","auto fuel scoring","teleop fuel scoring","climb level","climb time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
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
                find(entry, "abilities", categories, "26-2", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-3", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-4", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-5", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "26-6", false)
                    ? "true"
                    : "false",
                `"${find(entry, "data", categories, "26-7", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                `"${find(entry, "data", categories, "26-8", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                ["none", "level 1", "level 2", "level 3"][
                    parseInt(find(entry, "abilities", categories, "26-9", 0))
                ],
                `${(
                    parseInt(find(entry, "timers", categories, "26-10", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "26-11", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "26-12", 0)) /
                    1000
                ).toFixed(3)}s`,
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "26-13", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "26-14", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "26-15", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "26-16", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "26-17", "") + 1
                    )
                ),
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

/*

export interface picklist {
    team: string;
    "avg-auto-pieces": number;
    "avg-tele-pieces": number;
    "avg-l1": number;
    "avg-l2": number;
    "avg-l3": number;
    "avg-l4": number;
    "avg-proc": number;
    "avg-net": number;
    "deep-climbs": number;
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
        let autoPieces = 0;
        let telePieces = 0;
        let l1 = 0;
        let l2 = 0;
        let l3 = 0;
        let l4 = 0;
        let proc = 0;
        let net = 0;
        let deepClimbs = 0;
        let total = 0;
        for (const d of dat) {
            if (!d || !d.accuracy || !d.accuracy.calculated) {
                continue;
            }
            let acc = d.accuracy.percentage;

            autoPieces += acc * find(d, "counters", categories, "26-20", 0);
            telePieces += acc * find(d, "counters", categories, "26-24", 0);
            let autocoral = find(d, "data", categories, "26-18", []);
            let telecoral = find(d, "data", categories, "26-22", []);
            let autol4 = autocoral.filter((el) => el == 0).length;
            let autol3 = autocoral.filter((el) => el == 1).length;
            let autol2 = autocoral.filter((el) => el == 2).length;
            let autol1 = autocoral.filter((el) => el == 3).length;
            let telel4 = telecoral.filter((el) => el == 0).length;
            let telel3 = telecoral.filter((el) => el == 1).length;
            let telel2 = telecoral.filter((el) => el == 2).length;
            let telel1 = telecoral.filter((el) => el == 3).length;
            l1 += acc * (autol1 + telel1);
            l2 += acc * (autol2 + telel2);
            l3 += acc * (autol3 + telel3);
            l4 += acc * (autol4 + telel4);
            let autoalgae = find(d, "data", categories, "26-17", []);
            let telealgae = find(d, "data", categories, "26-21", []);
            let autoNe = autoalgae.filter((el) => el == 4).length;
            let autoPr = autoalgae.filter((el) => el == 5).length;
            let teleNe = telealgae.filter((el) => el == 4).length;
            let telePr = telealgae.filter((el) => el == 5).length;
            net += acc * (autoNe + teleNe);
            proc += acc * (autoPr + telePr);
            let climb = find(d, "abilities", categories, "26-8", 0);
            if (acc > 0.5) deepClimbs += climb == 3 ? 1 : 0;

            total += acc;
        }
        if (dat.length == 0 || total == 0) {
            analysis.push({
                team: t,
                "avg-auto-pieces": NaN,
                "avg-tele-pieces": NaN,
                "avg-l1": NaN,
                "avg-l2": NaN,
                "avg-l3": NaN,
                "avg-l4": NaN,
                "avg-proc": NaN,
                "avg-net": NaN,
                "deep-climbs": NaN
            });
        } else {
            analysis.push({
                team: t,
                "avg-auto-pieces": autoPieces / total,
                "avg-tele-pieces": telePieces / total,
                "avg-l1": l1 / total,
                "avg-l2": l2 / total,
                "avg-l3": l3 / total,
                "avg-l4": l4 / total,
                "avg-proc": proc / total,
                "avg-net": net / total,
                "deep-climbs": deepClimbs
            });
        }
    }

    return formatPicklist(analysis);
}

function formatPicklist(analysis) {
    return `entry,team,"avg auto pieces","avg tele pieces","avg l1","avg l2","avg l3","avg l4","avg processor","avg net","# of deep climbs"\n${analysis
        .map((entry, i) => {
            return [
                i,
                entry.team || 0,
                entry["avg-auto-pieces"],
                entry["avg-tele-pieces"],
                entry["avg-l1"],
                entry["avg-l2"],
                entry["avg-l3"],
                entry["avg-l4"],
                entry["avg-proc"],
                entry["avg-net"],
                entry["deep-climbs"]
            ].join(",");
        })
        .join("\n")}`;
} */

export function notes() {
    return ``;
}
/*
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
            label: "Algae Scoring",
            value: graph0
        });
        analyzed.push({
            type: "config",
            category: "score",
            label: "Coral Scoring",
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
            label: "Shot Accuracy",
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
    return await accuracy2025(event, matches, data, categories, teams);
}

/*
export async function tps(data, categories, teams) {
    return data.map((entry) => {
        if(!entry.event.startsWith("2024")) {
            return {
                silentlyFail: true,
                hash: event.hash
            };
        }
        return {
            silentlyFail: false,
            hash: event.hash,
            entry: {
                metadata: {
                    event: entry.event || "2024all-prac",
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
                    "auto-leave-starting-zone": find(entry, "abilities", categories, "24-0", false),
                    "ground-pick-up": find(entry, "abilities", categories, "24-1", false),
                    "auto-center-line-pick-up": find(entry, "abilities", categories, "24-18", false),
                    "teleop-stage-level-2024": parseInt(find(entry, "abilities", categories, "24-4", false)),
                    "teleop-spotlight-2024": find(entry, "abilities", categories, "24-5", false)
                },
                counters: {},
                data: {
                    "auto-scoring-2024": find(entry, "data", categories, "24-2", []),
                    "teleop-scoring-2024": find(entry, "data", categories, "24-3", []),
                    notes: entry.comments || ""
                },
                ratings: {
                    "driver-skill": parseInt(find(entry, "ratings", categories, "24-9", 0)),
                    "defense-skill": parseInt(find(entry, "ratings", categories, "24-10", 0)),
                    speed: parseInt(find(entry, "ratings", categories, "24-11", 0)),
                    stability: parseInt(find(entry, "ratings", categories, "24-12", 0)),
                    "intake-consistency": parseInt(find(entry, "ratings", categories, "24-13", 0))
                },
                timers: {
                    "brick-time": parseInt(find(entry, "timers", categories, "24-7", 0))
                    "defense-time": parseInt(find(entry, "timers", categories, "24-8", 0)),
                    "stage-time-2024": parseInt(find(entry, "timers", categories, "24-6", 0))
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
*/

const scouting2025 = {
    categories,
    layout,
    preload,
    formatData,
    formatParsedData,
    notes
    /* formPicklist,
    analysis,
    compare,
    predict,
    accuracy,
    tps*/
};
export default scouting2025;
