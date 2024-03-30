'''
python rankings_2024.py

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

        for x in dict:
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
