import { addTeam, removeAllTeams } from "../helpers/teams";

async function initializeExampleTeams() {
    await removeAllTeams();
    const teams = [
        { teamName: "Harker Robotics", teamNumber: "1072", accessToken: "123", country: "USA" }
    ];
    for (let i = 0; i < teams.length; i++) {
        let team = (await addTeam(
            teams[i].teamName,
            teams[i].teamNumber,
            teams[i].accessToken,
            teams[i].country
        )) as any;
        console.log(`Added team: ${team.teamName} (${team.teamNumber})`);
    }
    return;
}

initializeExampleTeams();
