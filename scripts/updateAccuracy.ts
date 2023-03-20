import { updateAccuracy } from "../helpers/scouting";

async function updateAccuracyForEvent(event) {
    if (event == null) {
        console.log("Missing --event argument");
        return;
    }
    await updateAccuracy(event);
    console.log("Updated!");
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

updateAccuracyForEvent(args.event);
