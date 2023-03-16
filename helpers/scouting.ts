import ScoutingEntry from "../models/scoutingEntry";
import ScoutingCategory from "../models/scoutingCategory";
import Team from "../models/team";
import { getTeamByNumber } from "./teams";
import * as crypto from "crypto";
import scoutingConfig from "../config/scouting";
import config from "../config";

export function getCategoryByIdentifier(identifier: string) {
    return ScoutingCategory.findOne({ identifier });
}

export async function addCategory(
    name: string,
    identifier: string,
    dataType?: string
) {
    let category = await getCategoryByIdentifier(identifier);
    if (category == null) {
        if (dataType === undefined) {
            category = new ScoutingCategory({
                name: name,
                identifier: identifier
            });
        } else {
            category = new ScoutingCategory({
                name: name,
                identifier: identifier,
                dataType: dataType
            });
        }
        await category.save();
    }
    return category;
}

export async function removeCategory(identifier: string) {
    return (
        (await ScoutingCategory.deleteOne({ identifier: identifier }))
            .deletedCount > 0
    );
}

export async function removeAllCategories() {
    await ScoutingCategory.deleteMany({});
}

export function getEntryByHash(hash: string) {
    return ScoutingEntry.findOne({ hash });
}

export async function entryExistsByHash(hash: string) {
    return (await getEntryByHash(hash)) != null;
}

export async function getLatestMatch(event: string) {
    let entry = (await ScoutingEntry.find({ event })
        .sort({ match: -1 })
        .limit(1)
        .lean()) as any;
    if (entry != null && entry[0] != null && entry[0].match != null) {
        return entry[0].match;
    } else {
        return 0;
    }
}

export async function getTeamEntriesByEvent(
    event: string,
    contributingTeam: string
) {
    return ScoutingEntry.find({
        event,
        "contributor.team": (await getTeamByNumber(contributingTeam))._id
    }).lean();
}

export async function addEntry(
    contributingTeam: string,
    contributingUsername: string,
    event: string,
    match: number,
    team: string,
    color: string,
    data: [any],
    abilities: [any],
    counters: [any],
    timers: [any],
    ratings: [any],
    comments: string,
    timestamp: number
) {
    let stringified = JSON.stringify([
        contributingTeam,
        contributingUsername,
        event,
        match,
        team,
        color,
        data.map((dataObj) => [
            "category",
            dataObj.category,
            "data",
            dataObj.data
        ]),
        abilities.map((abilityObj) => [
            "category",
            abilityObj.category,
            "ability",
            abilityObj.ability
        ]),
        counters.map((counterObj) => [
            "category",
            counterObj.category,
            "counter",
            counterObj.counter
        ]),
        timers.map((timerObj) => [
            "category",
            timerObj.category,
            "timer",
            timerObj.timer
        ]),
        ratings.map((ratingObj) => [
            "category",
            ratingObj.category,
            "rating",
            ratingObj.rating
        ]),
        comments
    ]);
    let hash = crypto.createHash("sha256").update(stringified).digest("hex");
    let entry = await getEntryByHash(hash);
    if (entry == null) {
        entry = new ScoutingEntry({
            contributor: {
                team: (await getTeamByNumber(contributingTeam))._id,
                username: contributingUsername
            },
            event: event,
            match: match,
            team: team,
            color: color,
            data: await Promise.all(
                data.map(async (element) => {
                    return {
                        category: (
                            await getCategoryByIdentifier(element.category)
                        )._id,
                        data: element.data
                    };
                })
            ),
            abilities: await Promise.all(
                abilities.map(async (element) => {
                    return {
                        category: (
                            await getCategoryByIdentifier(element.category)
                        )._id,
                        ability: element.ability
                    };
                })
            ),
            counters: await Promise.all(
                counters.map(async (element) => {
                    return {
                        category: (
                            await getCategoryByIdentifier(element.category)
                        )._id,
                        counter: element.counter
                    };
                })
            ),
            timers: await Promise.all(
                timers.map(async (element) => {
                    return {
                        category: (
                            await getCategoryByIdentifier(element.category)
                        )._id,
                        timer: element.timer
                    };
                })
            ),
            ratings: await Promise.all(
                ratings.map(async (element) => {
                    return {
                        category: (
                            await getCategoryByIdentifier(element.category)
                        )._id,
                        rating: element.rating
                    };
                })
            ),
            clientTimestamp: timestamp,
            serverTimestamp: new Date().getTime(),
            hash: hash,
            comments: comments
        });
        await entry.save();
    }
    return entry;
}

export async function getAllRawDataByEvent(event: string) {
    let data = await ScoutingEntry.find({ event }).lean();
    let teamsFromDatabase = await Team.find({}).lean();
    let categoriesFromDatabase = await ScoutingCategory.find({}).lean();
    let teams = {};
    for (let i = 0; i < teamsFromDatabase.length; i++) {
        let team = teamsFromDatabase[i] as any;
        teams[team._id.toString()] = team.teamNumber;
    }
    let categories = {};
    for (let i = 0; i < categoriesFromDatabase.length; i++) {
        let category = categoriesFromDatabase[i] as any;
        categories[category.identifier] = category._id.toString();
    }
    return { data, categories, teams };
}

export async function getAllDataByEvent(event: string) {
    let { data, categories, teams } = await getAllRawDataByEvent(event);
    return scoutingConfig.formatData(data, categories, teams);
}

export async function getSharedData(event: string, teamNumber: string) {
    let { data, categories, teams } = await getAllRawDataByEvent(event);
    let team = (await getTeamByNumber(teamNumber)) || { _id: "" };
    if (!config.auth.scoutingAdmins.includes(teamNumber)) {
        let contributions = data.filter(
            (entry: any) => entry.contributor.team == team._id.toString()
        );
        let hashStarts = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f"
        ].slice(
            0,
            Math.round(
                (contributions.length > 10 ? 10 : contributions.length) * 1.5
            )
        );
        data = data
            .map((entry: any) => {
                if (entry.contributor.team != team._id.toString()) {
                    if (!hashStarts.includes(entry.hash[0])) {
                        return null;
                    }
                    entry.comments = "[redacted for privacy]";
                    entry.contributor.username = crypto
                        .createHash("sha256")
                        .createHmac("sha256", config.auth.scoutingKeys[1])
                        .update(entry.contributor.username)
                        .digest("hex")
                        .substring(0, 8);
                    entry.ratings = [];
                }
                return entry;
            })
            .filter((entry: any) => entry != null);
    }
    return scoutingConfig.formatData(data, categories, teams);
}
