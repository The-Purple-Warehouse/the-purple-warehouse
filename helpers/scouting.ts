import ScoutingEntry from "../models/scoutingEntry";
import ScoutingCategory from "../models/scoutingCategory";
import Team from "../models/team";
import { getTeamByNumber } from "./teams";
import * as crypto from "crypto";
import scoutingConfig from "../config/scouting";

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
        comments,
        timestamp
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

export async function getAllDataByEvent(event: string) {
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
    return scoutingConfig.formatData(data, categories, teams);
}
