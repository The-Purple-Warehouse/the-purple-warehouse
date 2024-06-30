import { v4 as uuidv4 } from "uuid";
import APIKey from "../models/apiKey";
import { APIKeyType } from "../models/apiKey";
import * as crypto from "crypto";

function ensureType(data: any): any {
    if (data == null || typeof data !== "object") {
        return {};
    }
    if (
        typeof data.username !== "string" ||
        typeof data.team !== "string" ||
        typeof data.app !== "string" ||
        !Array.isArray(data.scopes) ||
        typeof data.expiration !== "number" ||
        typeof data.source !== "string" ||
        typeof data.limit !== "number"
    ) {
        return {};
    }
    let obj: APIKeyType = {} as APIKeyType;
    obj.name = data.name;
    obj.username = data.username;
    obj.team = data.team;
    obj.app = data.app;
    obj.scopes = data.scopes;
    obj.expiration = data.expiration;
    obj.source = data.source;
    obj.limit = data.limit;
    return obj;
}

function hashKey(key: string, hashType: string) {
    return crypto.createHash(hashType).update(key).digest("hex");
}

export function generateAPIKey() {
    return uuidv4();
}

export function generateAPIIdentifier() {
    return uuidv4();
}

export async function addAPIKey(rawOptions: any) {
    if (typeof rawOptions !== "object") {
        return null;
    }
    const unhashed = generateAPIKey();
    let options: APIKeyType = ensureType(rawOptions);
    options.creation = Date.now();
    options.live = true;
    options.source = options.source == "manual" ? "manual" : "login";
    options.hashType = "sha256";
    options.apiKey = hashKey(unhashed, options.hashType);
    options.apiIdentifier = generateAPIIdentifier();
    options.limit = options.limit || 2500; // a default character limit
    options.name =
        options.name ||
        `${options.app} (${options.apiIdentifier.split("-")[0]})`;

    let apiKey;
    try {
        apiKey = new APIKey(options);
        await apiKey.save();
    } catch (err) {
        console.error(err);
        return { key: null, identifier: null };
    }
    return { key: unhashed, identifier: options.apiIdentifier };
}

export async function enableAPIKey(identifier: string) {
    await APIKey.findOneAndUpdate(
        { apiIdentifier: identifier },
        { live: true }
    );
    return true;
}

export async function disableAPIKey(identifier: string) {
    await APIKey.findOneAndUpdate(
        { apiIdentifier: identifier },
        { live: false }
    );
    return true;
}

export async function verifyAPIKey(
    key: string,
    username: string,
    app: string,
    team: string,
    scopes: string[],
    verify: string[]
) {
    if (key == null) {
        return { verified: false };
    }
    let query: any = {
        apiKey: hashKey(key, "sha256"),
        hashType: "sha256"
    };
    if (verify.includes("username")) {
        query.username = username;
    }
    if (verify.includes("app")) {
        query.app = app;
    }
    if (verify.includes("team")) {
        query.team = team;
    }
    const apiKey = (await APIKey.findOne(query)) as any;
    if (apiKey == null) {
        return { verified: false };
    }
    if (apiKey.expiration < Date.now()) {
        return { verified: false };
    }
    if (!apiKey.live) {
        return { verified: false };
    }
    if (!scopes || !Array.isArray(scopes)) {
        return { verified: false };
    }
    for (let scope of scopes) {
        if (!apiKey.scopes.includes(scope)) {
            return { verified: false };
        }
    }
    return { verified: true, key: apiKey };
}

export function removeAll() {
    return APIKey.deleteMany({});
}

export async function getAll() {
    return await APIKey.find({}).lean();
}

/**
 * Retrive the rate limit and team number for a given API key.
 * @param apiKey the API key to verify
 * @returns the team number and rate limit for the given API key
 */
export async function retrieveRateLimit(apiKey) {
    const info = await verifyAPIKey(apiKey, null, null, null, [], []); // verification already happened, just retrieve the team # + rate limit
    if (!info.verified) {
        return { teamNumber: "", rateLimit: 0 };
    }
    return { teamNumber: info.key.team, rateLimit: info.key.rateLimit };
}