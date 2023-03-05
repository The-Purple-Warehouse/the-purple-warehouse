import Team from "../models/team";

export default class {
    static async getAccessToken(teamNumber: string): Promise<string> {
        const team = (await Team.findOne({ teamNumber })) as any;
        return team.accessToken;
    }
}
