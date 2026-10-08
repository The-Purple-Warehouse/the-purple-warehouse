import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface parsedTPWData {
    [team: string]: {
        "avg-tele": number;
        "avg-auto": number;
        "avg-climb": number;
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
        let afgps = [];
        let tfgps = [];
        let afgpts = {};
        let tfgpts = {};
        let l1climbs = [];
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
            let auto_fuel_pieces = x["auto fuel scoring"]
                .slice(1, x["auto fuel scoring"].length - 1)
                .split(", ");
            let tele_fuel_pieces = x["teleop fuel scoring"]
                .slice(1, x["teleop fuel scoring"].length - 1)
                .split(", ");
            let game_pieces = auto_fuel_pieces.concat(tele_fuel_pieces);
            afgps.push(auto_fuel_pieces);
            tfgps.push(tele_fuel_pieces);
            l1climbs.push(x["l1 climb"] === true || x["l1 climb"] === "true");
            let climb_lev = parseInt(x["climb level"]);
            if (climb_lev == 0) {
                egcpts.push(0);
            } else if (climb_lev == 1) {
                egcpts.push(10);
            } else if (climb_lev == 2) {
                egcpts.push(20);
            } else if (climb_lev >= 3) {
                egcpts.push(30);
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
        for (let i = 0; i < afgps.length; ++i) {
            for (let j = 0; j < afgps[i].length; ++j) {
                let val = afgps[i][j];
                if (val == "fsa") {
                    afgpts[i] = (afgpts[i] || 0) + 1;
                } else {
                    afgpts[i] = (afgpts[i] || 0) + 0;
                }
            }
            if (l1climbs[i]) {
                afgpts[i] = (afgpts[i] || 0) + 15;
            }
            avg_auto_points.push(afgpts[i]);
        }
        for (let i = 0; i < tfgps.length; ++i) {
            for (let j = 0; j < tfgps[i].length; ++j) {
                let val = tfgps[i][j];
                if (val == "fsa") {
                    tfgpts[i] = (tfgpts[i] || 0) + 1;
                } else if (val == "fp") {
                    tfgpts[i] = (tfgpts[i] || 0) + 0;
                } else {
                    tfgpts[i] = (tfgpts[i] || 0) + 0;
                }
            }
            avg_tele_points.push(tfgpts[i]);
        }
        let data_tpw: parsedTPWData[string] = {
            "avg-tele": avg(avg_tele_points),
            "avg-auto": avg(avg_auto_points),
            "avg-climb": avg(egcpts),
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
            data_tpw["avg-auto"] + data_tpw["avg-tele"] + data_tpw["avg-climb"];
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
