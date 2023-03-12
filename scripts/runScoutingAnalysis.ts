import scoutingConfig from "../config/scouting";

async function runScoutingAnalysis(event, teamNumber) {
    if (event == null) {
        console.log("Missing --event argument");
        return;
    }
    if (teamNumber == null) {
        console.log("Missing --teamNumber argument");
        return;
    }
    console.log(await scoutingConfig.analysis(event, teamNumber));
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

runScoutingAnalysis(args.event, args.teamNumber);
