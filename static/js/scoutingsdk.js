const ScoutingAppSDK = function (element, config) {
    let _this = this;
    config = fixConfig(config);

    element.innerHTML = ``;

    const importantQuotes = [
        "What is Red? How can you prove the Red you see is the Red others see? Its just labels",
        "The Brain to notes synapse is much faster than limited app tracking.",
        "Try doing that sheet over and over , not faster than paper, pen highlighters",
        "Whatever… not trying to counter that as its non- stuff",
        "The app is now on the back burner until they go though this entire season using our existing paper/excel /highlighter method.",
        "Do you watch sports by reviewing stats? That is Fantasy football…fantasy.",
        "Digital is 0 and 1, analog is infinite. Not that hard to understand…apps ARE digital. Human Brains are ANALOG",
        "Most of the “app stuff” is driven by smartphones and an electronic generation",
        "Look at Vegas , Vegas still wins despite card counters. Teams win for reasons other than fantastic scouting.",
        "Most tracking systems are digital, we choose analog…so do Musicians both are valid",
        "As for “scouting” :not found at all in last years Game and Season Manual",
        "60-100 teams to track…not that hard some are good some are not.",
        "I base most of our scouting off horse racing. Seems to work well.",
        "Seems like scouting award is fluff. Same for strategy. Cream rises to the top",
        "If students cant track 30-50 items without AI “help” there's a problem Houston. ",
        "weak waffle language",
        "One of the biggest issues with Apps…they are limited by design , the human brain is not limited by constraints.",
        "QR codes have been around for years not really that innovative in fact originally used in car manufacturing and everyone has seen them",
        "I know personally how hard it is for a team to win a Blue Banner",
        "There is not a single student that I have come across that sees the game like I do.",
        "These notes need to be passionate and not just entries, written by someone who gets the goals of scouting.",
        "Did Apollo use computers primarily? How about Jet travel? Or even discovering other continents ?",
        "Better than “fancy app” they worked so hard on you can place that in Chairmans or something"
    ];

    const quotes = [
        "Qualitative scouting is a completely valid way to track teams. The sample size is well within the scout teams ability to rank teams and find ways to use partners and defeat opponents.",
        "Like any sport, you waste their time and frustrate them into fouls , while ahead then if they break you and go back to scoring 1 for 1 … you win. ",
        "― Sun Tzu, The Art of War",
        "Confirmation bias , the tendency to process information by looking for, or interpreting, information that is consistent with one's existing beliefs.",
        "Scouting is about overall performance, are they a good partner ? If foe how to defeat?",
        "A “scouting form” is actually a terrible idea.",
        "We do 100% Qualitative scouting (Excel scheds, paper, pen, highlighter and shorthand notes)",
        "Correct name , never not correct",
        "the whole thinking was app or bust . Until we spoke.",
        "Yes leaving that debate to rest. I like Citrus Dad and respect his views, I have my own.",
        "Know your own limitations and find solutions. Its simple. Observe. There is not an app for that IMO as an app has you looking down.",
        "Blue alliance has plenty of data from FMS…watching closely tells you who is good. Pen , highlighter excel with watch lists.",
        "Teams will lie, best to use you own eyes and only track what you need to form an event winning alliance",
        "If the team makes eliminations/worlds before , they are very likely to win in the future. If they never make eliminations, then they are unlikely to do so in the future.",
        "So everyone is a winner won? First robotics competition",
        "I am not going to continue to express my opinions or scouting practices in this thread as they find it “off topic” as it wasn't deemed “useful for future readers” hence the OP requested “clean up”.",
        'And attacked by @ Stryker (with 18 loves) "individual being notorious for sharing eccentric opinions without appropriate defenses for them."',
        "Bye this thread enjoy your own opinions then, have at it",
        "I'll take a brain over and app…especially in a limited field size and low sample size",
        "I don't think this is at all different than sports or horse racing, same principles apply",
        "What does that mean exactly, does a number tell you “pick me”? There are many ways to do scouting, that's for certain",
        "We track all sorts of weird stuff that changes year to year. Stuff we believe in.",
        "Scouts are experienced talent evaluators who travel extensively for the purposes of watching athletes play their chosen sports and determining whether their set of skills and talents represent what is needed by the scout's organization.",
        "In the end if you do scouting well , you know your team well. Then its a matter of building the strongest alliance to have a good chance against all comers",
        "Not true if you LEAVE… seriously stop trying to win this argument",
        "Have you ever gone to a horse race with a new person that picks winners by “Cutesy Name”? It happens they pick a cute name and they win",
        "I suspect most wins at regional and championship are simple pair ups…not driven by any scouting app.",
        "Observation and notes can trump fancy new “just in” technology rich scouting app",
        "Amazing the worlds best inventions were accomplished without a single computer.",
        "Not that hard to “track” 30-50 teams in most competitions.",
        "Note 3: Not following the crowd, can be beneficial (see 2009 financial “crisis”)",
        "This scouting award will certainly be dominated by a subset of more boisterous teams",
        "Back to Horseracing, if it was easy to pick a winner don't you think with all the money involved , someone would create a program to pick a winner every time? Hasn't happened.",
        "Sure 1678 has a great record and would not have been “as great” without scouting doing its job.",
        "No amount of notes will convey what a simple conversation can convey as humans take visual cues from each other.",
        "Scouting involves luck. look at handicappers or stock brokers… its all luck finding the trend at the right time. There is no magic sauce. ",
        "Golden Worm Blasters",
        "I decided to comment based on my experience with students. No harm no foul. Sorry if a resolution was reached 3 mo ago",
        "What scouting brings is Intelligence… this bodes well in team interactions and gives you the intelligence high ground in competition or picking.",
        "The class handicapper judges the merits of a horse not by the time of his recent races, but by the type of company in which he has been competing",
        "Dealing with say 50 teams and say 10 matches to rely on data pointing the way is problematic",
        "I still dismiss your quaint notion Blue Banners don't matter!",
        "I will refine, ask away its about assembling the best pick list, right? I have much to offer there.",
        "The single most important stat in horse racing is “class” don't under estimate that quality. I've learned from experience there.",
        "Don't use apps",
        "Look at music…CD/streaming are cheap and acceptabe, yet LP albums are purer.",
        "We have [a blue banner]…strive for more every season. Not for everyone and thats fine",
        "NOT season",
        "This thread is a no win scenario and should end for the good of the game. Mods shut it down.",
        "I me thinks get a lot of silent likes and that is a-ok there are still critical thinkers here.",
        "winner winner chicken dinner",
        "Scouting apps are good programming exercise, usefulness not determined. It’s like weigh watching apps, stock apps, horoscope apps. It makes you feels good and it’s fun to program",
        "Tracking the right stuff in a game is important, does the scouting app do that? Do you trust the data? What insights are gained?",
        "Always open your mind to what is possible.",
        "But does an App track tendency? Does an App track where a robot likes to play? Does an app guarantee good data or bored scouts? Great drivers, Repair tendencies?",
        "Its not about data , its the right data",
        "Human processing blows away a computer except in certain tasks",
        "Pen + Paper + Highlighter + Excel, much more configurable. It always perplexes me why tracikng 40-60 robots requires an app? Except to give programmers something to do?"
    ];

    const MAX_QR_LENGTH = 128;

    function checkNull(object1, object2) {
        return object1 !== null && object1 !== undefined ? object1 : object2;
    }

    _this.escape = (string) => {
        const escapedChars = [
            { character: "&", replacement: "&amp;" },
            { character: "<", replacement: "&lt;" },
            { character: ">", replacement: "&gt;" },
            { character: '"', replacement: "&quot;" },
            { character: "'", replacement: "&#39;" }
        ];
        if (string === null || typeof string !== "string") {
            return string;
        }
        let result = string;
        for (let i = 0; i < escapedChars.length; i++) {
            result = result.replace(
                new RegExp(escapedChars[i].character, "g"),
                escapedChars[i].replacement
            );
        }
        return result;
    };

    _this.normalize = (string) => {
        const validChars = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ".",
            "!",
            "?",
            "(",
            ")"
        ];
        let normalized = [];
        for (let i = 0; i < string.length; i++) {
            if (validChars.includes(string[i].toLowerCase())) {
                normalized.push(string[i]);
            } else {
                normalized.push(" ");
            }
        }
        return normalized.join("");
    };

    _this.formatData = (eventCode, matchNumber, teamNumber, data) => {
        data = { ...data };
        data.data = { ...data.data };
        data.abilities = { ...data.abilities };
        data.counters = { ...data.counters };
        data.timers = { ...data.timers };
        data.ratings = { ...data.ratings };
        let formatted = {
            data: [],
            abilities: [],
            counters: [],
            timers: [],
            ratings: [],
            comments: data.data.comments || "",
            timestamp: new Date().getTime()
        };
        if (data.data.comments != null) {
            delete data.data.comments;
        }
        let dataKeys = Object.keys(data.data);
        let abilityKeys = Object.keys(data.abilities);
        let counterKeys = Object.keys(data.counters);
        let timerKeys = Object.keys(data.timers);
        let ratingKeys = Object.keys(data.ratings);
        for (let i = 0; i < dataKeys.length; i++) {
            formatted.data[i] = {
                category: dataKeys[i],
                data: data.data[dataKeys[i]]
            };
        }
        for (let i = 0; i < abilityKeys.length; i++) {
            formatted.abilities[i] = {
                category: abilityKeys[i],
                ability: data.abilities[abilityKeys[i]]
            };
        }
        for (let i = 0; i < counterKeys.length; i++) {
            formatted.counters[i] = {
                category: counterKeys[i],
                counter: data.counters[counterKeys[i]]
            };
        }
        for (let i = 0; i < timerKeys.length; i++) {
            formatted.timers[i] = {
                category: timerKeys[i],
                timer: data.timers[timerKeys[i]]
            };
        }
        for (let i = 0; i < ratingKeys.length; i++) {
            formatted.ratings[i] = {
                category: ratingKeys[i],
                rating: data.ratings[ratingKeys[i]]
            };
        }
        console.log(formatted);
        return formatted;
    };

    _this.stringifyFormatted = (
        eventCode,
        matchNumber,
        teamNumber,
        color,
        formatted
    ) => {
        let stringified = JSON.stringify([
            config.account.team,
            formatted.username || config.account.username,
            eventCode,
            matchNumber,
            teamNumber,
            color,
            formatted.data.map((dataObj) => [
                "category",
                dataObj.category,
                "data",
                dataObj.data
            ]),
            formatted.abilities.map((abilityObj) => [
                "category",
                abilityObj.category,
                "ability",
                abilityObj.ability
            ]),
            formatted.counters.map((counterObj) => [
                "category",
                counterObj.category,
                "counter",
                counterObj.counter
            ]),
            formatted.timers.map((timerObj) => [
                "category",
                timerObj.category,
                "timer",
                timerObj.timer
            ]),
            formatted.ratings.map((ratingObj) => [
                "category",
                ratingObj.category,
                "rating",
                ratingObj.rating
            ]),
            formatted.comments
        ]);
        return stringified;
    };

    _this.updateIncentives = (incentives) => {
        function periodic(func, times, ms, timesDropoff = -1) {
            if (timesDropoff == -1) {
                timesDropoff = times;
            }
            if (times > 0) {
                func();
                setTimeout(() => {
                    periodic(func, times - 1, ms, timesDropoff - 0.995);
                }, Math.ceil(ms / timesDropoff));
            }
        }
        let nutsElement = document.querySelector(
            ".header-incentives .nuts > p"
        );
        let boltsElement = document.querySelector(
            ".header-incentives .bolts > p"
        );
        let levelsElement = document.querySelector(".header-incentives .xp p");
        let progressElement = document.querySelector(
            ".header-incentives .xp .xp-filled"
        );
        let differenceNuts =
            incentives.totals.nuts - parseInt(nutsElement.innerHTML);
        let differenceBolts =
            incentives.totals.bolts - parseInt(boltsElement.innerHTML);
        let differenceLevels =
            incentives.totals.level - parseInt(levelsElement.innerHTML);
        let differenceProgress =
            100 * differenceLevels +
            (incentives.totals.progress * 100 -
                parseInt(progressElement.style.width.replace("%", "")));
        periodic(
            () => {
                nutsElement.innerHTML =
                    parseInt(nutsElement.innerHTML) +
                    Math.abs(differenceNuts) / differenceNuts;
            },
            Math.abs(differenceNuts),
            500
        );
        periodic(
            () => {
                boltsElement.innerHTML =
                    parseInt(boltsElement.innerHTML) +
                    Math.abs(differenceBolts) / differenceBolts;
            },
            Math.abs(differenceBolts),
            500
        );
        if (differenceProgress > 0) {
            periodic(
                () => {
                    progressElement.style.width = `${
                        parseInt(progressElement.style.width.replace("%", "")) +
                        1
                    }%`;
                    if (
                        parseInt(
                            progressElement.style.width.replace("%", "")
                        ) >= 100
                    ) {
                        progressElement.style.width = "0%";
                        levelsElement.innerHTML =
                            parseInt(levelsElement.innerHTML) + 1;
                    }
                },
                differenceProgress,
                500
            );
        }
    };

    let timers = {};
    window.t = timers;
    let checkboxes = {};
    window.c = checkboxes;

    let data = {
        data: {},
        abilities: {},
        counters: {},
        timers: {},
        ratings: {}
    };

    _this.revealTimers = () => {
        console.log(timers);
    };

    _this.revealCheckboxes = () => {
        console.log(checkboxes);
    };

    _this.showHomePage = (
        _eventCode = "",
        _matchNumber = "",
        _teamNumber = ""
    ) => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            data = {
                data: {},
                abilities: {},
                counters: {},
                timers: {},
                ratings: {}
            };
            timers = {};
            checkboxes = {};
            if (
                _eventCode != "" &&
                _this.getEventCode() != null &&
                _this.getEventCode() != ""
            ) {
                _this.setEventCode(_eventCode);
            }
            let latestMatch = "";
            if (config.latest.autofill) {
                let latestMatchData = await _this.getLatestMatch(
                    _this.getEventCode()
                );
                if (latestMatchData.success) {
                    latestMatch = latestMatchData.body.latest + 1;
                }
            }
            let year =
                config.year || new Date().toLocaleDateString().split("/")[2];
            let events = await _this.getEvents(year);
            element.innerHTML = `
                <div class="home-window">
                    <div class="title-block">
                        <h1>Begin scouting</h1>
                    </div>
                    <div class="group">
                        <input class="match-number" id="match-number" autocomplete="off" name="Match" type="number" min="0" required="required" value="${_this.escape(
                            _matchNumber || latestMatch
                        )}"/></span><span class="bar"></span>
                        <label for="match-number">Match Number</label>
                    </div>
                    <select class="event-code">
                        <option value=""${
                            (_eventCode || _this.getEventCode()) == null ||
                            (_eventCode || _this.getEventCode()) == ""
                                ? " selected"
                                : ""
                        }>Select an event...</option>
                        ${events.map(
                            (event) =>
                                `<option value="${event.key}"${
                                    (_eventCode || _this.getEventCode()) ==
                                    event.key
                                        ? " selected"
                                        : ""
                                }>${event.name}</option>`
                        )}
                    </select>
                    <select class="team">
                        <option value="">Select a team...</option>
                    </select>
                    <p class="red warning"></p>
                    <button class="start">Start</button>
                    <p class="boltman-quote">${_this.escape(
                        _this.getQuote()
                    )}</p>
                    <p class="footer-text">Made with &lt; &gt; by <a href="https://robotics.harker.org/" target="_blank">Harker Robotics</a></p>
                </div>
            `;

            let eventCode = element.querySelector(
                ".home-window > select.event-code"
            ).value;
            if (eventCode != null && eventCode != "") {
                _this.setMatches(eventCode);
            }

            element.querySelector(".home-window > button.start").onclick =
                async () => {
                    let eventCode = element.querySelector(
                        ".home-window > select.event-code"
                    ).value;
                    let matchNumber = parseInt(
                        element.querySelector(".home-window input.match-number")
                            .value
                    );
                    let teamNumber = element.querySelector(
                        ".home-window > select.team"
                    ).value;
                    if (
                        eventCode != null &&
                        eventCode != "" &&
                        matchNumber != null &&
                        matchNumber != "" &&
                        teamNumber != null &&
                        teamNumber != ""
                    ) {
                        await _this.showMatchPage(
                            0,
                            eventCode,
                            matchNumber,
                            teamNumber
                        );
                    }
                };
            element.querySelector(".home-window > select.event-code").onchange =
                async () => {
                    element.querySelector(".home-window > .warning").innerHTML =
                        "";
                    let eventCode = element.querySelector(
                        ".home-window > select.event-code"
                    ).value;
                    _this.setEventCode(eventCode);
                    _this.setMatches(eventCode);
                    let latestMatch = "";
                    if (config.latest.autofill) {
                        let latestMatchData = await _this.getLatestMatch(
                            _this.getEventCode()
                        );
                        if (latestMatchData.success) {
                            latestMatch = latestMatchData.body.latest + 1;
                        }
                    }
                    element.querySelector(".match-number").value = latestMatch;
                    updateTeamsList();
                };
            let updateTeamsList = async () => {
                element.querySelector(
                    ".home-window > select.team"
                ).innerHTML = `<option value="">Select a team...</option>`;
                let eventCode = element.querySelector(
                    ".home-window > select.event-code"
                ).value;
                let matchNumber = parseInt(
                    element.querySelector(".home-window  input.match-number")
                        .value
                );
                if (
                    eventCode != "" &&
                    matchNumber != "" &&
                    !isNaN(parseInt(matchNumber))
                ) {
                    let match = await _this.getMatch(eventCode, matchNumber);
                    let redTeams = match.alliances.red.team_keys;
                    let blueTeams = match.alliances.blue.team_keys;
                    let teams = `<option value="">Select a team...</option>`;
                    for (let i = 0; i < redTeams.length; i++) {
                        let teamNumber = redTeams[i].replace("frc", "");
                        teams += `
<option value="${_this.escape(teamNumber)}"${
                            teamNumber == _teamNumber ? " selected" : ""
                        }>
${_this.escape(teamNumber)} (Red ${i + 1})
</option>`;
                    }
                    for (let i = 0; i < blueTeams.length; i++) {
                        let teamNumber = blueTeams[i].replace("frc", "");
                        teams += `
<option value="${_this.escape(teamNumber)}"${
                            teamNumber == _teamNumber ? " selected" : ""
                        }>
${_this.escape(teamNumber)} (Blue ${i + 1})
</option>`;
                    }
                    element.querySelector(
                        ".home-window > select.team"
                    ).innerHTML = teams;
                    if (
                        !element
                            .querySelector(".home-window > select.event-code")
                            .value.endsWith("-prac") &&
                        ["1r", "2r", "3r", "1b", "2b", "3b"].includes(
                            element.querySelector(".home-window > select.team")
                                .value
                        )
                    ) {
                        element.querySelector(
                            ".home-window > .warning"
                        ).innerHTML =
                            "WARNING: It appears that qualification matches are not currently running for this event. If you are scouting practice matches, please use the PRACTICE MATCHES event. If qualification matches are indeed running, please connect to the internet briefly in order to download the list of teams.";
                    } else {
                        element.querySelector(
                            ".home-window > .warning"
                        ).innerHTML = "";
                    }
                }
            };
            element.querySelector(".home-window > select.team").onchange =
                function () {
                    let team = element.querySelector(
                        ".home-window > select.team"
                    ).value;
                    if (
                        ["1r", "2r", "3r", "1b", "2b", "3b"].includes(team) ||
                        element
                            .querySelector(
                                `.home-window > select.team > option[value="${team}"]`
                            )
                            .innerHTML.includes("Override")
                    ) {
                        let newTeam = prompt(
                            `Please enter a team number or leave this field blank to use ${team} as the team number`
                        );
                        newTeam = newTeam.replaceAll(" ", "").toUpperCase();
                        if (newTeam != "" && !isNaN(parseInt(newTeam))) {
                            document.querySelector(
                                `.home-window > select.team > option[value="${team}"]`
                            ).innerHTML = `${newTeam} (Override)`;
                            document.querySelector(
                                `.home-window > select.team > option[value="${team}"]`
                            ).value = newTeam;
                            team = newTeam;
                        }
                    }
                    if (
                        !element
                            .querySelector(".home-window > select.event-code")
                            .value.endsWith("-prac") &&
                        ["1r", "2r", "3r", "1b", "2b", "3b"].includes(team)
                    ) {
                        element.querySelector(
                            ".home-window > .warning"
                        ).innerHTML =
                            "WARNING: It appears that qualification matches are not currently running for this event. If you are scouting practice matches, please use the PRACTICE MATCHES event. If qualification matches are indeed running, please connect to the internet briefly in order to download the list of teams.";
                    } else {
                        element.querySelector(
                            ".home-window > .warning"
                        ).innerHTML = "";
                    }
                };
            element.querySelector(".home-window input.match-number").onblur =
                updateTeamsList;
            updateTeamsList();
            resolve();
        });
    };

    _this.showMatchPage = (index, eventCode, matchNumber, teamNumber) => {
        return new Promise(async (resolve, reject) => {
            _this.currentPage = index;
            if (index < -1) {
                _this.clearPendingFunctions();
                pendingFunctions.push(async () => {
                    await this.setMatchNav(
                        0,
                        eventCode,
                        matchNumber,
                        teamNumber
                    );
                });
                await _this.showHomePage();
            } else if (index < 0) {
                _this.clearPendingFunctions();
                pendingFunctions.push(async () => {
                    await this.setMatchNav(
                        0,
                        eventCode,
                        matchNumber,
                        teamNumber
                    );
                });
                await _this.showHomePage(eventCode, matchNumber, teamNumber);
            } else {
                pendingFunctions.push(async () => {
                    await this.setMatchNav(
                        index == 0 ? 1 : 2,
                        eventCode,
                        matchNumber,
                        teamNumber
                    );
                });
                element.innerHTML = `
					<div class="match-window">
						${await _this.compileComponent(
                            eventCode,
                            matchNumber,
                            teamNumber,
                            config.pages[index]
                        )}
					</div>
					<div class="overlay"></div>
					<div class="location-popup"></div>
				`;
                await _this.runPendingFunctions();
            }
            resolve();
        });
    };

    _this.setMatchNav = (toggle, eventCode, matchNumber, teamNumber) => {
        return new Promise(async (resolve, reject) => {
            const nav = document.querySelector("header");
            const regEls = Array.from(nav.querySelectorAll(".reg-nav"));
            const matchEls = Array.from(nav.querySelectorAll(".match-nav"));
            if (regEls) {
                let cl = toggle != 0 ? "add" : "remove";
                regEls.forEach((el) => {
                    el.classList[cl]("none");
                });
            }
            if (matchEls) {
                let cl = toggle != 0 ? "remove" : "add";
                matchEls.forEach((el) => {
                    el.classList[cl]("none");
                });
            }

            const submit = document.getElementById("submit-button");
            const back = document.getElementById("back-button");
            if (!submit || !back) {
                console.log("nav buttons not defined!");
                return;
            }

            if (toggle == 1) {
                submit.classList.remove("none");
                back.classList.add("none");
                submit.onclick = async () => {
                    await _this.showMatchPage(
                        parseInt(_this.currentPage) + 1,
                        eventCode,
                        matchNumber,
                        teamNumber
                    );
                };
                if (document.getElementById("scout-number"))
                    document.getElementById("scout-number").innerText =
                        teamNumber;
            } else if (toggle == 2) {
                submit.classList.add("none");
                back.classList.remove("none");
                back.onclick = async () => {
                    await _this.showMatchPage(
                        Math.min(parseInt(_this.currentPage) - 1, 1),
                        eventCode,
                        matchNumber,
                        teamNumber
                    );
                };
                if (document.getElementById("scout-number"))
                    document.getElementById("scout-number").innerText =
                        teamNumber;
            }

            resolve();
        });
    };

    function getQRScannerSize() {
        return Math.floor(
            Math.min(window.innerWidth - 200, window.innerHeight - 200)
        );
    }

    _this.uploadData = async (data) => {
        let formatted = _this.formatData(data.ec, data.mn, data.tn, {
            data: data.d,
            abilities: data.a,
            counters: data.c,
            timers: data.t,
            ratings: data.r
        });
        if (data.at == config.account.team) {
            formatted.username = data.au;
        } else {
            formatted.username = `team${data.at}-${data.au}`;
        }

        try {
            console.log("Preparing...");
            console.log("Uploading...");
            let upload = await (
                await fetch(
                    `/api/v1/scouting/entry/add/${encodeURIComponent(
                        data.ec
                    )}/${encodeURIComponent(data.mn)}/${encodeURIComponent(
                        data.tn
                    )}/${encodeURIComponent(data.tc)}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        body: JSON.stringify(formatted)
                    }
                )
            ).json();
            if (upload.success) {
                console.log("Verifying...");
                let stringified = _this.stringifyFormatted(
                    data.ec,
                    data.mn,
                    data.tn,
                    data.tc,
                    formatted
                );
                let hash = _this.hash(stringified);
                let verify = await (
                    await fetch(
                        `/api/v1/scouting/entry/verify/${encodeURIComponent(
                            hash
                        )}`
                    )
                ).json();
                if (verify.success && verify.body.verified) {
                    let incentives = [];
                    if (upload.body.xp - upload.body.accuracyBoosters.xp > 0) {
                        incentives.push(
                            `+${
                                upload.body.xp - upload.body.accuracyBoosters.xp
                            } XP`
                        );
                    }
                    if (
                        upload.body.nuts - upload.body.accuracyBoosters.nuts >
                        0
                    ) {
                        incentives.push(
                            `+${
                                upload.body.nuts -
                                upload.body.accuracyBoosters.nuts
                            } Nuts`
                        );
                    }
                    if (
                        upload.body.bolts - upload.body.accuracyBoosters.bolts >
                        0
                    ) {
                        incentives.push(
                            `+${
                                upload.body.bolts -
                                upload.body.accuracyBoosters.bolts
                            } Bolts`
                        );
                    }

                    let offset = 0;
                    if (incentives.length > 0) {
                        offset = 100;
                        setTimeout(() => {
                            console.log(`${incentives.join(", ")}`);
                        }, offset);
                    }

                    if (upload.body.accuracyBoosters.xp > 0) {
                        offset += 100;
                        setTimeout(() => {
                            console.log(
                                `+${upload.body.accuracyBoosters.xp} XP (Accuracy Boost)`
                            );
                        }, offset);
                    }

                    if (upload.body.accuracyBoosters.nuts > 0) {
                        offset += 100;
                        setTimeout(() => {
                            console.log(
                                `+${upload.body.accuracyBoosters.nuts} Nuts (Accuracy Boost)`
                            );
                        }, offset);
                    }

                    if (upload.body.accuracyBoosters.bolts > 0) {
                        offset += 100;
                        setTimeout(() => {
                            console.log(
                                `+${upload.body.accuracyBoosters.bolts} Bolts (Accuracy Boost)`
                            );
                        }, offset);
                    }

                    setTimeout(() => {
                        console.log("Success!");
                        _this.updateIncentives(upload.body);
                    }, offset);
                } else {
                    console.log(stringified);
                    console.log(
                        `Upload Failed!\n${
                            verify.error ||
                            "Unable to verify upload completion."
                        }`
                    );
                }
            } else {
                console.log(
                    `Upload Failed!\n${upload.error || "Unknown error."}`
                );
            }
        } catch (err) {
            console.error(err);
            console.log(`Upload Failed!\nCould not connect to the server.`);
        }
    };

    _this.showScannerPage = (view = 0) => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            element.innerHTML = `
                <div class="scanner-window">
                    <div class="scanner-view" style="display: ${
                        view == 0 ? "flex" : "none"
                    };">
                        <button class="use-text-input">Use Text Input</button>
                        <button class="switch-camera">Switch Camera</button>
                        <div class="scanned-label"><h4>QR Codes Scanned: </h4><p></p></div>
                        <div class="reader" id="reader"></div>
                        <div class="upload"></div>
                        <button style="display: none;" class="scan-again">Scan Again</button>
                    </div>
                    <div class="upload-view" style="display: ${
                        view == 1 ? "flex" : "none"
                    };">
                        <button class="use-scanner">Use Scanner</button>
                        <textarea class="upload-box"></textarea>
                        <button class="upload-data">Upload</button>
                        <div class="upload"></div>
                        <button style="display: none;" class="upload-again">Upload Again</button>
                    </div>
                </div>
            `;
            let reader = {
                stop: () => {}
            };
            if (view == 0) {
                reader = new Html5Qrcode("reader");
            }
            element.querySelector("button.scan-again").onclick = async () => {
                try {
                    await reader.stop();
                } catch (err) {}
                await _this.showScannerPage(0);
            };
            element.querySelector("button.upload-again").onclick = async () => {
                try {
                    await reader.stop();
                } catch (err) {}
                await _this.showScannerPage(1);
            };
            element.querySelector("button.use-text-input").onclick =
                async () => {
                    try {
                        await reader.stop();
                    } catch (err) {}
                    await _this.showScannerPage(1);
                };
            element.querySelector("button.use-scanner").onclick = async () => {
                try {
                    await reader.stop();
                } catch (err) {}
                await _this.showScannerPage(0);
            };
            let devices = [];
            let codes = [];
            let deviceIndex = 0;

            async function scanResult(decodedText, decodedResult) {
                try {
                    let data = JSON.parse(decodedText);
                    codes[data[0]] = data[2];
                    element.querySelector(".scanner-view p").innerHTML = `${
                        codes.filter((code) => code != null).length
                    }/${data[1]}`;
                    if (
                        codes.filter((code) => code != null).length == data[1]
                    ) {
                        console.log(codes.join(""));
                        let data = JSON.parse(codes.join(""));
                        let formatted = _this.formatData(
                            data.ec,
                            data.mn,
                            data.tn,
                            {
                                data: data.d,
                                abilities: data.a,
                                counters: data.c,
                                timers: data.t,
                                ratings: data.r
                            }
                        );
                        if (data.at == config.account.team) {
                            formatted.username = data.au;
                        } else {
                            formatted.username = `team${data.at}-${data.au}`;
                        }

                        element.querySelector(".scanner-view > p").innerHTML =
                            "&nbsp;";
                        await reader.stop();
                        element.querySelector(
                            ".scanner-view > button.switch-camera"
                        ).style.display = "none";

                        try {
                            element.querySelector(
                                ".scanner-view > .upload"
                            ).innerHTML = `<div class="status-box success" data-status="prepare">Preparing</div>`;
                            element.querySelector(
                                ".scanner-view > .upload"
                            ).innerHTML += `<div class="status-box loading" data-status="upload">Uploading</div>`;
                            let upload = await (
                                await fetch(
                                    `/api/v1/scouting/entry/add/${encodeURIComponent(
                                        data.ec
                                    )}/${encodeURIComponent(
                                        data.mn
                                    )}/${encodeURIComponent(
                                        data.tn
                                    )}/${encodeURIComponent(data.tc)}`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type":
                                                "application/json;charset=UTF-8"
                                        },
                                        body: JSON.stringify(formatted)
                                    }
                                )
                            ).json();
                            if (upload.success) {
                                const uploadBox = element.querySelector(
                                    "[data-status='upload']"
                                );
                                uploadBox.classList.remove("loading");
                                uploadBox.classList.add("success");

                                element.querySelector(
                                    ".scanner-view > .upload"
                                ).innerHTML += `<div class="status-box loading" data-status="verify">Verifying</div>`;
                                let stringified = _this.stringifyFormatted(
                                    data.ec,
                                    data.mn,
                                    data.tn,
                                    data.tc,
                                    formatted
                                );
                                let hash = _this.hash(stringified);
                                let verify = await (
                                    await fetch(
                                        `/api/v1/scouting/entry/verify/${encodeURIComponent(
                                            hash
                                        )}`
                                    )
                                ).json();
                                if (verify.success && verify.body.verified) {
                                    const verifyBox = element.querySelector(
                                        "[data-status='verify']"
                                    );
                                    verifyBox.classList.remove("loading");
                                    verifyBox.classList.add("success");
                                    let incentives = [];
                                    if (
                                        upload.body.xp -
                                            upload.body.accuracyBoosters.xp >
                                        0
                                    ) {
                                        incentives.push(
                                            `+${
                                                upload.body.xp -
                                                upload.body.accuracyBoosters.xp
                                            } XP`
                                        );
                                    }
                                    if (
                                        upload.body.nuts -
                                            upload.body.accuracyBoosters.nuts >
                                        0
                                    ) {
                                        incentives.push(
                                            `+${
                                                upload.body.nuts -
                                                upload.body.accuracyBoosters
                                                    .nuts
                                            } Nuts`
                                        );
                                    }
                                    if (
                                        upload.body.bolts -
                                            upload.body.accuracyBoosters.bolts >
                                        0
                                    ) {
                                        incentives.push(
                                            `+${
                                                upload.body.bolts -
                                                upload.body.accuracyBoosters
                                                    .bolts
                                            } Bolts`
                                        );
                                    }

                                    let offset = 0;
                                    if (incentives.length > 0) {
                                        offset = 100;
                                        setTimeout(() => {
                                            element.querySelector(
                                                ".scanner-view > .upload"
                                            ).innerHTML += `<div class="status-box success" data-status="verify">${incentives.join(
                                                ", "
                                            )}</div>`;
                                        }, offset);
                                    }

                                    if (upload.body.accuracyBoosters.xp > 0) {
                                        offset += 100;
                                        setTimeout(() => {
                                            element.querySelector(
                                                ".scanner-view > .upload"
                                            ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.xp} XP (Accuracy Boost)</div>`;
                                        }, offset);
                                    }

                                    if (upload.body.accuracyBoosters.nuts > 0) {
                                        offset += 100;
                                        setTimeout(() => {
                                            element.querySelector(
                                                ".scanner-view > .upload"
                                            ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.nuts} Nuts (Accuracy Boost)</div>`;
                                        }, offset);
                                    }

                                    if (
                                        upload.body.accuracyBoosters.bolts > 0
                                    ) {
                                        offset += 100;
                                        setTimeout(() => {
                                            element.querySelector(
                                                ".scanner-view > .upload"
                                            ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.bolts} Bolts (Accuracy Boost)</div>`;
                                        }, offset);
                                    }

                                    setTimeout(() => {
                                        element.querySelector(
                                            ".scanner-view > .upload"
                                        ).innerHTML += `<h3 class="green">Success!</h3>`;
                                        jsConfetti.addConfetti();
                                        _this.updateIncentives(upload.body);
                                    }, offset);
                                } else {
                                    console.log(stringified);
                                    const verifyBox = element.querySelector(
                                        "[data-status='verify']"
                                    );
                                    verifyBox.classList.remove("loading");
                                    verifyBox.classList.add("error");
                                    element.querySelector(
                                        ".scanner-view > .upload"
                                    ).innerHTML += `<h3 class="red">${
                                        verify.error ||
                                        "Unable to verify upload completion."
                                    }</h3>`;
                                    element.querySelector(
                                        ".scanner-view > button.scan-again"
                                    ).style.display = "block";
                                }
                            } else {
                                const uploadBox = element.querySelector(
                                    "[data-status='upload']"
                                );
                                uploadBox.classList.remove("loading");
                                uploadBox.classList.add("error");
                                element.querySelector(
                                    ".scanner-view > .upload"
                                ).innerHTML += `<h3 class="red">${
                                    upload.error || "Unknown error."
                                }</h3>`;
                                element.querySelector(
                                    ".scanner-view > button.scan-again"
                                ).style.display = "block";
                            }
                        } catch (err) {
                            console.error(err);
                            const uploadBox = element.querySelector(
                                "[data-status='upload']"
                            );
                            uploadBox.classList.remove("loading");
                            uploadBox.classList.add("error");
                            element.querySelector(
                                ".scanner-view > .upload"
                            ).innerHTML += `<h3 class="red">Could not connect to the server.</h3>`;
                            element.querySelector(
                                ".scanner-view > button.scan-again"
                            ).style.display = "block";
                        }
                    }
                } catch (err) {}
                // console.log(decodedText);
                // console.log(decodedResult);
            }

            element.querySelector("button.upload-data").onclick = async () => {
                try {
                    let data = JSON.parse(
                        element.querySelector(".upload-view > .upload-box")
                            .value
                    );
                    let formatted = _this.formatData(
                        data.ec,
                        data.mn,
                        data.tn,
                        {
                            data: data.d,
                            abilities: data.a,
                            counters: data.c,
                            timers: data.t,
                            ratings: data.r
                        }
                    );
                    if (data.at == config.account.team) {
                        formatted.username = data.au;
                    } else {
                        formatted.username = `team${data.at}-${data.au}`;
                    }

                    try {
                        element.querySelector(
                            ".upload-view > .upload-box"
                        ).style.display = "none";
                        element.querySelector(
                            "button.upload-data"
                        ).style.display = "none";
                        element.querySelector(
                            ".upload-view > .upload"
                        ).innerHTML = `<div class="status-box success" data-status="prepare">Preparing</div>`;
                        element.querySelector(
                            ".upload-view > .upload"
                        ).innerHTML += `<div class="status-box loading" data-status="upload">Uploading</div>`;
                        let upload = await (
                            await fetch(
                                `/api/v1/scouting/entry/add/${encodeURIComponent(
                                    data.ec
                                )}/${encodeURIComponent(
                                    data.mn
                                )}/${encodeURIComponent(
                                    data.tn
                                )}/${encodeURIComponent(data.tc)}`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json;charset=UTF-8"
                                    },
                                    body: JSON.stringify(formatted)
                                }
                            )
                        ).json();
                        if (upload.success) {
                            const uploadBox = element.querySelector(
                                "[data-status='upload']"
                            );
                            uploadBox.classList.remove("loading");
                            uploadBox.classList.add("success");
                            element.querySelector(
                                ".upload-view > .upload"
                            ).innerHTML += `<div class="status-box loading" data-status="verify">Verifying</div>`;
                            let stringified = _this.stringifyFormatted(
                                data.ec,
                                data.mn,
                                data.tn,
                                data.tc,
                                formatted
                            );
                            let hash = _this.hash(stringified);
                            let verify = await (
                                await fetch(
                                    `/api/v1/scouting/entry/verify/${encodeURIComponent(
                                        hash
                                    )}`
                                )
                            ).json();
                            if (verify.success && verify.body.verified) {
                                const verifyBox = element.querySelector(
                                    "[data-status='verify']"
                                );
                                verifyBox.classList.remove("loading");
                                verifyBox.classList.add("success");

                                let incentives = [];
                                if (
                                    upload.body.xp -
                                        upload.body.accuracyBoosters.xp >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.xp -
                                            upload.body.accuracyBoosters.xp
                                        } XP`
                                    );
                                }
                                if (
                                    upload.body.nuts -
                                        upload.body.accuracyBoosters.nuts >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.nuts -
                                            upload.body.accuracyBoosters.nuts
                                        } Nuts`
                                    );
                                }
                                if (
                                    upload.body.bolts -
                                        upload.body.accuracyBoosters.bolts >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.bolts -
                                            upload.body.accuracyBoosters.bolts
                                        } Bolts`
                                    );
                                }

                                let offset = 0;
                                if (incentives.length > 0) {
                                    offset = 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            ".upload-view > .upload"
                                        ).innerHTML += `<div class="status-box success" data-status="verify">${incentives.join(
                                            ", "
                                        )}</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.xp > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            ".upload-view > .upload"
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.xp} XP (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.nuts > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            ".upload-view > .upload"
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.nuts} Nuts (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.bolts > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            ".upload-view > .upload"
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.bolts} Bolts (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                setTimeout(() => {
                                    element.querySelector(
                                        ".upload-view > .upload"
                                    ).innerHTML += `<h3 class="green">Success!</h3>`;
                                    jsConfetti.addConfetti();
                                    _this.updateIncentives(upload.body);
                                    element.querySelector(
                                        ".upload-view > button.upload-again"
                                    ).style.display = "block";
                                }, offset);
                            } else {
                                console.log(stringified);
                                const verifyBox = element.querySelector(
                                    "[data-status='verify']"
                                );
                                verifyBox.classList.remove("loading");
                                verifyBox.classList.add("error");
                                element.querySelector(
                                    ".upload-view > .upload"
                                ).innerHTML += `<h3 class="red">${
                                    verify.error ||
                                    "Unable to verify upload completion."
                                }</h3>`;
                                element.querySelector(
                                    ".upload-view > button.upload-again"
                                ).style.display = "block";
                            }
                        } else {
                            const uploadBox = element.querySelector(
                                "[data-status='upload']"
                            );
                            uploadBox.classList.remove("loading");
                            uploadBox.classList.add("error");
                            element.querySelector(
                                ".upload-view > .upload"
                            ).innerHTML += `<h3 class="red">${
                                upload.error || "Unknown error."
                            }</h3>`;
                            element.querySelector(
                                ".upload-view > button.upload-again"
                            ).style.display = "block";
                        }
                    } catch (err) {
                        console.error(err);
                        const uploadBox = element.querySelector(
                            "[data-status='upload']"
                        );
                        uploadBox.classList.remove("loading");
                        uploadBox.classList.add("error");
                        element.querySelector(
                            ".upload-view > .upload"
                        ).innerHTML += `<h3 class="red">Could not connect to the server.</h3>`;
                        element.querySelector(
                            ".upload-view > button.upload-again"
                        ).style.display = "block";
                    }
                } catch (err) {}
                // console.log(decodedText);
                // console.log(decodedResult);
            };

            element.querySelector("button.switch-camera").onclick =
                async () => {
                    try {
                        await reader.stop();
                    } catch (err) {}
                    deviceIndex++;
                    if (deviceIndex >= devices.length) {
                        deviceIndex = 0;
                    }
                    try {
                        reader.start(
                            devices[deviceIndex].id,
                            {
                                fps: 10,
                                qrbox: {
                                    width: getQRScannerSize(),
                                    height: getQRScannerSize()
                                }
                            },
                            async (decodedText, decodedResult) => {
                                await scanResult(decodedText, decodedResult);
                            },
                            async (errorMessage) => {
                                // console.error(errorMessage);
                            }
                        );
                    } catch (err) {}
                };
            if (view == 0) {
                try {
                    devices = await Html5Qrcode.getCameras();
                    console.log(devices);
                    if (devices.length > 0) {
                        reader.start(
                            devices[deviceIndex].id,
                            {
                                fps: 10,
                                qrbox: {
                                    width: getQRScannerSize(),
                                    height: getQRScannerSize()
                                }
                            },
                            async (decodedText, decodedResult) => {
                                await scanResult(decodedText, decodedResult);
                            },
                            async (errorMessage) => {
                                // console.error(errorMessage);
                            }
                        );
                    }
                } catch (err) {}
                resolve(reader);
            }
        });
    };

    _this.showDataPage = () => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            let year =
                config.year || new Date().toLocaleDateString().split("/")[2];
            let events = await _this.getEvents(year);
            element.innerHTML = `
                <div class="data-window">
                    <h2>Event:</h2>
                    <div class="group">
                        <input class="team-number" id="team-number" autocomplete="off" name="Team" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number">Team Number (blank shows all)</label>
                    </div>
                    <select class="event-code">
                        <option value=""${
                            _this.getEventCode() == null ||
                            _this.getEventCode() == ""
                                ? " selected"
                                : ""
                        }>Select an event...</option>
                        ${events.map(
                            (event) =>
                                `<option value="${event.key}"${
                                    _this.getEventCode() == event.key
                                        ? " selected"
                                        : ""
                                }>${event.name}</option>`
                        )}
                    </select>
                    <button class="show-data">Show Data</button>
                    <button class="show-parsed-data">Show Parsed Data</button>
                    <button class="show-analysis">Show Analysis</button>
                    <button class="download-csv">Download CSV</button>
                    <p class="notes"></p>
                    <h3 class="red">&nbsp;</h3>
                    <table class="data-table" style="display: none;">
                        <thead>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="analysis" style="display: none;">
                        <div class="analysis-options">
                            <nav>
                                <a class="active" data-refer="score-graphs">Scoring</a>
                                <a data-refer="overall-graphs">Overall</a>
                                <a data-refer="predictions">Predictions</a>
                                <a data-refer="rankings">Rankings</a>
                            </nav>
                        </div>
                        <div class="analysis-content"></div>
                    </div>
                    <div class="overlay" style="display: none;"></div>
                </div>
            `;
            let overlayShown = false;
            const defAnalysis = `
                <div class="score-graphs"></div>
                <div class="none overall-graphs"></div>
                <div class="none predictions"></div>
                <div class="none rankings"></div>
            `;
            function showOverlay() {
                overlayShown = true;
                setTimeout(() => {
                    if (overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "block";
                    }
                }, 500);
            }
            function hideOverlay() {
                overlayShown = false;
                setTimeout(() => {
                    if (!overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "none";
                    }
                }, 500);
            }
            element.querySelector("button.show-data").onclick = async () => {
                showOverlay();
                let eventCode = element.querySelector(
                    ".data-window > select.event-code"
                ).value;
                let teamNumber = element.querySelector(
                    ".data-window input.team-number"
                ).value;
                element.querySelector(".notes").innerHTML = "";
                element.querySelector(".data-table > tbody").innerHTML = "";
                element.querySelector(".analysis-content").innerHTML =
                        defAnalysis;
                element.querySelector(".analysis").style.display = "none";
                try {
                    let data = await (
                        await fetch(
                            `/api/v1/scouting/entry/data/event/${encodeURIComponent(
                                eventCode
                            )}/csv`
                        )
                    ).json();
                    if (data.success) {
                        element.querySelector(".red").innerHTML = "&nbsp;";
                        let csv = Papa.parse(
                            data.body.csv.replaceAll('\\"', "&quot;")
                        ).data;
                        element.querySelector(".data-table > tbody").innerHTML =
                            csv
                                .slice(1)
                                .filter(
                                    (data) =>
                                        teamNumber == "" ||
                                        data.slice(1).includes(`${teamNumber}`)
                                )
                                .map((data) => {
                                    return `<tr>${data
                                        .map(
                                            (cell, i) =>
                                                `<td${
                                                    cell.length > 40 ||
                                                    cell.includes("\\n")
                                                        ? ` style="min-width: 200px; overflow-wrap: anywhere;"`
                                                        : ""
                                                }>${
                                                    csv[0][i] == "timestamp"
                                                        ? new Date(
                                                              parseInt(cell)
                                                          ).toLocaleString()
                                                        : _this
                                                              .escape(
                                                                  cell.replaceAll(
                                                                      "&quot;",
                                                                      '"'
                                                                  )
                                                              )
                                                              .replaceAll(
                                                                  "\\n",
                                                                  "<br>"
                                                              )
                                                }</td>`
                                        )
                                        .join("")}</tr>`;
                                })
                                .join("");
                        element.querySelector(
                            ".data-table > thead"
                        ).innerHTML = `<tr>${csv[0]
                            .map(
                                (cell) =>
                                    `<th>${cell
                                        .replaceAll('"', "")
                                        .replaceAll("\\n", "<br>")}</th>`
                            )
                            .join("")}</tr>`;
                        element.querySelector(
                            ".data-window > .notes"
                        ).innerHTML = data.body.notes.replaceAll("\n", "<br>");
                        element
                            .querySelector(".data-window")
                            .classList.add("data-window-visible");
                        element.querySelector(".data-table").style.display =
                            "block";
                    } else {
                        element.querySelector(".red").innerHTML =
                            data.error || "Unknown error.";
                    }
                } catch (err) {}
                hideOverlay();
            };
            element.querySelector("button.show-parsed-data").onclick =
                async () => {
                    showOverlay();
                    let eventCode = element.querySelector(
                        ".data-window > select.event-code"
                    ).value;
                    let teamNumber = element.querySelector(
                        ".data-window input.team-number"
                    ).value;
                    element.querySelector(".notes").innerHTML = "";
                    element.querySelector(".data-table > tbody").innerHTML = "";
                    element.querySelector(".analysis-content").innerHTML =
                        defAnalysis;
                    element.querySelector(".analysis").style.display = "none";
                    try {
                        let data = await (
                            await fetch(
                                `/api/v1/scouting/entry/data/event/${encodeURIComponent(
                                    eventCode
                                )}/csv/parsed`
                            )
                        ).json();
                        if (data.success) {
                            element.querySelector(".red").innerHTML = "&nbsp;";
                            let csv = Papa.parse(
                                data.body.csv.replaceAll('\\"', "&quot;")
                            ).data;
                            element.querySelector(
                                ".data-table > tbody"
                            ).innerHTML = csv
                                .slice(1)
                                .filter(
                                    (data) =>
                                        teamNumber == "" ||
                                        data.slice(1).includes(`${teamNumber}`)
                                )
                                .map((data) => {
                                    return `<tr>${data
                                        .map(
                                            (cell, i) =>
                                                `<td${
                                                    cell.length > 40 ||
                                                    cell.includes("\\n")
                                                        ? ` style="min-width: 200px; overflow-wrap: anywhere;"`
                                                        : ""
                                                }>${
                                                    csv[0][i] == "timestamp"
                                                        ? new Date(
                                                              parseInt(cell)
                                                          ).toLocaleString()
                                                        : _this
                                                              .escape(
                                                                  cell.replaceAll(
                                                                      "&quot;",
                                                                      '"'
                                                                  )
                                                              )
                                                              .replaceAll(
                                                                  "\\n",
                                                                  "<br>"
                                                              )
                                                }</td>`
                                        )
                                        .join("")}</tr>`;
                                })
                                .join("");
                            element.querySelector(
                                ".data-table > thead"
                            ).innerHTML = `<tr>${csv[0]
                                .map(
                                    (cell) =>
                                        `<th>${cell
                                            .replaceAll('"', "")
                                            .replaceAll("\\n", "<br>")}</th>`
                                )
                                .join("")}</tr>`;
                            element.querySelector(
                                ".data-window > .notes"
                            ).innerHTML = data.body.notes.replaceAll(
                                "\n",
                                "<br>"
                            );
                            element
                                .querySelector(".data-window")
                                .classList.add("data-window-visible");
                            element.querySelector(".data-table").style.display =
                                "block";
                        } else {
                            element.querySelector(".red").innerHTML =
                                data.error || "Unknown error.";
                        }
                    } catch (err) {}
                    hideOverlay();
                };
            element
                .querySelectorAll(".analysis-options > nav > a")
                .forEach((el) => {
                    el.onclick = () => {
                        element
                            .querySelectorAll(".analysis-options > nav > a")
                            .forEach((el) => {
                                el.classList.remove("active");
                            });
                        element
                            .querySelectorAll(".analysis-content > div")
                            .forEach((el) => {
                                el.classList.add("none");
                            });
                        el.classList.add("active");
                        element
                            .querySelector(
                                `.analysis-content > .${el.getAttribute(
                                    "data-refer"
                                )}`
                            )
                            .classList.remove("none");
                    };
                });
            element.querySelector("button.show-analysis").onclick =
                async () => {
                    showOverlay();
                    let eventCode = element.querySelector(
                        ".data-window > select.event-code"
                    ).value;
                    let teamNumber =
                        element.querySelector(".data-window input.team-number")
                            .value || config.account.team;
                    element.querySelector(".notes").innerHTML = "";
                    element.querySelector(".data-table > tbody").innerHTML = "";
                    element.querySelector(".data-table").style.display = "none";
                    element.querySelector(".analysis-content").innerHTML =
                        defAnalysis;
                    try {
                        let data = await (
                            await fetch(
                                `/api/v1/scouting/entry/analysis/event/${encodeURIComponent(
                                    eventCode
                                )}/${teamNumber}`
                            )
                        ).json();
                        if (data.success) {
                            element.querySelector(".red").innerHTML = "&nbsp;";
                            let run = [];
                            // score graphs
                            element.querySelector(
                                ".analysis-content .score-graphs"
                            ).innerHTML = data.body.display
                                .map((item, ind) => {
                                    if (item.category == "score") {
                                        if (item.type == "html") {
                                            return `<h2>${item.label}</h2>${item.value}`;
                                        } else if (item.type == "config") {
                                            const config = item.value;
                                            const id = _this.random();
                                            console.log(config);
                                            return `<canvas id="${id}">
                                                    <script>
                                                        const parse = (config) => {
                                                            if (window.innerWidth < 515) config.options.aspectRatio = 1;
                                                            else if (window.innerWidth < 800) config.options.aspectRatio = 1.5;
                                                            else config.options.aspectRatio = 2;

                                                            if (window.innerWidth <= 500 && config.type == "boxplot") {
                                                                config.options.plugins.tooltip.bodyFont.size = 6;
                                                            }

                                                            return config;
                                                        };
                                                        var chart_config${ind} = ${JSON.stringify(
                                                config
                                            )};
                                                        const resizetypes = ["line", "boxplot"];
                                                        chart_config${ind} = (resizetypes.includes(chart_config${ind}.type)) ? parse(chart_config${ind}) : chart_config${ind};
                                                        let chart${ind} = new Chart(document.getElementById("${id}").getContext("2d"), chart_config${ind});
                                                        if (resizetypes.includes(chart_config${ind}.type)) {
                                                            window.addEventListener("resize", () => {
                                                                chart_config${ind} = parse(chart_config${ind});
                                                                chart${ind}.update();
                                                            });
                                                        }
                                                    </script>
                                                </canvas>`;
                                        }
                                    }
                                })
                                .join("");
                            // overall graphs
                            element.querySelector(
                                ".analysis-content .overall-graphs"
                            ).innerHTML = data.body.display
                                .map((item, ind) => {
                                    if (item.category == "overall") {
                                        if (item.type == "html") {
                                            return `<h2>${item.label}</h2>${item.value}`;
                                        } else if (item.type == "config") {
                                            const config = item.value;
                                            const id = _this.random();
                                            console.log(config);
                                            return `<canvas id="${id}">
                                                    <script>
                                                        const parse = (config) => {
                                                            if (window.innerWidth < 515) config.options.aspectRatio = 1;
                                                            else if (window.innerWidth < 800) config.options.aspectRatio = 1.5;
                                                            else config.options.aspectRatio = 2;

                                                            if (window.innerWidth <= 500 && config.type == "boxplot") {
                                                                config.options.plugins.tooltip.bodyFont.size = 6;
                                                            }

                                                            return config;
                                                        };
                                                        var chart_config${ind} = ${JSON.stringify(
                                                config
                                            )};
                                                        const resizetypes = ["line", "boxplot"];
                                                        chart_config${ind} = (resizetypes.includes(chart_config${ind}.type)) ? parse(chart_config${ind}) : chart_config${ind};
                                                        let chart${ind} = new Chart(document.getElementById("${id}").getContext("2d"), chart_config${ind});
                                                        if (resizetypes.includes(chart_config${ind}.type)) {
                                                            window.addEventListener("resize", () => {
                                                                chart_config${ind} = parse(chart_config${ind});
                                                                chart${ind}.update();
                                                            });
                                                        }
                                                    </script>
                                                </canvas>`;
                                        }
                                    }
                                })
                                .join("");
                            // predictions
                            element.querySelector(
                                ".analysis-content .predictions"
                            ).innerHTML = data.body.display
                                .map((item) => {
                                    if (item.category == "predict") {
                                        if (item.type == "predictions") {
                                            return `<h2>${item.label}</h2>
                                                ${item.values
                                                    .map((data) => {
                                                        let firstListed = "red";
                                                        if (
                                                            (data.win &&
                                                                data.winner ==
                                                                    "blue") ||
                                                            (!data.win &&
                                                                data.winner ==
                                                                    "red")
                                                        ) {
                                                            firstListed =
                                                                "blue";
                                                        }
                                                        return `<h3>Match ${
                                                            data.match
                                                        } (Predicted ${
                                                            data.win
                                                                ? "WIN"
                                                                : "LOSS"
                                                        })</h3>
                                                        <div class="prediction-bar">
                                                            <div class="prediction-bar-${
                                                                firstListed ==
                                                                "red"
                                                                    ? "red"
                                                                    : "blue"
                                                            }" style="width: calc(${
                                                            firstListed == "red"
                                                                ? data.red * 100
                                                                : data.blue *
                                                                  100
                                                        }% - 2px);"><p>${Math.round(
                                                            firstListed == "red"
                                                                ? data.red * 100
                                                                : data.blue *
                                                                      100
                                                        )}%</p></div>
                                                            <div class="prediction-bar-${
                                                                firstListed ==
                                                                "red"
                                                                    ? "blue"
                                                                    : "red"
                                                            }" style="width: calc(${
                                                            firstListed == "red"
                                                                ? data.blue *
                                                                  100
                                                                : data.red * 100
                                                        }% - 3px);"><p>${Math.round(
                                                            firstListed == "red"
                                                                ? data.blue *
                                                                      100
                                                                : data.red * 100
                                                        )}%</p></div>
                                                        </div>`;
                                                    })
                                                    .join("")}`;
                                        }
                                    }
                                })
                                .join("");
                            // rankings
                            element.querySelector(
                                ".analysis-content .rankings"
                            ).innerHTML = data.body.display
                                .map((item) => {
                                    if (item.category == "rank") {
                                        if (item.type == "table") {
                                            return `<h2>${item.label}</h2>
                                            <table class="data-table">
                                                <thead>
                                                    <tr>${item.values[0]
                                                        .map(
                                                            (cell) =>
                                                                `<th>${cell
                                                                    .replaceAll(
                                                                        '"',
                                                                        ""
                                                                    )
                                                                    .replaceAll(
                                                                        "\\n",
                                                                        "<br>"
                                                                    )}</th>`
                                                        )
                                                        .join("")}</tr>
                                                </thead>
                                                <tbody>
                                                    ${item.values
                                                        .slice(1)
                                                        .map((data) => {
                                                            return `<tr>${data
                                                                .map(
                                                                    (cell) =>
                                                                        `<td${
                                                                            cell.includes(
                                                                                `<b>${teamNumber}</b>`
                                                                            )
                                                                                ? ` style="background-color: yellow;"`
                                                                                : ""
                                                                        }>${cell.replaceAll(
                                                                            "\\n",
                                                                            "<br>"
                                                                        )}</td>`
                                                                )
                                                                .join(
                                                                    ""
                                                                )}</tr>`;
                                                        })
                                                        .join("")}
                                                </tbody>
                                            </table>`;
                                        }
                                    }
                                })
                                .join("");
                            let scripts = [
                                ...element.querySelectorAll(".analysis script")
                            ];
                            for (let i = 0; i < scripts.length; i++) {
                                if (!run.includes(scripts[i].innerHTML)) {
                                    run.push(scripts[i].innerHTML);
                                    eval(scripts[i].innerHTML);
                                }
                            }
                            element
                                .querySelector(".data-window")
                                .classList.add("data-window-visible");
                            element.querySelector(".analysis").style.display =
                                "";
                        } else {
                            element.querySelector(".red").innerHTML =
                                data.error || "Unknown error.";
                        }
                    } catch (err) {}
                    hideOverlay();
                };
            element.querySelector("button.download-csv").onclick = async () => {
                showOverlay();
                let eventCode = element.querySelector(
                    ".data-window > select.event-code"
                ).value;
                let teamNumber = element.querySelector(
                    ".data-window input.team-number"
                ).value;
                try {
                    let data = await (
                        await fetch(
                            `/api/v1/scouting/entry/data/event/${encodeURIComponent(
                                eventCode
                            )}/csv`
                        )
                    ).json();
                    if (data.success) {
                        element.querySelector(".red").innerHTML = "&nbsp;";
                        let csv = data.body.csv;
                        let download =
                            "data:text/csv;charset=utf-8," +
                            encodeURIComponent(csv);
                        let link = document.createElement("a");
                        link.style.display = "none";
                        link.setAttribute("href", download);
                        link.setAttribute(
                            "download",
                            `tpw-scouting-${eventCode}.csv`
                        );
                        element.appendChild(link);
                        link.click();
                        link.remove();
                    } else {
                        element.querySelector(".red").innerHTML =
                            data.error || "Unknown error.";
                    }
                } catch (err) {}
                hideOverlay();
            };
            resolve();
        });
    };

    _this.showComparePage = () => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            let year =
                config.year || new Date().toLocaleDateString().split("/")[2];
            let events = await _this.getEvents(year);
            element.innerHTML = `
                <div class="data-window">
                    <h2>Event:</h2>
                    <select class="event-code">
                        <option value=""${
                            _this.getEventCode() == null ||
                            _this.getEventCode() == ""
                                ? " selected"
                                : ""
                        }>Select an event...</option>
                        ${events.map(
                            (event) =>
                                `<option value="${event.key}"${
                                    _this.getEventCode() == event.key
                                        ? " selected"
                                        : ""
                                }>${event.name}</option>`
                        )}
                    </select>
                    <h2>Team Numbers (up to 5)</h2>
                    <div class="group">
                        <input class="team-number-1" id="team-number-1" autocomplete="off" name="Team Number 1" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number-1">Team Number 1</label>
                    </div>
                    <div class="group">
                        <input class="team-number-2" id="team-number-2" autocomplete="off" name="Team Number 2" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number-2">Team Number 2</label>
                    </div>
                    <div class="group">
                        <input class="team-number-3" id="team-number-3" autocomplete="off" name="Team Number 3" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number-3">Team Number 3</label>
                    </div>
                    <div class="group">
                        <input class="team-number-4" id="team-number-4" autocomplete="off" name="Team Number 4" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number-4">Team Number 4</label>
                    </div>
                    <div class="group">
                        <input class="team-number-5" id="team-number-5" autocomplete="off" name="Team Number 5" type="number" min="0" required="required"/></span><span class="bar"></span>
                        <label for="team-number-5">Team Number 5</label>
                    </div>
                    <button class="show-comparison">Compare Teams</button>
                    <h3 class="red">&nbsp;</h3>
                    <div class="comparison" style="display: none;"></div>
                    <div class="overlay" style="display: none;"></div>
                </div>
            `;
            let overlayShown = false;
            const defComparison = `
                <div class="graphs"></div>
                <div class="predictions"></div>
                <div class="rankings"></div>
            `;
            function showOverlay() {
                overlayShown = true;
                setTimeout(() => {
                    if (overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "block";
                    }
                }, 500);
            }
            function hideOverlay() {
                overlayShown = false;
                setTimeout(() => {
                    if (!overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "none";
                    }
                }, 500);
            }
            element.querySelector("button.show-comparison").onclick =
                async () => {
                    showOverlay();
                    let eventCode = element.querySelector(
                        ".data-window > select.event-code"
                    ).value;
                    let teamNumber1 =
                        element.querySelector(
                            ".data-window input.team-number-1"
                        ).value || config.account.team;
                    let teamNumber2 =
                        element.querySelector(
                            ".data-window input.team-number-2"
                        ).value || "";
                    let teamNumber3 =
                        element.querySelector(
                            ".data-window input.team-number-3"
                        ).value || "";
                    let teamNumber4 =
                        element.querySelector(
                            ".data-window input.team-number-4"
                        ).value || "";
                    let teamNumber5 =
                        element.querySelector(
                            ".data-window input.team-number-5"
                        ).value || "";
                    let teamNumbers = [
                        teamNumber1,
                        teamNumber2,
                        teamNumber3,
                        teamNumber4,
                        teamNumber5
                    ]
                        .filter((teamNumber) => teamNumber != "")
                        .join(",");
                    element.querySelector(".comparison").innerHTML =
                        defComparison;
                    try {
                        let data = await (
                            await fetch(
                                `/api/v1/scouting/entry/compare/event/${encodeURIComponent(
                                    eventCode
                                )}/${teamNumbers}`
                            )
                        ).json();
                        if (data.success) {
                            element.querySelector(".red").innerHTML = "&nbsp;";
                            let run = [];
                            // graphs
                            element.querySelector(
                                ".comparison .graphs"
                            ).innerHTML = data.body.display
                                .map((item) => {
                                    if (item.type == "html") {
                                        return `<h2>${item.label}</h2>${item.value}`;
                                    } else if (item.type == "config") {
                                        const config = item.value;
                                        const id = _this.random();
                                        console.log(config);
                                        return `<canvas id="${id}">
                                                <script>
                                                    var chart_config = ${JSON.stringify(
                                                        config
                                                    )};
                                                    new Chart(document.getElementById("${id}").getContext("2d"), chart_config);
                                                </script>
                                            </canvas>`;
                                    }
                                })
                                .join("");
                            // predictions
                            element.querySelector(
                                ".comparison .predictions"
                            ).innerHTML = data.body.display
                                .map((item) => {
                                    if (item.type == "predictions") {
                                        return `<h2>${item.label}</h2>
                                        ${item.values
                                            .map((data) => {
                                                let firstListed = "red";
                                                if (
                                                    (data.win &&
                                                        data.winner ==
                                                            "blue") ||
                                                    (!data.win &&
                                                        data.winner == "red")
                                                ) {
                                                    firstListed = "blue";
                                                }
                                                return `<h3>Match ${
                                                    data.match
                                                } (Predicted ${
                                                    data.win ? "WIN" : "LOSS"
                                                })</h3>
                                                <div class="prediction-bar">
                                                    <div class="prediction-bar-${
                                                        firstListed == "red"
                                                            ? "red"
                                                            : "blue"
                                                    }" style="width: calc(${
                                                    firstListed == "red"
                                                        ? data.red * 100
                                                        : data.blue * 100
                                                }% - 2px);"><p>${Math.round(
                                                    firstListed == "red"
                                                        ? data.red * 100
                                                        : data.blue * 100
                                                )}%</p></div>
                                                    <div class="prediction-bar-${
                                                        firstListed == "red"
                                                            ? "blue"
                                                            : "red"
                                                    }" style="width: calc(${
                                                    firstListed == "red"
                                                        ? data.blue * 100
                                                        : data.red * 100
                                                }% - 3px);"><p>${Math.round(
                                                    firstListed == "red"
                                                        ? data.blue * 100
                                                        : data.red * 100
                                                )}%</p></div>
                                                </div>`;
                                            })
                                            .join("")}`;
                                    }
                                })
                                .join("");
                            // rankings
                            element.querySelector(
                                ".comparison .rankings"
                            ).innerHTML = data.body.display
                                .map((item) => {
                                    if (item.type == "table") {
                                        return `<h2>${item.label}</h2>
                                    <table class="data-table">
                                        <thead>
                                            <tr>${item.values[0]
                                                .map(
                                                    (cell) =>
                                                        `<th>${cell
                                                            .replaceAll('"', "")
                                                            .replaceAll(
                                                                "\\n",
                                                                "<br>"
                                                            )}</th>`
                                                )
                                                .join("")}</tr>
                                        </thead>
                                        <tbody>
                                            ${item.values
                                                .slice(1)
                                                .map((data) => {
                                                    return `<tr>${data
                                                        .map(
                                                            (cell) =>
                                                                `<td>${cell.replaceAll(
                                                                    "\\n",
                                                                    "<br>"
                                                                )}</td>`
                                                        )
                                                        .join("")}</tr>`;
                                                })
                                                .join("")}
                                        </tbody>
                                    </table>`;
                                    }
                                })
                                .join("");
                            let scripts = [
                                ...element.querySelectorAll(
                                    ".comparison script"
                                )
                            ];
                            for (let i = 0; i < scripts.length; i++) {
                                if (!run.includes(scripts[i].innerHTML)) {
                                    run.push(scripts[i].innerHTML);
                                    eval(scripts[i].innerHTML);
                                }
                            }
                            element
                                .querySelector(".data-window")
                                .classList.add("data-window-visible");
                            element.querySelector(".comparison").style.display =
                                "";
                        } else {
                            element.querySelector(".red").innerHTML =
                                data.error || "Unknown error.";
                        }
                    } catch (err) {}
                    hideOverlay();
                };
            resolve();
        });
    };

    _this.showPredictPage = () => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            let year =
                config.year || new Date().toLocaleDateString().split("/")[2];
            let events = await _this.getEvents(year);
            element.innerHTML = `
                <div class="data-window">
                    <h2>Event:</h2>
                    <select class="event-code">
                        <option value=""${
                            _this.getEventCode() == null ||
                            _this.getEventCode() == ""
                                ? " selected"
                                : ""
                        }>Select an event...</option>
                        ${events.map(
                            (event) =>
                                `<option value="${event.key}"${
                                    _this.getEventCode() == event.key
                                        ? " selected"
                                        : ""
                                }>${event.name}</option>`
                        )}
                    </select>
                    <h2>Red Alliance</h2>
                    <div class="team-color-group">
                        <div class="group">
                            <input class="team-number-red1" id="team-number-red1" autocomplete="off" name="Red 1 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-red1">Red 1</label>
                        </div>
                        <div class="group">
                            <input class="team-number-red2" id="team-number-red2" autocomplete="off" name="Red 2 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-red2">Red 2</label>
                        </div>
                        <div class="group">
                            <input class="team-number-red3" id="team-number-red3" autocomplete="off" name="Red 3 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-red3">Red 3</label>
                        </div>
                    </div>
                    <h2>Blue Alliance</h2>
                    <div class="team-color-group">
                        <div class="group">
                            <input class="team-number-blue1" id="team-number-blue1" autocomplete="off" name="Blue 1 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-blue1">Blue 1</label>
                        </div>
                        <div class="group">
                            <input class="team-number-blue2" id="team-number-blue2" autocomplete="off" name="Blue 2 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-blue2">Blue 2</label>
                        </div>
                        <div class="group">
                            <input class="team-number-blue3" id="team-number-blue3" autocomplete="off" name="Blue 3 Team Number" type="number" min="0" required="required"/></span><span class="bar"></span>
                            <label for="team-number-blue3">Blue 3</label>
                        </div>
                    </div>
                    <button class="show-prediction">Predict Winner</button>
                    <h3 class="red">&nbsp;</h3>
                    <div class="prediction" style="display: none;"></div>
                    <div class="overlay" style="display: none;"></div>
                </div>
            `;
            let overlayShown = false;
            function showOverlay() {
                overlayShown = true;
                setTimeout(() => {
                    if (overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "block";
                    }
                }, 500);
            }
            function hideOverlay() {
                overlayShown = false;
                setTimeout(() => {
                    if (!overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "none";
                    }
                }, 500);
            }
            element.querySelector("button.show-prediction").onclick =
                async () => {
                    showOverlay();
                    let eventCode = element.querySelector(
                        ".data-window > select.event-code"
                    ).value;
                    let teamNumberRed1 =
                        element.querySelector(
                            ".data-window input.team-number-red1"
                        ).value || "";
                    let teamNumberRed2 =
                        element.querySelector(
                            ".data-window input.team-number-red2"
                        ).value || "";
                    let teamNumberRed3 =
                        element.querySelector(
                            ".data-window input.team-number-red3"
                        ).value || "";
                    let teamNumberBlue1 =
                        element.querySelector(
                            ".data-window input.team-number-blue1"
                        ).value || "";
                    let teamNumberBlue2 =
                        element.querySelector(
                            ".data-window input.team-number-blue2"
                        ).value || "";
                    let teamNumberBlue3 =
                        element.querySelector(
                            ".data-window input.team-number-blue3"
                        ).value || "";
                    let teamNumbers = {
                        red: [
                            teamNumberRed1,
                            teamNumberRed2,
                            teamNumberRed3
                        ].filter((teamNumber) => teamNumber != ""),
                        blue: [
                            teamNumberBlue1,
                            teamNumberBlue2,
                            teamNumberBlue3
                        ].filter((teamNumber) => teamNumber != "")
                    };
                    if (
                        teamNumbers.red.length < 3 ||
                        teamNumbers.blue.length < 3
                    ) {
                        element.querySelector(".red").innerHTML =
                            "Please enter all six team numbers!";
                    }
                    element.querySelector(".prediction").innerHTML = "";
                    try {
                        let data = await (
                            await fetch(
                                `/api/v1/scouting/entry/predict/event/${encodeURIComponent(
                                    eventCode
                                )}/${teamNumbers.red.join(
                                    ","
                                )}/${teamNumbers.blue.join(",")}`
                            )
                        ).json();
                        if (data.success) {
                            element.querySelector(".red").innerHTML = "&nbsp;";
                            let run = [];
                            element.querySelector(".prediction").innerHTML =
                                data.body.display
                                    .map((item) => {
                                        if (item.type == "table") {
                                            return `<h2>${item.label}</h2>
                                        <table class="data-table">
                                            <thead>
                                                <tr>${item.values[0]
                                                    .map(
                                                        (cell) =>
                                                            `<th>${cell
                                                                .replaceAll(
                                                                    '"',
                                                                    ""
                                                                )
                                                                .replaceAll(
                                                                    "\\n",
                                                                    "<br>"
                                                                )}</th>`
                                                    )
                                                    .join("")}</tr>
                                            </thead>
                                            <tbody>
                                                ${item.values
                                                    .slice(1)
                                                    .map((data) => {
                                                        return `<tr>${data
                                                            .map(
                                                                (cell) =>
                                                                    `<td>${cell.replaceAll(
                                                                        "\\n",
                                                                        "<br>"
                                                                    )}</td>`
                                                            )
                                                            .join("")}</tr>`;
                                                    })
                                                    .join("")}
                                            </tbody>
                                        </table>`;
                                        } else if (item.type == "predictions") {
                                            return `<h2>${item.label}</h2>
                                            ${item.values
                                                .map((data) => {
                                                    let firstListed =
                                                        data.winner;
                                                    return `<h3>Predicted Winner: ${data.winner.toUpperCase()}</h3>
                                                    <div class="prediction-bar">
                                                        <div class="prediction-bar-${
                                                            firstListed == "red"
                                                                ? "red"
                                                                : "blue"
                                                        }" style="width: calc(${
                                                        firstListed == "red"
                                                            ? data.red * 100
                                                            : data.blue * 100
                                                    }% - 2px);"><p>${Math.round(
                                                        firstListed == "red"
                                                            ? data.red * 100
                                                            : data.blue * 100
                                                    )}%</p></div>
                                                        <div class="prediction-bar-${
                                                            firstListed == "red"
                                                                ? "blue"
                                                                : "red"
                                                        }" style="width: calc(${
                                                        firstListed == "red"
                                                            ? data.blue * 100
                                                            : data.red * 100
                                                    }% - 3px);"><p>${Math.round(
                                                        firstListed == "red"
                                                            ? data.blue * 100
                                                            : data.red * 100
                                                    )}%</p></div>
                                                    </div>`;
                                                })
                                                .join("")}`;
                                        } else if (item.type == "html") {
                                            return `<h2>${item.label}</h2>${item.value}`;
                                        }
                                    })
                                    .join("");
                            let scripts = [
                                ...element.querySelectorAll(
                                    ".prediction script"
                                )
                            ];
                            for (let i = 0; i < scripts.length; i++) {
                                if (!run.includes(scripts[i].innerHTML)) {
                                    run.push(scripts[i].innerHTML);
                                    eval(scripts[i].innerHTML);
                                }
                            }
                            element
                                .querySelector(".data-window")
                                .classList.add("data-window-visible");
                            element.querySelector(".prediction").style.display =
                                "";
                        } else {
                            element.querySelector(".red").innerHTML =
                                data.error || "Unknown error.";
                        }
                    } catch (err) {}
                    hideOverlay();
                };
            resolve();
        });
    };

    _this.showAdminPage = () => {
        return new Promise(async (resolve, reject) => {
            element.innerHTML = `
                <div class="home-window">
                    <h2>Admin Token:</h2>
                    <input class="admin-token" type="password" />
                    <button class="list">List All Teams</button>
                    <h2>Team Number:</h2>
                    <input class="team-number" type="number" />
                    <h2>Access Token:</h2>
                    <input class="access-token" type="text" />
                    <button class="fetch">Fetch TBA</button>
                    <h2>Team Name:</h2>
                    <input class="team-name" type="text" />
                    <h2>Country:</h2>
                    <input class="country" type="text" />
                    <h2>State:</h2>
                    <input class="state" type="text" />
                    <p class="warning">Make sure to double check all information before adding/updating a team.</p>
                    <button class="add">Add/Update Team</button>
                    <p class="message warning"></p>
                </div>
                <div class="data-window">
                    <table class="data-table" style="display: none;">
                        <thead>
                            <th>team number</th>
                            <th>name</th>
                            <th>country</th>
                            <th>state</th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            `;

            element.querySelector(".home-window > button.fetch").onclick =
                async () => {
                    let teamNumber = element.querySelector(
                        ".home-window > input.team-number"
                    ).value;
                    if (teamNumber != null && teamNumber != "") {
                        let team = await _this.getTeam(teamNumber);
                        if (team.nickname != null && team.nickname != "") {
                            element.querySelector(
                                ".home-window > input.team-name"
                            ).value = team.nickname;
                        } else {
                            element.querySelector(
                                ".home-window > input.team-name"
                            ).value = "";
                        }
                        if (team.country != null && team.country != "") {
                            element.querySelector(
                                ".home-window > input.country"
                            ).value = team.country;
                        } else {
                            element.querySelector(
                                ".home-window > input.country"
                            ).value = "";
                        }
                        if (
                            team.country == "USA" &&
                            team.state_prov != null &&
                            team.state_prov != ""
                        ) {
                            element.querySelector(
                                ".home-window > input.state"
                            ).value = team.state_prov;
                        } else {
                            element.querySelector(
                                ".home-window > input.state"
                            ).value = "";
                        }
                    }
                };

            element.querySelector(".home-window > button.add").onclick =
                async () => {
                    let teamNumber = element.querySelector(
                        ".home-window > input.team-number"
                    ).value;
                    let accessToken = element.querySelector(
                        ".home-window > input.access-token"
                    ).value;
                    let teamName = element.querySelector(
                        ".home-window > input.team-name"
                    ).value;
                    let country = element.querySelector(
                        ".home-window > input.country"
                    ).value;
                    let state = element.querySelector(
                        ".home-window > input.state"
                    ).value;
                    let adminToken = element.querySelector(
                        ".home-window > input.admin-token"
                    ).value;
                    if (
                        teamNumber != null &&
                        teamNumber != "" &&
                        accessToken != null &&
                        accessToken != "" &&
                        teamName != null &&
                        teamName != "" &&
                        country != null &&
                        country != "" &&
                        adminToken != null &&
                        adminToken != ""
                    ) {
                        let result = await _this.addTeam(
                            teamNumber,
                            accessToken,
                            teamName,
                            country,
                            state,
                            adminToken
                        );
                        if (result.success) {
                            element
                                .querySelector(".home-window > .message")
                                .classList.remove("red");
                            element
                                .querySelector(".home-window > .message")
                                .classList.add("green");
                            element.querySelector(
                                ".home-window > input.team-number"
                            ).value = "";
                            element.querySelector(
                                ".home-window > input.access-token"
                            ).value = "";
                            element.querySelector(
                                ".home-window > input.team-name"
                            ).value = "";
                            element.querySelector(
                                ".home-window > input.country"
                            ).value = "";
                            element.querySelector(
                                ".home-window > input.state"
                            ).value = "";
                            element.querySelector(
                                ".home-window > .message"
                            ).innerHTML = `Team ${teamNumber} added/updated successfully!`;
                        } else {
                            element
                                .querySelector(".home-window > .message")
                                .classList.remove("green");
                            element
                                .querySelector(".home-window > .message")
                                .classList.add("red");
                            element.querySelector(
                                ".home-window > .message"
                            ).innerHTML = result.error;
                        }
                    }
                };
            element.querySelector(".home-window > button.list").onclick =
                async () => {
                    let adminToken = element.querySelector(
                        ".home-window > input.admin-token"
                    ).value;
                    if (adminToken != null && adminToken != "") {
                        let result = await _this.listTeams(adminToken);
                        if (result.success) {
                            element.querySelector(
                                ".home-window > .message"
                            ).innerHTML = "";
                            element.querySelector(
                                ".data-table > tbody"
                            ).innerHTML = result.body.teams
                                .map((team, i) => {
                                    return `
                                <tr>
                                    <td>
                                        ${team.teamNumber}
                                    </td>
                                    <td>
                                        ${team.name}
                                    </td>
                                    <td>
                                        ${team.country}
                                    </td>
                                    <td>
                                        ${team.state}
                                    </td>
                                </tr>`;
                                })
                                .join("");
                            element.querySelector(".data-table").style.display =
                                "";
                        } else {
                            element
                                .querySelector(".home-window > .message")
                                .classList.remove("green");
                            element
                                .querySelector(".home-window > .message")
                                .classList.add("red");
                            element.querySelector(
                                ".home-window > .message"
                            ).innerHTML = result.error;
                        }
                    }
                };
            resolve();
        });
    };

    _this.getQuote = () => {
        let possibleQuotes = importantQuotes.length * 3 + quotes.length;
        let randomQuoteID = Math.floor(Math.random() * possibleQuotes);

        let boltmanQuote = "";
        if (randomQuoteID < importantQuotes.length * 3) {
            boltmanQuote = importantQuotes[Math.floor(randomQuoteID / 3)];
        } else {
            boltmanQuote = quotes[randomQuoteID - importantQuotes.length * 3];
        }
        return '"' + boltmanQuote + '" --Boltman';
    };

    _this.getLatestMatch = (eventCode) => {
        return new Promise(async (resolve, reject) => {
            setTimeout(() => {
                resolve({
                    success: false
                });
            }, 5000);
            try {
                let latestMatchData = await (
                    await fetch(
                        `/api/v1/scouting/entry/latest/${encodeURIComponent(
                            eventCode
                        )}`
                    )
                ).json();
                resolve(latestMatchData);
            } catch (err) {
                resolve({
                    success: false
                });
            }
        });
    };

    _this.getTeam = (teamNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                let team = await (
                    await fetch(
                        `/api/v1/scouting/team/get/${encodeURIComponent(
                            teamNumber
                        )}`
                    )
                ).json();
                resolve(team.body.team);
            } catch (err) {
                resolve({
                    success: false
                });
            }
        });
    };

    _this.addTeam = (
        teamNumber,
        accessToken,
        teamName,
        country,
        state,
        adminToken
    ) => {
        return new Promise(async (resolve, reject) => {
            try {
                let add = await (
                    await fetch(
                        `/api/v1/scouting/team/add/${encodeURIComponent(
                            teamNumber
                        )}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json;charset=UTF-8"
                            },
                            body: JSON.stringify({
                                teamName,
                                country,
                                state,
                                accessToken,
                                adminToken
                            })
                        }
                    )
                ).json();
                resolve(add);
            } catch (err) {
                resolve({
                    success: false
                });
            }
        });
    };

    _this.listTeams = (adminToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                let list = await (
                    await fetch(`/api/v1/scouting/team/list`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        body: JSON.stringify({
                            adminToken
                        })
                    })
                ).json();
                resolve(list);
            } catch (err) {
                resolve({
                    success: false
                });
            }
        });
    };

    _this.getEventCode = () => {
        if (localStorage.getItem("eventCode") == null) {
            return "";
        } else {
            return localStorage.getItem("eventCode");
        }
    };

    _this.setEventCode = (eventCode) => {
        localStorage.setItem("eventCode", eventCode);
        return;
    };

    _this.setEvents = (year) => {
        return new Promise(async (resolve, reject) => {
            try {
                let events = await (
                    await fetch(
                        `/api/v1/scouting/events/${encodeURIComponent(
                            year
                        )}/team`
                    )
                ).json();
                if (events.success) {
                    localStorage.setItem(
                        `events::${year}`,
                        JSON.stringify(events.body.events || [])
                    );
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (err) {
                console.log(err);
                if (
                    !err.toString().toLowerCase().includes("failed to fetch") &&
                    !err.toString().toLowerCase().includes("load failed")
                ) {
                    alert(
                        `/api/v1/scouting/events/${encodeURIComponent(
                            year
                        )}/team ${err}`
                    );
                }
                resolve(false);
            }
        });
    };

    _this.setMatches = (eventCode) => {
        return new Promise(async (resolve, reject) => {
            try {
                let cacheTime = 0;
                if (
                    !isNaN(
                        parseInt(
                            localStorage.getItem(
                                `cachetime::matches::${eventCode}`
                            )
                        )
                    )
                ) {
                    cacheTime = parseInt(
                        localStorage.getItem(`cachetime::matches::${eventCode}`)
                    );
                }
                if (cacheTime + 10000 > new Date().getTime()) {
                    resolve(true);
                } else {
                    let matches = await (
                        await fetch(
                            `/api/v1/scouting/matches/${encodeURIComponent(
                                eventCode
                            )}`
                        )
                    ).json();
                    if (matches.success) {
                        localStorage.setItem(
                            `cachetime::matches::${eventCode}`,
                            new Date().getTime()
                        );
                        localStorage.setItem(
                            `matches::${eventCode}`,
                            JSON.stringify(matches.body.matches || [])
                        );
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            } catch (err) {
                console.log(err);
                if (
                    !err.toString().includes("Failed to fetch") &&
                    !err.toString().toLowerCase().includes("load failed") &&
                    eventCode != ""
                ) {
                    alert(
                        `/api/v1/scouting/matches/${encodeURIComponent(
                            eventCode
                        )} ${err}`
                    );
                }
                resolve(false);
            }
        });
    };

    _this.getMatches = (eventCode) => {
        return new Promise(async (resolve, reject) => {
            if (localStorage.getItem(`matches::${eventCode}`) != null) {
                resolve(
                    JSON.parse(localStorage.getItem(`matches::${eventCode}`))
                );
                await _this.setMatches(eventCode);
            } else {
                let set = await _this.setMatches(eventCode);
                if (set) {
                    resolve(
                        JSON.parse(
                            localStorage.getItem(`matches::${eventCode}`)
                        )
                    );
                } else {
                    resolve([]);
                }
            }
        });
    };

    _this.getMatch = (
        eventCode,
        matchNumber,
        setNumber = 1,
        compLevel = "qm"
    ) => {
        return new Promise(async (resolve, reject) => {
            let matches = await _this.getMatches(eventCode);
            let fallback = {
                comp_level: compLevel,
                set_number: setNumber,
                match_number: matchNumber,
                alliances: {
                    red: {
                        score: 0,
                        team_keys: ["frc1r", "frc2r", "frc3r"],
                        surrogate_team_keys: [],
                        dq_team_keys: []
                    },
                    blue: {
                        score: 0,
                        team_keys: ["frc1b", "frc2b", "frc3b"],
                        surrogate_team_keys: [],
                        dq_team_keys: []
                    }
                },
                winning_alliance: "red",
                event_key: eventCode,
                time: 0,
                predicted_time: 0,
                actual_time: 0
            };
            let match =
                (matches.filter(
                    (match) =>
                        matchNumber == match.match_number &&
                        setNumber == match.set_number &&
                        compLevel == match.comp_level
                ) || [fallback])[0] || fallback;
            if (match.alliances == null) {
                match.alliances = fallback.alliances;
            }
            if (match.alliances.red == null) {
                match.alliances.red = fallback.alliances.red;
            }
            if (
                match.alliances.red.team_keys == null ||
                match.alliances.red.team_keys.length == 0
            ) {
                match.alliances.red.team_keys =
                    fallback.alliances.red.team_keys;
            }
            if (match.alliances.blue == null) {
                match.alliances.blue = fallback.alliances.blue;
            }
            if (
                match.alliances.blue.team_keys == null ||
                match.alliances.blue.team_keys.length == 0
            ) {
                match.alliances.blue.team_keys =
                    fallback.alliances.blue.team_keys;
            }
            resolve(match);
        });
    };

    _this.getEvents = (year) => {
        return new Promise(async (resolve, reject) => {
            if (localStorage.getItem(`events::${year}`) != null) {
                resolve(JSON.parse(localStorage.getItem(`events::${year}`)));
                await _this.setEvents(year);
            } else {
                let set = await _this.setEvents(year);
                if (set) {
                    resolve(
                        JSON.parse(localStorage.getItem(`events::${year}`))
                    );
                } else {
                    resolve([]);
                }
            }
        });
    };

    let pendingFunctions = [];

    _this.clearPendingFunctions = () => {
        pendingFunctions = [];
    };

    _this.logPendingFunctions = () => {
        console.log(pendingFunctions);
    };

    _this.runPendingFunctions = () => {
        return new Promise(async (resolve, reject) => {
            await Promise.all(pendingFunctions.map((func) => func()));
            _this.clearPendingFunctions();
            resolve();
        });
    };

    _this.setData = (type, key, value) => {
        return new Promise(async (resolve, reject) => {
            if (type != null && key != null) {
                data[type][key] = value;
                resolve(true);
            }
            resolve(false);
            console.log(data);
        });
    };

    _this.random = () => {
        return `${Date.now()}::${parseInt(Math.random() * 1000000000).toString(
            16
        )}`;
    };

    _this.timerFormat = (milliseconds) => {
        let seconds = Math.floor(milliseconds / 1000);
        return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${
            seconds % 60
        }.${milliseconds % 1000 < 100 ? "0" : ""}${Math.floor(
            (milliseconds % 1000) / 10
        )}`;
    };

    _this.showLocationPopup = (index, options, locations, values, state) => {
        return new Promise(async (resolve, reject) => {
            locations = [...locations];
            values = [...values];
            let locationData = locations.map((loc, i) => {
                return {
                    value: values[i],
                    index: loc
                };
            });
            element.querySelector(".location-popup").innerHTML = `
				${options
                    .map((option) => {
                        let show = true;
                        if (option.show != null) {
                            if (option.show.type == "function") {
                                show = eval(option.show.definition)({
                                    ...state,
                                    index
                                })
                                    ? true
                                    : false;
                            } else {
                                show = option.show ? true : false;
                            }
                        }
                        if (!show) {
                            return "";
                        }
                        let tracks = [];
                        if (typeof option.tracks == "object") {
                            tracks = option.tracks;
                        }
                        return `
						<div data-option="${_this.escape(option.value)}">
							<h2>${option.label}</h2>
							${
                                option.type == "toggle"
                                    ? `<button class="toggle" data-type="${
                                          option.type
                                      }" data-value="${_this.escape(
                                          option.value
                                      )}">[${
                                          locationData.filter(
                                              (loc) =>
                                                  loc.value == option.value &&
                                                  loc.index == index
                                          ).length
                                      }/${
                                          locationData.filter(
                                              (loc) => loc.value == option.value
                                          ).length
                                      }] ${
                                          locationData.filter(
                                              (loc) =>
                                                  loc.value == option.value &&
                                                  loc.index == index
                                          ).length > 0
                                              ? "Deselect"
                                              : "Select"
                                      }</button>`
                                    : `<button data-increment="-1"${
                                          option.max
                                              ? ` data-max="${option.max}"`
                                              : ""
                                      } data-type="${
                                          option.type
                                      }" data-value="${_this.escape(
                                          option.value
                                      )}"><span>-</span></button>
							<h3>${
                                locationData.filter(
                                    (loc) =>
                                        loc.value == option.value &&
                                        loc.index == index
                                ).length
                            } here<br>${
                                          locationData.filter(
                                              (loc) =>
                                                  loc.value == option.value ||
                                                  tracks.includes(loc.value)
                                          ).length
                                      } total</h3>
							<button data-increment="1"${
                                option.max ? ` data-max="${option.max}"` : ""
                            } data-type="${
                                          option.type
                                      }" data-value="${_this.escape(
                                          option.value
                                      )}"><span>+</span></button>`
                            }
						</div>
					`;
                    })
                    .join("")}
				<button>Save</button>
			`;
            element.querySelector(".location-popup > button").onclick =
                async () => {
                    element.querySelector(".location-popup").style.display =
                        "none";
                    element.querySelector(".overlay").style.display = "none";
                    resolve(locationData);
                };
            element.querySelector(".overlay").onclick = async () => {
                element.querySelector(".location-popup").style.display = "none";
                element.querySelector(".overlay").style.display = "none";
                resolve(locationData);
            };
            let elements = element.querySelectorAll(
                ".location-popup > div > button"
            );
            for (let i = 0; i < elements.length; i++) {
                elements[i].onclick = async () => {
                    if (elements[i].getAttribute("data-type") == "toggle") {
                        if (elements[i].innerHTML.includes("Deselect")) {
                            let indexToRemove = locationData.findIndex(
                                (loc) =>
                                    loc.value ==
                                        elements[i].getAttribute(
                                            "data-value"
                                        ) && loc.index == index
                            );
                            if (indexToRemove > -1) {
                                locationData.splice(indexToRemove, 1);
                            }
                            elements[i].innerHTML = `[${
                                locationData.filter(
                                    (loc) =>
                                        loc.value ==
                                            elements[i].getAttribute(
                                                "data-value"
                                            ) && loc.index == index
                                ).length
                            }/${
                                locationData.filter(
                                    (loc) =>
                                        loc.value ==
                                        elements[i].getAttribute("data-value")
                                ).length
                            }] ${
                                locationData.filter(
                                    (loc) =>
                                        loc.value ==
                                            elements[i].getAttribute(
                                                "data-value"
                                            ) && loc.index == index
                                ).length > 0
                                    ? "Deselect"
                                    : "Select"
                            }`;
                        } else {
                            locationData.push({
                                value: elements[i].getAttribute("data-value"),
                                index: index
                            });
                            elements[i].innerHTML = `[1/${
                                locationData.filter(
                                    (loc) =>
                                        loc.value ==
                                        elements[i].getAttribute("data-value")
                                ).length
                            }] Deselect`;
                        }
                    } else {
                        let increment = parseInt(
                            elements[i].getAttribute("data-increment")
                        );
                        for (let j = 0; j < Math.abs(increment); j++) {
                            if (increment > 0) {
                                let max = elements[i].getAttribute("data-max");
                                if (max != null) {
                                    try {
                                        max = parseInt(max);
                                    } catch (err) {}
                                }
                                if (
                                    max == null ||
                                    isNaN(max) ||
                                    isNaN(parseInt(max)) ||
                                    max >
                                        locationData.filter(
                                            (loc) =>
                                                loc.value ==
                                                    elements[i].getAttribute(
                                                        "data-value"
                                                    ) && loc.index == index
                                        ).length
                                ) {
                                    locationData.push({
                                        value: elements[i].getAttribute(
                                            "data-value"
                                        ),
                                        index: index
                                    });
                                }
                            } else {
                                let indexToRemove = locationData.findIndex(
                                    (loc) =>
                                        loc.value ==
                                            elements[i].getAttribute(
                                                "data-value"
                                            ) && loc.index == index
                                );
                                if (indexToRemove > -1) {
                                    locationData.splice(indexToRemove, 1);
                                }
                            }
                        }
                    }

                    for (let j = 0; j < options.length; j++) {
                        let show = true;
                        if (options[j].show != null) {
                            if (options[j].show.type == "function") {
                                show = eval(options[j].show.definition)({
                                    ...state,
                                    index
                                })
                                    ? true
                                    : false;
                            } else {
                                show = options[j].show ? true : false;
                            }
                        }
                        let tracks = [];
                        if (typeof options[j].tracks == "object") {
                            tracks = options[j].tracks;
                        }
                        if (show) {
                            if (options[j].type != "toggle") {
                                element.querySelector(
                                    `.location-popup > div[data-option="${_this.escape(
                                        options[j].value
                                    )}"] > h3`
                                ).innerHTML = `${
                                    locationData.filter(
                                        (loc) =>
                                            loc.value == options[j].value &&
                                            loc.index == index
                                    ).length
                                } here<br>${
                                    locationData.filter(
                                        (loc) =>
                                            loc.value == options[j].value ||
                                            tracks.includes(loc.value)
                                    ).length
                                } total`;
                            }
                        }
                    }
                };
            }
            element.querySelector(".overlay").style.display = "block";
            element.querySelector(".location-popup").style.display = "flex";
        });
    };

    let fieldOrientation = 0;
    let fieldOrientationSet = false;

    document.addEventListener("scroll", (event) => {
        try {
            let theadElements = document.querySelectorAll("thead");
            for (let i = 0; i < theadElements.length; i++) {
                try {
                    if (theadElements[i].getBoundingClientRect().bottom < 150) {
                        theadElements[i].classList.add("fixed");
                    } else {
                        theadElements[i].classList.remove("fixed");
                    }
                } catch (err) {}
            }
        } catch (err) {}
    });

    _this.compileComponent = (
        eventCode,
        matchNumber,
        teamNumber,
        component = {}
    ) => {
        return new Promise(async (resolve, reject) => {
            let color = await _this.getTeamColor(
                eventCode,
                matchNumber,
                teamNumber
            );

            function getState(additional = {}) {
                return {
                    eventCode: eventCode,
                    matchNumber: matchNumber,
                    teamNumber: teamNumber,
                    color: color,
                    data: data,
                    ...additional
                };
            }

            let types = [
                "layout",
                "title",
                "header",
                "text",
                "locations",
                "pagebutton",
                "scorecount",
                "pagebar",
                "checkbox",
                "timer",
                "select",
                "textbox",
                "rating",
                "upload",
                "qrcode",
                "data"
            ];
            let type = component.type;
            if (!types.includes(type)) {
                type = "layout";
            }
            if (component.type == "layout") {
                let directions = [
                    "rows",
                    "columns",
                    "grid",
                    "preset",
                    "preset-manager"
                ];
                let direction = component.direction;
                let name = component.name;
                if (!directions.includes(direction)) {
                    direction = "rows";
                }
                let components = [];
                if (
                    component.components != null &&
                    component.components instanceof Array
                ) {
                    components = component.components;
                }
                let id;
                if (["preset-manager"].includes(direction)) {
                    id = _this.random();
                }
                pendingFunctions.push(async () => {
                    if (id) {
                        let manager = element.querySelector(
                            `[data-id="${_this.escape(id)}"]`
                        );
                        if (!manager) {
                            console.log("manager is not defined!");
                            return;
                        }
                        let children = manager.children;
                        for (let i = 1; i < children.length - 1; i++)
                            children[i].classList.add("none");
                    }
                });
                resolve(`
					<div ${
                        direction == "preset"
                            ? `class="${name}-preset preset" data-ref="${name}"`
                            : `class="component-layout-${direction}"`
                    } ${
                    direction == "preset-manager"
                        ? `data-id="${_this.escape(id)}"`
                        : ""
                }>
						${(
                            await Promise.all(
                                components.map((component) =>
                                    _this.compileComponent(
                                        eventCode,
                                        matchNumber,
                                        teamNumber,
                                        component
                                    )
                                )
                            )
                        ).join("")}
					</div>
				`);
            } else if (component.type == "title") {
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                resolve(
                    `<h1 class="component-title">${_this.escape(label)}</h1>`
                );
            } else if (component.type == "header") {
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                resolve(
                    `<h1 class="component-header">${_this.escape(label)}</h1>`
                );
            } else if (component.type == "text" || component.type == "text") {
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                resolve(
                    `<p class="component-text">${_this
                        .escape(label)
                        .replace(new RegExp("\n", "g"), "<br>")}</p>`
                );
            } else if (component.type == "separator") {
                let style = "solid";
                if (component.style != null) {
                    if (component.style.type == "function") {
                        style = eval(component.style.definition)(getState());
                    } else {
                        style = component.style.toString();
                    }
                }
                resolve(
                    `<div class="component-separator" style="border-top: 2.5px ${style} var(--contentColor);"></div>`
                );
            } else if (component.type == "locations") {
                let id = _this.random();
                let src = "";
                if (component.src != null) {
                    if (component.src.type == "function") {
                        src = eval(component.src.definition)(getState());
                    } else {
                        src = component.src.toString();
                    }
                }
                let rows = 1;
                if (typeof component.rows == "number") {
                    rows = component.rows;
                }
                let columns = 1;
                if (typeof component.columns == "number") {
                    columns = component.columns;
                }
                let orientation = 0;
                if (typeof component.orientation == "number") {
                    orientation = component.orientation;
                }
                let flip = true;
                if (typeof component.flip == "boolean") {
                    flip = component.flip;
                }
                let disabled = [];
                if (typeof component.disabled == "object") {
                    disabled = component.disabled;
                }
                let options = [];
                if (component.options instanceof Array) {
                    options = component.options;
                }
                let defaultValue = {
                    locations: [],
                    values: [],
                    counter: 0
                };
                if (typeof component.default == "object") {
                    defaultValue = component.default;
                }
                pendingFunctions.push(async () => {
                    await _this.setData(
                        "data",
                        component.data.locations,
                        checkNull(
                            data.data[component.data.locations],
                            defaultValue.locations
                        )
                    );
                    await _this.setData(
                        "data",
                        component.data.values,
                        checkNull(
                            data.data[component.data.values],
                            defaultValue.values
                        )
                    );
                    await _this.setData(
                        "counters",
                        component.data.counter,
                        checkNull(
                            data.counters[component.data.counter],
                            defaultValue.counter
                        )
                    );
                    if (flip) {
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"] > button`
                        ).onclick = async () => {
                            let grid = element.querySelector(
                                `[data-id="${_this.escape(
                                    id
                                )}"] > .component-locations-container > .grid`
                            );
                            if (
                                parseInt(
                                    grid.getAttribute("data-orientation")
                                ) == 0
                            ) {
                                grid.style.transform = "scaleX(-1) scaleY(-1)";
                                fieldOrientation = 1;
                                fieldOrientationSet = true;
                                grid.setAttribute("data-orientation", 1);
                            } else {
                                grid.style.transform = "";
                                fieldOrientation = 0;
                                fieldOrientationSet = true;
                                grid.setAttribute("data-orientation", 0);
                            }
                        };
                    }
                    let gridElements = element.querySelectorAll(
                        `[data-id="${_this.escape(
                            id
                        )}"] > .component-locations-container > .grid > div.grid-item`
                    );
                    for (let i = 0; i < gridElements.length; i++) {
                        if (!disabled.includes(i)) {
                            gridElements[i].onclick = async (e) => {
                                let result = await _this.showLocationPopup(
                                    parseInt(
                                        gridElements[i].getAttribute(
                                            "data-index"
                                        )
                                    ),
                                    options,
                                    checkNull(
                                        data.data[component.data.locations],
                                        defaultValue.locations
                                    ),
                                    checkNull(
                                        data.data[component.data.values],
                                        defaultValue.values
                                    ),
                                    getState()
                                );
                                if (result != null) {
                                    await _this.setData(
                                        "data",
                                        component.data.locations,
                                        result.map((entry) => entry.index)
                                    );
                                    await _this.setData(
                                        "data",
                                        component.data.values,
                                        result.map((entry) => entry.value)
                                    );
                                    await _this.setData(
                                        "counters",
                                        component.data.counter,
                                        result.length
                                    );
                                    for (
                                        let index = 0;
                                        index < rows * columns;
                                        index++
                                    ) {
                                        if (
                                            checkNull(
                                                data.data[
                                                    component.data.locations
                                                ],
                                                defaultValue.locations
                                            ).filter((loc) => loc == index)
                                                .length > 0
                                        ) {
                                            element
                                                .querySelector(
                                                    `[data-id="${_this.escape(
                                                        id
                                                    )}"] > .component-locations-container > .grid > div.grid-item[data-index="${_this.escape(
                                                        index
                                                    )}"]`
                                                )
                                                .classList.add("active");
                                        } else {
                                            element
                                                .querySelector(
                                                    `[data-id="${_this.escape(
                                                        id
                                                    )}"] > .component-locations-container > .grid > div.grid-item[data-index="${_this.escape(
                                                        index
                                                    )}"]`
                                                )
                                                .classList.remove("active");
                                        }
                                        let marker = "";
                                        if (component.marker != null) {
                                            if (
                                                component.marker.type ==
                                                "function"
                                            ) {
                                                let locs = checkNull(
                                                    data.data[
                                                        component.data.locations
                                                    ],
                                                    defaultValue.locations
                                                );
                                                let vals = checkNull(
                                                    data.data[
                                                        component.data.values
                                                    ],
                                                    defaultValue.values
                                                );
                                                let locations = [];
                                                for (
                                                    let j = 0;
                                                    j < locs.length;
                                                    j++
                                                ) {
                                                    if (locs[j] == index) {
                                                        locations.push({
                                                            location: locs[j],
                                                            value: vals[j]
                                                        });
                                                    }
                                                }
                                                marker = eval(
                                                    component.marker.definition
                                                )(getState({ locations }));
                                            } else {
                                                marker =
                                                    component.marker.toString();
                                            }
                                        }
                                        element.querySelector(
                                            `[data-id="${_this.escape(
                                                id
                                            )}"] > .component-locations-container > .grid > div.grid-item[data-index="${_this.escape(
                                                index
                                            )}"]`
                                        ).innerHTML = `<div class="marker">${marker}</div>`;
                                    }
                                }
                            };
                        }
                    }
                });
                let additionalClasses = [];
                if (rows > 5) {
                    additionalClasses.push("large-grid-y");
                }
                if (columns < 4) {
                    additionalClasses.push("small-grid-x");
                }
                resolve(`
					<div class="component-locations" data-id="${_this.escape(id)}">
						<div class="component-locations-container ${additionalClasses.join(" ")}">
							<div class="grid" data-orientation="${_this.escape(
                                fieldOrientationSet
                                    ? fieldOrientation
                                    : orientation
                            )}" style="grid-template-rows: repeat(${_this.escape(
                    rows
                )}, 1fr); grid-template-columns: repeat(${_this.escape(
                    columns
                )}, 1fr); background-size: cover; aspect-ratio: 61 / 52; background-image: url(${_this.escape(
                    src
                )});${
                    (fieldOrientationSet ? fieldOrientation : orientation) == 1
                        ? " transform: scaleX(-1) scaleY(-1);"
                        : ""
                }">
								${[...new Array(rows).keys()]
                                    .map((row, rowindex) => {
                                        return [...new Array(columns).keys()]
                                            .map((column, columnindex) => {
                                                let index =
                                                    rowindex * columns +
                                                    columnindex;
                                                let marker = "";
                                                if (component.marker != null) {
                                                    if (
                                                        component.marker.type ==
                                                        "function"
                                                    ) {
                                                        let locs = checkNull(
                                                            data.data[
                                                                component.data
                                                                    .locations
                                                            ],
                                                            defaultValue.locations
                                                        );
                                                        let vals = checkNull(
                                                            data.data[
                                                                component.data
                                                                    .values
                                                            ],
                                                            defaultValue.values
                                                        );
                                                        let locations = [];
                                                        for (
                                                            let j = 0;
                                                            j < locs.length;
                                                            j++
                                                        ) {
                                                            if (
                                                                locs[j] == index
                                                            ) {
                                                                locations.push({
                                                                    location:
                                                                        locs[j],
                                                                    value: vals[
                                                                        j
                                                                    ]
                                                                });
                                                            }
                                                        }
                                                        marker = eval(
                                                            component.marker
                                                                .definition
                                                        )(
                                                            getState({
                                                                locations
                                                            })
                                                        );
                                                    } else {
                                                        marker =
                                                            component.marker.toString();
                                                    }
                                                }
                                                return `<div class="grid-item${
                                                    checkNull(
                                                        data.data[
                                                            component.data
                                                                .locations
                                                        ],
                                                        defaultValue.locations
                                                    ).filter(
                                                        (loc) =>
                                                            loc ==
                                                            rowindex * columns +
                                                                columnindex
                                                    ).length > 0
                                                        ? ` active`
                                                        : ""
                                                }" style="grid-area: ${
                                                    rowindex + 1
                                                } / ${columnindex + 1} / ${
                                                    rowindex + 2
                                                } / ${columnindex + 2};${
                                                    disabled.includes(index)
                                                        ? ` cursor: not-allowed;`
                                                        : ""
                                                }" data-row="${rowindex}" data-column="${columnindex}" data-index="${index}"><div class="marker">${marker}</div></div>`;
                                            })
                                            .join("");
                                    })
                                    .join("")}
							</div>
						</div>
						${flip ? `<button>Flip</button>` : ""}
					</div>
				`);
            } else if (component.type == "scorecount") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let scores = [];
                if (component.scores instanceof Array) {
                    scores = component.scores;
                }
                let values = [];
                let locations = [];
                let dcounter = 0;

                if (component.data) {
                    values = checkNull(data.data[component.data.values], []);
                    locations = checkNull(
                        data.data[component.data.locations],
                        []
                    );
                    dcounter = checkNull(
                        data.counters[component.data.counter],
                        0
                    );
                }

                let scoreClick = (event, el) => {
                    if (!el.classList.contains("active"))
                        event.stopPropagation();
                    el.classList.add("active");
                };

                let outClick = (event, el) => {
                    if (!event.target.closest(".parent")) {
                        el.classList.remove("active");
                    }
                };

                let updateCounter = (tracker) => {
                    let counters = tracker.querySelectorAll(".additive");
                    let count = 0;
                    counters.forEach((counter) => {
                        count += parseInt(counter.innerText);
                    });
                    let tallycount = tracker.querySelector("div.tally");
                    if (tallycount) tallycount.innerText = count;
                    else {
                        console.log("doesnt have tally counter");
                        console.log(tracker);
                    }
                };

                const saveData = async () => {
                    await _this.setData(
                        "data",
                        component.data.locations,
                        locations
                    );
                    await _this.setData("data", component.data.values, values);
                    await _this.setData(
                        "counters",
                        component.data.counter,
                        dcounter
                    );
                };

                const handleIncrement = async (type, controlLabel) => {
                    // 2024
                    if (type.includes("speaker")) {
                        if (controlLabel === "Scored") values.push("ss");
                        else if (controlLabel === "Missed") values.push("sm");
                        else if (controlLabel === "Amplify") values.push("sa");
                        locations.push(1);
                    } else if (type.includes("amp")) {
                        if (controlLabel === "Scored") values.push("as");
                        else if (controlLabel === "Missed") values.push("am");
                        locations.push(0);
                    } else if (type.includes("trap")) {
                        if (controlLabel === "Scored") values.push("ts");
                        else if (controlLabel === "Missed") values.push("tm");
                        locations.push(2);
                    }

                    // 2025
                    if (type.includes("net")) {
                        if (controlLabel === "Scored") values.push("asn");
                        else if (controlLabel === "Missed") values.push("amn");
                        locations.push(4);
                    } else if (type.includes("processor")) {
                        if (controlLabel === "Scored") values.push("asp");
                        else if (controlLabel === "Missed") values.push("amp");
                        locations.push(5);
                    }
                    dcounter++;
                    await saveData();
                };

                const handleDecrement = async (type, controlLabel) => {
                    // 2024
                    if (type.includes("speaker")) {
                        if (controlLabel === "Scored")
                            removeLastEntry(values, "ss");
                        else if (controlLabel === "Missed")
                            removeLastEntry(values, "sm");
                        else if (controlLabel === "Amplify")
                            removeLastEntry(values, "sa");
                        removeLastEntry(locations, 1);
                    } else if (type.includes("amp")) {
                        if (controlLabel === "Scored")
                            removeLastEntry(values, "as");
                        else if (controlLabel === "Missed")
                            removeLastEntry(values, "am");
                        removeLastEntry(locations, 0);
                    } else if (type.includes("trap")) {
                        if (controlLabel === "Scored")
                            removeLastEntry(values, "ts");
                        else if (controlLabel === "Missed")
                            removeLastEntry(values, "tm");
                        removeLastEntry(locations, 2);
                    }

                    // 2025
                    if (type.includes("net")) {
                        if (controlLabel === "Scored")
                            removeLastEntry(values, "asn");
                        else if (controlLabel === "Missed")
                            removeLastEntry(values, "amn");
                        removeLastEntry(locations, 4);
                    } else if (type.includes("processor")) {
                        if (controlLabel === "Scored")
                            removeLastEntry(values, "asp");
                        else if (controlLabel === "Missed")
                            removeLastEntry(values, "amp");
                        removeLastEntry(locations, 5);
                    }

                    dcounter = Math.max(0, dcounter - 1);
                    await saveData();
                };

                const removeLastEntry = (array, value) => {
                    const index = array.lastIndexOf(value);
                    if (index !== -1) array.splice(index, 1);
                };

                const initCounters = (tracker, score, index) => {
                    const counters = tracker.querySelectorAll(
                        ".score-control .counter"
                    );
                    const tallyCount = tracker.querySelector(".tally");
                    let count = 0;
                    counters.forEach((counter, cInd) => {
                        let cLabel = score.controls[cInd]?.label || "";
                        let mval = "";
                        // 2024
                        if (score.class.includes("speaker")) {
                            if (cLabel === "Scored") mval = "ss";
                            else if (cLabel === "Missed") mval = "sm";
                            else if (cLabel === "Amplify") mval = "sa";
                        } else if (score.class.includes("amp")) {
                            if (cLabel === "Scored") mval = "as";
                            else if (cLabel === "Missed") mval = "am";
                        } else if (score.class.includes("trap")) {
                            if (cLabel === "Scored") mval = "ts";
                            else if (cLabel === "Missed") mval = "tm";
                        }

                        // 2025
                        if (score.class.includes("net")) {
                            if (cLabel === "Scored") mval = "asn";
                            else if (cLabel === "Missed") mval = "amn";
                        } else if (score.class.includes("processor")) {
                            if (cLabel === "Scored") mval = "asp";
                            else if (cLabel === "Missed") mval = "amp";
                        }

                        const mc = values.filter((val) => val === mval).length;
                        counter.innerText = mc;
                        if (score.controls[cInd].additive) count += mc;
                    });
                    if (tallyCount) tallyCount.innerText = count;
                };

                let htmlcont = "";

                component.scores.forEach((score, index) => {
                    if (score.disabled) return;

                    let htmlcontrol = "";
                    score.controls.forEach((control) => {
                        let controlId = `${id}-control-${index}-${control.label}`;
                        htmlcontrol += `
                            <div class="score-control" id="${controlId}">
                                <div>${control.subtract}</div>
                                <div>
                                    <div class="counter ${
                                        control.additive ? "additive" : ""
                                    }">0</div>
                                    <div class="subtext">${_this.escape(
                                        control.label
                                    )}</div>
                                </div>
                                <div>${control.add}</div>
                            </div>`;

                        pendingFunctions.push(async () => {
                            const controlElement =
                                document.getElementById(controlId);
                            const plus =
                                controlElement.querySelector(
                                    "div:nth-child(3)"
                                );
                            const minus =
                                controlElement.querySelector(
                                    "div:nth-child(1)"
                                );
                            plus.addEventListener("click", (event) => {
                                event.stopPropagation();
                                let counter =
                                    controlElement.querySelector(".counter");
                                let curcount = parseInt(counter.innerText) || 0;
                                if (
                                    control.max !== undefined &&
                                    curcount >= control.max
                                )
                                    return;
                                counter.innerText = curcount + 1;
                                handleIncrement(score.class, control.label);
                            });
                            minus.addEventListener("click", (event) => {
                                event.stopPropagation();
                                let counter =
                                    controlElement.querySelector(".counter");
                                let curcount = parseInt(counter.innerText) || 0;
                                if (curcount <= 0) return;
                                counter.innerText = curcount - 1;
                                handleDecrement(score.class, control.label);
                            });
                        });
                    });

                    htmlcont += `
                        <div style="width: calc(100% / ${
                            component.scores.length
                        });" class="${score.class} ${
                        score.disabled ? "disabled" : ""
                    }">
                            <div class="close">${score.close}</div>
                            <div class="front-group">
                                <div class="score-label">
                                    <div class="icon">${score.icon}</div>
                                    <div class="subtitle">${score.name}</div>
                                </div>
                                <div class="tally">0</div>
                            </div>
                            ${
                                !score.disabled
                                    ? `<div class="score-controls parent">${htmlcontrol}</div>`
                                    : ""
                            }
                        </div>`;

                    pendingFunctions.push(async () => {
                        const tracker = document.querySelector(
                            `[data-id='${id}'] .${score.class}`
                        );
                        if (tracker) initCounters(tracker, score, index);
                    });
                });

                pendingFunctions.push(async () => {
                    let trackers = document.querySelectorAll(
                        `div[data-id='${id}'] > div:not(.disabled)`
                    );
                    trackers.forEach((tracker) => {
                        tracker.addEventListener("click", (event) =>
                            scoreClick(event, tracker)
                        );
                        document.addEventListener("click", (event) =>
                            outClick(event, tracker)
                        );
                        let timers = tracker.querySelectorAll(
                            ".score-controls > .score-control"
                        );
                        timers.forEach((timer) => {
                            let minus = timer.children[0];
                            let plus = timer.children[2];
                            plus.addEventListener("click", () => {
                                updateCounter(tracker);
                            });
                            minus.addEventListener("click", () => {
                                updateCounter(tracker);
                            });
                        });
                    });

                    await saveData();
                });

                resolve(
                    `<div class="component-score-counter" data-id="${_this.escape(
                        id
                    )}">${htmlcont}</div>`
                );
            } else if (component.type == "pagebutton") {
                let id = _this.random();
                let page = -1;
                if (typeof component.page == "number") {
                    page = component.page;
                }
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                pendingFunctions.push(async () => {
                    element.querySelector(
                        `[data-id="${_this.escape(id)}"]`
                    ).onclick = async () => {
                        let timerNames = Object.keys(timers);
                        for (let i = 0; i < timerNames.length; i++) {
                            clearInterval(timers[timerNames[i]].interval);
                            timers[timerNames[i]].running = false;
                            timers[timerNames[i]].restricted = false;
                            await _this.setData(
                                "timers",
                                component.data,
                                timers[timerNames[i]].milliseconds
                            );
                        }

                        await _this.showMatchPage(
                            element
                                .querySelector(
                                    `[data-id="${_this.escape(id)}"]`
                                )
                                .getAttribute("data-page"),
                            eventCode,
                            matchNumber,
                            teamNumber
                        );
                    };
                });
                resolve(
                    `<button class="component-pagebutton" data-id="${_this.escape(
                        id
                    )}" data-page="${page}">${label}</button>`
                );
            } else if (component.type == "pagebar") {
                let id = _this.random();
                if (typeof component.page == "number") {
                    page = component.page;
                }
                let label = "";
                let tabs = component.options;
                if (!tabs) tabs = [];
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                pendingFunctions.push(async () => {
                    let children = element.querySelectorAll(
                        `[data-id="${_this.escape(id)}"] > div`
                    );
                    for (let i = 0; i < children.length; ++i) {
                        let tab = tabs[i];
                        children[i].onclick = async () => {
                            let manager = children[i].closest(
                                ".component-layout-preset-manager"
                            );
                            let refers = children[i].getAttribute("data-ref");
                            let presets = manager.children;
                            children.forEach((child) => {
                                child.classList.remove("active");
                            });
                            children[i].classList.add("active");
                            if (presets && presets.length > 0) {
                                for (let j = 0; j < presets.length - 1; ++j) {
                                    if (
                                        presets[j].getAttribute("data-ref") ==
                                        refers
                                    ) {
                                        presets[j].classList.remove("none");
                                    } else {
                                        presets[j].classList.add("none");
                                    }
                                }
                            }
                        };
                    }
                });
                resolve(
                    `<aside id="controls" class="component-pagebar" data-id="${_this.escape(
                        id
                    )}">
                        ${tabs
                            .map((tab, i) => {
                                return `<div data-ref="${_this.escape(
                                    tab.refers
                                )}" class="${_this.escape(tab.refers)} ${
                                    tab.active ? "active" : ""
                                }">
                                ${tab.html}
                                <p>${_this.escape(tab.name)}</p>
                            </div>`;
                            })
                            .join("")}
                    </aside>`
                );
                /* } else if (component.type == "checkbox") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState()) + "<br>";
                    } else {
                        label = component.label.toString() + "<br>";
                    }
                }
                let defaultValue = false;
                if (typeof component.default == "boolean") {
                    defaultValue = component.default;
                }
                pendingFunctions.push(async () => {
                    element.querySelector(
                        `[data-id="${_this.escape(id)}"] > input`
                    ).oninput = async () => {
                        await _this.setData(
                            "abilities",
                            component.data,
                            element.querySelector(
                                `[data-id="${_this.escape(id)}"] > input`
                            ).checked
                        );
                    };
                    await _this.setData(
                        "abilities",
                        component.data,
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"] > input`
                        ).checked
                    );
                });
                resolve(`
					<div class="component-checkbox" data-id="${_this.escape(id)}">
						<input type="checkbox" id="${_this.escape(id)}" ${
                    checkNull(data.abilities[component.data], defaultValue)
                        ? "checked"
                        : ""
                } />
						<span class="checkmark"></span>
						<label for="${_this.escape(id)}">${label}</label>
					</div>
				`); */
            } else if (component.type == "checkbox") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label =
                            eval(component.label.definition)(getState()) +
                            "<br>";
                    } else {
                        label = component.label.toString();
                    }
                }
                let defaultValue = false;
                if (typeof component.default == "boolean") {
                    defaultValue = component.default;
                }
                if (checkboxes[component.data] == null) {
                    checkboxes[component.data] = {};
                    checkboxes[component.data].elements = [];
                }
                checkboxes[component.data].elements.push(id);
                pendingFunctions.push(async () => {
                    const updateUI = () => {
                        checkboxes[component.data].elements.forEach(
                            (checkId) => {
                                const checkEl = element.querySelector(
                                    `[data-id="${_this.escape(
                                        checkId
                                    )}"] > input`
                                );
                                if (checkEl) {
                                    checkEl.checked = checkNull(
                                        data.abilities[component.data],
                                        defaultValue
                                    );
                                }
                            }
                        );
                    };

                    element.querySelector(
                        `[data-id="${_this.escape(id)}"] > input`
                    ).oninput = async () => {
                        await _this.setData(
                            "abilities",
                            component.data,
                            element.querySelector(
                                `[data-id="${_this.escape(id)}"] > input`
                            ).checked
                        );
                        updateUI();
                    };
                    await _this.setData(
                        "abilities",
                        component.data,
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"] > input`
                        ).checked
                    );
                    updateUI();
                });
                resolve(`
					<div class="component-toggle" data-id="${_this.escape(id)}">
                        <p>${_this.escape(label)}</p>
						<input type="checkbox" id="${_this.escape(id)}" ${
                    checkNull(data.abilities[component.data], defaultValue)
                        ? "checked"
                        : ""
                } />
						<label for="${_this.escape(id)}"></label>
					</div>
				`);
                /* } else if (component.type == "timer") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let name = "";
                if (component.name != null) {
                    name = component.name.toString();
                }
                let restricts = [];
                if (component.restricts instanceof Array) {
                    restricts = component.restricts;
                }
                let defaultValue = 0;
                if (typeof component.default == "number") {
                    defaultValue = component.default;
                }
                if (timers[name] == null) {
                    timers[name] = {};
                    timers[name].running = false;
                    timers[name].restricted = false;
                }
                if (timers[name].milliseconds == null) {
                    timers[name].milliseconds = defaultValue;
                }
                timers[name].id = id;
                pendingFunctions.push(async () => {
                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] > .button-container > button.minus`
                    ).onclick = async () => {
                        if (timers[name].milliseconds > 1000) {
                            timers[name].milliseconds -= 1000;
                        } else {
                            timers[name].milliseconds = 0;
                        }
                        if (timers[name].milliseconds < 0) {
                            timers[name].milliseconds = 0;
                        }
                        await _this.setData(
                            "timers",
                            component.data,
                            timers[name].milliseconds
                        );
                        element.querySelector(
                            `[data-id="${_this.escape(
                                timers[name].id
                            )}"] > h2 > span`
                        ).innerHTML = _this.timerFormat(
                            data.timers[component.data]
                        );
                    };
                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] > .button-container > button.plus`
                    ).onclick = async () => {
                        timers[name].milliseconds += 1000;
                        await _this.setData(
                            "timers",
                            component.data,
                            timers[name].milliseconds
                        );
                        element.querySelector(
                            `[data-id="${_this.escape(
                                timers[name].id
                            )}"] > h2 > span`
                        ).innerHTML = _this.timerFormat(
                            data.timers[component.data]
                        );
                    };
                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] > .button-container > button.timer`
                    ).onclick = async () => {
                        if (timers[name].running) {
                            timers[name].running = false;
                            clearInterval(timers[name].interval);
                            await _this.setData(
                                "timers",
                                component.data,
                                timers[name].milliseconds
                            );
                            element.querySelector(
                                `[data-id="${_this.escape(
                                    timers[name].id
                                )}"] > h2 > span`
                            ).innerHTML = _this.timerFormat(
                                data.timers[component.data]
                            );
                            element.querySelector(
                                `[data-id="${_this.escape(
                                    timers[name].id
                                )}"] > .button-container > button.timer`
                            ).innerHTML = "<i class='fa'>&#xf04b;</i>";
                            for (let i = 0; i < restricts.length; i++) {
                                if (timers[restricts[i]] == null) {
                                    timers[restricts[i]] = {};
                                    timers[restricts[i]].running = false;
                                    timers[restricts[i]].restricted = false;
                                }
                                timers[restricts[i]].restricted = false;
                                let button = element.querySelector(
                                    `[data-id="${_this.escape(
                                        timers[restricts[i]].id
                                    )}"] > .button-container > button.timer`
                                );
                                if (
                                    timers[restricts[i]].id != null &&
                                    button != null
                                ) {
                                    button.disabled = false;
                                }
                            }
                        } else {
                            for (let i = 0; i < restricts.length; i++) {
                                if (timers[restricts[i]] == null) {
                                    timers[restricts[i]] = {};
                                    timers[restricts[i]].running = false;
                                    timers[restricts[i]].restricted = false;
                                }
                                if (
                                    timers[restricts[i]].id != null &&
                                    element.querySelector(
                                        `[data-id="${_this.escape(
                                            timers[restricts[i]].id
                                        )}"] > .button-container > button.timer`
                                    ) != null
                                ) {
                                    element.querySelector(
                                        `[data-id="${_this.escape(
                                            timers[restricts[i]].id
                                        )}"] > .button-container > button.timer`
                                    ).disabled = true;
                                }
                                timers[restricts[i]].restricted = true;
                            }
                            timers[name].running = true;
                            timers[name].interval = setInterval(async () => {
                                timers[name].milliseconds += 50;
                                await _this.setData(
                                    "timers",
                                    component.data,
                                    timers[name].milliseconds
                                );
                                let text = element.querySelector(
                                    `[data-id="${_this.escape(
                                        timers[name].id
                                    )}"] > h2 > span`
                                );
                                if (text != null) {
                                    text.innerHTML = _this.timerFormat(
                                        data.timers[component.data]
                                    );
                                }
                            }, 50);
                            element.querySelector(
                                `[data-id="${_this.escape(
                                    timers[name].id
                                )}"] > .button-container > button.timer`
                            ).innerHTML = '<i class="fa">&#xf04c;</i>';
                        }
                    };
                    await _this.setData(
                        "timers",
                        component.data,
                        timers[name].milliseconds
                    );
                });
                resolve(`
					<div class="component-timer" data-id="${_this.escape(id)}">
						<h2>${_this.escape(label)}: <span>${_this.timerFormat(
                    checkNull(data.timers[component.data], defaultValue)
                )}</span></h2>
						<div class="button-container">
							<button class="minus"><span>-</span></button>
							<button class="timer" ${
                                checkNull(
                                    checkNull(timers[name], {}).restricted,
                                    false
                                )
                                    ? "disabled"
                                    : ""
                            }>${
                    checkNull(checkNull(timers[name], {}).running, false)
                        ? '<i class="fa">&#xf04c;</i>'
                        : '<i class="fa">&#xf04b;</i>'
                }</button>
							<button class="plus"><span>+</span></button>
						</div>
					</div>
				`); */
            } else if (component.type == "timer") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let name = "";
                if (component.name != null) {
                    name = component.name.toString();
                }
                let restricts = [];
                if (component.restricts instanceof Array) {
                    restricts = component.restricts;
                }
                let defaultValue = 0;
                if (typeof component.default == "number") {
                    defaultValue = component.default;
                }
                if (timers[name] == null) {
                    timers[name] = {};
                    timers[name].running = false;
                    timers[name].restricted = false;
                    timers[name].elements = [];
                }
                if (timers[name].milliseconds == null) {
                    timers[name].milliseconds = defaultValue;
                }
                timers[name].elements.push(id);
                pendingFunctions.push(async () => {
                    const updateUI = () => {
                        timers[name].elements.forEach((timerId) => {
                            const timeElement = element.querySelector(
                                `[data-id="${_this.escape(timerId)}"] p.time`
                            );
                            if (timeElement) {
                                timeElement.innerHTML = _this.timerFormat(
                                    timers[name].milliseconds
                                );
                            }
                        });
                    };
                    const updateButtons = (running) => {
                        timers[name].elements.forEach((timerId) => {
                            const playButton = element.querySelector(
                                `[data-id="${_this.escape(
                                    timerId
                                )}"] div.controls > div.play`
                            );
                            if (playButton) {
                                playButton.children[0].classList.toggle(
                                    "none",
                                    running
                                );
                                playButton.children[1].classList.toggle(
                                    "none",
                                    !running
                                );
                            }
                        });
                    };

                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] div.controls > div.minus`
                    ).onclick = async () => {
                        if (timers[name].milliseconds > 1000) {
                            timers[name].milliseconds -= 1000;
                        } else {
                            timers[name].milliseconds = 0;
                        }
                        if (timers[name].milliseconds < 0) {
                            timers[name].milliseconds = 0;
                        }
                        updateUI();
                        await _this.setData(
                            "timers",
                            component.data,
                            timers[name].milliseconds
                        );
                    };
                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] div.controls > div.plus`
                    ).onclick = async () => {
                        timers[name].milliseconds += 1000;
                        updateUI();
                        await _this.setData(
                            "timers",
                            component.data,
                            timers[name].milliseconds
                        );
                    };
                    element.querySelector(
                        `[data-id="${_this.escape(
                            id
                        )}"] div.controls > div.play`
                    ).onclick = async () => {
                        if (timers[name].running) {
                            timers[name].running = false;
                            clearInterval(timers[name].interval);
                            await _this.setData(
                                "timers",
                                component.data,
                                timers[name].milliseconds
                            );
                            updateButtons(false);
                            restricts.forEach((name) => {
                                if (!timers[name]) {
                                    timers[name] = {
                                        running: false,
                                        restricted: false
                                    };
                                }
                                timers[name].restricted = false;
                                timers[name].elements.forEach((timerId) => {
                                    const button = element.querySelector(
                                        `[data-id="${_this.escape(
                                            timerId
                                        )}"] div.controls > div.play`
                                    );
                                    if (button) {
                                        button.classList.remove("disabled");
                                    }
                                });
                            });
                        } else {
                            restricts.forEach((name) => {
                                if (!timers[name]) {
                                    timers[name] = {
                                        running: false,
                                        restricted: false
                                    };
                                }
                                timers[name].restricted = true;
                                timers[name].elements.forEach((timerId) => {
                                    const button = element.querySelector(
                                        `[data-id="${_this.escape(
                                            timerId
                                        )}"] div.controls > div.play`
                                    );
                                    if (button) {
                                        button.classList.add("disabled");
                                    }
                                });
                            });
                            timers[name].running = true;
                            timers[name].interval = setInterval(async () => {
                                timers[name].milliseconds += 50;
                                updateUI();
                                await _this.setData(
                                    "timers",
                                    component.data,
                                    timers[name].milliseconds
                                );
                                let text = element.querySelector(
                                    `[data-id="${_this.escape(
                                        timers[name].id
                                    )}"] p.time`
                                );
                                if (text != null) {
                                    text.innerHTML = _this.timerFormat(
                                        data.timers[component.data]
                                    );
                                }
                            }, 50);
                            updateButtons(true);
                        }
                    };
                    await _this.setData(
                        "timers",
                        component.data,
                        timers[name].milliseconds
                    );
                    updateUI();
                });
                resolve(`
					<div class="component-clock" data-id="${_this.escape(id)}">
                        <div>
                            <p>${_this.escape(label)}</p>
                            <div><p class="time">${_this.timerFormat(
                                checkNull(
                                    data.timers[component.data],
                                    defaultValue
                                )
                            )}</p></div>
                        </div>
                        <div class="controls">
                            <div class="minus">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                            </div>
                            <div class="play" ${
                                checkNull(
                                    checkNull(timers[name], {}).restricted,
                                    false
                                )
                                    ? "disabled"
                                    : ""
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                                <svg class="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>
                            </div>
                            <div class="plus">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                            </div>
                        </div>
					</div>
				`);
                /* } else if (component.type == "select") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let defaultValue = 0;
                if (typeof component.default == "number") {
                    defaultValue = component.default;
                }
                let options = [];
                if (component.options instanceof Array) {
                    options = component.options;
                }
                pendingFunctions.push(async () => {
                    element.querySelector(
                        `[data-id="${_this.escape(id)}"] > select`
                    ).oninput = async () => {
                        await _this.setData(
                            "abilities",
                            component.data,
                            parseInt(
                                element.querySelector(
                                    `[data-id="${_this.escape(id)}"] > select`
                                ).value
                            )
                        );
                    };
                    await _this.setData(
                        "abilities",
                        component.data,
                        parseInt(
                            element.querySelector(
                                `[data-id="${_this.escape(id)}"] > select`
                            ).value
                        )
                    );
                });
                resolve(`
					<div class="component-select" data-id="${_this.escape(id)}">
						<h2>${_this.escape(label)}</h2>
						<select>
							${options.map((option, index) => {
                                return `<option value="${index}" ${
                                    index ==
                                    checkNull(
                                        data.abilities[component.data],
                                        defaultValue
                                    )
                                        ? "selected"
                                        : ""
                                }>${_this.escape(option.label)}</option>`;
                            })}
						</select>
					</div>
				`); */
            } else if (component.type == "select") {
                let id = _this.random();
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let defaultValue = 0;
                if (typeof component.default == "number") {
                    defaultValue = component.default;
                }
                let options = [];
                if (component.options instanceof Array) {
                    options = component.options;
                }
                pendingFunctions.push(async () => {
                    element.querySelector(
                        `[data-id="${_this.escape(id)}"] > select`
                    ).oninput = async () => {
                        let n = parseInt(
                            element.querySelector(
                                `[data-id="${_this.escape(id)}"] > select`
                            ).value
                        );
                        if (n != -1) {
                            await _this.setData("abilities", component.data, n);
                        }
                    };
                    await _this.setData(
                        "abilities",
                        component.data,
                        parseInt(
                            element.querySelector(
                                `[data-id="${_this.escape(id)}"] > select`
                            ).value
                        )
                    );
                });
                resolve(`
					<div class="component-dropdown" data-id="${_this.escape(id)}">
						<select>
							${options.map((option, index) => {
                                return `<option value="${index}" ${
                                    index ==
                                    checkNull(
                                        data.abilities[component.data],
                                        defaultValue
                                    )
                                        ? "selected"
                                        : ""
                                }>${_this.escape(label)}: ${_this.escape(
                                    option.label
                                )}</option>`;
                            })}
						</select>
					</div>
				`);
                /* } else if (component.type == "textbox") {
                let id = _this.random();
                let placeholder = "";
                if (component.placeholder != null) {
                    placeholder = component.placeholder.toString();
                }
                let defaultValue = "";
                if (component.default != null) {
                    defaultValue = component.default.toString();
                }
                let visibility = false;
                function showOverlay() {
                    overlayShown = true;
                    if (overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "block";
                    }
                }
                function hideOverlay() {
                    overlayShown = false;
                    if (!overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "none";
                    }
                }
                pendingFunctions.push(async () => {
                    const textarea = element.querySelector(`[data-id="${_this.escape(id)}"] > div`);
                    const toggle = element.querySelector(`[data-id="${_this.escape(id)}"] button`);
                    textarea.style.display = visibility ? "block" : "none";
                    toggle.onclick = () => {
                        visibility = !visibility;
                        textarea.style.display = visibility ? "block" : "none";
                        if (visibility) {
                            showOverlay();
                        } else {
                            hideOverlay();
                        }
                    };
                    textarea.oninput = async () => {
                        await _this.setData(
                            "data",
                            component.data,
                            textarea.value
                        );
                    };
                    await _this.setData(
                        "data",
                        component.data,
                        textarea.value
                    );
                });
                resolve(
                    `<div class="component-textbox" data-id="${_this.escape(id)}">
                        <button class="component-notesbutton" type="button">Comments</button>
                        <div>
                            <h2>Notes</h2>
                            <textarea class="component-textbox" placeholder="${_this.escape(
                                placeholder
                            )}" data-id="${_this.escape(id)}">${_this.escape(
                                checkNull(data.data[component.data], defaultValue)
                            )}</textarea>
                        </div>
                    </div>`
                ); */
            } else if (component.type == "textbox") {
                let id = _this.random();
                let placeholder = "";
                if (component.placeholder != null) {
                    placeholder = component.placeholder.toString();
                }
                let defaultValue = "";
                if (component.default != null) {
                    defaultValue = component.default.toString();
                }
                let visibility = false;
                function showOverlay() {
                    overlayShown = true;
                    if (overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "block";
                    }
                }
                function hideOverlay() {
                    overlayShown = false;
                    if (!overlayShown) {
                        element.querySelector(".overlay").style.display =
                            "none";
                    }
                }
                pendingFunctions.push(async () => {
                    const textarea = element.querySelector(
                        `[data-id="${_this.escape(id)}"] textarea`
                    );
                    textarea.oninput = async () => {
                        await _this.setData(
                            "data",
                            component.data,
                            textarea.value
                        );
                    };
                    await _this.setData("data", component.data, textarea.value);
                });
                resolve(
                    `<div class="component-textarea" data-id="${_this.escape(
                        id
                    )}">
                        <p>Comments</p>
                        <p class="subtext">Scoring ability? Stability? Fouls? Issues?</p>
                        <p class="subtext">Team Number? (if practice match)</p>
                        <textarea data-id="${_this.escape(
                            id
                        )}" placeholder="${_this.escape(
                        placeholder
                    )}">${_this.escape(
                        checkNull(data.data[component.data], defaultValue)
                    )}</textarea>
                    </div>`
                );
            } else if (component.type == "rating") {
                let id = _this.random();
                let defaultValue = "";
                if (component.default != null) {
                    defaultValue = component.default.toString();
                } else {
                    defaultValue = "0";
                }
                let label = "";
                if (component.label != null) {
                    if (component.label.type == "function") {
                        label = eval(component.label.definition)(getState());
                    } else {
                        label = component.label.toString();
                    }
                }
                let src = [];
                if (component.src != null) {
                    if (component.src.type == "function") {
                        src = eval(component.src.definition)(getState());
                    } else {
                        src = component.src;
                    }
                }
                if (data.ratings[component.data]) {
                    defaultValue = data.ratings[component.data];
                }
                pendingFunctions.push(async () => {
                    var sliders = document.querySelectorAll(
                        `[data-id="${id}"] > div`
                    );
                    var ranges = document.querySelectorAll(
                        `[data-id="${id}"] > div > input`
                    );
                    var values = document.querySelectorAll(
                        `[data-id="${id}"] > div > span`
                    );

                    sliders.forEach((slider) => {
                        values.forEach((vel) => {
                            vel.innerHTML = parseInt(defaultValue) + 1;
                        });

                        ranges.forEach(async (rel) => {
                            rel.value = parseInt(defaultValue) + 1;
                            rel.addEventListener("input", async function () {
                                var vel = this.nextElementSibling;
                                vel.innerHTML = this.value;

                                let val = rel.value - 1;
                                if (val < 0) val = 0;
                                if (val > 4) val = 4;
                                await _this.setData(
                                    "ratings",
                                    component.data,
                                    val
                                );
                            });
                        });
                    });

                    await _this.setData(
                        "ratings",
                        component.data,
                        parseInt(defaultValue)
                    );
                });
                resolve(
                    `<div class="component-rating" data-id="${_this.escape(
                        id
                    )}">
                        <h2>${_this.escape(label)}</h2>
                        <div>
                            <input class="range-slider" type="range" value="1" min="1" max="5" step="1">
                            <span class="range-span">1</span>
                        </div>
                    </div>`
                );
            } else if (component.type == "upload") {
                let id = _this.random();
                pendingFunctions.push(async () => {
                    try {
                        let formatted = _this.formatData(
                            eventCode,
                            matchNumber,
                            teamNumber,
                            data
                        );

                        const prepareBox = element.querySelector(
                            "[data-status='prepare']"
                        );
                        prepareBox.classList.remove("loading");
                        prepareBox.classList.add("success");
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"]`
                        ).innerHTML += `<div class="status-box loading" data-status="upload">Uploading</div>`;
                        let upload = await (
                            await fetch(
                                `/api/v1/scouting/entry/add/${encodeURIComponent(
                                    eventCode
                                )}/${encodeURIComponent(
                                    matchNumber
                                )}/${encodeURIComponent(
                                    teamNumber
                                )}/${encodeURIComponent(color)}`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json;charset=UTF-8"
                                    },
                                    body: JSON.stringify(formatted)
                                }
                            )
                        ).json();
                        if (upload.success) {
                            const uploadBox = element.querySelector(
                                "[data-status='upload']"
                            );
                            uploadBox.classList.remove("loading");
                            uploadBox.classList.add("success");

                            element.querySelector(
                                `[data-id="${_this.escape(id)}"]`
                            ).innerHTML += `<div class="status-box loading" data-status="verify">Verifying</div>`;
                            let stringified = _this.stringifyFormatted(
                                eventCode,
                                matchNumber,
                                teamNumber,
                                color,
                                formatted
                            );
                            let hash = _this.hash(stringified);
                            let verify = await (
                                await fetch(
                                    `/api/v1/scouting/entry/verify/${encodeURIComponent(
                                        hash
                                    )}`
                                )
                            ).json();
                            if (verify.success && verify.body.verified) {
                                const verifyBox = element.querySelector(
                                    "[data-status='verify']"
                                );
                                verifyBox.classList.remove("loading");
                                verifyBox.classList.add("success");

                                let incentives = [];
                                if (
                                    upload.body.xp -
                                        upload.body.accuracyBoosters.xp >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.xp -
                                            upload.body.accuracyBoosters.xp
                                        } XP`
                                    );
                                }
                                if (
                                    upload.body.nuts -
                                        upload.body.accuracyBoosters.nuts >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.nuts -
                                            upload.body.accuracyBoosters.nuts
                                        } Nuts`
                                    );
                                }
                                if (
                                    upload.body.bolts -
                                        upload.body.accuracyBoosters.bolts >
                                    0
                                ) {
                                    incentives.push(
                                        `+${
                                            upload.body.bolts -
                                            upload.body.accuracyBoosters.bolts
                                        } Bolts`
                                    );
                                }

                                let offset = 0;
                                if (incentives.length > 0) {
                                    offset = 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            `[data-id="${_this.escape(id)}"]`
                                        ).innerHTML += `<div class="status-box success" data-status="verify">${incentives.join(
                                            ", "
                                        )}</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.xp > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            `[data-id="${_this.escape(id)}"]`
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.xp} XP (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.nuts > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            `[data-id="${_this.escape(id)}"]`
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.nuts} Nuts (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                if (upload.body.accuracyBoosters.bolts > 0) {
                                    offset += 100;
                                    setTimeout(() => {
                                        element.querySelector(
                                            `[data-id="${_this.escape(id)}"]`
                                        ).innerHTML += `<div class="status-box success" data-status="verify">+${upload.body.accuracyBoosters.bolts} Bolts (Accuracy Boost)</div>`;
                                    }, offset);
                                }

                                setTimeout(() => {
                                    element.querySelector(
                                        `[data-id="${_this.escape(id)}"]`
                                    ).innerHTML += `<h3 class="green">Success!</h3>`;
                                    jsConfetti.addConfetti();
                                    _this.updateIncentives(upload.body);
                                }, offset);
                            } else {
                                console.log(stringified);
                                const verifyBox = element.querySelector(
                                    "[data-status='verify']"
                                );
                                verifyBox.classList.remove("loading");
                                verifyBox.classList.add("error");

                                element.querySelector(
                                    `[data-id="${_this.escape(id)}"]`
                                ).innerHTML += `<h3 class="red">${
                                    verify.error ||
                                    "Unable to verify upload completion."
                                }</h3>`;
                            }
                        } else {
                            const uploadBox = element.querySelector(
                                "[data-status='upload']"
                            );
                            uploadBox.classList.remove("loading");
                            uploadBox.classList.add("error");

                            element.querySelector(
                                `[data-id="${_this.escape(id)}"]`
                            ).innerHTML += `<h3 class="red">${
                                upload.error || "Unknown error."
                            }</h3>`;
                        }
                    } catch (err) {
                        // console.error(err);
                        const uploadBox = element.querySelector(
                            "[data-status='upload']"
                        );
                        uploadBox.classList.remove("loading");
                        uploadBox.classList.add("error");
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"]`
                        ).innerHTML += `<h3 class="red">Could not connect to the server.</h3>`;
                    }
                });
                resolve(
                    `<div class="component-upload" data-id="${_this.escape(
                        id
                    )}">
                        <div class="status-box loading" data-status="prepare">Preparing</div>
                    </div>`
                );
            } else if (component.type == "qrcode") {
                let id = _this.random();
                let code = JSON.stringify({
                    ec: eventCode,
                    mn: matchNumber,
                    tn: teamNumber,
                    tc: color,
                    au: config.account.username,
                    at: config.account.team,
                    d: data.data,
                    a: data.abilities,
                    c: data.counters,
                    t: data.timers,
                    r: data.ratings
                });
                let chunkLength = 20;
                if (typeof component.chunkLength == "number") {
                    chunkLength = component.chunkLength;
                }
                let interval = 500;
                if (typeof component.interval == "number") {
                    interval = component.interval;
                }
                pendingFunctions.push(async () => {
                    await _this.prepareQRCodes(
                        code,
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"]`
                        ),
                        chunkLength
                    );
                    await _this.showQRCodes(
                        element.querySelector(
                            `[data-id="${_this.escape(id)}"]`
                        ),
                        interval
                    );
                });
                resolve(
                    `<div class="component-qrcode" data-id="${_this.escape(
                        id
                    )}" style="display: none;"></div>`
                );
            } else if (component.type == "data") {
                let code = JSON.stringify({
                    ec: eventCode,
                    mn: matchNumber,
                    tn: teamNumber,
                    tc: color,
                    au: config.account.username,
                    at: config.account.team,
                    d: data.data,
                    a: data.abilities,
                    c: data.counters,
                    t: data.timers,
                    r: data.ratings
                });
                resolve(
                    `<textarea class="component-textbox" readonly>${_this.escape(
                        code
                    )}</textarea>`
                );
            } else {
                console.log("bad error with component type");
                resolve("");
            }
        });
    };

    _this.getTeamColor = (eventCode, matchNumber, teamNumber) => {
        return new Promise(async (resolve, reject) => {
            let match = await _this.getMatch(eventCode, matchNumber);
            let redTeams = match.alliances.red.team_keys.map((team) =>
                team.replace("frc", "")
            );
            let blueTeams = match.alliances.blue.team_keys.map((team) =>
                team.replace("frc", "")
            );
            if (redTeams.includes(teamNumber)) {
                resolve("red");
            } else if (blueTeams.includes(teamNumber)) {
                resolve("blue");
            } else {
                resolve("unknown");
            }
        });
    };

    function fixConfig(configuration) {
        if (configuration.theme == null) {
            configuration.theme = {};
        }
        if (
            configuration.theme.backgroundColor == null ||
            configuration.theme.backgroundColor == ""
        ) {
            configuration.theme.backgroundColor = "#e5eef4";
        }
        if (
            configuration.theme.contentColor == null ||
            configuration.theme.contentColor == ""
        ) {
            configuration.theme.contentColor = "#404040";
        }
        if (
            configuration.theme.primaryBackgroundColor == null ||
            configuration.theme.primaryBackgroundColor == ""
        ) {
            configuration.theme.primaryBackgroundColor = "#39547b";
        }
        if (
            configuration.theme.primaryContentColor == null ||
            configuration.theme.primaryContentColor == ""
        ) {
            configuration.theme.primaryContentColor = "#e5eef4";
        }
        if (
            configuration.theme.primaryDarkerBackgroundColor == null ||
            configuration.theme.primaryDarkerBackgroundColor == ""
        ) {
            configuration.theme.primaryDarkerBackgroundColor = "#2b405f";
        }
        if (
            configuration.theme.disabledColor == null ||
            configuration.theme.disabledColor == ""
        ) {
            configuration.theme.disabledColor = "#747474";
        }
        if (configuration.latest == null) {
            configuration.latest = {};
        }
        if (configuration.latest.autofill == null) {
            configuration.latest.autofill = true;
        }
        document.documentElement.style.setProperty(
            "--backgroundColor",
            configuration.theme.backgroundColor
        );
        document.documentElement.style.setProperty(
            "--contentColor",
            configuration.theme.contentColor
        );
        document.documentElement.style.setProperty(
            "--primaryBackgroundColor",
            configuration.theme.primaryBackgroundColor
        );
        document.documentElement.style.setProperty(
            "--primaryContentColor",
            configuration.theme.primaryContentColor
        );
        document.documentElement.style.setProperty(
            "--primaryDarkerBackgroundColor",
            configuration.theme.primaryDarkerBackgroundColor
        );
        document.documentElement.style.setProperty(
            "--disabledColor",
            configuration.theme.disabledColor
        );
        if (configuration.pages == null) {
            configuration.pages = [];
        }
        if (configuration.account == null) {
            configuration.account = {};
        }
        if (configuration.account.username == null) {
            configuration.account.username = "";
        }
        if (configuration.account.team == null) {
            configuration.account.team = "";
        }
        return configuration;
    }

    function generateQR(string, target) {
        let options = {
            text: string,
            width: getQRSize(),
            height: getQRSize(),
            colorDark: config.theme.primaryDarkerBackgroundColor,
            colorLight: config.theme.backgroundColor,
            correctLevel: QRCode.CorrectLevel.H
        };

        var qrcode = new QRCode(target, options);
    }

    function getQRSize() {
        return Math.floor(
            Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7)
        );
    }

    _this.prepareQRCodes = (string, target, chunkLength) => {
        let chunks = [];
        for (let i = 0; i < string.length; i += chunkLength) {
            chunks.push(string.substring(i, i + chunkLength));
        }
        for (let i = 0; i < chunks.length; i++) {
            generateQR(JSON.stringify([i, chunks.length, chunks[i]]), target);
        }
        console.log(chunks);
    };

    _this.showQRCodes = (target, interval) => {
        let codes = target.querySelectorAll("canvas");
        for (let i = 0; i < codes.length; i++) {
            codes[i].style.display = "none";
        }
        target.appendChild(document.createElement("p"));
        let code = 0;
        target.style.display = "block";
        setInterval(() => {
            for (let i = 0; i < codes.length; i++) {
                codes[i].style.display = "none";
            }
            codes[code].style.display = "block";
            target.querySelector("p").innerHTML = `${code + 1}/${codes.length}`;
            code++;
            if (code >= codes.length) {
                code = 0;
            }
        }, interval);
    };

    /* Imported from https://github.com/TogaTech/helpful.js  */
    _this.hexFromBytes = (bytes) => {
        if (bytes == null || !(bytes instanceof Uint8Array)) {
            return "";
        }
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
            if (bytes[i].toString(16).length == 0) {
                hex += "00";
            } else if (bytes[i].toString(16).length == 1) {
                hex += "0" + bytes[i].toString(16);
            } else {
                hex += bytes[i].toString(16);
            }
        }
        return hex;
    };

    _this.stringToBytes = (string) => {
        return new TextEncoder().encode(string);
    };

    _this.hash = (string) => {
        return _this.hexFromBytes(sha256(_this.stringToBytes(string)));
    };

    _this.showLeaderboardPage = async () => {
        return new Promise(async (resolve, reject) => {
            await _this.setMatchNav(0, undefined, undefined, undefined);
            try {
                const response = await fetch("/api/v1/scouting/leaderboard");
                const data = await response.json();

                element.innerHTML = `
                    <div class="leaderboard-container">
                        <h2>Scouting Leaderboard</h2>
                        <div class="leaderboard-list">
                            ${
                                data.success
                                    ? data.body.leaders
                                          .map(
                                              (leader, index) => `
                                <div class="leaderboard-item">
                                    <div class="rank">${index + 1}</div>
                                    <div class="user-info">
                                        <span class="username">${_this.escape(
                                            leader.username
                                        )}</span>
                                        <span class="team">(${_this.escape(
                                            leader.team
                                        )})</span>
                                    </div>
                                    <div class="stats">
                                        <div class="currency">
                                            <div class="nuts">
                                                <img src="/img/nuts.png" alt="Nuts" />
                                                <span>${leader.nuts}</span>
                                            </div>
                                            <div class="bolts">
                                                <img src="/img/bolts.png" alt="Bolts" />
                                                <span>${leader.bolts}</span>
                                            </div>
                                        </div>
                                        <div class="level">
                                            Level ${leader.level}
                                        </div>
                                    </div>
                                </div>
                            `
                                          )
                                          .join("")
                                    : "<p>Failed to fetch leaderboard data</p>"
                            }
                        </div>
                    </div>`;
            } catch (error) {
                console.error("Error loading leaderboard:", error);
                element.innerHTML = `
                    <div class="leaderboard-container">
                        <h2>Error Loading Leaderboard</h2>
                        <p>Failed to load leaderboard data. Please try again later.</p>
                    </div>`;
            }
            resolve();
        });
    };
};
