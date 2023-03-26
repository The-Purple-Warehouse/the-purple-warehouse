# --event --baseFilePath -- csv --t1 --t2 --t3 --type
#imports
import pandas as pd
import numpy as np

#graph stuff
import plotly
import plotly.express as plt
import plotly.graph_objects as go

import seaborn as sns
from collections import OrderedDict
import requests as rq
import json
import os
import math
import sys
import time

#This contains information for team 1072s: The Harker School 2023 Scouting Analyzer
#Using data from the scouting app it does analysis to help scouters during matches and for public scouting analyzer project!

#Sets fileAddress, event key, and takes csv downloaded from tba
#apikey = 'Wqt2K6oW76k4u6iYqghgNb1R3uzKcDkVFFhSbLG0vR4qDsAVGdcei5noa1EKRvQO' #enter tba api key

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
	elif rawArgs[i] == "--t1" and "t1" not in args:
		args["t1"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--t2" and "t2" not in args:
		args["t2"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--t3" and "t3" not in args:
		args["t3"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--type" and "type" not in args:
		args["type"] = rawArgs[i + 1]
		i += 1

eventKeys = [args["event"]]
fileAddress = args["baseFilePath"]
csv = args["csv"]

#Where to find the data in google drive

#imports data and assignes to data
data = pd.read_csv(fileAddress + csv)

def tba_request(e):
    
    path = fileAddress + event + "-tba.json"
    if os.path.exists(path):
        with open(fileAddress + event + "-tba.json", "r") as file:
            data = json.load(file)
    else:
        raise Exception("Could not find TBA file")
    return data

    '''
    res = rq.get('https://www.thebluealliance.com/api/v3/event/'+e+'/matches?X-TBA-Auth-Key='+apikey)
    data = res.json()
    return data
    '''

#event key for tba
event = eventKeys[0]

#gets tba_data from google drive
tba_data = tba_request(event)

def data_format(arr): #change the strings in csv to usuable char list
    arr = arr.replace("[", "")
    arr = arr.replace("]", "")
    arr = arr.replace(",", "")
    arr = arr.replace("'", "")
    arr = arr.split()
    return arr

def uniqueTeams():
    teams = list(set(data["team"]))
    return (teams)

#print(uniqueTeams())

#Makes seperate data frame of data for just one specific team
#@param teamNum the team number to make the data frame for
#@return the specific data frame

def specificTeam(teamNum):
    team = (teamNum)
    str_data = data.astype({"team": "string"})
    team_data = str_data[str_data["team"] == str(team)]
    #print(team_data)
    return team_data

#Uses specificTeam to condense important offense information like number of cones, cubes, ect..
#Based on format by Timmy Chen
#@param teamNum team number
#@return a data frame of condensed information
def shotSummary(teamNum):
    team = teamNum
    team_data = specificTeam(team)
    game_pieces = pd.DataFrame(columns = ["Match", "Cones", "Cubes", "Missed", "Total Shots"])
    #game_pieces
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

#takes location of specified match
def sortedArray(team, matchNum):

    x = combineLocations(team)['locations']


    arr = x[matchNum]
    arr = data_format(arr)


    return arr


#generates the game piece types for each match
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
    arr = data_format(arr)

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
#subfunction to grab data for specific team, for radar chart
#name: grabbed attribute
#team: straightforward
#match: relative to the total matches team plays, not global matches
def MatchSpecAny(name, team, match):
    x = specifAny(name, team)[name]


    arr = x[match]

    arr = str(arr)
    arr = data_format(arr)
    return arr

def locationsOfMissed(team, matchNum):
    overallLoc = list(map(int, sortedArray(team, matchNum))) #locations as int list
    #print(overallLoc)
    overallShot = sortedShot(team, matchNum) #shots as char list
    #print(overallShot)
    m = []
    count = 0

    for i in overallShot:
        if (i == "m"):
            m.append(count)
        count += 1
    locM = []
    counter = 0
    for i in m:
        locM.append(int(overallLoc[i]))
    locM.sort()
    return locM

def height_to_point(loc, period): #location number, whether it is in auton or tele
    #input location as a string
    if loc == "":
        return 0;
    loc = int(loc)
    if 1 <= loc <= 9: #high
        if period == "AUTON":
            return 6
        elif period == "TELEOP":
            return 5
        else:
            return "invalid period type"
    elif 10 <= loc <= 18: #mid
        if period == "AUTON":
            return 4
        elif period == "TELEOP":
            return 3
        else:
            return "invalid period type"
    elif 19 <= loc <= 27: #low
        if period == "AUTON":
            return 3
        elif period == "TELEOP":
            return 2
        else:
            return "invalid period type"
    else:
        return 0

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
    #vis.to_csv("visualization of: " + team+ "matchNum: "+ match +".csv")
    return vis


def auto_counter(team, matchNum): #grabs auton count from the list
    auto_count = int(MatchSpecAny("auto count", team, matchNum)[0])
    return (auto_count)

def auton_points(team, matchNum):
    #get necessary lists
    overallLoc = list(map(int, sortedArray(team, matchNum))) #locations as int list
    #print(overallLoc)
    overallShot = sortedShot(team, matchNum) #shots as char list
    #print(overallShot)

    #grab count values
    auto_count = auto_counter(team, matchNum) #shots attempted in auto

    #find auton points
    auton_points = 0;
    for i in range(auto_count):
        shot_type = overallShot[i] #miss or not
        shot_loc = overallLoc[i] #location
        if shot_type != 'm':
            auton_points += height_to_point(shot_loc, "AUTON") #convert the location to point value

    return auton_points

#tele points

def tele_counter(team, matchNum): #pieces attempted in tele
    total_count = len(list(map(int, sortedArray(team, matchNum))))
    auto_count = auto_counter(team, matchNum)
    tele_count = total_count - auto_count
    return tele_count

#print(tele_counter('1323', 1))
def tele_points(team, matchNum):
    overallLoc = list(map(int, sortedArray(team, matchNum))) #locations as int list
    #print(overallLoc)
    overallShot = sortedShot(team, matchNum) #shots as char list
    #print(overallShot)

    #grab count values
    auto_count = auto_counter(team, matchNum)
    tele_count = tele_counter(team, matchNum)

    #find tele points
    tele_points = 0;
    for i in range(tele_count):
        shot_type = overallShot[auto_count+i] #miss or not
        shot_loc = overallLoc[auto_count+i] #location
        #print(shot_type, shot_loc, end = " ")
        if shot_type != 'm':
            #print(shot_loc)
            #print(height_to_point(shot_loc, "TELEOP"))
            tele_points += height_to_point(int(shot_loc), "TELEOP") #convert the location to point value

    return tele_points

def all_points(team, matchNum):
    auto = auton_points(team, matchNum)
    tele = tele_points(team, matchNum)
    total = auto + tele
    lst = [auto, tele, total]

    return lst

def scoredList(team, matchNum): #locations teams scored in during a match
    overallLoc = list(map(int, sortedArray(team, matchNum))) #locations as int list
    #print(overallLoc)
    overallShot = sortedShot(team, matchNum) #shots as char list
    #print(overallShot)

    made_lst = []
    for i in range(len(overallShot)):
        if overallShot[i] != "m":
            made_lst.append(overallLoc[i])

    made_lst.sort()
    return made_lst #list of made locations

#print(scoredList('1072', 0))

#counts number of links scored
def linkCounter(team, matchNum):
    links = 0
    made_loc = scoredList(team, matchNum)
    #made_loc = [10, 11, 12, 13, 14, 15, 18, 19, 23, 24, 25]

    topRow = []
    midRow = []
    lowRow = []

    for loc in made_loc:
        if loc <= 9:
            topRow.append(loc)
        if (loc > 9) & (loc<=18) :
            midRow.append(loc)
        if (loc < 30) & (loc>18):
            lowRow.append(loc)

    total_pos = [lowRow, midRow, topRow]
    print(total_pos)

    total_flags = [] #flags; if 0, then not visited before; if 1, then visited; visited cannot form link
    for row_pos in total_pos:
        if len(row_pos) >= 3:
            flagged_lst = [0 for i in range(len(row_pos))] #list of flag values of equal size to pieces scored
            #print(flagged_lst)

            for i in range(len(row_pos)-2): #length of the row-2, look forwards max of two slots
                if flagged_lst[i] != 1: #if unvisited
                    if row_pos[i+1] - row_pos[i] == 1 and row_pos[i+2] - row_pos[i+1] == 1: #if i, i+1, and i+2 consecutive
                        links +=1 #works; so count+=1
                        flagged_lst[i] = 1 #current can't be used in other link
                        flagged_lst[i+1] = 1 #next one can't be used in other link
                        flagged_lst[i+2] = 1 #second next one can't be reused
            total_flags.append(flagged_lst)
    #print(total_flags)
    return(links)

def accuracy(team):
    team_match_count = (len(specifAny("match", team)))
    #print(team_match_count)
    data_lst = []
    avg = 0
    for i in range(team_match_count):
        scored = len(scoredList(team, i))
        #print(scored)
        missed = len(locationsOfMissed(team, i))
        total = len(list(map(int, sortedArray(team, i))))
        #print(total)
        if total != 0:
            data_lst.append(scored/total)
        else:
            data_lst.append(0)

        if len(data_lst) > 0:
            avg = sum(data_lst)/len(data_lst)

    return avg

#generates the game piece types for each match
def comments_total(team):
    spec = specificTeam(team)
    x = pd.DataFrame(columns = ['comments'])
    count = 0
    for r in spec['comments']:
        x.loc[count] = r
        count+=1
    return x



def comments_match(team, matchNum):

    x = comments_total(team)['comments']
    arr = x[matchNum]
    arr = data_format(arr)
    #arr = "

    return arr


#Sorting methods
def sortOverallScoreUp():
     return team_stats.sort_values('overall score', ascending = False)

def sortMethod(rowName, asc):
    return team_stats.sort_values(rowName, ascending = asc)



def graphing():
    dataS = shotSummary(args["t1"])
    match = dataS['Match'] #x var
    cone = dataS['Cones'] #y1
    cube = dataS['Cubes'] #y2
    missed = dataS['Missed'] #y3
    total = dataS['Total Shots'] #y4

    fig = go.Figure()

    fig.add_trace(go.Scatter( #line for cones # across match

        x=match,
        y=cone,
        name="cone"       # this sets its legend entry
    ))


    fig.add_trace(go.Scatter( #line for cubes # across match
        x=match,
        y=cube,
        name="cube"
    ))

    fig.add_trace(go.Scatter( #line for missed # across match
        x=match,
        y=missed,
        name="missed"
    ))

    fig.add_trace(go.Scatter( #line for total # across match
        x=match,
        y=total,
        name="total"
    ))

    fig.update_layout( #graph titles
        title="Scoring Over Time",
        xaxis_title="Match",
        yaxis_title="Num",
        legend_title="Type"
        #font=dict(family="Courier New, monospace",size=18,color="RebeccaPurple")
    )

    fig.show()
    #plotly.offline.plot(fig, filename='graphing.html')


def averageTeam(team, name):
    spec = specificTeam(team)
    print(spec['end climb'])
    total = 0
    count = 0
    for i in spec[name]:
        total += i
        count +=1
    if count == 0:
        return total
    return round(total/count, 2)



#start = time.time()



def total_avg(team): #average elements for each team
    match_count = len(shotSummary(team))
    print('match count:', match_count)
    #print(match_count)


    spec = specificTeam(team)
    spec['end climb']


    avg_lst = []

    auto_sum = 0
    tele_sum = 0
    total_sum = 0
    scored_sum = 0
    drive = 0
    defense = 0
    climb = 0
    uptime = 0
    speed = 0

    #acc = 0
    for i in range(match_count): #generate average point values
        all_scored = all_points(team, i)
        auto_sum += all_scored[0]
        tele_sum += all_scored[1]
        total_sum += all_scored[2]
        scored_sum += len(scoredList(team, i))

        drive += list(spec['drive skill'])[i]
        defense += list(spec['defense skill'])[i]
        climb += list(spec['end climb'])[i]
        uptime += 153-list(spec['break time'])[i]
        speed += list(spec['speed'])[i]


    acc = accuracy(team)



    #compile into big whole list of averages
    pts_lst = [round(auto_sum/match_count, 2), round(tele_sum/match_count, 2), round(total_sum/match_count, 2), round(scored_sum/match_count, 2), round(drive/match_count, 2), round(defense/match_count, 2), round(climb/match_count, 2), round(uptime/match_count, 2), round(speed/match_count, 2), round(acc, 3)]
    return pts_lst
    #auto, tele, total, scored, drive, def, climb, uptime, speed, acc

#print(total_avg('254'))
#end = time.time()
#print(end - start)


# In[42]:


#IMPORTANT; NEED A TEST TEAM TO WORK ASDFJSAJS
#test_team = '1072'
#categories = len(total_avg(test_team))
categories = 10


# ### ONLY RUN BALLS ONCE PLS IT TAKES 40 SEC

# In[43]:



#import time

#start = time.time()

total_team_stats = []
#df = pd.DataFrame(data, index = ["day1", "day2", "day3"])
UQteams = uniqueTeams()

#BALLS: Basic Analysis of Linearlized List Statistics
def BALLS():
    #print(len(UQteams))

    #WONT ALWAYS BE 10, TRYING TO COMPENSATE FOR CODE RUNNING TIME
    team_stats = [0 for i in range(categories)]


    for team in UQteams:
        team_data = total_avg(team)
        total_team_stats.append(team_data)
        team_stats = [sum(i) for i in zip(team_data, team_stats)] #sum of all the lists


    #print(team_stats)
    avg_stats = [round(i/len(UQteams), 3) for i in team_stats] #auto, tele, total, scored, drive, def, climb, uptime, speed, acc
    return avg_stats

#REALLY IMPORTANT, ITS THE AVG VALUES FOR ALL TEAMS


#end = time.time()
#print(end - start)


# In[44]:


#dataframe of all stats of each individual team
df_team_stats = pd.DataFrame(total_team_stats, index = UQteams, columns = ["auto", "tele", "total", "scored", "drive", "def", "climb", "uptime", "speed", "acc"])


# In[45]:


# ### GRAPHICS START HERE

# In[85]:


#POOP: players of our pack
def radarChartPOOP(team, team2, team3):
    categories = ["auto", "tele", "total", "scored", "drive", "def", "climb", "uptime", "speed", "acc"]

    team = int(team)
    team2 = int(team2)
    team3 = int(team3)
    #spread for teams
    team_spread = df_team_spread.loc[team]
    team_spread2 = df_team_spread.loc[team2]
    team_spread3 = df_team_spread.loc[team3]

    #graph for 3 teams + avg lst
    s_team = [team_spread[0], team_spread[1], team_spread[2], team_spread[3], team_spread[4], team_spread[5], team_spread[6], team_spread[7], team_spread[8], team_spread[9]]
    s_team2 = [team_spread2[0], team_spread2[1], team_spread2[2], team_spread2[3], team_spread2[4], team_spread2[5], team_spread2[6], team_spread2[7], team_spread2[8], team_spread2[9]]
    s_team3 = [team_spread3[0], team_spread3[1], team_spread3[2], team_spread3[3], team_spread3[4], team_spread3[5], team_spread3[6], team_spread3[7], team_spread3[8], team_spread3[9]]
    avgerage_spread = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    #display average values
    df_avg_spread = pd.DataFrame([avg_lst], columns = ["auto", "tele", "total", "scored", "drive", "def", "climb", "break", "speed", "acc"])
    df_avg_spread.index.name='Average'

    #radar chart
    fig = go.Figure()

    fig.add_trace(go.Scatterpolar(
          r=s_team,
          theta=categories,
          fill='toself',
          name=team
    ))

    fig.add_trace(go.Scatterpolar(
          r=s_team2,
          theta=categories,
          fill='toself',
          name=team2
    ))

    fig.add_trace(go.Scatterpolar(
          r=s_team3,
          theta=categories,
          fill='toself',
          name=team3
    ))

    fig.add_trace(go.Scatterpolar(
          r=avgerage_spread,
          theta=categories,
          fill='toself',
          name="average"
    ))


    '''fig.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 5])),showlegend=False)'''
    fig.update_layout(
        title_font_family="Sitka",
        title_font_color="green",
        title = "Stat Spread",
        width = 600,
        height = 600)


    #fig.show()
    plotly.offline.plot(fig, filename=str(team)+"_"+str(team2)+"_"+str(team3)+'_POOPchart.html')



# ### radarChartPOOP("4400", "1072", "1323")

#

# In[86]:


#radarChartPOOP("2637", "751", "5458")
#radarChartPOOP("1280", "1072", "3598")


# In[87]:



#PISS: player idenitification stat spread
def radarChartPISS(team, team2, team3):
    categories = ['auto points', 'teleop points', 'total points']

    team = int(team)
    team2 = int(team2)
    team3 = int(team3)

    points1 = total_avg(team)
    points2 = total_avg(team2)
    points3 = total_avg(team3)

    s_team = [points1[0], points1[1], points1[2]]
    s_team2 = [points2[0], points2[1], points2[2]]
    s_team3 = [points3[0], points3[1], points3[2]]



    fig = go.Figure()

    fig.add_trace(go.Scatterpolar(
          r=s_team,
          theta=categories,
          fill='toself',
          name=team
    ))

    fig.add_trace(go.Scatterpolar(
          r=s_team2,
          theta=categories,
          fill='toself',
          name=team2
    ))

    fig.add_trace(go.Scatterpolar(
          r=s_team3,
          theta=categories,
          fill='toself',
          name=team3
    ))


    '''fig.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 5])),showlegend=False)'''
    fig.update_layout(
        title_font_family="Sitka",
        title_font_color="green",
        title = "Point Spread",
        width = 600,
        height = 600)


    #fig.show()
    plotly.offline.plot(fig, filename=str(team)+"_"+str(team2)+"_"+str(team3)+'_PISSchart.html')



#radarChartPISS("254", "1678", "1072")
#end = time.time()
#print(end - start)

if str(args["type"]) == '0':
    avg_lst = BALLS()
    total_team_spread = []
    #spread for all teams compared to average
    def amogus():
        #print(df_team_stats.loc['1072'][0])

        for team in UQteams:
            team_stats = df_team_stats.loc[team] #stats for that team
            team_spread = [team_stats[i]/avg_lst[i] for i in range(categories)] #team stats/avg stats
            total_team_spread.append(team_spread) #add that to a big list
    amogus()
    #print(total_team_spread)
    df_team_spread = pd.DataFrame(total_team_spread, index = UQteams, columns = ["auto", "tele", "total", "scored", "drive", "def", "climb", "uptime", "speed", "acc"])
    radarChartPOOP(args["t1"], args["t2"], args["t3"])
elif str(args["type"]) == '1':
    radarChartPISS(args["t1"], args["t2"], args["t3"])
else:
    raise Exception("Command line arg 'type' was not passed correctly")
