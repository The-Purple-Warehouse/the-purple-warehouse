import Team from "../models/team";

export default class {

    static async getTeamByNumber(teamNumber: string) {
        await Team.findOne({teamNumber});
    }

}