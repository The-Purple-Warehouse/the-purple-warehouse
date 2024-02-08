import { assert } from "console";
import {
    getEntries,
    getEntryByHash,
    addEntry,
    removeAll,
    getAll,
    retrieveEntry
} from "../helpers/tps";
import { TPSEntryType, TPSPrivacyRule } from "../models/tpsEntry";

const example = JSON.parse(
    JSON.stringify({
        metadata: {
            event: "2024camb",
            match: {
                level: "qm",
                number: 3,
                set: 1
            },
            bot: "9999",
            timestamp: 1711729092182,
            scouter: {
                name: "kabir",
                team: "1072",
                app: "tpw"
            }
        },
        abilities: {
            "auto-center-line-pick-up": false,
            "ground-pick-up": true,
            "auto-leave-starting-zone": true,
            "teleop-spotlight-2024": false,
            "teleop-stage-level-2024": 3
        },
        counters: {},
        data: {
            "auto-scoring-2024": ["ss", "sm"],
            "teleop-scoring-2024": ["ss", "as", "am", "as", "sa", "ts"],
            notes: "decent defense and intake always worked smoothly\ncycles were relatively slow though"
        },
        ratings: {
            "defense-skill": 3,
            "driver-skill": 3,
            "intake-consistency": 4,
            speed: 2,
            stability: 3
        },
        timers: {
            "brick-time": 1500,
            "defense-time": 6745,
            "stage-time-2024": 12815
        },
        privacy: [
            {
                path: "abilities.teleop-stage-level-2024",
                private: true,
                teams: ["254", "1678"],
                type: "excluded"
            },
            {
                path: "metadata.scouter.name",
                private: true,
                type: "redacted"
            },
            {
                path: "metadata.event",
                private: true
            },
            {
                path: "metadata.match.level",
                private: true,
                type: "scrambled"
            }
        ]
    })
);

let example2 = JSON.parse(JSON.stringify(example));
example2.metadata.event = "2023camb";

async function testPrivacy() {
    await removeAll();
    const timestamp = 1711729092182;
    let newEntry = await addEntry(example, timestamp);
    console.log("\nPrivacy Testing ...\n-------------------");
    console.log(`Added entry: ${newEntry.hash}, ${example.metadata.event}`);
    console.assert(
        newEntry.serverTimestamp == timestamp,
        "Example timestamps do not match: " +
            newEntry.serverTimestamp +
            " vs " +
            timestamp
    );
    console.assert(newEntry.hash != null, "Example entry's hash is null");
    let entries = await getEntries({
        "metadata.event": example.metadata.event
    });
    console.assert(entries.length == 1, "Entries getEntries is not 1");
    console.assert(
        (entries[0] as any).hash == (newEntry as any).hash,
        "Entries from getEntries is not the same as entry from getEntryByHash"
    );

    let tpsEntry: TPSEntryType = (await getAll())[0] as any as TPSEntryType;
    console.assert(tpsEntry != null, "Entry from getAll is null");
    const returnedEntry = retrieveEntry(tpsEntry, "1072");
    console.assert(
        returnedEntry.metadata.scouter.name == "[redacted for privacy]",
        "Scouter name is not redacted"
    );
    console.assert(
        returnedEntry.abilities["teleop-stage-level-2024"] == undefined,
        "Teleop stage level is not excluded"
    );
    console.assert(
        returnedEntry.metadata.event == undefined,
        "Event is not redacted"
    );
    console.assert(
        returnedEntry.metadata.match.level != undefined,
        "Match level is not scrambled"
    );
    console.assert(
        returnedEntry.privacy == null,
        "Privacy rules are not removed"
    );
    console.log(returnedEntry);
}

async function testExampleEntry(ex) {
    const timestamp = 1711729092182;
    let newEntry = await addEntry(ex, timestamp);
    console.log(`Added entry: ${newEntry.hash}, ${ex.metadata.event}`);
    console.assert(
        newEntry.serverTimestamp == timestamp,
        "Example timestamps do not match: " +
            newEntry.serverTimestamp +
            " vs " +
            timestamp
    );
    console.assert(newEntry.hash != null, "Example entry's hash is null");
    return newEntry;
}

async function testGetEntry(hash, query) {
    let entry = await getEntryByHash(hash);
    console.assert(entry != null, "Entry from getEntryByHash is null");
    let entries = await getEntries(query);
    console.assert(entries.length == 1, "Entries getEntries is not 1");
    console.assert(
        (entries[0] as any).hash == (entry as any).hash,
        "Entries from getEntries is not the same as entry from getEntryByHash"
    );
}

async function test() {
    await removeAll();
    const entry = await testExampleEntry(example);
    const entry2 = await testExampleEntry(example2);
    console.assert(
        entry.hash != entry2.hash,
        "Example entries have the same hash"
    );
    await testGetEntry(entry.hash, { "metadata.event": "2024camb" });
    await testGetEntry(entry2.hash, { "metadata.event": "2023camb" });
    await testPrivacy();
}

test();
