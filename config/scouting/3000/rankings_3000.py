'''
python rankings_2026.py

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
    for team, dict in team_data.items():
        afgps = list()
        tfgps = list()
        afgpts = {}
        tfgpts = {}
        l1climbs = list()
        egcpts = list()  # endgame climb points
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
            auto_fuel_pieces = x['auto fuel scoring'][1:len(x['auto fuel scoring']) - 1].split(", ")
            tele_fuel_pieces = x['teleop fuel scoring'][1:len(x['teleop fuel scoring']) - 1].split(", ")
            game_pieces = auto_fuel_pieces + tele_fuel_pieces
            afgps.append(auto_fuel_pieces)
            tfgps.append(tele_fuel_pieces)
            l1climbs.append(x.get('l1 climb', '').lower() == 'true' or x.get('l1 climb', '') == True)

            c_lev = int(x['climb level'])
            if c_lev == 0:
                egcpts.append(0)
            elif c_lev == 1:
                egcpts.append(10)
            elif c_lev == 2:
                egcpts.append(20)
            elif c_lev >= 3:
                egcpts.append(30)

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

        for i in range(len(afgps)):
            afgpts[i] = 0
            for j in range(len(afgps[i])):
                val = afgps[i][j]
                if val == "fsa":
                    afgpts[i] = afgpts.get(i, 0) + 1
                else:
                    afgpts[i] = afgpts.get(i, 0) + 0
            if l1climbs[i]:
                afgpts[i] = afgpts.get(i, 0) + 15
            avg_auto_points.append(afgpts[i])
        for i in range(len(tfgps)):
            tfgpts[i] = 0
            for j in range(len(tfgps[i])):
                val = tfgps[i][j]
                if val == "fsa":
                    tfgpts[i] = tfgpts.get(i, 0) + 1
                elif val == "fp":
                    tfgpts[i] = tfgpts.get(i, 0) + 0
                else:
                    tfgpts[i] = tfgpts.get(i, 0) + 0
            avg_tele_points.append(tfgpts[i])

        data_tpw = OrderedDict()
        data_tpw['avg-tele'] = avg(avg_tele_points)
        data_tpw['avg-auto'] = avg(avg_auto_points)
        data_tpw['avg-climb'] = avg(egcpts)
        data_tpw['avg-def'] = avg(defe)
        data_tpw['avg-driv'] = avg(driver)
        data_tpw['avg-speed'] = avg(speed)
        data_tpw['avg-stab'] = avg(stab)
        data_tpw['avg-inta'] = avg(inta)
        data_tpw['avg-upt'] = avg(uptime)
        data_tpw['matches'] = matches
        data_tpw['tpw-std'] = std(avg_auto_points) + std(avg_tele_points) + std(egcpts)
        data_tpw["tpw-score"] = data_tpw['avg-auto'] + data_tpw['avg-tele'] + data_tpw['avg-climb']
        parsed_tpw_data[team] = data_tpw

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
    public_dict[team] = {"off-score": dict["r-score"], "def-score": dict["avg-def"]}

with open(base + event + "-rankings.json", "w") as f:
    json.dump(public_dict, f)
