import fs from "fs";
import { parsedRow } from ".";

interface teamData {
    [key: string]: any[];
}

interface matchData {
    score: number;
    fouls: number;
    teleop: number;
}

interface tbaTeamData {
    [matchIndex: number]: matchData;
}

interface prediction {
    winner: "blue" | "red";
    bluePredicted: number;
    redPredicted: number;
    bp?: number;
    rp?: number;
    bluePercent: number;
    redPercent: number;
}

interface endPrediction {
    winner: "blue" | "red";
    blue: number;
    red: number;
    match?: any;
    win?: any;
}

interface parsedData {
    [team: string]: {
        "avg-score": number;
        "std-score": number;
        "avg-fouls": number;
        "std-teleop": number;
    };
}

interface tbaData {
    alliances: {
        blue: {
            team_keys: string[];
            score: number;
        };
        red: {
            team_keys: string[];
            score: number;
        };
    };
    score_breakdown: {
        blue: {
            foulCount: number;
            techFoulCount: number;
            teleopPoints: number;
        };
        red: {
            foulCount: number;
            techFoulCount: number;
            teleopPoints: number;
        };
    };
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

function tbaFile(path: string): parsedData {
    if (!fs.existsSync(path)) {
        throw new Error("TBA file does not exist");
    }
    const data: tbaData[] = JSON.parse(fs.readFileSync(path, "utf-8"));
    const tdata: { [team: string]: tbaTeamData } = {};
    const pdata: parsedData = {};
    for (const match of data) {
        try {
            const bteams = match.alliances.blue.team_keys;
            const rteams = match.alliances.red.team_keys;
            const bscore = match.alliances.blue.score;
            const rscore = match.alliances.red.score;
            const bfouls =
                match.score_breakdown.blue.foulCount +
                match.score_breakdown.blue.techFoulCount;
            const rfouls =
                match.score_breakdown.red.foulCount +
                match.score_breakdown.red.techFoulCount;
            const bteleop = match.score_breakdown.blue.teleopPoints;
            const rteleop = match.score_breakdown.red.teleopPoints;
            for (const team of bteams) {
                let key = team.slice(3);
                let match: matchData = {
                    score: bscore,
                    fouls: bfouls,
                    teleop: bteleop
                };
                if (!tdata[key]) {
                    tdata[key] = {};
                }
                let mind = Object.keys(tdata[key]).length;
                tdata[key][mind] = match;
            }
            for (const team of rteams) {
                let key = team.slice(3);
                let match: matchData = {
                    score: rscore,
                    fouls: rfouls,
                    teleop: rteleop
                };
                if (!tdata[key]) {
                    tdata[key] = {};
                }
                let mind = Object.keys(tdata[key]).length;
                tdata[key][mind] = match;
            }
        } catch (error) {
            console.error("Error during tba match processing: ", error);
            continue;
        }
    }
    for (const team in tdata) {
        const scores: number[] = [];
        const fouls: number[] = [];
        const teleop: number[] = [];
        for (const match of Object.values(tdata[team])) {
            scores.push(match.score);
            fouls.push(match.fouls);
            teleop.push(match.teleop);
        }
        pdata[team] = {
            "avg-score": avg(scores),
            "std-score": std(scores),
            "avg-fouls": avg(fouls),
            "std-teleop": std(teleop)
        };
    }
    return pdata;
}

function tbaPredict(
    b1: number,
    b2: number,
    b3: number,
    r1: number,
    r2: number,
    r3: number,
    tbaData: parsedData
): prediction {
    const bteams = [String(b1), String(b2), String(b3)];
    const rteams = [String(r1), String(r2), String(r3)];

    const bascores = bteams.map((team) => tbaData[team]["avg-score"]);
    const bas = Math.max(...bascores) + Math.min(...bascores);
    const bafouls = bteams.map((team) => tbaData[team]["avg-fouls"]);
    const baf = Math.max(...bafouls) + Math.min(...bafouls);
    const batstd = avg(bteams.map((team) => tbaData[team]["std-teleop"]));
    const bstdscores = bteams.map((team) => tbaData[team]["std-score"]);
    const bmstd = Math.min(...bstdscores);
    const bmxstd = Math.max(...bstdscores);
    const bastd = std(bstdscores);
    const brstd = bmxstd - bmstd;

    const rascores = rteams.map((team) => tbaData[team]["avg-score"]);
    const ras = Math.max(...rascores) + Math.min(...rascores);
    const rafouls = rteams.map((team) => tbaData[team]["avg-fouls"]);
    const raf = Math.max(...rafouls) + Math.min(...rafouls);
    const ratstd = avg(rteams.map((team) => tbaData[team]["std-teleop"]));
    const rstdscores = rteams.map((team) => tbaData[team]["std-score"]);
    const rmstd = Math.min(...rstdscores);
    const rmxstd = Math.max(...rstdscores);
    const rastd = std(rstdscores);
    const rrstd = rmxstd - rmstd;

    const bluescore = bas - bastd - brstd + raf - batstd;
    const redscore = ras - rastd - rrstd + baf - ratstd;
    const bpercent = bluescore / (bluescore + redscore);
    const rpercent = redscore / (bluescore + redscore);
    const w = bluescore > redscore ? "blue" : "red";

    return {
        winner: w,
        bluePredicted: bluescore,
        redPredicted: redscore,
        bluePercent: bpercent,
        redPercent: rpercent
    };
}

function tpwPredict(
    b1: number,
    b2: number,
    b3: number,
    r1: number,
    r2: number,
    r3: number,
    tpwData: parsedTPWData
): prediction {
    const bteams = [String(b1), String(b2), String(b3)];
    const rteams = [String(r1), String(r2), String(r3)];

    const bascores = bteams.map((team) => tpwData[team]["tpw-score"]);
    const bas = Math.max(...bascores) + Math.min(...bascores);
    const bstdscores = bteams.map((team) => tpwData[team]["tpw-std"]);
    const bmstd = Math.min(...bstdscores);
    const bmxstd = Math.max(...bstdscores);
    const bastd = avg(bstdscores);
    const brstd = bmxstd - bmstd;
    const baat = avg(
        bteams.map(
            (team) => tpwData[team]["avg-tele"] + tpwData[team]["avg-auto"]
        )
    );
    const bd = avg(bteams.map((team) => tpwData[team]["avg-def"]));
    const bdr = avg(bteams.map((team) => tpwData[team]["avg-driv"]));
    const bspd = avg(bteams.map((team) => tpwData[team]["avg-speed"]));
    const bstab = avg(bteams.map((team) => tpwData[team]["avg-stab"]));
    const binta = avg(bteams.map((team) => tpwData[team]["avg-inta"]));
    const bmix = bd + bdr + bspd + bstab + binta;

    const rascores = rteams.map((team) => tpwData[team]["tpw-score"]);
    const ras = Math.max(...rascores) + Math.min(...rascores);
    const rstdscores = rteams.map((team) => tpwData[team]["tpw-std"]);
    const rmstd = Math.min(...rstdscores);
    const rmxstd = Math.max(...rstdscores);
    const rastd = avg(rstdscores);
    const rrstd = rmxstd - rmstd;
    const raat = avg(
        rteams.map(
            (team) => tpwData[team]["avg-tele"] + tpwData[team]["avg-auto"]
        )
    );
    const rd = avg(rteams.map((team) => tpwData[team]["avg-def"]));
    const rdr = avg(rteams.map((team) => tpwData[team]["avg-driv"]));
    const rspd = avg(rteams.map((team) => tpwData[team]["avg-speed"]));
    const rstab = avg(rteams.map((team) => tpwData[team]["avg-stab"]));
    const rinta = avg(rteams.map((team) => tpwData[team]["avg-inta"]));
    const rmix = rd + rdr + rspd + rstab + rinta;

    const bluescore = baat + bas - bastd - brstd;
    const redscore = raat + ras - rastd - rrstd;
    const bpercent = bluescore / (bluescore + redscore);
    const rpercent = redscore / (bluescore + redscore);
    const w = bluescore > redscore ? "blue" : "red";

    return {
        winner: w,
        bluePredicted: bluescore,
        redPredicted: redscore,
        bp: bmix,
        rp: rmix,
        bluePercent: bpercent,
        redPercent: rpercent
    };
}

export function computePrediction(
    b1: number,
    b2: number,
    b3: number,
    r1: number,
    r2: number,
    r3: number,
    data: parsedRow[],
    base: string,
    event: string
): endPrediction {
    const path = base + event + "-tba.json";
    const data_tba = tbaFile(path);
    const data_tpw: parsedTPWData = getData(data);

    const tpw = tpwPredict(b1, b2, b3, r1, r2, r3, data_tpw);
    let bp: number;
    let rp: number;
    if (Object.keys(data_tba).length >= Object.keys(data_tpw).length) {
        const tba = tbaPredict(b1, b2, b3, r1, r2, r3, data_tba);
        const bs1 = tba.bluePredicted;
        const bs2 = tpw.bluePredicted;
        const bs3 = tpw.bp;
        const rs1 = tba.redPredicted;
        const rs2 = tpw.redPredicted;
        const rs3 = tpw.rp;
        bp = bs1 + bs2 + 5 * (bs3 - rs3);
        rp = rs1 + rs2 + 5 * (rs3 - bs3);
    } else {
        bp = tpw.bluePredicted;
        rp = tpw.redPredicted;
    }
    const w = bp > rp ? "blue" : "red";
    return {
        winner: w,
        blue: bp,
        red: rp
    };
}
