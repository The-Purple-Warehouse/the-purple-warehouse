import * as crypto from "crypto";
import { sortedStringify } from "./utils";
import TPSEntry, { TPSEntryType, TPSPrivacyRule } from "../models/tpsEntry";
import config from "../config";

function validatePrivacyRules(value: any): TPSPrivacyRule[] {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map((rule) => {
        if (typeof rule.path !== "string") {
            throw new Error("Invalid 'path' in privacy rule.");
        }
        return {
            path: rule.path,
            private: rule.private ?? false, // default to false
            teams: rule.teams ?? [], // default to empty array
            type: rule.type ?? "excluded" // default to "excluded"
        };
    });
}

function scramble(value: any) {
    if (value == null || typeof value !== "string") {
        return null;
    }
    return crypto
        .createHmac("sha256", config.auth.scoutingKeys[1])
        .update(value)
        .digest("hex")
        .substring(0, 16);
}

function cloneObject(value: any) {
    return JSON.parse(JSON.stringify(value));
}

export function retrieveEntry(
    tps: TPSEntryType,
    teamNumber: string
): TPSEntryType {
    const rules = tps.privacy ?? []; // privacy rules are stored with the data

    const defaultRules: TPSPrivacyRule[] = [
        { path: "data.notes", private: true, type: "redacted" },
        { path: "metadata.scouter.name", private: true, type: "scrambled" }
    ];

    defaultRules.forEach((defaultRule) => {
        if (!rules.some((rule) => rule.path === defaultRule.path)) {
            rules.push(defaultRule);
        }
    });

    const privacyRules = validatePrivacyRules(rules);

    const tpsPrivate = cloneObject(tps);

    privacyRules.forEach((rule) => {
        let pathSegments = rule.path.split(".");
        let current: any = tps;
        for (let i = 0; i < pathSegments.length - 1; ++i) {
            if (current[pathSegments[i]] === undefined) {
                return;
            }
            current = current[pathSegments[i]];
        }

        const key = pathSegments[pathSegments.length - 1];
        if (current[key] === undefined) {
            return;
        }

        if (
            rule.private &&
            (!rule.teams.length || !rule.teams.includes(teamNumber))
        ) {
            switch (rule.type) {
                case "scrambled":
                    tpsPrivate[key] = scramble(current[key]);
                    break;
                case "redacted":
                    tpsPrivate[key] = "[redacted for privacy]";
                    break;
                case "excluded":
                    delete tpsPrivate[key];
                    break;
            }
        }
    });

    if (tpsPrivate.privacy) delete tpsPrivate.privacy; // do not pass the privacy rules to the requester
    return tpsPrivate;
}

export async function addEntry(data: any, serverTimestamp: number) {
    let hash = crypto
        .createHash("sha256")
        .update(sortedStringify(data))
        .digest("hex");
    let entry = (await getEntryByHash(hash)) as any;
    if (entry == null) {
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
