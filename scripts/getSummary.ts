import { getSummaryByEvent } from "../helpers/scouting";

async function getSummary(event) {
    if (event == null) {
        console.log("Missing --event argument");
        return;
    }
    let data = (await getSummaryByEvent(event)) as any;
    console.log("INDIVIDUAL MATCHES:");
    console.log(
        data.individual.matches
            .map(
                (match) =>
                    `${match.username} (${match.team}) - ${match.amount} match${
                        match.amount > 1 ? "es" : ""
                    }`
            )
            .join("\n")
    );
    console.log("");
    console.log("INDIVIDUAL ACCURACIES:");
    console.log(
        data.individual.accuracies
            .map(
                (accuracy) =>
                    `${accuracy.username} (${accuracy.team}) - ${
                        accuracy.amount * 100
                    }% accuracy`
            )
            .join("\n")
    );
    console.log("");
    console.log("TEAM MATCHES:");
    console.log(
        data.team.matches
            .map(
                (match) =>
                    `${match.team} - ${match.amount} match${
                        match.amount > 1 ? "es" : ""
                    }`
            )
            .join("\n")
    );
    console.log("");
    console.log("TEAM ACCURACIES:");
    console.log(
        data.team.accuracies
            .map(
                (accuracy) =>
                    `${accuracy.team} - ${accuracy.amount * 100}% accuracy`
            )
            .join("\n")
    );
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

getSummary(args.event);
