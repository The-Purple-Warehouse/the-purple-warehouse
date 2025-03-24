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
        matchesFull: {},
        teamEvents: {},
        eventTeams: {}
    };
}

const EVENT_PRIORITY = {
    "Archimedes Division": 1,
    "Curie Division": 1,
    "Daly Division": 1,
    "Galileo Division": 1,
    "Hopper Division": 1,
    "Johnson Division": 1,
    "Milstein Division": 1,
    "Newton Division": 1
};

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
        if (cache.events == null) {
            cache.teamEvents = {};
        }
        cache.events[year] = {
            value: formatted.sort((a, b) => {
                let aPriority = EVENT_PRIORITY[a.name] || 0;
                let bPriority = EVENT_PRIORITY[b.name] || 0;
                if (aPriority == bPriority) {
                    return a.name.localeCompare(b.name);
                } else {
                    return bPriority - aPriority;
                }
            }),
            timestamp: new Date().getTime()
        };
        cache.events[year].value.unshift({
            key: `${year}all-prac`,
            name: "PRACTICE MATCHES"
        });
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

async function syncTeamEventsCache(year, team) {
    try {
        let events = await (
            await fetch(
                `https://www.thebluealliance.com/api/v3/team/frc${encodeURIComponent(
                    team
                )}/events/${encodeURIComponent(
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
        if (cache.teamEvents == null) {
            cache.teamEvents = {};
        }
        if (cache.teamEvents[year] == null) {
            cache.teamEvents[year] = {};
        }
        cache.teamEvents[year][team] = {
            value: formatted.sort((a, b) => {
                let aPriority = EVENT_PRIORITY[a.name] || 0;
                let bPriority = EVENT_PRIORITY[b.name] || 0;
                if (aPriority == bPriority) {
                    return a.name.localeCompare(b.name);
                } else {
                    return bPriority - aPriority;
                }
            }),
            timestamp: new Date().getTime()
        };
        cache.teamEvents[year][team].value.unshift({
            key: `${year}all-prac`,
            name: "PRACTICE MATCHES"
        });
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

async function syncEventTeamsCache(year, event) {
    try {
        const teams = await (
            await fetch(
                `https://www.thebluealliance.com/api/v3/event/${encodeURIComponent(
                    event
                )}/teams/simple?X-TBA-Auth-Key=${encodeURIComponent(config.auth.tba)}`
            )
        ).json();
        if (!cache.eventTeams) {
            cache.eventTeams = {};
        }
        if (!cache.eventTeams[year]) {
            cache.eventTeams[year] = {};
        }
        cache.eventTeams[year][event] = {
            value: teams,
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {
        console.error(err);
    }
}

export async function getEvents(year) {
    try {
        if (cache.events == null) {
            cache.events = {};
        }
        if (cache.events[year] == null) {
            await syncEventsCache(year);
        } else if (
            new Date().getTime() >
            cache.events[year].timestamp + 60000
        ) {
            syncEventsCache(year);
        }
        return cache.events[year].value;
    } catch (err) {
        // year = new Date().toLocaleDateString().split("/")[2];
        year = config.year;
        if (cache.events == null) {
            cache.events = {};
        }
        if (cache.events[year] == null) {
            await syncEventsCache(year);
        } else if (
            new Date().getTime() >
            cache.events[year].timestamp + 60000
        ) {
            syncEventsCache(year);
        }
        return cache.events[year].value;
    }
}

export async function getTeamEvents(year, team) {
    try {
        if (cache.teamEvents == null) {
            cache.teamEvents = {};
        }
        if (
            cache.teamEvents[year] == null ||
            cache.teamEvents[year][team] == null
        ) {
            await syncTeamEventsCache(year, team);
        } else if (
            new Date().getTime() >
            cache.teamEvents[year][team].timestamp + 60000
        ) {
            syncTeamEventsCache(year, team);
        }
        return cache.teamEvents[year][team].value;
    } catch (err) {
        // year = new Date().toLocaleDateString().split("/")[2];
        year = config.year;
        if (cache.teamEvents == null) {
            cache.teamEvents = {};
        }
        if (
            cache.teamEvents[year] == null ||
            cache.teamEvents[year][team] == null
        ) {
            await syncTeamEventsCache(year, team);
        } else if (
            new Date().getTime() >
            cache.teamEvents[year][team].timestamp + 60000
        ) {
            syncTeamEventsCache(year, team);
        }
        return cache.teamEvents[year][team].value;
    }
}

export async function getEventTeams(event, year) {
    if (!cache.eventTeams) {
        cache.eventTeams = {};
    }
    if (!cache.eventTeams[year]) {
        cache.eventTeams[year] = {};
    }
    if (!cache.eventTeams[year][event]) {
        await syncEventTeamsCache(year, event);
    } else if (
        new Date().getTime() > cache.eventTeams[year][event].timestamp + 60000
    ) {
        syncEventTeamsCache(year, event);
    }
    return cache.eventTeams[year][event].value;
}

export async function getEventsSorted(year, team) {
    let events = await getEvents(year);
    let teamEvents = await getTeamEvents(year, team);
    let sortedEvents = teamEvents.map((event) => {
        return {
            key: event.key,
            name: `* ${event.name}`
        };
    });
    let eventInList = {};
    for (let i = 0; i < teamEvents.length; i++) {
        eventInList[teamEvents[i].key] = true;
    }
    for (let i = 0; i < events.length; i++) {
        if (!eventInList[events[i].key]) {
            eventInList[events[i].key] = true;
            sortedEvents.push(events[i]);
        }
    }
    return sortedEvents;
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
        if (cache.matches == null) {
            cache.matches = {};
        }
        cache.matches[event] = {
            value: matches,
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

export async function getMatches(event) {
    if (cache.matches == null) {
        cache.matches = {};
    }
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
        if (cache.matchesFull == null) {
            cache.matchesFull = {};
        }
        cache.matchesFull[event] = {
            value: matches,
            timestamp: new Date().getTime()
        };
        fs.writeFileSync("../tbacache.json", JSON.stringify(cache));
    } catch (err) {}
}

export async function getMatchesFull(event) {
    if (cache.matchesFull == null) {
        cache.matchesFull = {};
    }
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

export async function getTeam(teamNumber) {
    try {
        let team = await (
            await fetch(
                `https://www.thebluealliance.com/api/v3/team/frc${encodeURIComponent(
                    teamNumber
                )}/simple?X-TBA-Auth-Key=${encodeURIComponent(config.auth.tba)}`
            )
        ).json();
        return team;
    } catch (err) {}
    return {};
}
