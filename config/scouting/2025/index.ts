import { execSync, exec } from "child_process";
import * as fs from "fs";
import { getMatchesFull } from "../../../helpers/tba";
import { getAllDataByEvent } from "../../../helpers/scouting";
import accuracy2025 from "./accuracy";

export function categories() {
    return [
        {
            name: "Leave Starting Zone",
            identifier: "25-0",
            dataType: "boolean"
        },
        {
            name: "Coral Ground Intake",
            identifier: "25-1",
            dataType: "boolean"
        },
        {
            name: "Algae Ground Intake",
            identifier: "25-2",
            dataType: "boolean"
        },
        { name: "Algae Reef Intake", identifier: "25-3", dataType: "boolean" },
        { name: "Auto Algae Scoring", identifier: "25-4", dataType: "array" }, // 'asn' 'asp' 'amn' 'amp'
        { name: "Auto Coral Scoring", identifier: "25-5", dataType: "array" }, // 'cs1' 'cm2' 'cs3' 'cs4'
        { name: "Teleop Algae Scoring", identifier: "25-6", dataType: "array" }, // 'asn' 'asp' 'amn' 'amnp'
        { name: "Teleop Coral Scoring", identifier: "25-7", dataType: "array" }, // 'cs1' 'cm2' 'cs3' 'cs4'
        { name: "Cage Level", identifier: "25-8" },
        { name: "Cage Time", identifier: "25-9" },
        { name: "Brick Time", identifier: "25-10" },
        { name: "Defense Time", identifier: "25-11" },
        { name: "Driver Skill Rating", identifier: "25-12" },
        { name: "Defense Skill Rating", identifier: "25-13" },
        { name: "Robot Speed Rating", identifier: "25-14" },
        { name: "Robot Stability Rating", identifier: "25-15" },
        { name: "Intake Consistency Rating", identifier: "25-16" },
        {
            name: "Auto Algae Scoring Locations",
            identifier: "25-17",
            dataType: "array"
        },
        {
            name: "Auto Coral Scoring Locations",
            identifier: "25-18",
            dataType: "array"
        },
        /*
         * LOCATIONS
         * (0 = L4) (1 = L3) (2 = L2) (3 = L1)
         * (4 = net) (5 = processor)
         */
        { name: "Auto Algae Count", identifier: "25-19" },
        { name: "Auto Coral Count", identifier: "25-20" },
        {
            name: "Teleop Algae Scoring Locations",
            identifier: "25-21",
            dataType: "array"
        },
        {
            name: "Teleop Coral Scoring Locations",
            identifier: "25-22",
            dataType: "array"
        },
        { name: "Teleop Algae Count", identifier: "25-23" },
        { name: "Teleop Coral Count", identifier: "25-24" }
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
                                    data: "25-0"
                                },
                                {
                                    type: "checkbox",
                                    label: "Coral Ground Intake",
                                    default: false,
                                    data: "25-1"
                                },
                                {
                                    type: "checkbox",
                                    label: "Algae Ground Intake",
                                    default: false,
                                    data: "25-2"
                                },
                                {
                                    type: "checkbox",
                                    label: "Algae Reef Intake",
                                    default: false,
                                    data: "25-3"
                                },
                                {
                                    type: "timer",
                                    label: "Brick Time",
                                    default: 0,
                                    data: "25-10",
                                    name: "brick_time",
                                    restricts: ["cage_time", "defense_time"]
                                },
                                {
                                    type: "scorecount",
                                    data: {
                                        values: "25-4",
                                        locations: "25-17",
                                        counter: "25-19"
                                    },
                                    scores: [
                                        {
                                            name: "Processor",
                                            class: "processor",
                                            disabled: false,
                                            close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>',
                                            icon: '<svg id="Object" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><path d="M28,5H4A3,3,0,0,0,1,8V24a3,3,0,0,0,3,3H28a3,3,0,0,0,3-3V8A3,3,0,0,0,28,5ZM3,24V8A1,1,0,0,1,4,7H21V25H4A1,1,0,0,1,3,24Zm26,0a1,1,0,0,1-1,1H23V7h5a1,1,0,0,1,1,1Z"/><path d="M17,9H7a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V11A2,2,0,0,0,17,9ZM7,21V11H17V21Z"/><path d="M27,15H25a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"/><path d="M27,19H25a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"/></svg>',
                                            controls: [
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Scored",
                                                    max: 9,
                                                    additive: true
                                                },
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Missed",
                                                    additive: false
                                                }
                                            ]
                                        },
                                        {
                                            name: "Net",
                                            class: "net",
                                            disabled: false,
                                            close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>',
                                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.81 511.95"><g id="Layer_2" data-name="Layer 2"><g id="cobweb"><path d="M310.11,361.34H201.7a15,15,0,0,1-12.86-7.28l-54.2-90.37a15,15,0,0,1,0-15.43l54.2-90.37a15,15,0,0,1,12.86-7.28H310.11A15,15,0,0,1,323,157.89l54.2,90.37a15,15,0,0,1,0,15.43L323,354.06A15,15,0,0,1,310.11,361.34Zm-99.92-30h91.43L346.83,256l-45.21-75.37H210.19L165,256Z"/><path d="M120.38,512a15,15,0,0,1-13.06-22.35l271-481.95a15,15,0,1,1,26.14,14.7l-271,482A15,15,0,0,1,120.38,512Z"/><path d="M391.43,512a15,15,0,0,1-13.08-7.65l-271-481.95a15,15,0,1,1,26.14-14.7l271,482A15,15,0,0,1,391.43,512Z"/><path d="M496.82,271H15a15,15,0,0,1,0-30H496.82a15,15,0,0,1,0,30Z"/><path d="M310.11,361.34H201.7a15,15,0,0,1-12.86-7.28l-54.2-90.37a15,15,0,0,1,0-15.43l54.2-90.37a15,15,0,0,1,12.86-7.28H310.11A15,15,0,0,1,323,157.89l54.2,90.37a15,15,0,0,1,0,15.43L323,354.06A15,15,0,0,1,310.11,361.34Zm-99.92-30h91.43L346.83,256l-45.21-75.37H210.19L165,256Z"/><path d="M120.38,512a15,15,0,0,1-13.06-22.35l271-481.95a15,15,0,1,1,26.14,14.7l-271,482A15,15,0,0,1,120.38,512Z"/><path d="M391.43,512a15,15,0,0,1-13.08-7.65l-271-481.95a15,15,0,1,1,26.14-14.7l271,482A15,15,0,0,1,391.43,512Z"/><path d="M391.42,512a15,15,0,0,1-9.14-3.11c-27.64-21.27-74.88-34-126.37-34s-98.74,12.7-126.37,34A15,15,0,0,1,105.4,497.1c-.86-83-31.87-189.78-97.94-228.15a15,15,0,0,1,0-25.94C73.53,204.63,104.54,97.83,105.4,14.85A15,15,0,0,1,129.54,3.11c27.63,21.27,74.88,34,126.37,34S354.51,24.41,382.17,3.2A14.74,14.74,0,0,1,386.45.85h0A15,15,0,0,1,392.05,0a14.9,14.9,0,0,1,10.67,5.13,14.83,14.83,0,0,1,2.93,5.12v0h0a14.86,14.86,0,0,1,.75,4.7h0c.9,83,31.92,189.67,97.94,228a15,15,0,0,1,0,25.94c-66.06,38.37-97.08,145.17-97.94,228.15a15,15,0,0,1-15,14.85ZM255.91,444.88c46.57,0,89.37,9.21,121.64,25.75,3.13-41.69,12.59-83.44,27.34-119.85,16.59-41,39-73.28,65.64-94.8-26.6-21.53-49-53.85-65.64-94.81C390.14,124.76,380.68,83,377.55,41.32c-32.27,16.54-75.07,25.75-121.64,25.75s-89.37-9.21-121.65-25.75c-3.13,41.69-12.59,83.44-27.34,119.85-16.59,41-39,73.28-65.64,94.81,26.6,21.52,49.05,53.84,65.64,94.8,14.75,36.41,24.21,78.16,27.34,119.85C166.54,454.09,209.33,444.88,255.91,444.88Z"/><path d="M496.82,271H15a15,15,0,0,1,0-30H496.82a15,15,0,0,1,0,30Z"/></g></g></svg>',
                                            controls: [
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Scored",
                                                    max: 9,
                                                    additive: true
                                                },
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Missed",
                                                    additive: false
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "locations",
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2025coral-grid.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "25-5",
                                        locations: "25-18",
                                        counter: "25-20"
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
                                                    if (i > 4) {
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
                                                .filter(
                                                    (marker) => marker != ""
                                                )
                                                .slice(0, 5)
                                                .join("")}`;
                                        }).toString()
                                    },
                                    options: [
                                        {
                                            label: "Scored",
                                            value: "cs4",
                                            tracks: ["cs1", "cs2", "cs3"],
                                            type: "counter",
                                            max: 12,
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
                                            max: 12,
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
                                            max: 12,
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
                                    label: "Coral Ground Intake",
                                    default: false,
                                    data: "25-1"
                                },
                                {
                                    type: "checkbox",
                                    label: "Algae Ground Intake",
                                    default: false,
                                    data: "25-2"
                                },
                                {
                                    type: "checkbox",
                                    label: "Algae Reef Intake",
                                    default: false,
                                    data: "25-3"
                                },
                                {
                                    type: "timer",
                                    label: "Brick Time",
                                    default: 0,
                                    data: "25-10",
                                    name: "brick_time",
                                    restricts: ["cage_time", "defense_time"]
                                },
                                {
                                    type: "timer",
                                    label: "Defense Time",
                                    default: 0,
                                    data: "25-11",
                                    name: "defense_time",
                                    restricts: ["cage_time", "brick_time"]
                                },
                                {
                                    type: "scorecount",
                                    data: {
                                        values: "25-6",
                                        locations: "25-21",
                                        counter: "25-23"
                                    },
                                    scores: [
                                        {
                                            name: "Processor",
                                            class: "processor",
                                            disabled: false,
                                            close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>',
                                            icon: '<svg id="Object" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><path d="M28,5H4A3,3,0,0,0,1,8V24a3,3,0,0,0,3,3H28a3,3,0,0,0,3-3V8A3,3,0,0,0,28,5ZM3,24V8A1,1,0,0,1,4,7H21V25H4A1,1,0,0,1,3,24Zm26,0a1,1,0,0,1-1,1H23V7h5a1,1,0,0,1,1,1Z"/><path d="M17,9H7a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V11A2,2,0,0,0,17,9ZM7,21V11H17V21Z"/><path d="M27,15H25a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"/><path d="M27,19H25a1,1,0,0,0,0,2h2a1,1,0,0,0,0-2Z"/></svg>',
                                            controls: [
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Scored",
                                                    additive: true
                                                },
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Missed",
                                                    additive: false
                                                }
                                            ]
                                        },
                                        {
                                            name: "Net",
                                            class: "net",
                                            disabled: false,
                                            close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>',
                                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.81 511.95"><g id="Layer_2" data-name="Layer 2"><g id="cobweb"><path d="M310.11,361.34H201.7a15,15,0,0,1-12.86-7.28l-54.2-90.37a15,15,0,0,1,0-15.43l54.2-90.37a15,15,0,0,1,12.86-7.28H310.11A15,15,0,0,1,323,157.89l54.2,90.37a15,15,0,0,1,0,15.43L323,354.06A15,15,0,0,1,310.11,361.34Zm-99.92-30h91.43L346.83,256l-45.21-75.37H210.19L165,256Z"/><path d="M120.38,512a15,15,0,0,1-13.06-22.35l271-481.95a15,15,0,1,1,26.14,14.7l-271,482A15,15,0,0,1,120.38,512Z"/><path d="M391.43,512a15,15,0,0,1-13.08-7.65l-271-481.95a15,15,0,1,1,26.14-14.7l271,482A15,15,0,0,1,391.43,512Z"/><path d="M496.82,271H15a15,15,0,0,1,0-30H496.82a15,15,0,0,1,0,30Z"/><path d="M310.11,361.34H201.7a15,15,0,0,1-12.86-7.28l-54.2-90.37a15,15,0,0,1,0-15.43l54.2-90.37a15,15,0,0,1,12.86-7.28H310.11A15,15,0,0,1,323,157.89l54.2,90.37a15,15,0,0,1,0,15.43L323,354.06A15,15,0,0,1,310.11,361.34Zm-99.92-30h91.43L346.83,256l-45.21-75.37H210.19L165,256Z"/><path d="M120.38,512a15,15,0,0,1-13.06-22.35l271-481.95a15,15,0,1,1,26.14,14.7l-271,482A15,15,0,0,1,120.38,512Z"/><path d="M391.43,512a15,15,0,0,1-13.08-7.65l-271-481.95a15,15,0,1,1,26.14-14.7l271,482A15,15,0,0,1,391.43,512Z"/><path d="M391.42,512a15,15,0,0,1-9.14-3.11c-27.64-21.27-74.88-34-126.37-34s-98.74,12.7-126.37,34A15,15,0,0,1,105.4,497.1c-.86-83-31.87-189.78-97.94-228.15a15,15,0,0,1,0-25.94C73.53,204.63,104.54,97.83,105.4,14.85A15,15,0,0,1,129.54,3.11c27.63,21.27,74.88,34,126.37,34S354.51,24.41,382.17,3.2A14.74,14.74,0,0,1,386.45.85h0A15,15,0,0,1,392.05,0a14.9,14.9,0,0,1,10.67,5.13,14.83,14.83,0,0,1,2.93,5.12v0h0a14.86,14.86,0,0,1,.75,4.7h0c.9,83,31.92,189.67,97.94,228a15,15,0,0,1,0,25.94c-66.06,38.37-97.08,145.17-97.94,228.15a15,15,0,0,1-15,14.85ZM255.91,444.88c46.57,0,89.37,9.21,121.64,25.75,3.13-41.69,12.59-83.44,27.34-119.85,16.59-41,39-73.28,65.64-94.8-26.6-21.53-49-53.85-65.64-94.81C390.14,124.76,380.68,83,377.55,41.32c-32.27,16.54-75.07,25.75-121.64,25.75s-89.37-9.21-121.65-25.75c-3.13,41.69-12.59,83.44-27.34,119.85-16.59,41-39,73.28-65.64,94.81,26.6,21.52,49.05,53.84,65.64,94.8,14.75,36.41,24.21,78.16,27.34,119.85C166.54,454.09,209.33,444.88,255.91,444.88Z"/><path d="M496.82,271H15a15,15,0,0,1,0-30H496.82a15,15,0,0,1,0,30Z"/></g></g></svg>',
                                            controls: [
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Scored",
                                                    additive: true
                                                },
                                                {
                                                    subtract:
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>',
                                                    add: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>',
                                                    label: "Missed",
                                                    additive: false
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "locations",
                                    src: {
                                        type: "function",
                                        definition: ((state) =>
                                            `/img/2025coral-grid.png`).toString()
                                    },
                                    default: {
                                        locations: [],
                                        values: [],
                                        counter: 0
                                    },
                                    data: {
                                        values: "25-7",
                                        locations: "25-22",
                                        counter: "25-24"
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
                                                    if (i > 4) {
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
                                                .filter(
                                                    (marker) => marker != ""
                                                )
                                                .slice(0, 5)
                                                .join("")}`;
                                        }).toString()
                                    },
                                    options: [
                                        {
                                            label: "Scored",
                                            value: "cs4",
                                            tracks: ["cs1", "cs2", "cs3"],
                                            type: "counter",
                                            max: 12,
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
                                            max: 12,
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
                                            max: 12,
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
                                    label: "Cage Level",
                                    data: "25-8",
                                    default: 0,
                                    options: [
                                        {
                                            label: "None"
                                        },
                                        {
                                            label: "Parked"
                                        },
                                        {
                                            label: "Shallow"
                                        },
                                        {
                                            label: "Deep"
                                        }
                                    ]
                                },
                                {
                                    type: "timer",
                                    label: "Cage Time",
                                    default: 0,
                                    data: "25-9",
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
                                    data: "25-12",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Defense Skill Rating",
                                    default: 0,
                                    data: "25-13",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Robot Speed Rating",
                                    default: 0,
                                    data: "25-14",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Robot Stability Rating",
                                    default: 0,
                                    data: "25-15",
                                    src: [
                                        "/img/star-outline.png",
                                        "/img/star-filled.png"
                                    ]
                                },
                                {
                                    type: "rating",
                                    label: "Intake Consistency Rating",
                                    default: 0,
                                    data: "25-16",
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
    return ["/img/2025coral-grid.png"];
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
    return `,match,team,alliance,leave,"coral intake","algae ground intake","algae reef intake","auto algae scoring","auto coral scoring","teleop algae scoring","teleop coral scoring","cage level","cage time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "25-0", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "25-1", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "25-2", false)
                    ? "true"
                    : "false",
                find(entry, "abilities", categories, "25-3", false)
                    ? "true"
                    : "false",
                `"[${find(entry, "data", categories, "25-4", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "25-5", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "25-6", []).join(", ")}]"`,
                `"[${find(entry, "data", categories, "25-7", []).join(", ")}]"`,
                parseInt(find(entry, "abilities", categories, "25-8", 0)),
                parseInt(find(entry, "timers", categories, "25-9", 0)),
                parseInt(find(entry, "timers", categories, "25-10", 0)),
                parseInt(find(entry, "timers", categories, "25-11", 0)),
                parseInt(find(entry, "ratings", categories, "25-12", "")),
                parseInt(find(entry, "ratings", categories, "25-13", "")),
                parseInt(find(entry, "ratings", categories, "25-14", "")),
                parseInt(find(entry, "ratings", categories, "25-15", "")),
                parseInt(find(entry, "ratings", categories, "25-16", "")),
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
    asn: "algae net score",
    asp: "algae processor score",
    amn: "algae net missed",
    amp: "algae processor missed",
    cs1: "coral L1 score",
    cs2: "coral L2 score",
    cs3: "coral L3 score",
    cs4: "coral L4 score",
    cm1: "coral L1 missed",
    cm2: "coral L2 missed",
    cm3: "coral L3 missed",
    cm4: "coral L4 missed"
};

export function formatParsedData(data, categories, teams) {
    return `,match,team,alliance,leave,"coral intake","algae ground intake","algae reef intake","auto algae scoring","auto coral scoring","teleop algae scoring","teleop coral scoring","cage level","cage time","brick time","defense time","driver skill","defense skill",speed,stability,"intake consistency",scouter,comments,accuracy,timestamp\n${data
        .map((entry, i) => {
            return [
                i,
                entry.match || 0,
                entry.team || 0,
                entry.color || "unknown",
                find(entry, "abilities", categories, "25-0", false)
                    ? "yes"
                    : "no",
                find(entry, "abilities", categories, "25-1", false)
                    ? "yes"
                    : "no",
                find(entry, "abilities", categories, "25-2", false)
                    ? "yes"
                    : "no",
                find(entry, "abilities", categories, "25-3", false)
                    ? "yes"
                    : "no",
                `"${find(entry, "data", categories, "25-4", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                `"${find(entry, "data", categories, "25-5", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                `"${find(entry, "data", categories, "25-6", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                `"${find(entry, "data", categories, "25-7", [])
                    .map((entry) => parsedScoring[entry])
                    .join("\\n")}"`,
                ["none", "parked", "shallow", "deep"][
                    parseInt(find(entry, "abilities", categories, "25-8", 0))
                ],
                `${(
                    parseInt(find(entry, "timers", categories, "25-9", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "25-10", 0)) /
                    1000
                ).toFixed(3)}s`,
                `${(
                    parseInt(find(entry, "timers", categories, "25-11", 0)) /
                    1000
                ).toFixed(3)}s`,
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "25-12", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "25-13", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "25-14", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "25-15", "") + 1
                    )
                ),
                "⭐".repeat(
                    parseInt(
                        find(entry, "ratings", categories, "25-16", "") + 1
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
        let rankingCommand = `python3 config/scouting/2025/rankings_2025.py --event ${event} --baseFilePath ../ --csv ${event}.csv`;
        console.log(rankingCommand);
        pending.push(run(rankingCommand));
        let graphsCommand = `python3 config/scouting/2025/graphs_2025.py --mode 0 --event ${event} --team ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        console.log(graphsCommand);
        pending.push(run(graphsCommand));
        let radarStandardCommand = `python3 config/scouting/2025/graphs_2025.py --mode 1 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
        console.log(radarStandardCommand);
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2025/graphs_2025.py --mode 2 --event ${event} --teamList ${teamNumber} --baseFilePath ../ --csv ${event}.csv`;
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
            let predictionsCommand = `python3 config/scouting/2025/predictions_2025.py --event ${event} --baseFilePath ../ --csv ${event}.csv --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
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
        let radarStandardCommand = `python3 config/scouting/2025/graphs_2025.py --mode 1 --event ${event} --teamList ${teamNumbers.join(
            ","
        )} --baseFilePath ../ --csv ${event}.csv`;
        pending.push(run(radarStandardCommand));
        let radarMaxCommand = `python3 config/scouting/2025/graphs_2025.py --mode 2 --event ${event} --teamList ${teamNumbers.join(
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
        let predictionsCommand = `python3 config/scouting/2025/predictions_2025.py --event ${event} --baseFilePath ../ --csv ${event}.csv --r1 ${r1} --r2 ${r2} --r3 ${r3} --b1 ${b1} --b2 ${b2} --b3 ${b3}`;
        pending.push(run(predictionsCommand));

        await Promise.all(pending);

        let prediction = JSON.parse(
            fs
                .readFileSync(
                    `../${event}-${r1}-${r2}-${r3}-${b1}-${b2}-${b3}-prediction.json`
                )
                .toString()
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
    notes,
    analysis,
    compare,
    predict,
    accuracy /*,
    tps*/
};
export default scouting2025;
