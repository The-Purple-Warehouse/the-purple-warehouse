import * as crypto from "crypto";
import { sortedStringify } from "./utils";
import TPSEntry, { TPSEntryType, TPSPrivacyRule } from "../models/tpsEntry";
import config from "../config";

const interfaces = ["abilities", "counters", "data", "metadata", "ratings", "timers"];
const serverInterfaces = ["abilities", "counters", "data", "metadata", "ratings", "timers", "server"];

function checkNull(object1, object2) {
    return object1 !== null && object1 !== undefined ? object1 : object2;
}

export function validatePrivacyRules(value: any, useServerInterfaces: boolean = false): TPSPrivacyRule[] {
    if (!Array.isArray(value)) {
        return [];
    }
    let interfacesList = interfaces;
    if(useServerInterfaces) {
        interfacesList = serverInterfaces;
    }
    return value.map((rule) => {
        if (typeof rule.path !== "string" || !interfacesList.includes(rule.path.split(".")[0])) {
            return null;
        }
        return {
            path: rule.path,
            private: checkNull(rule.private, false), // default to false
            teams: checkNull(rule.teams, []), // default to empty array
            type: checkNull(rule.type, "excluded"), // default to "excluded"
            detail: rule.detail
        };
    }).filter(rule => rule != null);
}

function scramble(value: any, length: number) {
    if (value == null || typeof value !== "string") {
        return null;
    }
    return crypto
        .createHmac("sha256", config.auth.scoutingKeys[1])
        .update(value)
        .digest("hex")
        .substring(0, length);
}

function cloneObject(value: any) {
    return JSON.parse(JSON.stringify(value));
}

export function format(tps: any, useServerInterfaces: boolean = false) {
    let interfacesList = interfaces;
    if(useServerInterfaces) {
        interfacesList = serverInterfaces;
    }
    let formatted = {};
    for(let i = 0; i < interfacesList.length; i++) {
        if(tps[interfacesList[i]] != null) {
            formatted[interfacesList[i]] = tps[interfacesList[i]];
        }
    }
    return formatted;
}

export function retrieveEntry(
    tps: any,
    teamNumber: string
): any {
    const rules = checkNull(tps.privacy, []); // privacy rules are stored with the data

    let defaultTeams = [];
    if(tps.metadata != null && tps.metadata.scouter != null && tps.metadata.scouter.team != null) {
        defaultTeams.push(tps.metadata.scouter.team);
    }

    const defaultRules: TPSPrivacyRule[] = [
        { path: "data.notes", private: true, type: "redacted", detail: "[redacted for privacy]", teams: defaultTeams },
        { path: "metadata.scouter.name", private: true, type: "scrambled", detail: 16, teams: defaultTeams }
    ];

    defaultRules.forEach((defaultRule) => {
        if (!rules.some((rule) => defaultRule.path == rule.path || defaultRule.path.startsWith(`${rule.path}.`))) {
            rules.push(defaultRule);
        }
    });

    const privacyRules = validatePrivacyRules(rules, true);

    const tpsPrivate = format(cloneObject(tps), false) as any;
    tpsPrivate.server = {
        timestamp: tps.serverTimestamp,
        accuracy: tps.accuracy
    }
    privacyRules.forEach((rule) => {
        let pathSegments = rule.path.split(".");
        let current: any = tps;
        let tpsPrivateCurrent: any = tpsPrivate;
        for (let i = 0; i < pathSegments.length - 1; ++i) {
            if (current[pathSegments[i]] === undefined || tpsPrivateCurrent[pathSegments[i]] === undefined) {
                return;
            }
            current = current[pathSegments[i]];
            tpsPrivateCurrent = tpsPrivateCurrent[pathSegments[i]];
        }

        const key = pathSegments[pathSegments.length - 1];
        if (current[key] === undefined || tpsPrivateCurrent[key] === undefined) {
            return;
        }

        if (
            rule.private &&
            (!rule.teams.length || !rule.teams.includes(teamNumber))
        ) {
            switch (rule.type) {
                case "scrambled":
                    tpsPrivateCurrent[key] = scramble(current[key], checkNull(rule.detail, 16));
                    break;
                case "redacted":
                    tpsPrivateCurrent[key] = checkNull(rule.detail, "[redacted for privacy]");
                    break;
                case "excluded":
                    delete tpsPrivateCurrent[key];
                    break;
            }
        }
    });

    return tpsPrivate;
}

export async function addEntry(data: any, privacy: any, serverTimestamp: number) {
    let hash = crypto
        .createHash("sha256")
        .update(sortedStringify(data))
        .digest("hex");
    let entry = (await getEntryByHash(hash)) as any;
    if (entry == null) {
        data.privacy = privacy;
        data.serverTimestamp = serverTimestamp;
        data.hash = hash;
        entry = new TPSEntry(data);
        await entry.save();
    }
    return entry;
}

export function getEntryByHash(hash: string) {
    return TPSEntry.findOne({ hash });
}

export async function entryExistsByHash(hash: string) {
    return (await getEntryByHash(hash)) != null;
}

export async function getLatestMatch(event: string) {
    let entries = (await TPSEntry.find({ "metadata.event": event })
        .sort({ "metadata.match.number": -1 })
        .lean()) as any;
    if (entries != null) {
        entries = entries.filter(entry => entry != null && entry.metadata != null && entry.metadata.match != null);
        let finals = entries.filter(entry => entry.metadata.match.level == "f");
        let semifinals = entries.filter(entry => entry.metadata.match.level == "sf");
        let quals = entries.filter(entry => entry.metadata.match.level == "qm");
        if(finals.length > 0) {
            return finals[0].metadata.match;
        } else if(semifinals.length > 0) {
            semifinals = semifinals.sort((a, b) => b.metadata.match.set - a.metadata.match.set);
            return semifinals[0].metadata.match;
        } else if(quals.length > 0) {
            return quals[0].metadata.match;
        }
    } else {
        return {level: "qm", number: 0, set: 1};
    }
}

export function getEntries(query: any) {
    if (query == null || typeof query !== "object") {
        return Promise.resolve([]);
    }
    let whitelist = [
        "metadata.event",
        "metadata.match.level",
        "metadata.match.number",
        "metadata.match.set",
        "metadata.bot",
        "metadata.scouter.team",
        "metadata.scouter.name",
        "metadata.scouter.app"
    ];
    let filter = {};
    for (let key of Object.keys(query)) {
        if (
            whitelist.includes(key) &&
            (typeof query[key] === "string" || typeof query[key] === "number")
        ) {
            filter[key] = query[key];
        }
    }
    return TPSEntry.find(filter).lean();
}

export function removeAll() {
    return TPSEntry.deleteMany();
}

export function getAll() {
    return TPSEntry.find().lean();
}
