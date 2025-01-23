'''
python predictions_2025.py

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
    team_data = OrderedDict()
    data_length = 0

    if os.path.exists(tpw_path):
        with open(tpw_path, "r") as file:
            TPW_data = csv.DictReader(file)
            for x in TPW_data:
                data_length += 1
                if x['team'] not in team_data:
                    team_data[x['team']] = [x]
                else:
                    team_data[x['team']].append(x)
    else:
        raise Exception("Could not find TPW file")

    parsed_tpw_data = OrderedDict()
    for team, dict in team_data.items(): # team_data is tba data in an OrderedDict, just used to get list of teams
        acgps = list() #auto coral game pieces
        aagps = list () #auto algae game pieces
        tcgps = list() #teleop coral game pieces
        tagps = list() #teleop algae game pieces
        acgpts = {} #auto coral game piece points
        aagpts = {} #auto algae game piece points
        tcgpts = {} #teleop coral game piece points
        tagpts = {} #teleop algae game piece points
        # agpts = {} #auto game piece points
        # tgpts = {} #teleop game piece points
        egcpts = list() #endgame cage points
        defe = list()
        speed = list()
        driver = list()
        stab = list()
        inta = list()
        uptime = list()
        avg_auto_points = list()
        avg_tele_points = list()
        matches = {}

        for x in dict:
            auto_algae_pieces = x['auto algae scoring'][1:len(x['auto algae scoring']) - 1].split(", ")
            auto_coral_pieces = x['auto coral scoring'][1:len(x['auto coral scoring']) - 1].split(", ")
            tele_algae_pieces = x['teleop algae scoring'][1:len(x['teleop algae scoring']) - 1].split(", ")
            tele_coral_pieces = x['teleop coral scoring'][1:len(x['teleop coral scoring']) - 1].split(", ")
            game_algae_pieces = auto_algae_pieces + tele_algae_pieces
            game_coral_pieces = auto_coral_pieces + tele_coral_pieces
            game_pieces = game_algae_pieces + game_coral_pieces
            acgps.append(auto_coral_pieces)
            aagps.append(auto_algae_pieces)
            tcgps.append(tele_coral_pieces)
            tagps.append(tele_algae_pieces)

            cage_lev = int(x['cage level'])

            if cage_lev == 0:
                egcpts.append(0)
            elif cage_lev == 1:
                egcpts.append(2)
            elif cage_lev == 2:
                egcpts.append(6)
            elif cage_lev >= 3:
                egcpts.append(12)

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

        for i in range(0, len(acgps)):
            for j in range(0, len(acgps[i])):
                val = acgps[i][j]
                if val == 'cs1':
                    try:
                        acgpts[i] += 3
                    except:
                        acgpts[i] = 3
                elif val == 'cs2':
                    try:
                        acgpts[i] += 4
                    except:
                        acgpts[i] = 4
                elif val == 'cs3':
                    try:
                        acgpts[i] += 6
                    except:
                        acgpts[i] = 6
                elif val == 'cs4':
                    try:
                        acgpts[i] += 7
                    except:
                        acgpts[i] = 7
                else:
                    try:
                        acgpts[i] += 0
                    except:
                        acgpts[i] = 0
            avg_auto_points.append(acgpts[i])

        for i in range(0, len(aagps)):
            for j in range(0, len(aagps[i])):
                val = aagps[i][j]
                if val == 'asn':
                    try:
                        aagpts[i] += 4
                    except:
                        aagpts[i] = 4
                elif val == 'asp':
                    try:
                        aagpts[i] += 6
                    except:
                        aagpts[i] = 6
                else:
                    try:
                        aagpts[i] += 0
                    except:
                        aagpts[i] = 0
            avg_auto_points.append(aagpts[i])

        for i in range(0, len(tcgps)):
            for j in range(0, len(tcgps[i])):
                val = tcgps[i][j]
                if val == 'cs1':
                    try:
                        tcgpts[i] += 2
                    except:
                        tcgpts[i] = 2
                elif val == 'cs2':
                    try:
                        tcgpts[i] += 3
                    except:
                        tcgpts[i] = 3
                elif val == 'cs3':
                    try:
                        tcgpts[i] += 4
                    except:
                        tcgpts[i] = 4
                elif val == 'cs4':
                    try:
                        tcgpts[i] += 5
                    except:
                        tcgpts[i] = 5
                else:
                    try:
                        tcgpts[i] += 0
                    except:
                        tcgpts[i] = 0
            avg_tele_points.append(tcgpts[i])

        for i in range(0, len(tagps)):
            for j in range(0, len(tagps[i])):
                val = tagps[i][j]
                if val == 'asn':
                    try:
                        tagpts[i] += 4
                    except:
                        tagpts[i] = 4
                elif val == 'asp':
                    try:
                        tagpts[i] += 6
                    except:
                        tagpts[i] = 6
                else:
                    try:
                        tagpts[i] += 0
                    except:
                        tagpts[i] = 0
            avg_tele_points.append(tagpts[i])

        data_tpw = OrderedDict()
        data_tpw['avg-tele'] = avg(avg_tele_points)
        data_tpw['avg-auto'] = avg(avg_auto_points)
        data_tpw['avg-cage'] = avg(egcpts)
        data_tpw['avg-def'] = avg(defe)
        data_tpw['avg-driv'] = avg(driver)
        data_tpw['avg-speed'] = avg(speed)
        data_tpw['avg-stab'] = avg(stab)
        data_tpw['avg-inta'] = avg(inta)
        data_tpw['avg-upt'] = avg(uptime)
        data_tpw['matches'] = matches
        data_tpw['tpw-std'] = std(avg_auto_points) + std(avg_tele_points) + std(egcpts)
        data_tpw["tpw-score"] = data_tpw['avg-auto'] + data_tpw['avg-tele'] + data_tpw['avg-cage']
        parsed_tpw_data[team] = data_tpw #all team data stored to parsed_tpw_data OrderedDict

    with open(base + 'parsed_tpw_data_'+event+'.json', 'w') as f:
        f.write(json.dumps({'lines': data_length, 'data': parsed_tpw_data}, default=int))
        f.close()
    return parsed_tpw_data

def getDataLength():
    data_length = 0
    if os.path.exists(tpw_path):
        with open(tpw_path, "r") as file:
            TPW_data = csv.DictReader(file)
            for x in TPW_data:
                data_length += 1
    else:
        raise Exception("Could not find TPW file")

    return data_length


if os.path.exists(base + 'parsed_tpw_data_'+event+'.json'):
    with open(base + 'parsed_tpw_data_'+event+'.json') as f:
        loaded = json.loads(f.read())
        if loaded['lines'] == getDataLength():
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

    # blue average score
    # blue average foul

    baf = max([parsed_data[b1]['avg-fouls'], parsed_data[b2]['avg-fouls'], parsed_data[b3]['avg-fouls']]) + min([parsed_data[b1]['avg-fouls'], parsed_data[b2]['avg-fouls'], parsed_data[b3]['avg-fouls']])
    raf = max([parsed_data[r1]['avg-fouls'], parsed_data[r2]['avg-fouls'], parsed_data[r3]['avg-fouls']]) + min([parsed_data[r1]['avg-fouls'], parsed_data[r2]['avg-fouls'], parsed_data[r3]['avg-fouls']])

    # stdev of all of the alliance partners in the simulation (all averaged) FOR TELEOP

    batstd = avg([parsed_data[b1]['std-teleop'], parsed_data[b2]['std-teleop'], parsed_data[b3]['std-teleop']])
    ratstd = avg([parsed_data[r1]['std-teleop'], parsed_data[r2]['std-teleop'], parsed_data[r3]['std-teleop']])

    # off of whole score, min of stdev of the whole score for any team in the blue
    
    # stdev of score in every match played: parsed_data[b1]['std-score']
    
    bmstd = min([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']]) # most blue consistent team
    rmstd = min([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bmxstd = max([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']]) # least blue consistent team
    rmxstd = max([parsed_data[r1]['std-score'], parsed_data[r2]['std-score'], parsed_data[r3]['std-score']])

    bastd = std([parsed_data[b1]['std-score'], parsed_data[b2]['std-score'], parsed_data[b3]['std-score']]) # stdev of consistences...
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

    brstd = bmxstd - bmstd # subtract worst standard deviation from best standard deviation, range of consistency
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
    
    # bmix mix of averages and stdevs, for 5 star qualitative ratings
    # bluescore estimates point score
    
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

    tpw = tpw_predict(b1, b2, b3, r1, r2, r3)

    if len(parsed_data) >= len(parsed_tpw_data):
        tba = tba_predict(b1, b2, b3, r1, r2, r3)

        bs1 = tba["blue-predicted"]
        bs2 = tpw["blue-predicted"]
        bs3 = tpw["bp"]

        rs1 = tba["red-predicted"]
        rs2 = tpw["red-predicted"]
        rs3 = tpw["rp"]

        bp = bs1 + bs2 + 5*(bs3 - rs3) # look into 5
        rp = rs1 + rs2 + 5*(rs3 - bs3)
    else:
        bp = tpw["blue-predicted"]
        rp = tpw["red-predicted"]

    if bp > rp:
        winner = 'blue'
    else:
        winner = 'red'

    return {'winner': winner, 'blue': bp, 'red': rp}

results = predict(args["b1"], args["b2"], args["b3"], args["r1"], args["r2"], args["r3"])
#print(results)

with open(base + event + "-" + args["r1"] + "-" + args["r2"] + "-" + args["r3"] + "-" + args["b1"] + "-" + args["b2"] + "-" + args["b3"] + "-prediction.json", "w") as f:
    json.dump(results, f)