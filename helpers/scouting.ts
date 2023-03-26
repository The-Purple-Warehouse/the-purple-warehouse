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

export async function getAverageAccuracy(
    event: string,
    contributingTeam: string,
    contributingUser: string,
    limit: number
) {
    let entries = await ScoutingEntry.find({
        event,
        "contributor.team": (await getTeamByNumber(contributingTeam))._id,
        "contributor.username": contributingUser,
        accuracy: { $exists: true },
        "accuracy.calculated": true
    })
        .sort({ match: -1 })
        .limit(limit)
        .lean();
    let pending = await ScoutingEntry.countDocuments({
        event,
        "contributor.team": (await getTeamByNumber(contributingTeam))._id,
        "contributor.username": contributingUser,
        $or: [
            { accuracy: { $exists: false } },
            { "accuracy.calculated": false }
        ]
    });
    if (entries.length == 0) {
        return {
            accuracy: 0,
            total: 0,
            pending
        };
    }
    return {
        accuracy:
            entries
                .map((entry) => (entry as any).accuracy.percentage)
                .reduce((total, current) => total + current, 0) /
            entries.length,
        total: entries.length,
        pending
    };
}

export function getLevelAndProgress(xp) {
    if(xp < 100) {
        return {
            level: 1,
            progress: xp / 100
        };
    } else if(xp < 500) {
        return {
            level: 2,
            progress: (xp - 100) / 400
        };
    } else if(xp < 1000) {
        return {
            level: 3,
            progress: (xp - 500) / 500
        };
    } else if(xp < 2000) {
        return {
            level: 4,
            progress: (xp - 1000) / 1000
        };
    } else if(xp < 3500) {
        return {
            level: 5,
            progress: (xp - 2000) / 1500
        };
    } else if(xp < 5000) {
        return {
            level: 6,
            progress: (xp - 3500) / 1500
        };
    } else if(xp < 7000) {
        return {
            level: 7,
            progress: (xp - 5000) / 2000
        };
    } else if(xp < 10000) {
        return {
            level: 8,
            progress: (xp - 7000) / 3000
        };
    } else if(xp < 15000) {
        return {
            level: 9,
            progress: (xp - 10000) / 5000
        };
    } else if(xp < 20000) {
        return {
            level: 10,
            progress: (xp - 20000) / 5000
        };
    } else {
        return {
            level: 10,
            progress: 1
        };
    }
}

export async function getTotalIncentives(contributingTeam, contributingUser) {
    let entries = await ScoutingEntry.find({
        "contributor.team": (await getTeamByNumber(contributingTeam))._id,
        "contributor.username": contributingUser,
        xp: { $exists: true }
    })
        .select({ xp: 1, nuts: 1, bolts: 1 })
        .lean();
    return {
        xp: entries.reduce((total, current: any) => total + current.xp, 0),
        nuts: entries.reduce((total, current: any) => total + current.nuts, 0),
        bolts: entries.reduce((total, current: any) => total + current.bolts, 0),
        ...getLevelAndProgress(entries.reduce((total, current: any) => total + current.xp, 0))
    };
}

export function randomBolts() {
    let rand = Math.random() * 100;
    if (rand < 2) {
        return 5;
    } else if (rand < 6) {
        return 4;
    } else if (rand > 13) {
        return 3;
    } else if (rand > 23) {
        return 2;
    } else if (rand > 45) {
        return 1;
    } else {
        return 0;
    }
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
        let rollingAccuracy: any = await getAverageAccuracy(
            event,
            contributingTeam,
            contributingUsername,
            5
        );
        let incentiveMultiplier = 1;
        if (rollingAccuracy.total > 3) {
            if (rollingAccuracy.accuracy > 0.8) {
                incentiveMultiplier = 1;
            } else if (rollingAccuracy.accuracy > 0.7) {
                incentiveMultiplier = 0.7;
            } else if (rollingAccuracy.accuracy > 0.6) {
                incentiveMultiplier = 0.4;
            } else if (rollingAccuracy.accuracy > 0.5) {
                incentiveMultiplier = 0.2;
            } else {
                incentiveMultiplier = 0;
            }
        } else if (rollingAccuracy.pending > 3) {
            incentiveMultiplier = 0;
        }
        if (event.endsWith("-prac")) {
            incentiveMultiplier = 0;
        }
        let duplicate = await ScoutingEntry.findOne({
            "contributor.team": (await getTeamByNumber(contributingTeam))._id,
            "contributor.username": contributingUsername,
            event,
            match,
            team
        });
        if (duplicate != null) {
            incentiveMultiplier = 0;
        }
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
            comments: comments,
            accuracy: {
                calculated: false,
                percentage: 0
            },
            xp: Math.round(
                (Math.random() * 100 + 100) * incentiveMultiplier +
                    (incentiveMultiplier > 0
                        ? rollingAccuracy.accuracy * 50
                        : 0)
            ),
            nuts: Math.round(
                (Math.random() * 50 + 50) * incentiveMultiplier +
                    (incentiveMultiplier > 0
                        ? rollingAccuracy.accuracy * 25
                        : 0)
            ),
            bolts: Math.round(randomBolts() * incentiveMultiplier),
            accuracyBoosters: {
                xp: Math.round(
                    incentiveMultiplier > 0 ? rollingAccuracy.accuracy * 50 : 0
                ),
                nuts: Math.round(
                    incentiveMultiplier > 0 ? rollingAccuracy.accuracy * 25 : 0
                )
            }
        });
        await entry.save();
        await updateAccuracy(event);
    }
    return entry;
}

