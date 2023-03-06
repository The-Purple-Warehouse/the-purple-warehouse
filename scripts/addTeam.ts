import { addTeam, removeAllTeams } from "../helpers/teams";

async function addTeamToDatabase(teamName, teamNumber, accessToken) {
    if(teamName == null) {
        console.log("Missing --teamName argument");
        return;
    }
    if(teamNumber == null) {
        console.log("Missing --teamNumber argument");
        return;
    }
    if(accessToken == null) {
        console.log("Missing --accessToken argument");
        return;
    }
    let team = (await addTeam(
        teamName,
        teamNumber,
        accessToken
    )) as any;
    console.log(
        `Added team: ${team.teamName} (${team.teamNumber})`
    );
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for(let i = 0; i < rawArgs.length; i++) {
    if(rawArgs[i] == "--teamName" && args["teamName"] == null) {
        args["teamName"] = rawArgs[i + 1];
        i++;
    } else if(rawArgs[i] == "--teamNumber" && args["teamNumber"] == null) {
        args["teamNumber"] = rawArgs[i + 1];
        i++;
    } else if(rawArgs[i] == "--accessToken" && args["accessToken"] == null) {
        args["accessToken"] = rawArgs[i + 1];
        i++;
    }
}

addTeamToDatabase(args.teamName, args.teamNumber, args.accessToken);
