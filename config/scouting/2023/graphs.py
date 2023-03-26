#imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import mpld3
from mpld3 import plugins
import datetime
import json
import requests
from statistics import mean
import sys
import os

rawArgs = sys.argv[1:]
args = {}
for i in range(len(rawArgs)):
	if rawArgs[i] == "--csv" and "csv" not in args:
		args["csv"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--event" and "event" not in args:
		args["event"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--baseFilePath" and "baseFilePath" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--teamNumber" and "teamNumber" not in args:
		args["teamNumber"] = rawArgs[i + 1]
		i += 1

#Sets fileAddress, event key, and takes csv downloaded from tpw

#Where to find the data
csv = args["csv"]
base = args["baseFilePath"]

#imports data and assigns to data
data = pd.read_csv(base + csv)

#event key for tpw
event = args["event"]

#importing from the TBI API requires a base url + an additional url segment indicating a specific path to look into

def tba_request(e):
	path = base + e + "-tba.json"
	if os.path.exists(path):
		with open(base + e + "-tba.json", "r") as file:
			data = json.load(file)
			return data
	else:
		raise Exception("Could not find TBA file")

event_key = event
x = tba_request(event_key) #loads details for each match for the given event from tba

match_number = [i['match_number'] for i in x] #creates a list of match numbers for each match in the event
comp_levels = [i['comp_level'] for i in x] #creates a list of comp levels for each match (qm = quals, qf = quarters, sf = semis, f = finals)

red_team_keys = np.array([[(i[3:]) for i in j['alliances']['red']['team_keys']] for j in x]) #team keys (frc[team number]) for red list with 3 elements in each slot
blue_team_keys = np.array([[(i[3:]) for i in j['alliances']['blue']['team_keys']] for j in x]) #same for blue

red_scores = [i['alliances']['red']['score'] if i['alliances']['red']['score'] >= 0 else np.nan for i in x] #score for red in each match or np.nan if the score doesn't exist (that is, the match hasn't been played yet)
#not keeping scores as 0 for incomplete matches bc to the program, that looks like a tie, not an unplayed match
blue_scores = [i['alliances']['blue']['score'] if i['alliances']['blue']['score'] >= 0 else np.nan for i in x] #same for blue

red_rp = [np.nan if i['score_breakdown'] is None else i['score_breakdown']['red']['rp'] for i in x] #number of RP the red alliance got if the match has been played, otherwise np.nan
blue_rp = [np.nan if i['score_breakdown'] is None else i['score_breakdown']['blue']['rp'] for i in x] #same for blue
youtube_link = ['https://www.youtube.com/watch/{}'.format(i['videos'][0]['key']) if (len(i['videos']) > 0) else np.nan for i in x] #a youtube link if the match has been played

tba_data = pd.DataFrame(np.array([match_number, comp_levels, red_team_keys[:,0], red_team_keys[:,1], red_team_keys[:,2], blue_team_keys[:,0], blue_team_keys[:,1], blue_team_keys[:,2], red_scores, blue_scores, red_rp, blue_rp, youtube_link],dtype='object').T, columns=['match', 'level', 'r1', 'r2', 'r3', 'b1', 'b2', 'b3', 'red score', 'blue score', 'red rp', 'blue rp', 'video'])
#basically just creates a gigantic dataframe with all of the previously-created lists as columns
tba_data['match'] = tba_data['match'].astype(int) #sets the match to an int type so it can be sorted
tba_data = tba_data.sort_values('match').reset_index().drop('index', axis=1) #sorts mathches in order

#tba_data = pd.read_csv(f'{fileAddress}{event} tba data.csv')

#list of teams..not really used
teams = np.unique(np.array(tba_data[tba_data['level'] == 'qm'][['r1', 'r2', 'r3', 'b1', 'b2', 'b3']]).flatten())

#Makes seperate data frame of data for just one specific team
#@param teamNum the team number to make the data frame for
#@return the specific data frame

def specificTeam(teamNum):
    team = teamNum
    team_data = data[data["team"] == int(team)]
    if team_data == []:
        team_data = data[data["team"] == (team)]
    # team_data.to_csv('specificTeam: ' + str(teamNum) + ".csv")
    return team_data

#Uses specificTeam to condense important offense information like number of cones, cubes, ect..
#Based on format by Timmy Chen
#@param teamNum team number
#@return a data frame of condensed information
def shotSummary(teamNum ):
    team = teamNum
    team_data = specificTeam(team)
    game_pieces = pd.DataFrame(columns = ["Match", "Cones", "Cubes", "Missed", "Total Shots"])
    x = len(game_pieces)
    y =0
    count = 0
    arrMissed = []
    for r in team_data['game piece']:
        cone = 0
        cube = 0
        missed = 0
        for s in r:

            if s =='b':
                cube +=1
            if s =='y':
                cone +=1
            if s == 'm':
                missed +=1

        total =cone +cube+missed
        game_pieces.loc[count] = [count,cone,cube,missed,total]
        count +=1
    # game_pieces.to_csv("summary of " + str(teamNum) + ".csv")
    return game_pieces

 #data frame of just locations. Is used in sorted Array for location graphing
def combineLocations(team):
    spec = specificTeam(team)
    x = pd.DataFrame(columns = ['locations'])
    count = 0
    for r in spec['locations']:
        x.loc[count] = r
        count+=1
    return x

#combineLocations(team).to_csv('name.csv')

#takes location of specified match
def sortedArray(team, matchNum):

    x = combineLocations(team)['locations']

    arr = x[matchNum]
    arr = arr.replace("[", "")
    arr = arr.replace("]", "")
    arr = arr.replace(",", "")
    arr = arr.split()
    #sortedArray.to_csv('sortedArray.csv')
    return arr
def specifShot(team):
    spec = specificTeam(team)
    x = pd.DataFrame(columns = ['game piece'])
    count = 0
    for r in spec['game piece']:
        x.loc[count] = r
        count+=1
    return x
def sortedShot(team, matchNum):
    x = specifShot(team)['game piece']
    arr = x[matchNum]
    arr = arr.replace("[", "")
    arr = arr.replace("]", "")
    arr = arr.replace(",", "")
    arr = arr.replace("''", "")
    arr = arr.split()
    return arr
def specifAny(name, team):
    spec = specificTeam(team)
    x = pd.DataFrame(columns = [name])
    count = 0
    for r in spec[name]:
        x.loc[count] = r
        count+=1
    return x
#not for arrays
def MatchSpecAny(name, team, match):
    x = specifAny(name, team)[name]
    arr = x[match]
    return arr
def locationsOfMissed(team, matchNum):
    overallLoc = sortedArray(team, matchNum)
    print(overallLoc)
    overallShot = sortedShot(team, matchNum)
    print(overallShot)
    m = []
    count = 0
    for i in overallShot:
        if (i == "'m'"):
            m.append(count)
        count += 1
    locM = []
    counter = 0
    for i in m:
        locM.append(int(overallLoc[i]))
    locM.sort()
    return locM
#WARNING: IF TEAM MISSES THEN MAKES, REPORTS AS MISSED..i think
#VISUALIZING
def visualizeLocations(team, matchNum):
    vis = pd.DataFrame(columns = [1, 2, 3, 4, 5, 6, 7, 8, 9])
    arr = sortedArray(team, matchNum)
    missed = locationsOfMissed(team, matchNum)
    print("missed")
    print(missed)
    topRow = []
    midRow = []
    lowRow = []
    for i in arr:
        i = int(i)
        if i <= 9:
            topRow.append(i)
        if (i > 9) & (i<=18) :
            midRow.append(i)
        if (i < 30) & (i>18):
            lowRow.append(i)
    topRow.sort()
    midRow.sort()
    lowRow.sort()
    print('top')
    print(topRow)
    print('mid')
    print(midRow)
    print('low')
    print(lowRow)
    last = 0;

    nums = [1+last, 2+last, 3+last, 4+last, 5+last, 6+last, 7+last, 8+last, 9+last]
    for r in nums:
        if missed.count(r) !=0 :
            nums[r-1] = "x"
        elif topRow.count(r) != 0:
            nums[r-1] = "O"
        else:
            nums[r-1] = "-"
    vis.loc[0]  = nums
    last +=9

    nums = [1+last, 2+last, 3+last, 4+last, 5+last, 6+last, 7+last, 8+last, 9+last]
    for r in nums:
        if missed.count(r) !=0 :
            nums[r-10] = "x"
        elif midRow.count(r) != 0:
            nums[r-10] = "O"
        else:
            nums[r-10] = "-"
    vis.loc[1]  = nums
    last +=9

    nums = [1+last, 2+last, 3+last, 4+last, 5+last, 6+last, 7+last, 8+last, 9+last]
    for r in nums:
        if missed.count(r) !=0 :
            nums[r-19] = "x"
        elif lowRow.count(r) != 0:
            nums[r-19] = "O"
        else:
            nums[r-19] = "-"
    vis.loc[2]  = nums
    vis.to_csv("visualization of: " + team+ "matchNum: "+match+".csv")
    return vis

#scores are not fine tuned
#SORTING
def defenseScore(team):
    total = 0
    count = 0
    spec = specificTeam(team)
    stats = shotSummary(team)
    for r in spec['defense time']:
        total += (r/2)
        count +=1
    for r in spec['defense skill']:
        total += 10*r
    for r in spec['speed']:
        total += 30*r
    for r in spec['drive skill']:
        total += 30*r
    return round (total, 2)

def offenseScore(team):
    spec = specificTeam(team)
    stats = shotSummary(team)
    count = 0
    total = 0
    for r in stats['Cones']:
        total += r*10
        count +=1
    for r in stats['Cubes']:
        total += r*10
    for r in stats['Missed']:
        total -= (r/2)
    for r in stats['Total Shots']:
        total += r
    for r in spec['ground pick-up']:
        if r == True:
            total +=10
    for r in spec['auto count']:
        total += r*5
    for r in spec['end climb']:
        total +=r*20
    for r in spec['climb time']:
        if r > 30:
            total -= 10
        if r <30:
            total += 30
    for r in spec['drive skill']:
        total += 30*r
    for r in spec['speed']:
        total += 30*r
    return round(total, 2)

def overallScore(team):
    x = defenseScore(team)
    y = offenseScore(team)
    spec = specificTeam(team)
    total = 0
    for r in spec['break time']:
        total -= r
    return  (x + 5*y) +total

team_stats = pd.DataFrame(columns = ["team", 'defense score', 'offense score', 'overall score'])
counter =0
for r in teams:
    team = r
    team_stats.loc[counter] = [r, defenseScore(team), offenseScore(team), overallScore(team)]
    counter+=1

#Sorting methods
def sortOverallScoreUp():
     return team_stats.sort_values('overall score', ascending = False)
def sortMethod(rowName, asc):
    return team_stats.sort_values(rowName, ascending = asc)

#GRAPHING
team = args["teamNumber"]

dataS = shotSummary(team)

fig, ax = plt.subplots()

x_Y = dataS['Match']
y_Y = dataS['Cones']
y_B = dataS['Cubes']
y_M = dataS['Missed']
y_T = dataS['Total Shots']
ax.plot(x_Y, y_Y, label = 'Cones')
ax.plot(x_Y, y_B, label = 'Cubes')
ax.plot(x_Y, y_M, label = 'Missed')
ax.plot(x_Y, y_T, label = 'Total')

plt.title('Scoring Over Time ' + str(team))
plt.xlabel('Match Num')
plt.ylabel('Num')
plt.legend()
#plt.show()
ax.plot()
#ax.lines.pop(4)
html_fig = mpld3.fig_to_html(fig)
write = open(base + event + '-' + team + '-analysis.html', "w")
write.write(html_fig)
write.close()
#output: #plt.savefig('my_plot.png')
