import { v4 as uuidv4 } from "uuid";
import APIKey from "../models/apiKey";
import { key } from "../models/apiKey";
import * as crypto from "crypto";

function ensureType(data: any): key | null {
    if (data == null || typeof data !== "object") {
        return null;
    }
    if (typeof data.name !== "string" || typeof data.team !== "string" || typeof data.app !== "string"
        || !Array.isArray(data.scopes) || typeof data.expiration !== "number" || typeof data.source !== "string") {
        return null;
    }
    let obj: key = {} as key;
    obj.name = data.name;
    obj.team = data.team;
    obj.app = data.app;
    obj.scopes = data.scopes;
    obj.expiration = data.expiration;
    obj.source = data.source;
    return obj;
}

function hashKey(key: string, hashType: string) {
    return crypto.createHash(hashType).update(key).digest("hex");
}

export function generateAPIKey() {
    return uuidv4();
}

export async function addAPIKey(data: any) {
    if (typeof data !== "object") {
        return null;
    }
    const unhashed = generateAPIKey();
    let options: key = ensureType(data);
    options.creation = Date.now();
    options.live = true;
    options.source = options.source == "manual" ? "manual" : "login flow";
    options.hashType = "sha256";
    options.apiKey = hashKey(unhashed, options.hashType);

    let apiKey;
    try {
        apiKey = new APIKey(options);
        await apiKey.save();
    } catch (err) {
        console.error(err);
        return null;
    }
    return { key: unhashed, ...apiKey};
}

export function enableAPIKey(key: string) {
    return APIKey.findOneAndUpdate(
        { apiKey: hashKey(key, "sha256") }, 
        { live: true },
        { new: true }
    );
}

export function disableAPIKey(key: string) {
    return APIKey.findOneAndUpdate(
        { apiKey: hashKey(key, "sha256") }, 
        { live: false },
        { new: true }
    );
}

export async function verifyAPIKey(key: string, expiration: number, scouter: string, app: string, team: string, scopes: string[]) {
    if (key == null) {
        return false;
    }
    const apiKey = await APIKey.findOne({ apiKey: hashKey(key, "sha256"), expiration, scouter, app, team });
    if (apiKey == null) {
        return false;
    }
    if (expiration < Date.now()) {
        return false;
    }
    if (!(apiKey as any).live) {
        return false;
    }
    if (!scopes || !Array.isArray(scopes)) {
        return false;
    }
    for (let scope of scopes) {
        if (!(apiKey as any).scopes.includes(scope)) {
            return false;
        }
    }
    return true;
}

export function removeAll() {
    return APIKey.deleteMany({});
}