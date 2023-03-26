# --event --baseFilePath --b1 --b2 --b3 --r1 --r2 --r3
import numpy as np
from collections import OrderedDict
import requests as rq
from alive_progress import alive_bar
import json
import os
import math
import sys

rawArgs = sys.argv[1:]
args = {}
for i in range(len(rawArgs)):
	if rawArgs[i] == "--event" and "event" not in args:
		args["event"] = rawArgs[i + 1]
		i += 1
	elif rawArgs[i] == "--baseFilePath" and "baseFilePath" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--b1" and "b1" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--b2" and "b2" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--b3" and "b3" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--r1" and "r1" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--r2" and "r2" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1
    elif rawArgs[i] == "--r3" and "r3" not in args:
		args["baseFilePath"] = rawArgs[i + 1]
		i += 1

eventKeys = [args["event"]]
base = args["baseFilePath"]
parsed_data = OrderedDict()

def avg(data):
    data = np.array([data])
    return np.mean(data)

def std(data):
    data = np.array([data])
    return np.std(data)

def max(data):
    data = np.array([data])
    return np.max(data)

def min(data):
    data = np.array([data])
    return np.min(data)

def copy(li1):
    li_copy = []
    li_copy.extend(li1)
    return li_copy

#To implement further caching later:
#path = base + event + "-calculated_data.json"
#if os.path.exists(path):
#    with open(base + event + "-calculated_data.json", "r") as file:
#        parsed_data = json.JSONDecoder(object_pairs_hook=OrderedDict).decode(json.load(file))
#else:

for event in eventKeys:
	try:
		path = base + event + "-tba.json"
		if os.path.exists(path):
			with open(base + event + "-tba.json", "r") as file:
				data = json.load(file)
		else:
			raise Exception("Could not find TBA file")

		team_data = OrderedDict()
		matches_data = OrderedDict()
		count_mat = 0
		for x in (data):
			if x["comp_level"] != "qm":
				matches_data[count_mat] = {
					"level": x["comp_level"],
					"num": x["match_number"],
					"b1": x["alliances"]["blue"]["team_keys"][0][3:],
					"b2": x["alliances"]["blue"]["team_keys"][1][3:],
					"b3": x["alliances"]["blue"]["team_keys"][2][3:],
					"r1": x["alliances"]["red"]["team_keys"][0][3:],
					"r2": x["alliances"]["red"]["team_keys"][1][3:],
					"r3": x["alliances"]["red"]["team_keys"][2][3:],
					"b-score": x["alliances"]["blue"]["score"],
					"r-score": x["alliances"]["red"]["score"]
				}
			count_mat += 1
			if x["comp_level"] == "qm":
				blue_teams = x["alliances"]["blue"]["team_keys"]
				red_teams = x["alliances"]["red"]["team_keys"]

				blue_score = x["alliances"]["blue"]["score"]
				red_score = x["alliances"]["red"]["score"]

				delta_b  = blue_score - red_score
				delta_r = red_score - blue_score

				try:
					blue_auto = x["score_breakdown"]["blue"]["autoPoints"]
					red_auto = x["score_breakdown"]["red"]["autoPoints"]
				except:
					blue_auto = 0
					red_auto = 0

				try:
					blue_auto_gpc = x["score_breakdown"]["blue"]["autoGamePieceCount"]
					red_auto_gpc = x["score_breakdown"]["red"]["autoGamePieceCount"]
				except:
					blue_auto_gpc = 0
					red_auto_gpc = 0

				try:
					blue_auto_gpp = x["score_breakdown"]["blue"]["autoGamePiecePoints"]
					red_auto_gpp = x["score_breakdown"]["red"]["autoGamePiecePoints"]
				except:
					blue_auto_gpp = 0
					red_auto_gpp = 0

				try:
					blue_tele_gpc = x["score_breakdown"]["blue"]["teleopGamePieceCount"]
					red_tele_gpc = x["score_breakdown"]["red"]["teleopGamePieceCount"]
				except:
					blue_tele_gpc = 0
					red_tele_gpc = 0

				try:
					blue_tele_gpp = x["score_breakdown"]["blue"]["teleopGamePiecePoints"]
					red_tele_gpp = x["score_breakdown"]["red"]["teleopGamePiecePoints"]
				except:
					blue_tele_gpp = 0
					red_tele_gpp = 0

				try:
					blue_charge = x["score_breakdown"]["blue"]["totalChargeStationPoints"]
					red_charge = x["score_breakdown"]["red"]["totalChargeStationPoints"]
				except:
					blue_charge = 0
					red_charge = 0

				try:
					blue_links = len(x["score_breakdown"]["blue"]["links"])
					red_links = len(x["score_breakdown"]["red"]["links"])
				except:
					blue_links = 0
					red_links = 0

				for y in blue_teams:
					match_data = OrderedDict()
					match_data["score"] = blue_score
					match_data["delta"] = delta_b
					match_data["auto"] = blue_auto
					match_data["links"] = blue_links
					match_data["auto_gpc"] = blue_auto_gpc
					match_data["auto_gpp"] = blue_auto_gpp
					match_data["tele_gpc"] = blue_tele_gpc
					match_data["tele_gpp"] = blue_tele_gpp
					match_data["charge"] = blue_charge
					try:
						count = len(team_data[y[3:]])
						team_data[y[3:]][count] = match_data
					except:
						team_data[y[3:]] = OrderedDict()
						team_data[y[3:]][0] = match_data

				for y in red_teams:
					match_data = OrderedDict()
					match_data["score"] = red_score
					match_data["delta"] = delta_r
					match_data["auto"] = red_auto
					match_data["links"] = red_links
					match_data["auto_gpc"] = red_auto_gpc
					match_data["auto_gpp"] = red_auto_gpp
					match_data["tele_gpc"] = red_tele_gpc
					match_data["tele_gpp"] = red_tele_gpp
					match_data["charge"] = red_charge
					try:
						count = len(team_data[y[3:]])
						team_data[y[3:]][count] = match_data
					except:
						team_data[y[3:]] = OrderedDict()
						team_data[y[3:]][0] = match_data

		for team, dict in team_data.items():

			scores = list()
			ppps = list() #ppp = points per piece
			charges = list()
			autos = list()
			deltas = list()
			links = list()

			for match in team_data[team].items():

				scores.append(match[1]["score"])

				tele_gpc = match[1]["tele_gpc"]
				auto_gpc = match[1]["auto_gpc"]
				if tele_gpc > 0:
					ppps.append(match[1]["tele_gpp"]/tele_gpc)
				if auto_gpc > 0:
					ppps.append(match[1]["auto_gpp"]/auto_gpc)

				charges.append(match[1]["charge"])

				autos.append(match[1]["auto"])

				deltas.append(match[1]["delta"])

				links.append(match[1]["links"])

			data = OrderedDict()
			data["avg-score"] = avg(scores)
			data["std-score"] = std(scores)
			data["avg-ppp"] = avg(ppps)
			data["avg-charge"] = avg(charges)
			data["avg-auto"] = avg(autos)
			data["avg-delta"] = avg(deltas)
			data["avg-link"] = avg(links)
			data["c-score"] = (2*data["avg-score"])/(data["std-score"]) + 0.8*data["avg-delta"]
			if np.isnan(data["c-score"]):
				raise ValueError("Tried to calculate score, got NaN!")
			parsed_data[team] = data

		sorted_dict = OrderedDict(sorted(parsed_data.items(), key=lambda x: x[1]["c-score"]))
		public_dict = OrderedDict()

		for team, dict in sorted_dict.items():
			public_dict[team] = {"off-score": dict["c-score"], "def-score": dict["avg-delta"]}

	except Exception as e:
		print(e)

