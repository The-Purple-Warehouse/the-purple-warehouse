'''
python predictions_2024.py

    --event         tba/frc event key
    --csv           filename of tpw data
    --baseFilePath  base filesystem path
    --b1            blue team 1
    --b2            blue team 2
    --b3            blue team 3
    --r1            red team 1
    --r2            red team 2
    --r3            red team 3
    --match         the match number up to which data should be used

tba cached data must be in file named: [event]-tba.json

stores prediction in json file:

    filename: [event]-[r1]-[r2]-[r3]-[b1]-[b2]-[b3]-prediction.json

caches parsed data to json file:

    filename:   parsed_tpw_data_[event].json
'''


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

def copy(li1):
    li_copy = []
    li_copy.extend(li1)
    return li_copy

tpw_path = base + tpw_csv
path = base + event + "-tba.json"
if os.path.exists(path):
    with open(base + event + "-tba.json", "r") as file:
        data = json.load(file)
else:
    raise Exception("Could not find TBA file")

team_data = OrderedDict()
matches_data = OrderedDict()

for x in (data):
    try:
        blue_teams = x["alliances"]["blue"]["team_keys"]
        red_teams = x["alliances"]["red"]["team_keys"]
    
        blue_score = x["alliances"]["blue"]["score"]
        red_score = x["alliances"]["red"]["score"]
    
        blue_fouls = x["score_breakdown"]["blue"]["foulCount"] + x["score_breakdown"]["blue"]["techFoulCount"]
        red_fouls = x["score_breakdown"]["red"]["foulCount"] + x["score_breakdown"]["red"]["techFoulCount"]
    
        blue_teleop = x["score_breakdown"]["blue"]["teleopPoints"]
        red_teleop = x["score_breakdown"]["red"]["teleopPoints"]
    
        for y in blue_teams:
            match_data = OrderedDict()
            match_data["score"] = blue_score
            match_data["fouls"] = blue_fouls
            match_data["teleop"] = blue_teleop
    
            try:
                count = len(team_data[y[3:]])
                team_data[y[3:]][count] = match_data
            except:
                team_data[y[3:]] = OrderedDict()
                team_data[y[3:]][0] = match_data
    
        for y in red_teams:
            match_data = OrderedDict()
            match_data["score"] = red_score
            match_data["fouls"] = red_fouls
            match_data["teleop"] = red_teleop
    
            try:
                count = len(team_data[y[3:]])
                team_data[y[3:]][count] = match_data
            except:
                team_data[y[3:]] = OrderedDict()
                team_data[y[3:]][0] = match_data
    except:
        continue

for team, dict in team_data.items():
    scores = list()
    fouls = list()
    teleop = list()


    for match in team_data[team].items():
        scores.append(match[1]["score"])
        fouls.append(match[1]["fouls"])
        teleop.append(match[1]["teleop"])

    data = OrderedDict()
    data["avg-score"] = avg(scores)
    data["std-score"] = std(scores)
    data["avg-fouls"] = avg(fouls)
    data["std-teleop"] = std(teleop)
    parsed_data[team] = data


