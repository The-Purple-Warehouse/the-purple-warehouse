import ScoutingEntry from "../models/scoutingEntry";
import ScoutingCategory from "../models/scoutingCategory";
import teams from "./teams";
import * as crypto from "crypto";

export default class {

    static async getCategoryByIdentifier(identifier: string) {
        await ScoutingCategory.findOne({identifier});
    }

    static async getEntryByHash(hash: string) {
        return await ScoutingEntry.findOne({hash});
    }

    static async entryExistsByHash(hash: string) {
        return (await this.getEntryByHash(hash)) != null;
    }

    static async addEntry(contributingTeam: string, contributingUsername: string, match: number, team: string,
                          color: string, data: [any], abilities: [any], counters: [any], timers: [any], ratings: [any],
                          comments: string, timestamp: number) {
        let stringified = JSON.stringify([
            contributingTeam,
            contributingUsername,
            match,
            team,
            color,
            data.map((dataObj) => ["category", dataObj.category, "data", dataObj.data]),
            abilities.map((abilityObj) => ["category", abilityObj.category, "ability", abilityObj.ability]),
            counters.map((counterObj) => ["category", counterObj.category, "counter", counterObj.counter]),
            timers.map((timerObj) => ["category", timerObj.category, "timer", timerObj.timer]),
            ratings.map((ratingObj) => ["category", ratingObj.category, "rating", ratingObj.rating]),
            comments,
            timestamp
        ]);
        let hash = crypto.createHash("sha256").update(stringified).digest("hex");
        if (!(await this.entryExistsByHash(hash))) {
            await (new ScoutingEntry({
                contributor: {
                    team: teams.getTeamByNumber(contributingTeam),
                    username: contributingUsername
                },
                match: match,
                team: team,
                color: color,
                data: data.map(dataObj => {
                    return {
                        category: this.getCategoryByIdentifier(dataObj.category),
                        data: dataObj.data
                    }
                }),
                abilities: abilities.map(abilityObj => {
                    return {
                        category: this.getCategoryByIdentifier(abilityObj.category),
                        ability: abilityObj.ability
                    }
                }),
                counters: counters.map(counterObj => {
                    return {
                        category: this.getCategoryByIdentifier(counterObj.category),
                        counter: counterObj.counter
                    }
                }),
                timers: timers.map(timerObj => {
                    return {
                        category: this.getCategoryByIdentifier(timerObj.category),
                        timer: timerObj.timer
                    }
                }),
                ratings: ratings.map(ratingObj => {
                    return {
                        category: this.getCategoryByIdentifier(ratingObj.category),
                        rating: ratingObj.rating
                    }
                }),
                clientTimestamp: timestamp,
                serverTimestamp: (new Date()).getTime(),
                hash: hash,
                comments: comments
            })).save();
        }
    }

    static async addCategory(name: string, identifier: string, dataType?: string) {
        if (dataType === undefined) {
            await (new ScoutingCategory({
                name: name,
                identifier: identifier
            })).save();
        } else {
            await (new ScoutingCategory({
                name: name,
                identifier: identifier,
                dataType: dataType
            })).save();
        }
    }
}