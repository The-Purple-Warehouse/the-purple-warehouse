import config from "../config";
import fetch from "node-fetch";

export async function getEvents(year) {
    let events = await (await fetch(`https://www.thebluealliance.com/api/v3/events/${encodeURIComponent(year)}/simple?X-TBA-Auth-Key=${encodeURIComponent(config.auth.tba)}`)).json();
    return events.map((event) => {
        return {
            key: event.key,
            name: event.name
        };
    }).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMatches(event) {
    let matches = await (await fetch(`https://www.thebluealliance.com/api/v3/event/${encodeURIComponent(event)}/matches/simple?X-TBA-Auth-Key=${encodeURIComponent(config.auth.tba)}`)).json();
    return matches;
}