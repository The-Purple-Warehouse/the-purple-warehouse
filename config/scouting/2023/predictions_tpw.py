import numpy as np
from collections import OrderedDict
import json
import os
import math
import sys
import csv
import pandas as pd

rawArgs = sys.argv[1:]
args = {}
for i in range(len(rawArgs)):
    if rawArgs[i] == "--event" and "event" not in args:
        args["event"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--csv" and "csv" not in args:
        args["csv"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--baseFilePath" and "baseFilePath" not in args:
        args["baseFilePath"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--b1" and "b1" not in args:
        args["b1"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--b2" and "b2" not in args:
        args["b2"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--b3" and "b3" not in args:
        args["b3"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--r1" and "r1" not in args:
        args["r1"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--r2" and "r2" not in args:
        args["r2"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--r3" and "r3" not in args:
        args["r3"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--match" and "match" not in args:
        args["match"] = rawArgs[i + 1]
        i += 1

try:
    match_num = args["match"]
except:
    match_num = 100000000
event = args["event"]
base = args["baseFilePath"]
tpw_csv = args["csv"]
parsed_data = OrderedDict()

def avg(data):
    if data != []:
        data = np.array([data])
        return np.mean(data)
    else:
        return 0

def std(data):
    if data != []:
        data = np.array([data])
        return np.std(data)
    else:
        return 0

def max(data):
    if data != []:
        data = np.array([data])
        return np.max(data)
    else:
        return 0

def min(data):
    if data != []:
        data = np.array([data])
        return np.min(data)
    else:
        return 0

tpw_path = base + tpw_csv
path = base + event + "-tba.json"
if os.path.exists(path):
    with open(base + event + "-tba.json", "r") as file:
        data = json.load(file)
else:
    raise Exception("Could not find TBA file")

team_data = OrderedDict()
matches_data = OrderedDict()
count_mat = 0
for x in (data):
    count_mat += 1
    if x["comp_level"] == "qm":
        blue_teams = x["alliances"]["blue"]["team_keys"]
        red_teams = x["alliances"]["red"]["team_keys"]

        blue_score = x["alliances"]["blue"]["score"]
        red_score = x["alliances"]["red"]["score"]

        for y in blue_teams:
            match_data = OrderedDict()
            match_data["score"] = blue_score
            try:
                count = len(team_data[y[3:]])
                team_data[y[3:]][count] = match_data
            except:
                team_data[y[3:]] = OrderedDict()
                team_data[y[3:]][0] = match_data

        for y in red_teams:
            match_data = OrderedDict()
            match_data["score"] = red_score
            try:
                count = len(team_data[y[3:]])
                team_data[y[3:]][count] = match_data
            except:
                team_data[y[3:]] = OrderedDict()
                team_data[y[3:]][0] = match_data

for team, dict in team_data.items():
    scores = list()

    for match in team_data[team].items():
        scores.append(match[1]["score"])

    data = OrderedDict()
    data["avg-score"] = avg(scores)
    data["std-score"] = std(scores)
    parsed_data[team] = data

def getData():
    path = base + event + "-tba.json"
    if os.path.exists(path):
        with open(base + event + "-tba.json", "r") as file:
            data = json.load(file)
    else:
        raise Exception("Could not find TBA file")

    team_data = OrderedDict()
    count_mat = 0
    for x in (data):
        count_mat += 1
        if x["comp_level"] == "qm":
            blue_teams = x["alliances"]["blue"]["team_keys"]
            red_teams = x["alliances"]["red"]["team_keys"]

            blue_score = x["alliances"]["blue"]["score"]
            red_score = x["alliances"]["red"]["score"]

            for y in blue_teams:
                team_data[y[3:]] = ''

            for y in red_teams:
                team_data[y[3:]] = ''

    parsed_tpw_data = OrderedDict()
    for team, dict in team_data.items(): # team_data is tba data in an OrderedDict, just used to get list of teams
        agps = list()
        tgps = list()
        alcs = list()
        tlcs = list()
        agpts = {}
        tgpts = {}
        acspts = list()
        ecspts = list()
        defe = list()
        speed = list()
        driver = list()
        stab = list()
        inta = list()
        uptime = list()
        matches = {}
        if os.path.exists(tpw_path):
            with open(tpw_path, "r") as file:
                TPW_data = csv.DictReader(file)
                for x in TPW_data:
                    if x['team'] == str(team) and int(x['match']) < match_num:
                        game_piece = x['game piece'][1:len(x['game piece']) - 1].split(", ")
                        locs = x['locations'][1:len(x['locations']) - 1].split(", ")
                        game_piece = [s.replace("'", '') for s in game_piece]
                        locs = [s.replace("'", '') for s in locs]
                        auto_count = int(x['auto count'])
                        if auto_count > 0:
                            agps.append(game_piece[:auto_count])
                            tgps.append(game_piece[auto_count:])
                            alcs.append(locs[:auto_count])
                            tlcs.append(locs[auto_count:])
                        else:
                            tgps.append(game_piece)
                            tlcs.append(locs)
                            agps.append([])
                            alcs.append([])

                        auto_cs = int(x['auto climb'])
                        end_cs = int(x['end climb'])

                        if auto_cs == 1:
                            acspts.append(8)
                        elif auto_cs == 2:
                            acspts.append(12)
                        elif auto_cs == 0:
                            acspts.append(0)

                        if end_cs == 1:
                            ecspts.append(6)
                        elif end_cs == 2:
                            ecspts.append(10)
                        elif end_cs == 0:
                            ecspts.append(0)
                        try:
                            defe.append(int(x["defense skill"]))
                            speed.append(int(x["speed"]))
                            stab.append(int(x["stability"]))
                            inta.append(int(x["intake consistency"]))
                            driver.append(int(x["drive skill"]))
                        except:
                            #print('passed')
                            legacy = True
                        uptime.append(153 - int(x["break time"]))

                        try:
                            matches[x['match']][(x[''])] = game_piece
                        except:
                            matches[x['match']] = {x['']: game_piece}

                for i in range(0, len(agps)):
                    for j in range(0, len(agps[i])):
                        if agps[i][j] != 'm':
                            loc = int(alcs[i][j])
                            if loc > 0 and loc < 10:
                                try:
                                    agpts[i] += 6
                                except:
                                    agpts[i] = 6
                            elif loc < 19:
                                try:
                                    agpts[i] += 4
                                except:
                                    agpts[i] = 4
                            elif loc < 28:
                                try:
                                    agpts[i] += 3
                                except:
                                    agpts[i] = 3

                for i in range(0, len(tgps)):
                    for j in range(0, len(tgps[i])):
                        if tgps[i][j] != 'm' and tlcs[i][j] != '':
                            loc = int(tlcs[i][j])
                            if loc > 0 and loc < 10:
                                try:
                                    tgpts[i] += 5
                                except:
                                    tgpts[i] = 5
                            elif loc < 19:
                                try:
                                    tgpts[i] += 3
                                except:
                                    tgpts[i] = 3
                            elif loc < 28:
                                try:
                                    tgpts[i] += 2
                                except:
                                    tgpts[i] = 2

                avg_auto_points = list()
                avg_tele_points = list()

                for i, x in agpts.items():
                    avg_auto_points.append(x)

                for i, x in tgpts.items():
                    avg_tele_points.append(x)

                data_tpw = OrderedDict()
                data_tpw['agps'] = agps
                data_tpw['alcs'] = alcs
                data_tpw['tgps'] = tgps
                data_tpw['tlcs'] = tlcs
                data_tpw['agpts'] = agpts
                data_tpw['tgpts'] = tgpts
                data_tpw['avg-auto'] = avg(avg_auto_points)
                data_tpw['avg-tele'] = avg(avg_tele_points)
                data_tpw['avg-auto-cs'] = avg(acspts)
                data_tpw['avg-end-cs'] = avg(ecspts)
                data_tpw['std-auto'] = std(avg_auto_points)
                data_tpw['std-tele'] = std(avg_tele_points)
                data_tpw['std-auto-cs'] = std(acspts)
                data_tpw['std-end-cs'] = std(ecspts)
                data_tpw['max-auto'] = max(avg_auto_points)
                data_tpw['max-tele'] = max(avg_tele_points)
                data_tpw['max-auto-cs'] = max(acspts)
                data_tpw['max-end-cs'] = max(ecspts)
                data_tpw['avg-def'] = avg(defe)
                data_tpw['avg-driv'] = avg(driver)
                data_tpw['avg-speed'] = avg(speed)
                data_tpw['avg-stab'] = avg(stab)
                data_tpw['avg-inta'] = avg(inta)
                data_tpw['avg-upt'] = avg(uptime)
                data_tpw['matches'] = matches
                data_tpw['tpw-std'] = data_tpw['std-auto'] + data_tpw['std-tele'] + data_tpw['std-auto-cs'] + data_tpw['std-end-cs']
                data_tpw["tpw-score"] = data_tpw['avg-auto'] + data_tpw['avg-tele'] + data_tpw['avg-auto-cs'] + data_tpw['avg-end-cs']
                parsed_tpw_data[team] = data_tpw # all team data stored to parsed_tpw_data OrderedDict
        else:
            raise Exception("Could not find TPW file")

    with open(base + 'parsed_tpw_data_'+event+'.json', 'w') as f:
        f.write(json.dumps({'lines': len(pd.read_csv(tpw_path)), 'data': parsed_tpw_data}, default=int))
        f.close()
    return parsed_tpw_data

if os.path.exists(base + 'parsed_tpw_data_'+event+'.json'):
    with open(base + 'parsed_tpw_data_'+event+'.json') as f:
        loaded = json.loads(f.read())
        if loaded['lines'] == len(pd.read_csv(tpw_path)):
            parsed_tpw_data = loaded['data']
            f.close()
        else:
            f.close()
            parsed_tpw_data = getData()
else:
    parsed_tpw_data = getData()

def tba_predict(b1, b2, b3, r1, r2, r3):
    b1 = str(b1)
    b2 = str(b2)
    b3 = str(b3)
    r1 = str(r1)
    r2 = str(r2)
    r3 = str(r3)

    bas = max([parsed_data[b1]['avg-score'], parsed_data[b2]['avg-score'], parsed_data[b3]['avg-score']]) + min([parsed_data[b1]['avg-score'], parsed_data[b2]['avg-score'], parsed_data[b3]['avg-score']])
    ras = max([parsed_data[r1]['avg-score'], parsed_data[r2]['avg-score'], parsed_data[r3]['avg-score']]) + min([parsed_data[r1]['avg-score'], parsed_data[r2]['avg-score'], parsed_data[r3]['avg-score']])

    bmstd = min([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rmstd = min([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bmxstd = max([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rmxstd = max([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bastd = std([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rastd = std([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    brstd = bmxstd - bmstd
    rrstd = rmxstd - rmstd

    bluescore = bas - bastd - brstd
    redscore = ras - rastd - rrstd

    if bluescore > redscore:
        return {'color-of-winner':'blue', 'blue-predicted': bluescore, 'red-predicted': redscore, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}
    else:
        return {'color-of-winner':'red', 'blue-predicted': bluescore, 'red-predicted': redscore, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}

def tpw_predict(b1, b2, b3, r1, r2, r3):
    b1 = str(b1)
    b2 = str(b2)
    b3 = str(b3)
    r1 = str(r1)
    r2 = str(r2)
    r3 = str(r3)

    bas = max([parsed_tpw_data[b1]['tpw-score'], parsed_tpw_data[b2]['tpw-score'], parsed_tpw_data[b3]['tpw-score']]) + min([parsed_tpw_data[b1]['tpw-score'], parsed_tpw_data[b2]['tpw-score'], parsed_tpw_data[b3]['tpw-score']])
    ras = max([parsed_tpw_data[r1]['tpw-score'], parsed_tpw_data[r2]['tpw-score'], parsed_tpw_data[r3]['tpw-score']]) + min([parsed_tpw_data[r1]['tpw-score'], parsed_tpw_data[r2]['tpw-score'], parsed_tpw_data[r3]['tpw-score']])

    bmstd = min([parsed_tpw_data[b1]['tpw-std'], parsed_tpw_data[b2]['tpw-std'], parsed_tpw_data[b3]['tpw-std']])
    rmstd = min([parsed_tpw_data[r1]['tpw-std'], parsed_tpw_data[r2]['tpw-std'], parsed_tpw_data[r3]['tpw-std']])

    bmxstd = max([parsed_tpw_data[b1]['tpw-std'], parsed_tpw_data[b2]['tpw-std'], parsed_tpw_data[b3]['tpw-std']])
    rmxstd = max([parsed_tpw_data[r1]['tpw-std'], parsed_tpw_data[r2]['tpw-std'], parsed_tpw_data[r3]['tpw-std']])

    bastd = avg([parsed_tpw_data[b1]['tpw-std'], parsed_tpw_data[b2]['tpw-std'], parsed_tpw_data[b3]['tpw-std']])
    rastd = avg([parsed_tpw_data[r1]['tpw-std'], parsed_tpw_data[r2]['tpw-std'], parsed_tpw_data[r3]['tpw-std']])

    brstd = bmxstd - bmstd
    rrstd = rmxstd - rmstd

    bd = avg([parsed_tpw_data[b1]['avg-def'], parsed_tpw_data[b2]['avg-def'], parsed_tpw_data[b3]['avg-def']])
    rd = avg([parsed_tpw_data[r1]['avg-def'], parsed_tpw_data[r2]['avg-def'], parsed_tpw_data[r3]['avg-def']])

    bdr = avg([parsed_tpw_data[b1]['avg-driv'], parsed_tpw_data[b2]['avg-driv'], parsed_tpw_data[b3]['avg-driv']])
    rdr = avg([parsed_tpw_data[r1]['avg-driv'], parsed_tpw_data[r2]['avg-driv'], parsed_tpw_data[r3]['avg-driv']])

    bspd = avg([parsed_tpw_data[b1]['avg-speed'], parsed_tpw_data[b2]['avg-speed'], parsed_tpw_data[b3]['avg-speed']])
    rspd = avg([parsed_tpw_data[r1]['avg-speed'], parsed_tpw_data[r2]['avg-speed'], parsed_tpw_data[r3]['avg-speed']])

    bstab = avg([parsed_tpw_data[b1]['avg-stab'], parsed_tpw_data[b2]['avg-stab'], parsed_tpw_data[b3]['avg-stab']])
    rstab = avg([parsed_tpw_data[r1]['avg-stab'], parsed_tpw_data[r2]['avg-stab'], parsed_tpw_data[r3]['avg-stab']])

    binta = avg([parsed_tpw_data[b1]['avg-inta'], parsed_tpw_data[b2]['avg-inta'], parsed_tpw_data[b3]['avg-inta']])
    rinta = avg([parsed_tpw_data[r1]['avg-inta'], parsed_tpw_data[r2]['avg-inta'], parsed_tpw_data[r3]['avg-inta']])

    bmix = bd + bdr + bspd + bstab + binta
    rmix = rd + rdr + rspd + rstab + rinta

    bluescore = bas - bastd - brstd
    redscore = ras - rastd - rrstd

    if bluescore > redscore:
        return {'color-of-winner':'blue', 'blue-predicted': bluescore, 'red-predicted': redscore, 'bp': bmix, 'rp': rmix, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}
    else:
        return {'color-of-winner':'red', 'blue-predicted': bluescore, 'red-predicted': redscore, 'bp': bmix, 'rp': rmix, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}

def predict(b1, b2, b3, r1, r2, r3):
    b1 = str(b1)
    b2 = str(b2)
    b3 = str(b3)
    r1 = str(r1)
    r2 = str(r2)
    r3 = str(r3)

    # tba = tba_predict(b1, b2, b3, r1, r2, r3)
    tpw = tpw_predict(b1, b2, b3, r1, r2, r3)

    # bs1 = tba["blue-predicted"]
    bs2 = tpw["blue-predicted"]
    bs3 = tpw["bp"]

    # rs1 = tba["red-predicted"]
    rs2 = tpw["red-predicted"]
    rs3 = tpw["rp"]

    # bp1 = tba["blue-percent"]
    bp2 = tpw["blue-percent"]

    # rp1 = tba["red-percent"]
    rp2 = tpw["red-percent"]

    bc = 0
    rc = 0

    bp = 0
    rp = 0

    winner = ''

    check1 = False
    check2 = False

    """
    if bs1 > rs1:
        bc += 1
        check1 = True
    else:
        rc += 1
    if bs2 > rs2:
        bc += 1
    else:
        rc += 1
    if bs3 > rs3:
        bc += 1
        check2 = True
    else:
        rc += 1

    if bc > rc:
        winner = 'blue'
        if bc == 3:
            # bp = avg([bp1, bp2])
            bp = bp2
            # rp = avg([rp1, rp2])
            rp = rp2
            bp = bp + 0.3*rp
            rp = rp - 0.3*rp
        elif check1 and check2:
            bp = bp1
            rp = rp1
        elif check1:
            bp = avg([bp1, bp2])
            rp = avg([rp1, rp2])
        elif check2:
            bp = bp2
            rp = rp2
    else:
        winner = 'red'
        if rc == 3:
            bp = avg([bp1, bp2])
            rp = avg([rp1, rp2])
            rp = rp + 0.3*bp
            bp = bp - 0.3*bp
        elif check1:
            bp = bp2
            rp = rp2
        elif check2:
            bp = avg([bp1, bp2])
            rp = avg([rp1, rp2])
        else:
            bp = bp1
            rp = rp1
    """
    if bc > rc:
        winner = 'blue'
    else:
        winner = 'red'
    bp = bp2
    rp = rp2

    return {'winner': winner, 'blue': bp, 'red': rp}

results = predict(args["b1"], args["b2"], args["b3"], args["r1"], args["r2"], args["r3"])
print(results)

with open(base + event + "-" + args["r1"] + "-" + args["r2"] + "-" + args["r3"] + "-" + args["b1"] + "-" + args["b2"] + "-" + args["b3"] + "-prediction.json", "w") as f:
    json.dump(results, f)
