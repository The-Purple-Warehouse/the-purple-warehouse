'''
python graphs_2024.py

    --event         tba/frc event key
    --csv           filename of tpw data
    --baseFilePath  base filesystem path
    --team          team to be analyzed | !! Only use for --mode 0 !!
    --teamList      comma separated list of teams to by analyzed | !! Only use for --mode 1 or 2 !! | ex. --teamList 254,1679,1072 --mode 2
    --mode          0 - team performance over time graph | 1 - team(s) avg score spread radar chart | 2 - team(s) percentage scoring + performance of best score/perf
    --theme         null/0 - light theme for --mode 1 & 2 | 1 -  dark theme for --mode 1 & 2

tba cached data must be in file named: event-tba.json

returns graph/chart to html file:

    mode    filename
    0       [event]-[team1]-analysis.html
    1       [team1]_[team2]_[team3]_etc_spreadChart.html
    2       [team1]_[taem2]_[team3]_etc_CTBchart.html

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
import matplotlib.pyplot as plt
import mpld3
from mpld3 import plugins
import matplotlib.pyplot as plt
import plotly
import plotly.express as plty
import plotly.graph_objects as go
import plotly.io as pio
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
    elif rawArgs[i] == "--team" and "team" not in args:
        args["team"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--teamList" and "teamList" not in args:
        args["teamList"] = rawArgs[i + 1].split(',')
        i += 1
    elif rawArgs[i] == "--mode" and "mode" not in args:
        args["mode"] = rawArgs[i + 1]
        i += 1
    elif rawArgs[i] == "--theme" and "theme" not in args:
        args["theme"] = rawArgs[i + 1]
        i += 1

event = args["event"]
base = args["baseFilePath"]
tpw_csv = args["csv"]

template = 'plotly'
if 'theme' in args and int(args["theme"]) == 0:
    template = 'plotly'
elif 'theme' in args and int(args["theme"]) == 1:
    template = 'plotly_dark'

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
    for team, dict in team_data.items(): # team_data is tba data in an OrderedDict, just used to get list of teams, dict=DATA
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


def shotSummary(team):
    data = parsed_tpw_data[str(team)]
    game_pieces = pd.DataFrame(columns = ["Match", "Speaker", "Amp", "Trap", "Missed", "Total Shots"])
    for r in data['matches']:
        speaker = list()
        amp = list()
        trap = list()
        missed = list()
        for s in data['matches'][r]:
            sp = 0
            am = 0
            tr = 0
            mi = 0
            for e in data['matches'][r][s]:
                if e == 'as':
                    am += 1
                elif e == 'ss':
                    sp += 1
                elif e == 'sa':
                    sp += 1
                elif e == 'ts':
                    tr += 1
                elif 'm' in e:
                    mi += 1
            speaker.append(sp)
            amp.append(am)
            trap.append(tr)
            missed.append(mi)
        speaker = avg(speaker)
        amp = avg(amp)
        trap = avg(trap)
        missed = avg(missed)
        total = speaker+amp+trap+missed
        game_pieces.loc[r] = [r,speaker,amp,trap,missed,total]
    return game_pieces

def radarChartSpread(teams):
    categories = ['auto points', 'teleop points', 'stage points', 'total points', 'auto points']
    fig = go.Figure()
    fn = ''
    for team in teams:
        team = str(team)
        fn += team + '-'

        s_team = [parsed_tpw_data[team]["avg-auto"], parsed_tpw_data[team]["avg-tele"], parsed_tpw_data[team]["avg-stage"], parsed_tpw_data[team]["tpw-score"], parsed_tpw_data[team]["avg-auto"]]

        fig.add_trace(go.Scatterpolar(
              r=s_team,
              theta=categories,
              fill='toself',
              name=team
        ))

    fig.update_layout(
        title_font_family="Sitka",
        title_font_color="green",
        title = "Average Point Spread",
        width = 600,
        height = 600,
        template=template)

    plotly.offline.plot(fig, filename=base + event + "-" + fn + 'standard-radar.html', auto_open=False)

def getBest():
    auto = 0
    tele = 0
    total = 0
    drive = 0
    defe = 0
    stab = 0
    upt = 0
    speed = 0
    inta = 0

    for team, dict in parsed_tpw_data.items():
        if dict["avg-auto"] > auto:
            auto = dict["avg-auto"]
        if dict["avg-tele"] > tele:
            tele = dict["avg-tele"]
        if dict["tpw-score"] > total:
            total = dict["tpw-score"]
        if dict["avg-driv"] > drive:
            drive = dict["avg-driv"]
        if dict["avg-def"] > defe:
            defe = dict["avg-def"]
        if dict["avg-stab"] > stab:
            stab = dict["avg-stab"]
        if dict["avg-upt"] > upt:
            upt = dict["avg-upt"]
        if dict["avg-speed"] > speed:
            speed = dict["avg-speed"]
        if dict["avg-inta"] > inta:
            inta = dict["avg-inta"]
    return [auto, tele, total, drive, defe, stab, upt, speed, inta]

#CTB: Compare To Best
def radarChartCTB(teams):
    categories = ["auto pts", "teleop pts", "total pts", "drive skill", "defense", "stability", "uptime", "speed", "intake", "auto pts"]
    maxes = getBest()
    for i in range(len(maxes)):
        if(maxes[i] == 0):
            maxes[i] = 0.000000001

    fig = go.Figure()
    avgerage_spread = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    fn = ''

    for team in teams:
        team = str(team)
        fn += team + '-'

        s_team = [parsed_tpw_data[team]["avg-auto"]/maxes[0], parsed_tpw_data[team]["avg-tele"]/maxes[1], parsed_tpw_data[team]["tpw-score"]/maxes[2], parsed_tpw_data[team]["avg-driv"]/maxes[3], parsed_tpw_data[team]["avg-def"]/maxes[4], parsed_tpw_data[team]["avg-stab"]/maxes[5], parsed_tpw_data[team]["avg-upt"]/maxes[6], parsed_tpw_data[team]["avg-speed"]/maxes[7], parsed_tpw_data[team]["avg-inta"]/maxes[8], parsed_tpw_data[team]["avg-auto"]/maxes[0]]

        fig.add_trace(go.Scatterpolar(
              r=s_team,
              theta=categories,
              fill='toself',
              name=team
        ))

    fig.add_trace(go.Scatterpolar(
          r=avgerage_spread,
          theta=categories,
          fill='none',
          name="Best Achieved"
    ))

    fig.update_layout(
        title_font_family="Sitka",
        title_font_color="green",
        title = "Stats Percent of Best",
        width = 600,
        height = 600,
        template=template)

    plotly.offline.plot(fig, filename=base + event + "-" + fn + 'max-radar.html', auto_open=False)

def overTimeChart(team):
    dataS = shotSummary(team)

    fig, ax = plt.subplots()

    x_Y = dataS['Match']
    y_S = dataS['Speaker']
    y_A = dataS['Amp']
    y_Tr = dataS['Trap']
    y_M = dataS['Missed']
    y_T = dataS['Total Shots']
    ax.plot(x_Y, y_S, label = 'Speaker')
    ax.plot(x_Y, y_A, label = 'Amp')
    ax.plot(x_Y, y_Tr, label = 'Trap')
    ax.plot(x_Y, y_M, label = 'Missed')
    ax.plot(x_Y, y_T, label = 'Total')

    plt.title('Scoring Over Time ' + str(team))
    plt.xlabel('Match Num')
    plt.ylabel('Num')
    plt.legend()
    ax.plot()
    html_fig = mpld3.fig_to_html(fig)
    write = open(base + event + '-' + team + '-analysis.html', "w")
    write.write(html_fig)
    write.close()


if int(args["mode"]) == 0:
    overTimeChart(str(args["team"]))
elif int(args["mode"]) == 1:
    radarChartSpread(args["teamList"])
elif int(args["mode"]) == 2:
    radarChartCTB(args["teamList"])