def getData():
    path = base + event + "-tba.json"
    if os.path.exists(path):
        with open(base + event + "-tba.json", "r") as file:
            data = json.load(file)
    else:
        raise Exception("Could not find TBA file")

    team_data = OrderedDict()
    for x in (data):
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
        agps = list() #auto game pieces
        tgps = list() #teleop game pieces
        agpts = {} #auto game piece points
        tgpts = {} #teleop game piece points
        tstpts = list() #teleop stage points
        defe = list()
        speed = list()
        driver = list()
        stab = list()
        inta = list()
        uptime = list()
        avg_auto_points = list()
        avg_tele_points = list()
        matches = {}
        if os.path.exists(tpw_path):
            with open(tpw_path, "r") as file:
                TPW_data = csv.DictReader(file)
                for x in TPW_data:
                    if x['team'] == str(team) and int(x['match']) <= match_num:
                        auto_pieces = x['auto scoring'][1:len(x['auto scoring']) - 1].split(", ")
                        tele_pieces = x['teleop scoring'][1:len(x['teleop scoring']) - 1].split(", ")
                        game_pieces = auto_pieces + tele_pieces
                        agps.append(auto_pieces)
                        tgps.append(tele_pieces)

                        tele_st = int(x['stage level'])

                        if tele_st == 0:
                            tstpts.append(0)
                        elif tele_st == 1:
                            tstpts.append(1)
                        elif tele_st == 2:
                            tstpts.append(3)
                        elif tele_st >= 3:
                            tstpts.append(4)

                        try:
                            defe.append(int(x["defense skill"]))
                            speed.append(int(x["speed"]))
                            stab.append(int(x["stability"]))
                            inta.append(int(x["intake consistency"]))
                            driver.append(int(x["driver skill"]))
                            uptime.append(153000 - int(x["brick time"]))
                        except:
                            defe.append(3)
                            speed.append(3)
                            stab.append(3)
                            inta.append(3)
                            driver.append(3)
                            uptime.append(100)

                        try:
                            matches[x['match']][(x[''])] = game_pieces
                        except:
                            matches[x['match']] = {x['']: game_pieces}

                for i in range(0, len(agps)):
                    for j in range(0, len(agps[i])):
                        val = agps[i][j]
                        if val == 'as':
                            try:
                                agpts[i] += 2
                            except:
                                agpts[i] = 2
                        elif val == 'ss':
                            try:
                                agpts[i] += 5
                            except:
                                agpts[i] = 5
                        else:
                            try:
                                agpts[i] += 0
                            except:
                                agpts[i] = 0
                    avg_auto_points.append(agpts[i])

                for i in range(0, len(tgps)):
                    for j in range(0, len(tgps[i])):
                        val = tgps[i][j]
                        if val == 'as':
                            try:
                                tgpts[i] += 1
                            except:
                                tgpts[i] = 1
                        elif val == 'ss':
                            try:
                                tgpts[i] += 2
                            except:
                                tgpts[i] = 2
                        elif val in ['sa', 'ts']:
                            try:
                                tgpts[i] += 5
                            except:
                                tgpts[i] = 5
                        else:
                            try:
                                tgpts[i] += 0
                            except:
                                tgpts[i] = 0
                    avg_tele_points.append(tgpts[i])

                data_tpw = OrderedDict()
                data_tpw['avg-tele'] = avg(avg_tele_points)
                data_tpw['avg-auto'] = avg(avg_auto_points)
                data_tpw['avg-stage'] = avg(tstpts)
                data_tpw['avg-def'] = avg(defe)
                data_tpw['avg-driv'] = avg(driver)
                data_tpw['avg-speed'] = avg(speed)
                data_tpw['avg-stab'] = avg(stab)
                data_tpw['avg-inta'] = avg(inta)
                data_tpw['avg-upt'] = avg(uptime)
                data_tpw['matches'] = matches
                data_tpw['tpw-std'] = std(avg_auto_points) + std(avg_tele_points) + std(tstpts)
                data_tpw["tpw-score"] = data_tpw['avg-auto'] + data_tpw['avg-tele'] + data_tpw['avg-stage']
                parsed_tpw_data[team] = data_tpw #all team data stored to parsed_tpw_data OrderedDict
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

    baf = max([parsed_data[b1]['avg-fouls'], parsed_data[b2]['avg-fouls'], parsed_data[b3]['avg-fouls']]) + min([parsed_data[b1]['avg-fouls'], parsed_data[b2]['avg-fouls'], parsed_data[b3]['avg-fouls']])
    raf = max([parsed_data[r1]['avg-fouls'], parsed_data[r2]['avg-fouls'], parsed_data[r3]['avg-fouls']]) + min([parsed_data[r1]['avg-fouls'], parsed_data[r2]['avg-fouls'], parsed_data[r3]['avg-fouls']])

    batstd = avg([parsed_data[b1]['std-teleop'], parsed_data[b2]['std-teleop'], parsed_data[b3]['std-teleop']])
    ratstd = avg([parsed_data[r1]['std-teleop'], parsed_data[r2]['std-teleop'], parsed_data[r3]['std-teleop']])

    bmstd = min([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rmstd = min([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bmxstd = max([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rmxstd = max([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bastd = std([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']])
    rastd = std([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    brstd = bmxstd - bmstd
    rrstd = rmxstd - rmstd

    bluescore = bas - bastd - brstd + raf - batstd
    redscore = ras - rastd - rrstd + baf - ratstd

    if bluescore > redscore:
        return {'winner':'blue', 'blue-predicted': bluescore, 'red-predicted': redscore, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}
    else:
        return {'winner':'red', 'blue-predicted': bluescore, 'red-predicted': redscore, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}

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

    baat = avg([parsed_tpw_data[b1]['avg-tele'] + parsed_tpw_data[b1]['avg-auto'], parsed_tpw_data[b2]['avg-tele'] + parsed_tpw_data[b2]['avg-auto'], parsed_tpw_data[b3]['avg-tele'] + parsed_tpw_data[b3]['avg-auto']])
    raat = avg([parsed_tpw_data[r1]['avg-tele'] + parsed_tpw_data[r1]['avg-auto'], parsed_tpw_data[r2]['avg-tele'] + parsed_tpw_data[r2]['avg-auto'], parsed_tpw_data[r3]['avg-tele'] + parsed_tpw_data[r3]['avg-auto']])

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

    bluescore = baat + bas - bastd - brstd
    redscore = raat + ras - rastd - rrstd

    if bluescore > redscore:
        return {'winner':'blue', 'blue-predicted': bluescore, 'red-predicted': redscore, 'bp': bmix, 'rp': rmix, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}
    else:
        return {'winner':'red', 'blue-predicted': bluescore, 'red-predicted': redscore, 'bp': bmix, 'rp': rmix, 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}

def predict(b1, b2, b3, r1, r2, r3):
    b1 = str(b1)
    b2 = str(b2)
    b3 = str(b3)
    r1 = str(r1)
    r2 = str(r2)
    r3 = str(r3)

    tba = tba_predict(b1, b2, b3, r1, r2, r3)
    tpw = tpw_predict(b1, b2, b3, r1, r2, r3)

    bs1 = tba["blue-predicted"]
    bs2 = tpw["blue-predicted"]
    bs3 = tpw["bp"]

    rs1 = tba["red-predicted"]
    rs2 = tpw["red-predicted"]
    rs3 = tpw["rp"]

    bp = bs1 + bs2 + 5*(bs3 - rs3)
    rp = rs1 + rs2 + 5*(rs3 - bs3)

    if bp > rp:
        winner = 'blue'
    else:
        winner = 'red'

    return {'winner': winner, 'blue': bp, 'red': rp}

results = predict(args["b1"], args["b2"], args["b3"], args["r1"], args["r2"], args["r3"])
#print(results)

with open(base + event + "-" + args["r1"] + "-" + args["r2"] + "-" + args["r3"] + "-" + args["b1"] + "-" + args["b2"] + "-" + args["b3"] + "-prediction.json", "w") as f:
    json.dump(results, f)
