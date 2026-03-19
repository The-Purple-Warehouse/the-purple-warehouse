'''
python graphs_2026.py

    --event         tba/frc event key
    --csv           filename of tpw data
    --baseFilePath  base filesystem path
    --team          team to be analyzed | !! Only use for --mode 0 !!
    --teamList      comma separated list of teams to by analyzed | !! Only use for --mode 1 or 2 !! | ex. --teamList 254,1679,1072 --mode 2
    --mode          0 - fuel scoring over time | 1 - team(s) avg score spread radar chart | 2 - team(s) percentage scoring + performance of best score/perf | 3 - auto vs teleop fuel chart
    --theme         null/0 - light theme for --mode 1 & 2 | 1 -  dark theme for --mode 1 & 2

tba cached data must be in file named: event-tba.json

returns graph/chart to html file:

    mode    filename
    0       [event]-[team1]-fuel_analysis.html
    1       [team1]_[team2]_[team3]_etc_spreadChart.html
    2       [team1]_[taem2]_[team3]_etc_CTBchart.html
    3       [event]-[team1]-auto_vs_teleop.html

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
                matches[x['match']][(x[''])] = {
                    'auto': auto_fuel_pieces,
                    'teleop': tele_fuel_pieces
                }
            except:
                matches[x['match']] = {x['']: {
                    'auto': auto_fuel_pieces,
                    'teleop': tele_fuel_pieces
                }}

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

def shotSummary(team):
    data = parsed_tpw_data[str(team)]
    game_pieces = pd.DataFrame(columns = ["Match", "AutoScored", "TeleopScored", "TeleopPassed", "Total Fuel"])
    for r in data['matches']:
        auto_scored_list = list()
        tele_scored_list = list()
        tele_passed_list = list()
        for s in data['matches'][r]:
            entry = data['matches'][r][s]
            if isinstance(entry, dict):
                a_scored = 0
                for e in entry.get('auto', []):
                    if e == "fsa":
                        a_scored += 1
                t_scored = 0
                t_passed = 0
                for e in entry.get('teleop', []):
                    if e == "fsa":
                        t_scored += 1
                    elif e == "fp":
                        t_passed += 1
                auto_scored_list.append(a_scored)
                tele_scored_list.append(t_scored)
                tele_passed_list.append(t_passed)
            else:
                auto_scored_list.append(0)
                tele_scored_list.append(0)
                tele_passed_list.append(0)
        auto_avg = avg(auto_scored_list)
        tele_avg = avg(tele_scored_list)
        pass_avg = avg(tele_passed_list)
        total = auto_avg + tele_avg + pass_avg
        game_pieces.loc[r] = [r, auto_avg, tele_avg, pass_avg, total]
    return game_pieces

def radarChartSpread(teams):
    categories = ['auto points', 'teleop points', 'climb points', 'total points', 'auto points']
    fig = go.Figure()
    fn = ''
    for team in teams:
        team = str(team)
        fn += team + '-'

        s_team = [parsed_tpw_data[team]["avg-auto"], parsed_tpw_data[team]["avg-tele"], parsed_tpw_data[team]["avg-climb"], parsed_tpw_data[team]["tpw-score"], parsed_tpw_data[team]["avg-auto"]]

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

def overTimeFuelChart(team):
    dataS = shotSummary(team)

    fig, ax = plt.subplots()

    x_Y = dataS['Match']
    y_AS = dataS['AutoScored']
    y_TS = dataS['TeleopScored']
    y_TP = dataS['TeleopPassed']
    y_T = dataS['Total Fuel']
    ax.plot(x_Y, y_AS, label = 'Auto Scored')
    ax.plot(x_Y, y_TS, label = 'Teleop Scored')
    ax.plot(x_Y, y_TP, label = 'Teleop Passed')
    ax.plot(x_Y, y_T, label = 'Total')

    plt.title('Fuel Scoring Over Time ' + str(team))
    plt.xlabel('Match Num')
    plt.ylabel('Num')
    plt.legend()
    ax.plot()
    html_fig = mpld3.fig_to_html(fig)
    write = open(base + event + '-' + team + '-fuel_analysis.html', "w")
    write.write(html_fig)
    write.close()

def autoVsTeleopChart(team):
    dataS = shotSummary(team)

    fig, ax = plt.subplots()

    x_Y = dataS['Match']
    y_AS = dataS['AutoScored']
    y_TS = dataS['TeleopScored']
    y_TP = dataS['TeleopPassed']
    y_T = dataS['Total Fuel']
    ax.plot(x_Y, y_AS, label = 'Auto Scored')
    ax.plot(x_Y, y_TS, label = 'Teleop Scored')
    ax.plot(x_Y, y_TP, label = 'Teleop Passed')
    ax.plot(x_Y, y_T, label = 'Total')

    plt.title('Auto vs Teleop Fuel Scoring ' + str(team))
    plt.xlabel('Match Num')
    plt.ylabel('Num')
    plt.legend()
    ax.plot()
    html_fig = mpld3.fig_to_html(fig)
    write = open(base + event + '-' + team + '-auto_vs_teleop.html', "w")
    write.write(html_fig)
    write.close()


if int(args["mode"]) == 0:
    overTimeFuelChart(str(args["team"]))
elif int(args["mode"]) == 1:
    radarChartSpread(args["teamList"])
elif int(args["mode"]) == 2:
    radarChartCTB(args["teamList"])
elif int(args["mode"]) == 3:
    autoVsTeleopChart(str(args["team"]))
