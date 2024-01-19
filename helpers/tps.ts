import * as crypto from "crypto";
import { sortedStringify } from "./utils";
import TPSEntry from "../models/tpsEntry";

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
