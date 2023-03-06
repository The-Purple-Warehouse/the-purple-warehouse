import { hashAccessToken } from "../helpers/teams";

function hash(accessToken) {
    if (accessToken == null) {
        console.log("Missing --accessToken argument");
        return;
    }
    let hashedToken = hashAccessToken(accessToken);
    console.log(`${hashedToken}`);
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] == "--accessToken" && args["accessToken"] == null) {
        args["accessToken"] = rawArgs[i + 1];
        i++;
    }
}

hash(args.accessToken);
