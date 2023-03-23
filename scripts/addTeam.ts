import { addTeam, removeAllTeams } from "../helpers/teams";

async function addTeamToDatabase(
    teamName,
    teamNumber,
    accessToken,
    country,
    state
) {
    if (teamName == null) {
        console.log("Missing --teamName argument");
        return;
    }
    if (teamNumber == null) {
        console.log("Missing --teamNumber argument");
        return;
    }
    if (accessToken == null) {
        console.log("Missing --accessToken argument");
        return;
    }
    if (country == null) {
        console.log("Missing --country argument");
        return;
    }
    if (state == null) {
        console.log("Missing --state argument");
        return;
    }
    let team = (await addTeam(
        teamName,
        teamNumber,
        accessToken,
        country,
        state
    )) as any;
    console.log(`Added team: ${team.teamName} (${team.teamNumber})`);
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] == "--teamName" && args["teamName"] == null) {
        args["teamName"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--teamNumber" && args["teamNumber"] == null) {
        args["teamNumber"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--accessToken" && args["accessToken"] == null) {
        args["accessToken"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--country" && args["country"] == null) {
        args["country"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--state" && args["state"] == null) {
        args["state"] = rawArgs[i + 1];
        i++;
    }
}

addTeamToDatabase(
    args.teamName,
    args.teamNumber,
    args.accessToken,
    args.country,
    args.state
);
