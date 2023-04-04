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
                    if x['team'] == str(team):
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

for team, dict in parsed_tpw_data.items():
    parsed_tpw_data[team]['r-score'] = parsed_tpw_data[team]["tpw-score"] - parsed_tpw_data[team]["tpw-std"] + parsed_tpw_data[team]["avg-driv"] + parsed_tpw_data[team]["avg-speed"] + parsed_tpw_data[team]["avg-stab"] + parsed_tpw_data[team]["avg-inta"]

sorted_dict = OrderedDict(sorted(parsed_tpw_data.items(), key=lambda x: x[1]["r-score"]))
public_dict = OrderedDict()

for team, dict in sorted_dict.items():
    print(team, dict["r-score"], dict["avg-def"])
    public_dict[team] = {"off-score": dict["r-score"], "def-score": dict["avg-def"]}

with open(base + event + "-rankings.json", "w") as f:
    json.dump(public_dict, f)
