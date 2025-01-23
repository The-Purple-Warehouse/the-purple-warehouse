'''
python rankings_2025.py

    --event         tba/frc event key
    --csv           filename of tpw data
    --baseFilePath  base filesystem path

stores rankings in json file:

    filename: [event]-rankings.json

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

event = args["event"]
base = args["baseFilePath"]
tpw_csv = args["csv"]

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

for team, dict in parsed_tpw_data.items():
    parsed_tpw_data[team]['r-score'] = parsed_tpw_data[team]["tpw-score"] - parsed_tpw_data[team]["tpw-std"] + parsed_tpw_data[team]["avg-driv"] + parsed_tpw_data[team]["avg-speed"] + parsed_tpw_data[team]["avg-stab"] + parsed_tpw_data[team]["avg-inta"]

sorted_dict = OrderedDict(sorted(parsed_tpw_data.items(), key=lambda x: x[1]["r-score"]))
public_dict = OrderedDict()

for team, dict in sorted_dict.items():
    #print(team, dict["r-score"], dict["avg-def"])
    public_dict[team] = {"off-score": dict["r-score"], "def-score": dict["avg-def"]}

with open(base + event + "-rankings.json", "w") as f:
    json.dump(public_dict, f)