export async function getAllRawDataByEvent(event: string) {
    let data;
    if (event.endsWith("-prac")) {
        data = await ScoutingEntry.find({ event })
            .sort({ serverTimestamp: 1 })
            .lean();
    } else {
        data = await ScoutingEntry.find({ event })
            .sort([
                ["match", 1],
                ["color", -1],
                ["team", 1]
            ])
            .lean();
    }
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

export async function getSummaryByEvent(event: string) {
    let { data, categories, teams } = await getAllRawDataByEvent(event);
    let matches = {};
    let teamMatches = {};
    let accuracies = {};
    let teamAccuracies = {};
    for (let i = 0; i < data.length; i++) {
        let entry = data[i] as any;
        let team = teams[entry.contributor.team._id.toString()];
        let username = entry.contributor.username;
        if (matches[team] == null) {
            matches[team] = {};
        }
        if (teamMatches[team] == null) {
            teamMatches[team] = 0;
        }
        if (matches[team][username] == null) {
            matches[team][username] = 0;
        }
        matches[team][username] += 1;
        teamMatches[team] += 1;
        if (accuracies[team] == null) {
            accuracies[team] = {};
        }
        if (teamAccuracies[team] == null) {
            teamAccuracies[team] = {
                numerator: 0,
                denominator: 0
            };
        }
        if (accuracies[team][username] == null) {
            accuracies[team][username] = {
                numerator: 0,
                denominator: 0
            };
        }
        if (entry.accuracy && entry.accuracy.calculated) {
            accuracies[team][username].numerator += entry.accuracy.percentage;
            accuracies[team][username].denominator += 1;
            teamAccuracies[team].numerator += entry.accuracy.percentage;
            teamAccuracies[team].denominator += 1;
        }
    }
    let matchesSorted = [];
    let accuraciesSorted = [];
    let teamMatchesSorted = [];
    let teamAccuraciesSorted = [];
    let teamsWithEntries = Object.keys(matches);
    for (let i = 0; i < teamsWithEntries.length; i++) {
        let usernames = Object.keys(matches[teamsWithEntries[i]]);
        for (let j = 0; j < usernames.length; j++) {
            matchesSorted.push({
                team: teamsWithEntries[i],
                username: usernames[j],
                amount: matches[teamsWithEntries[i]][usernames[j]]
            });
            if (accuracies[teamsWithEntries[i]][usernames[j]].denominator > 0) {
                accuraciesSorted.push({
                    team: teamsWithEntries[i],
                    username: usernames[j],
                    amount:
                        accuracies[teamsWithEntries[i]][usernames[j]]
                            .numerator /
                        accuracies[teamsWithEntries[i]][usernames[j]]
                            .denominator
                });
            }
        }
        teamMatchesSorted.push({
            team: teamsWithEntries[i],
            amount: teamMatches[teamsWithEntries[i]]
        });
        if (teamAccuracies[teamsWithEntries[i]].denominator > 0) {
            teamAccuraciesSorted.push({
                team: teamsWithEntries[i],
                amount:
                    teamAccuracies[teamsWithEntries[i]].numerator /
                    teamAccuracies[teamsWithEntries[i]].denominator
            });
        }
    }
    matchesSorted = matchesSorted.sort((a, b) => b.amount - a.amount);
    accuraciesSorted = accuraciesSorted.sort((a, b) => b.amount - a.amount);
    teamMatchesSorted = teamMatchesSorted.sort((a, b) => b.amount - a.amount);
    teamAccuraciesSorted = teamAccuraciesSorted.sort(
        (a, b) => b.amount - a.amount
    );
    return {
        individual: {
            matches: matchesSorted,
            accuracies: accuraciesSorted
        },
        team: {
            matches: teamMatchesSorted,
            accuracies: teamAccuraciesSorted
        }
    };
}

export async function getSharedData(
    event: string,
    teamNumber: string,
    threshold: number = 10
) {
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
                (contributions.length > threshold
                    ? threshold
                    : contributions.length) *
                    (16 / threshold)
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

export async function updateAccuracy(event: string) {
    let { data, categories, teams } = await getAllRawDataByEvent(event);
    let matches: any = {};
    for (let i = 0; i < data.length; i++) {
        let entry = data[i] as any;
        if (matches[`match${entry.match}`] == null) {
            matches[`match${entry.match}`] = [];
        }
        matches[`match${entry.match}`].push(entry);
    }
    let matchNumbers = Object.keys(matches);
    for (let i = 0; i < matchNumbers.length; i++) {
        if (
            matches[matchNumbers[i]].filter(
                (entry) => !entry.accuracy || !entry.accuracy.calculated
            ).length == 0
        ) {
            delete matches[matchNumbers[i]];
        }
    }
    let calculated = await scoutingConfig.accuracy(
        event,
        matches,
        data,
        categories,
        teams
    );
    let hashes = Object.keys(calculated);
    await Promise.all(
        hashes.map((hash) => {
            return ScoutingEntry.findOneAndUpdate(
                {
                    hash
                },
                {
                    "accuracy.calculated": true,
                    "accuracy.percentage": calculated[hash]
                }
            );
        })
    );
}

export async function getStats() {
    let entries = await ScoutingEntry.find({}, { contributor: 1 }).lean();
    let users = new Set();
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i] as any;
        users.add(
            `${entry.contributor.team.toString()}-${entry.contributor.username}`
        );
    }
    return {
        entries: await ScoutingEntry.countDocuments({}),
        scouters: [...users].length,
        teams: await Team.countDocuments({
            teamNumber: { $ne: config.auth.scoutingInternal.teamNumber }
        }),
        countries: (await Team.distinct("country")).length,
        states: (await Team.distinct("state")).filter((state) => state != "")
            .length
    };
}
