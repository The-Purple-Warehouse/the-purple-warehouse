import { getAllDataByEvent } from "../helpers/scouting";

async function getAllScoutingData(event) {
    if (event == null) {
        console.log("Missing --event argument");
        return;
    }
    let data = (await getAllDataByEvent(event)) as any;
    console.log(data);
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] == "--event" && args["event"] == null) {
        args["event"] = rawArgs[i + 1];
        i++;
    }
}

getAllScoutingData(args.event);
