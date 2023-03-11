import { getAllDataByEvent, getSharedData } from "../helpers/scouting";

async function getAllScoutingData(event, teamNumber) {
    if (event == null) {
        console.log("Missing --event argument");
        return;
    }
    let data;
    if(teamNumber == null) {
        data = (await getAllDataByEvent(event)) as any;
    } else {
        data = (await getSharedData(event, teamNumber)) as any;
    }
    console.log(data);
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] == "--event" && args["event"] == null) {
        args["event"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--teamNumber" && args["teamNumber"] == null) {
        args["teamNumber"] = rawArgs[i + 1];
        i++;
    }
}

getAllScoutingData(args.event, args.teamNumber);
