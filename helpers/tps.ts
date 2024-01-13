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
    return TPSEntry.find(query).lean();
}

export function removeAll() {
    return TPSEntry.deleteMany();
}

export function getAll() {
    return TPSEntry.find().lean();
}
