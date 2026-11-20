import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
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
        let agps = [];
        let tgps = [];
        let agpts = {};
        let tgpts = {};
        //let egcpts = [];
        let uptime = [];
        let avg_auto_points = [];
        let avg_tele_points = [];
        let matches = {};
        for (let x of team_data[team]) {
            let auto_pieces = x["auto scoring"]
                .slice(1, x["auto scoring"].length - 1)
                .split(", ");
            let tele_pieces = x["teleop scoring"]
                .slice(1, x["teleop scoring"].length - 1)
                .split(", ");
            let game_pieces = auto_pieces.concat(tele_pieces);
            agps.push(auto_pieces);
            tgps.push(tele_pieces);
            let cage_lev = parseInt(x["cage level"]);
            try {
                uptime.push(153000 - parseInt(x["brick time"]));
            } catch {
                uptime.push(100);
            }
            try {
                matches[x["match"]][x[""]] = game_pieces;
            } catch {
                matches[x["match"]] = { [x[""]]: game_pieces };
            }
        }
        for (let i = 0; i < agps.length; ++i) {
            for (let j = 0; j < agps[i].length; ++j) {
                let val = agps[i][j];
                if (val == "cs1") {
                    agpts[i] = (agpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    agpts[i] = (agpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    agpts[i] = (agpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    agpts[i] = (agpts[i] || 0) + 7;
                } else {
                    agpts[i] = (agpts[i] || 0) + 0;
                }
            }
            avg_auto_points.push(agpts[i]);
        }
        for (let i = 0; i < tgps.length; i++) {
            for (let j = 0; j < tgps[i].length; ++j) {
                let val = tgps[i][j];
                if (val == "cs1") {
                    tgpts[i] = (tgpts[i] || 0) + 3;
                } else if (val == "cs2") {
                    tgpts[i] = (tgpts[i] || 0) + 4;
                } else if (val == "cs3") {
                    tgpts[i] = (tgpts[i] || 0) + 6;
                } else if (val == "cs4") {
                    tgpts[i] = (tgpts[i] || 0) + 7;
                } else {
                    tgpts[i] = (tgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tgpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-upt": avg(uptime),
            matches: matches,
            "tpw-std": std(avg_auto_points) + std(avg_tele_points),
            "tpw-score": 0
        };
        data_tpw["tpw-score"] = data_tpw["avg-auto"] + data_tpw["avg-tele"];
        parsed_tpw_data[team] = data_tpw;
    }
    return parsed_tpw_data;
}

export function computeRankings(data: parsedRow[]): rankings {
    const parsed_data = getData(data);
    for (let team in parsed_data)
        parsed_data[team]["r-score"] =
            parsed_data[team]["tpw-score"] - parsed_data[team]["tpw-std"];
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
