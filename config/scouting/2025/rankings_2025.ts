import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
        "avg-cage": number;
        "avg-def": number;
        "avg-driv": number;
        "avg-speed": number;
        "avg-stab": number;
        "avg-inta": number;
        "avg-upt": number;
        matches: any;
        "tpw-std": number;
        "tpw-score": number;
        "r-score"?: number;
    };
}

interface rankings {
    [team: string]: {
        "off-score": number;
        "def-score": number;
    };
}

// sum and average taken from https://gist.github.com/dggluz/365527824f9f521055baa3532b1d46e7
const sum = (numbers: number[]) =>
    numbers.reduce((total, aNumber) => total + aNumber, 0);
const avg = (numbers: number[]) => sum(numbers) / numbers.length;

// std taken from https://decipher.dev/30-seconds-of-typescript/docs/standardDeviation/
const std = (arr) => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr
            .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0) / arr.length
    );
};

function getData(data): any {
    let team_data: teamData = {};
    if (!data) {
        throw new Error("No data given to getData()");
    }
    for (let x of data) {
        if (team_data[x["team"]] == null) {
            team_data[x["team"]] = [x];
        } else {
            team_data[x["team"]].push(x);
        }
    }
    let parsed_tpw_data: parsedTPWData = {};
    for (let team in team_data) {
        let acgps = [];
        let aagps = [];
        let tcgps = [];
        let tagps = [];
        let acgpts = {};
        let aagpts = {};
        let tcgpts = {};
        let tagpts = {};
        let egcpts = [];
        let defe = [];
        let speed = [];
        let driver = [];
        let stab = [];
        let inta = [];
        let uptime = [];
        let avg_auto_points = [];
        let avg_tele_points = [];
        let matches = {};
        for (let x of team_data[team]) {
            let auto_algae_pieces = x["auto algae scoring"]
                .slice(1, x["auto algae scoring"].length - 1)
                .split(", ");
            let auto_coral_pieces = x["auto coral scoring"]
                .slice(1, x["auto coral scoring"].length - 1)
                .split(", ");
            let tele_algae_pieces = x["teleop algae scoring"]
                .slice(1, x["teleop algae scoring"].length - 1)
                .split(", ");
            let tele_coral_pieces = x["teleop coral scoring"]
                .slice(1, x["teleop coral scoring"].length - 1)
                .split(", ");
            let game_algae_pieces = auto_algae_pieces.concat(tele_algae_pieces);
            let game_coral_pieces = auto_coral_pieces.concat(tele_coral_pieces);
            let game_pieces = game_algae_pieces.concat(game_coral_pieces);
            acgps.push(auto_coral_pieces);
            aagps.push(auto_algae_pieces);
            tcgps.push(tele_coral_pieces);
            tagps.push(tele_algae_pieces);
            let cage_lev = parseInt(x["cage level"]);
            if (cage_lev == 0) {
                egcpts.push(0);
            } else if (cage_lev == 1) {
                egcpts.push(2);
            } else if (cage_lev == 2) {
                egcpts.push(6);
            } else if (cage_lev >= 3) {
                egcpts.push(12);
            }
            try {
                defe.push(parseInt(x["defense skill"]));
                speed.push(parseInt(x["speed"]));
                stab.push(parseInt(x["stability"]));
                inta.push(parseInt(x["intake consistency"]));
                driver.push(parseInt(x["driver skill"]));
                uptime.push(153000 - parseInt(x["brick time"]));
            } catch {
                defe.push(3);
                speed.push(3);
                stab.push(3);
                inta.push(3);
                driver.push(3);
                uptime.push(100);
            }
            try {
                matches[x["match"]][x[""]] = game_pieces;
            } catch {
                matches[x["match"]] = { [x[""]]: game_pieces };
            }
        }
        for (let i = 0; i < acgps.length; ++i) {
            for (let j = 0; j < acgps[i].length; ++j) {
                let val = acgps[i][j];
                if (val == "cs1") {
                    acgpts[i] = (acgpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    acgpts[i] = (acgpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    acgpts[i] = (acgpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    acgpts[i] = (acgpts[i] || 0) + 7;
                } else {
                    acgpts[i] = (acgpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(acgpts[i]);
        }
        for (let i = 0; i < aagps.length; i++) {
            for (let j = 0; j < aagps[i].length; ++j) {
                let val = aagps[i][j];
                if (val == "asn") {
                    aagpts[i] = (aagpts[i] || 0) + 4;
                } else if (val == "asp") {
                    aagpts[i] = (aagpts[i] || 0) + 6;
                } else {
                    aagpts[i] = (aagpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(aagpts[i]);
        }
        for (let i = 0; i < tcgps.length; i++) {
            for (let j = 0; j < tcgps[i].length; ++j) {
                let val = tcgps[i][j];
                if (val == "cs1") {
                    tcgpts[i] = (tcgpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    tcgpts[i] = (tcgpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    tcgpts[i] = (tcgpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    tcgpts[i] = (tcgpts[i] || 0) + 7;
                } else {
                    tcgpts[i] = (tcgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tcgpts[i]);
        }
        for (let i = 0; i < tagps.length; i++) {
            for (let j = 0; j < tagps[i].length; ++j) {
                let val = tagps[i][j];
                if (val == "asn") {
                    tagpts[i] = (tagpts[i] || 0) + 4;
                } else if (val == "asp") {
                    tagpts[i] = (tagpts[i] || 0) + 6;
                } else {
                    tagpts[i] = (tagpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tagpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-cage": avg(egcpts),
            "avg-def": avg(defe),
            "avg-driv": avg(driver),
            "avg-speed": avg(speed),
            "avg-stab": avg(stab),
            "avg-inta": avg(inta),
            "avg-upt": avg(uptime),
            matches: matches,
            "tpw-std":
                std(avg_auto_points) + std(avg_tele_points) + std(egcpts),
            "tpw-score": 0
        };
        data_tpw["tpw-score"] =
            data_tpw["avg-auto"] + data_tpw["avg-tele"] + data_tpw["avg-cage"];
        parsed_tpw_data[team] = data_tpw;
    }
    return parsed_tpw_data;
}

export function computeRankings(data: parsedRow[]): rankings {
    const parsed_data = getData(data);
    for (let team in parsed_data)
        parsed_data[team]["r-score"] =
            parsed_data[team]["tpw-score"] -
            parsed_data[team]["tpw-std"] +
            parsed_data[team]["avg-driv"] +
            parsed_data[team]["avg-speed"] +
            parsed_data[team]["avg-stab"] +
            parsed_data[team]["avg-inta"];
    const sorted = Object.entries(parsed_data).sort(
        (a, b) => (b[1]["r-score"] || 0) - (a[1]["r-score"] || 0)
    );
    const pranks: rankings = {};
    for (const [team, data] of sorted) {
        pranks[team] = {
            "off-score": data["r-score"] || 0,
            "def-score": data["avg-def"]
        };
    }
    return pranks;
}
