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
        { name: "Speed Rating", identifier: "23-15" }
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
                    label: (state) => `AUTO (${state.teamNumber})`
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
                    src: "./img/2023grid.png",
                    default: [],
                    data: {
                        locations: "23-2",
                        values: "23-3",
                        counter: "23-6"
                    },
                    rows: 9,
                    columns: 3,
                    orientation: 1,
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
                    label: "Charge Station level",
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
                    label: (state) => `TELEOP (${state.teamNumber})`
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
                    src: "./img/2023grid.png",
                    default: [],
                    data: {
                        locations: "23-4",
                        values: "23-5",
                        counter: "23-7"
                    },
                    rows: 9,
                    columns: 3,
                    orientation: 1,
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
                    label: (state) => `ENDGAME (${state.teamNumber})`
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
                    label: "Charge Station level",
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
                    label: (state) => `NOTES (${state.teamNumber})`
                },
                {
                    type: "text",
                    label: "Please give any important information about this robot or its performance in the match including:\n\n- Driver skill\n- Ability to defend\n- Ability to score against defense\n- Robot stability\n- Fouls or other issues\n- Anything else that is relevant"
                },
                {
                    type: "textbox",
                    placeholder: "Enter notes here...",
                    default: "",
                    data: "notes"
                },
                {
                    type: "rating",
                    label: "Drive Skill Rating",
                    default: 4,
                    data: "23-13"
                },
                {
                    type: "rating",
                    label: "Defense Skill Rating",
                    default: 4,
                    data: "23-14"
                },
                {
                    type: "rating",
                    label: "Speed Rating",
                    default: 4,
                    data: "23-15"
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
    ]
}

const scouting2023 = { categories, layout };
export default scouting2023;
