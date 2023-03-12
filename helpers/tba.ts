import config from "../config";
// @ts-ignore
import practice from "../config/scouting/practice";
import fetch from "node-fetch";
import * as fs from "fs";

let cache;

try {
    cache = JSON.parse(fs.readFileSync("../tbacache.json").toString());
} catch (err) {
    cache = {
        events: {},
        matches: {},
        matchesFull: {}
    };
}

async function syncEventsCache(year) {
    try {
        let events = await (
            await fetch(
                `https://www.thebluealliance.com/api/v3/events/${encodeURIComponent(
                    year
                )}/simple?X-TBA-Auth-Key=${encodeURIComponent(config.auth.tba)}`
            )
        ).json();
        let formatted = (events as any).map((event) => {
            return {
                key: event.key,
                name: event.name
            };
        });
        formatted.push({
            key: "2023cafr-prac",
            name: "Central Valley Regional PRACTICE"
        });
        cache.events[year] = {
            value: formatted.sort((a, b) => a.name.localeCompare(b.name)),
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

export async function getEvents(year) {
    if (cache.events[year] == null) {
        await syncEventsCache(year);
    } else if (new Date().getTime() > cache.events[year].timestamp + 60000) {
        syncEventsCache(year);
    }
    return cache.events[year].value;
}

async function syncMatchesCache(event) {
    try {
        let matches = [];
        if (event.endsWith("-prac")) {
            matches = practice[event] || [];
        } else {
            matches = await (
                await fetch(
                    `https://www.thebluealliance.com/api/v3/event/${encodeURIComponent(
                        event
                    )}/matches/simple?X-TBA-Auth-Key=${encodeURIComponent(
                        config.auth.tba
                    )}`
                )
            ).json();
        }
        cache.matches[event] = {
            value: matches,
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

export async function getMatches(event) {
    if (cache.matches[event] == null) {
        await syncMatchesCache(event);
    } else if (new Date().getTime() > cache.matches[event].timestamp + 60000) {
        syncMatchesCache(event);
    }
    return cache.matches[event].value;
}

async function syncMatchesFullCache(event) {
    try {
        let matches = [];
        if (event.endsWith("-prac")) {
            matches = practice[event] || [];
        } else {
            matches = await (
                await fetch(
                    `https://www.thebluealliance.com/api/v3/event/${encodeURIComponent(
                        event
                    )}/matches?X-TBA-Auth-Key=${encodeURIComponent(
                        config.auth.tba
                    )}`
                )
            ).json();
        }
        cache.matchesFull[event] = {
            value: matches,
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

export async function getMatchesFull(event) {
    if (cache.matchesFull[event] == null) {
        await syncMatchesFullCache(event);
    } else if (
        new Date().getTime() >
        cache.matchesFull[event].timestamp + 60000
    ) {
        syncMatchesFullCache(event);
    }
    return cache.matchesFull[event].value;
}
