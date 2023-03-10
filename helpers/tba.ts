import config from "../config";
// @ts-ignore
import practice from "../config/scouting/practice";
import fetch from "node-fetch";

export async function getEvents(year) {
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
    return formatted.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMatches(event) {
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
    return matches;
}
