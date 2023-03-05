export function categories() {
    return [
        {name: "Leaves Community", identifier: "23-0", dataType: "boolean"},
        {name: "Ground Pick-Up", identifier: "23-1", dataType: "boolean"},
        {name: "Auto Scoring Locations", identifier: "23-2", dataType: "array"},
        {name: "Auto Game Pieces", identifier: "23-3", dataType: "array"},
        {name: "Teleop Scoring Locations", identifier: "23-4", dataType: "array"},
        {name: "Teleop Game Pieces", identifier: "23-5", dataType: "array"},
        {name: "Auto Count", identifier: "23-6"},
        {name: "Auto Charge Station Level", identifier: "23-7"},
        {name: "Teleop Charge Station Level", identifier: "23-8"},
        {name: "Teleop Charge Station Time", identifier: "23-9"},
        {name: "Break Time", identifier: "23-10"},
        {name: "Defense Time", identifier: "23-11"},
        {name: "Drive Skill Rating", identifier: "23-12"},
        {name: "Defense Skill Rating", identifier: "23-13"},
        {name: "Speed Rating", identifier: "23-14"}
    ];
}

const scouting2023 = { categories };
export default scouting2023;