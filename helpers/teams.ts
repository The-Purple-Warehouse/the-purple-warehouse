import Team from "../models/team";

export function getTeamByNumber(teamNumber: string) {
    return Team.findOne({ teamNumber });
}