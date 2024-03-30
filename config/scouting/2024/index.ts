import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2024 from "./accuracy";

export function categories() {
    return [
        {
            name: "Leave Starting Zone",
            identifier: "24-0",
            dataType: "boolean"
        },
        { name: "Ground Pick-Up", identifier: "24-1", dataType: "boolean" },
        { name: "Auto Scoring", identifier: "24-2", dataType: "array" },
        { name: "Teleop Scoring", identifier: "24-3", dataType: "array" },
        { name: "Stage Level", identifier: "24-4" },
        { name: "Spotlight", identifier: "24-5", dataType: "boolean" },
        { name: "Stage Time", identifier: "24-6" },
        { name: "Brick Time", identifier: "24-7" },
        { name: "Defense Time", identifier: "24-8" },
        { name: "Driver Skill Rating", identifier: "24-9" },
        { name: "Defense Skill Rating", identifier: "24-10" },
        { name: "Robot Speed Rating", identifier: "24-11" },
        { name: "Robot Stability Rating", identifier: "24-12" },
        { name: "Intake Consistency Rating", identifier: "24-13" },
        {
            name: "Auto Scoring Locations",
            identifier: "24-14",
            dataType: "array"
        },
        { name: "Auto Count", identifier: "24-15" },
        {
            name: "Teleop Scoring Locations",
            identifier: "24-16",
            dataType: "array"
        },
        { name: "Teleop Count", identifier: "24-17" },
        { name: "Center Line Pick-Up", identifier: "24-18" }
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
                    label: "Leave Starting Zone",
                    default: false,
                    data: "24-0"
                },
                {
                    type: "checkbox",
                    label: "Ground Pick-Up",
                    default: false,
                    data: "24-1"
                },
                {
                    type: "checkbox",
                    label: "Center Line Pick-Up",
                    default: false,
                    data: "24-18"
                },
                {
                    type: "timer",
                    label: "Brick Time",
                    default: 0,
                    data: "24-7",
                    name: "brick_time",
                    restricts: ["stage_time", "defense_time"]
                },
                {
                    type: "locations",
                    src: {
                        type: "function",
                        definition: ((state) =>
                            `/img/2024grid-auto-red.png`).toString()
                    },
                    default: {
                        locations: [],
                        values: [],
                        counter: 0
                    },
                    data: {
                        values: "24-2",
                        locations: "24-14",
                        counter: "24-15"
                    },
                    rows: 3,
                    columns: 1,
                    orientation: 0,
                    flip: false,
                    disabled: [2],
                    marker: {
                        type: "function",
                        definition: ((state) => {
                            return `${state.locations
                                .filter((location) =>
                                    ["as", "ss", "sa", "ts"].includes(
                                        location.value
                                    )
                                )
                                .map((location, i, arr) => {
                                    if (i > 4) {
                                        return "";
                                    } else if (
                                        ["ts"].includes(location.value)
                                    ) {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(3px + 7vw); height: calc(3px + 7vw); background-color: rgba(0, 0, 0, 0); border: calc(3px + 1vw) solid #fd910d; border-radius: 50%;"></div>`;
                                    } else if (
                                        ["as", "ss", "sa"].includes(
                                            location.value
                                        )
                                    ) {
                                        let colors = [
                                            "#fd910d",
                                            "#fd3f0d",
                                            "#b700ff",
                                            "#5300ff",
                                            "#000000"
                                        ];
                                        if (
                                            arr.length > 100 ||
                                            i + 95 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[4]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[4]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 95 ||
                                            i + 90 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[4]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 90 ||
                                            i + 85 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 85 ||
                                            i + 80 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 80 ||
                                            i + 75 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 75 ||
                                            i + 70 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 70 ||
                                            i + 65 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 65 ||
                                            i + 60 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 60 ||
                                            i + 55 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 55 ||
                                            i + 50 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 50 ||
                                            i + 45 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 45 ||
                                            i + 40 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 40 ||
                                            i + 35 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 35 ||
                                            i + 30 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 30 ||
                                            i + 25 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 25 ||
                                            i + 20 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 20 ||
                                            i + 15 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 15 ||
                                            i + 10 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 10 ||
                                            i + 5 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: rgba(0, 0, 0, 0); border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 5 ||
                                            i < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;"></div>`;
                                        }
                                    }
                                    return "";
                                })
                                .filter((marker) => marker != "")
                                .slice(0, 5)
                                .join("")}`;
                        }).toString()
                    },
                    options: [
                        {
                            label: "Scored",
                            value: "as",
                            tracks: ["ss", "ts"],
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
                            value: "am",
                            tracks: ["sm", "tm"],
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
                            value: "ss",
                            tracks: ["as", "ts"],
                            type: "counter",
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 1;
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "sm",
                            tracks: ["am", "tm"],
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
                            value: "ts",
                            tracks: ["as", "ss"],
                            type: "counter",
                            max: 3,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 2;
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "tm",
                            tracks: ["am", "sm"],
                            type: "counter",
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 2;
                                }).toString()
                            }
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
                    data: "24-1"
                },
                {
                    type: "timer",
                    label: "Defense Time",
                    default: 0,
                    data: "24-8",
                    name: "defense_time",
                    restricts: ["stage_time", "brick_time"]
                },
                {
                    type: "timer",
                    label: "Brick Time",
                    default: 0,
                    data: "24-7",
                    name: "brick_time",
                    restricts: ["stage_time", "defense_time"]
                },
                {
                    type: "locations",
                    src: {
                        type: "function",
                        definition: ((state) =>
                            `/img/2024grid-red.png`).toString()
                    },
                    default: {
                        locations: [],
                        values: [],
                        counter: 0
                    },
                    data: {
                        values: "24-3",
                        locations: "24-16",
                        counter: "24-17"
                    },
                    rows: 3,
                    columns: 1,
                    orientation: 0,
                    flip: false,
                    marker: {
                        type: "function",
                        definition: ((state) => {
                            return `${state.locations
                                .filter((location) =>
                                    ["as", "ss", "sa", "ts"].includes(
                                        location.value
                                    )
                                )
                                .map((location, i, arr) => {
                                    if (i > 4) {
                                        return "";
                                    } else if (
                                        ["ts"].includes(location.value)
                                    ) {
                                        return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(3px + 7vw); height: calc(3px + 7vw); background-color: rgba(0, 0, 0, 0); border: calc(3px + 1vw) solid #fd910d; border-radius: 50%;"></div>`;
                                    } else if (
                                        ["as", "ss", "sa"].includes(
                                            location.value
                                        )
                                    ) {
                                        let colors = [
                                            "#fd910d",
                                            "#fd3f0d",
                                            "#b700ff",
                                            "#5300ff",
                                            "#000000"
                                        ];
                                        if (
                                            arr.length > 100 ||
                                            i + 95 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[4]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[4]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 95 ||
                                            i + 90 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[4]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 90 ||
                                            i + 85 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[4]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 85 ||
                                            i + 80 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[4]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 80 ||
                                            i + 75 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[3]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 75 ||
                                            i + 70 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[3]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 70 ||
                                            i + 65 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[3]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 65 ||
                                            i + 60 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[3]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 60 ||
                                            i + 55 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[2]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 55 ||
                                            i + 50 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[2]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 50 ||
                                            i + 45 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[2]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 45 ||
                                            i + 40 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[2]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 40 ||
                                            i + 35 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[1]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 35 ||
                                            i + 30 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[1]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 30 ||
                                            i + 25 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[1]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 25 ||
                                            i + 20 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[1]}; border-radius: 50%;"></div>`;
                                        } else if (
                                            arr.length > 20 ||
                                            i + 15 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: ${colors[0]}; border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 15 ||
                                            i + 10 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: ${colors[0]}; border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 10 ||
                                            i + 5 < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;">
                                                <div style="display: inline-block; vertical-align: middle; width: calc(1px + 2.33vw); height: calc(1px + 2.33vw); background-color: rgba(0, 0, 0, 0); border: calc(1px + 0.33vw) solid ${colors[0]}; border-radius: 50%; margin-left: 50%; margin-top: 50%; transform: translate(-50%, -50%);"></div>
                                            </div>`;
                                        } else if (
                                            arr.length > 5 ||
                                            i < arr.length
                                        ) {
                                            return `<div style="display: inline-block; vertical-align: middle; margin: 3px; width: calc(2px + 4.66vw); height: calc(2px + 4.66vw); background-color: rgba(0, 0, 0, 0); border: calc(2px + 0.66vw) solid ${colors[0]}; border-radius: 50%;"></div>`;
                                        }
                                    }
                                    return "";
                                })
                                .filter((marker) => marker != "")
                                .slice(0, 5)
                                .join("")}`;
                        }).toString()
                    },
                    options: [
                        {
                            label: "Scored",
                            value: "as",
                            tracks: ["ss", "sa", "ts"],
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
                            value: "am",
                            tracks: ["sm", "tm"],
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
                            value: "ss",
                            tracks: ["as", "sa", "ts"],
                            type: "counter",
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 1;
                                }).toString()
                            }
                        },
                        {
                            label: "Scored (Amplify)",
                            value: "sa",
                            tracks: ["as", "ss", "ts"],
                            type: "counter",
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 1;
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "sm",
                            tracks: ["am", "tm"],
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
                            value: "ts",
                            tracks: ["as", "ss", "sa"],
                            type: "counter",
                            max: 3,
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 2;
                                }).toString()
                            }
                        },
                        {
                            label: "Missed",
                            value: "tm",
                            tracks: ["am", "sm"],
                            type: "counter",
                            show: {
                                type: "function",
                                definition: ((state) => {
                                    return state.index == 2;
                                }).toString()
                            }
                        }
                    ]
                },
                {
                    type: "checkbox",
                    label: "Spotlight",
                    default: false,
                    data: "24-5"
                },
                {
                    type: "timer",
                    label: "Stage Time",
                    default: 0,
                    data: "24-6",
                    name: "stage_time",
                    restricts: ["defense_time", "brick_time"]
                },
                {
                    type: "select",
                    label: "Stage Level",
                    data: "24-4",
                    default: 0,
                    options: [
                        {
                            label: "None"
                        },
                        {
                            label: "Parked"
                        },
                        {
                            label: "On Stage"
                        },
                        {
                            label: "Harmony"
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
                            label: "Notes >",
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
                            label: "Notes >",
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
                            `NOTES (${state.teamNumber})`).toString()
                    }
                },
                {
                    type: "rating",
                    label: "Driver Skill Rating",
                    default: 0,
                    data: "24-9",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Defense Skill Rating",
                    default: 0,
                    data: "24-10",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Robot Speed Rating",
                    default: 0,
                    data: "24-11",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Robot Stability Rating",
                    default: 0,
                    data: "24-12",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "rating",
                    label: "Intake Consistency Rating",
                    default: 0,
                    data: "24-13",
                    src: ["/img/star-outline.png", "/img/star-filled.png"]
                },
                {
                    type: "header",
                    label: "Other Notes"
                },
                {
                    type: "text",
                    label: "Please give any important information about this robot or its performance in the match including:\n\n- Ability to score against defense\n- Robot stability\n- Fouls or other issues\n- Team number (for practice matches only)\n- Anything else that is relevant\n"
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
                            label: "Send >",
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
                    type: "pagebutton",
                    label: "Upload (Online)",
                    page: 4
                },
                {
                    type: "pagebutton",
                    label: "QR Code (Offline)",
                    page: 5
                },
                {
                    type: "pagebutton",
                    label: "Copy Data (Offline)",
                    page: 6
                },
                {
                    type: "pagebutton",
                    label: "< Notes",
                    page: 2
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
                            page: 3
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
                            page: 3
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
                            page: 3
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
        "/img/2024grid-red.png",
        "/img/2024grid-auto-red.png",
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

export function formatData(data, categories, teams) {
    return `,match,team,alliance,leave,"ground pick-up","center line pick-up","auto scoring","teleop scoring","stage level",spotlight,"stage time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "24-0", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "24-1", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "24-18", false)
                    ? "true"
                    : "false",
                `"[${find(entry, "data", categories, "24-2", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "24-3", []).join(", ")}]"`,
                parseInt(find(entry, "abilities", categories, "24-4", 0)),
                find(entry, "abilities", categories, "24-5", false)
                    ? "true"
                    : "false",
                parseInt(find(entry, "timers", categories, "24-6", 0)),
                parseInt(find(entry, "timers", categories, "24-7", 0)),
                parseInt(find(entry, "timers", categories, "24-8", 0)),
                parseInt(find(entry, "ratings", categories, "24-9", "")),
                parseInt(find(entry, "ratings", categories, "24-10", "")),
                parseInt(find(entry, "ratings", categories, "24-11", "")),
                parseInt(find(entry, "ratings", categories, "24-12", "")),
                parseInt(find(entry, "ratings", categories, "24-13", "")),
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

let parsedScoring = {
    as: "amp score",
    am: "amp missed",
    ss: "speaker score",
    sa: "speaker score (amplify)",
    sm: "speaker miss",
    ts: "trap score",
    tm: "trap miss"
};

export function formatParsedData(data, categories, teams) {
    return `,match,team,alliance,leave,"ground pick-up","center line pick-up","auto scoring","teleop scoring","stage level",spotlight,"stage time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "24-0", false)
                    ? "yes"
                    : "no",
                find(entry, "abilities", categories, "24-1", false)
                    ? "yes"
                    : "no",
                find(entry, "abilities", categories, "24-18", false)
                    ? "yes"
                    : "no",
                `"${find(entry, "data", categories, "24-2", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                `"${find(entry, "data", categories, "24-3", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                ["none", "parked", "on stage", "harmony"][
                    parseInt(find(entry, "abilities", categories, "24-4", 0))
                ],
                find(entry, "abilities", categories, "24-5", false)
                    ? "yes"
                    : "no",
                `${(
                    parseInt(find(entry, "timers", categories, "24-6", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "24-7", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "24-8", 0)) /
                    1000
                ).toFixed(3)}s`,
                "⭐".repeat(
                    parseInt(find(entry, "ratings", categories, "24-9", "") + 1)
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "24-10", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "24-11", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "24-12", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "24-13", "") + 1
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
        let rankingCommand = `python3 config/scouting/2024/rankings_2024.py --event ${event} --baseFilePath ../ --csv ${event}.csv`;
        console.log(rankingCommand);
        pending.push(run(rankingCommand));
        let graphsCommand = `python3 config/scouting/2024/graphs_2024.py --mode 0 --event ${event} --team ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        console.log(graphsCommand);
        pending.push(run(graphsCommand));
        let radarStandardCommand = `python3 config/scouting/2024/graphs_2024.py --mode 1 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        console.log(radarStandardCommand);
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2024/graphs_2024.py --mode 2 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        console.log(radarMaxCommand);
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
            let predictionsCommand = `python3 config/scouting/2024/predictions_2024.py --event ${event} --baseFilePath ../ --csv ${event}.csv --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
            console.log(predictionsCommand);
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
        let radarStandardCommand = `python3 config/scouting/2024/graphs_2024.py --mode 1 --event ${event} --teamList ${teamNumbers.join(
            ","
        )} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2024/graphs_2024.py --mode 2 --event ${event} --teamList ${teamNumbers.join(
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
        let predictionsCommand = `python3 config/scouting/2024/predictions_2024.py --event ${event} --baseFilePath ../ --csv ${event}.csv --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
        pending.push(run(predictionsCommand));

        await Promise.all(pending);

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
    return await accuracy2024(event, matches, data, categories, teams);
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

const scouting2024 = {
    categories,
    layout,
    preload,
    formatData,
    formatParsedData,
    notes,
    analysis,
    compare,
    predict,
    accuracy /*,
    tps*/
};
export default scouting2024;
