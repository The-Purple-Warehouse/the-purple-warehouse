import Team from "../models/team";
import ScoutingCategory from "../models/scoutingCategory";
import {getCategoryByIdentifier} from "./scouting";

export function getTeamByNumber(teamNumber: string) {
    return Team.findOne({ teamNumber });
}

export async function teamExistsByNumber(teamNumber: string) {
    return (await getTeamByNumber(teamNumber)) != null;
}

export async function addTeam(
    teamName: string,
    teamNumber: string,
    accessToken: string
) {
    let team = await getTeamByNumber(teamNumber);
    if (team == null) {
        team = new Team({
            teamName: teamName,
            teamNumber: teamNumber,
            accessToken: accessToken
        });
        await team.save();
    }
    return team;
}

export async function getAccessToken(teamNumber: string): Promise<string> {
    const team = (await getTeamByNumber(teamNumber)) as any;
    return team.accessToken;
}

export async function removeTeam(teamNumber: string) {
    return (
        (await Team.deleteOne({ teamNumber }))
            .deletedCount > 0
    );
}

export async function removeAllTeams() {
    await Team.deleteMany({});
}