def predict(b1, b2, b3, r1, r2, r3):
    b1 = str(b1)
    b2 = str(b2)
    b3 = str(b3)
    r1 = str(r1)
    r2 = str(r2)
    r3 = str(r3)

    bms = max([parsed_data[b1]['avg-score'] + parsed_data[b2]['avg-score'] + parsed_data[b3]['avg-score']])
    rms = max([parsed_data[r1]['avg-score'] + parsed_data[r2]['avg-score'] + parsed_data[r3]['avg-score']])

    bmd = max([parsed_data[b1]['avg-delta'] + parsed_data[b2]['avg-delta'] + parsed_data[b3]['avg-delta']])
    rmd = max([parsed_data[r1]['avg-delta'] + parsed_data[r2]['avg-delta'] + parsed_data[r3]['avg-delta']])

    bmstd = min([parsed_data[b1]['std-score'] + parsed_data[b2]['std-score'] + parsed_data[b3]['std-score']])
    rmstd = min([parsed_data[r1]['std-score'] + parsed_data[r2]['std-score'] + parsed_data[r3]['std-score']])

    bml = max([parsed_data[b1]['avg-link'] + parsed_data[b2]['avg-link'] + parsed_data[b3]['avg-link']])
    rml = max([parsed_data[r1]['avg-link'] + parsed_data[r2]['avg-link'] + parsed_data[r3]['avg-link']])

    bmr = max([parsed_data[b1]['avg-ppp'] + parsed_data[b2]['avg-ppp'] + parsed_data[b3]['avg-ppp']])
    rmr = max([parsed_data[r1]['avg-ppp'] + parsed_data[r2]['avg-ppp'] + parsed_data[r3]['avg-ppp']])

    bluescore = (parsed_data[b1]['c-score'] + parsed_data[b2]['c-score'] + parsed_data[b3]['c-score'])/5 + 0.5*bms + bmd + 5*bml + 5*bmr
    redscore = (parsed_data[r1]['c-score'] + parsed_data[r2]['c-score'] + parsed_data[r3]['c-score'])/5 + 0.5*rms + rmd + 5*rml + 5*rmr
    #print(bluescore, redscore)
    if bluescore > redscore:
        return {'color-of-winner':'blue', 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}
    else:
        return {'color-of-winner':'red', 'blue-percent':bluescore/(bluescore + redscore), 'red-percent':redscore/(bluescore + redscore)}

results = predict(args["b1"], args["b2"], args["b3"], args["r1"], args["r2"], args["r3"])

with open(base + event + "-" + args["b1"] + "-" + args["b2"] + "-" + args["b3"] + "-" + args["r1"] + "-" + args["r2"] + "-" + args["r3"] + "-prediction.json", "w") as f:
    json.dump(results, f)
