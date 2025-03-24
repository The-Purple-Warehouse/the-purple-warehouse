import * as Koa from "koa";
import Router from "koa-router";
import * as json from "koa-json";
import * as logger from "koa-logger";
import * as views from "koa-views";
import bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import * as session from "koa-session";
import * as Handlebars from "handlebars";
import requireScoutingAuth from "../../middleware/requireScoutingAuth";

import config from "../../config";
import { addAPIHeaders } from "../../helpers/utils";
import {
    addEntry,
    entryExistsByHash,
    getLatestMatch,
    getNumberOfEntriesByEvent,
    getSharedData,
    getTeamsAtEvent,
    getTeamData,
    getTotalIncentives,
    getLevelAndProgress,
    aggregateLeaderboard
} from "../../helpers/scouting";
import {
    getTeamByNumber,
    addTeam,
    hashAccessToken,
    getAllTeams
} from "../../helpers/teams";
import {
    getEvents,
    getEventsSorted,
    getMatches,
    getMatchesFull,
    getTeam
} from "../../helpers/tba";
import scoutingConfig from "../../config/scouting";
import Team from "../../models/team";
import {
    getShopItems,
    purchaseShopItem,
    getUserInventory
} from "../../helpers/shop";
import { processAdmin } from "../../helpers/adminHelpers";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true
    };
});

router.get("/events/:year", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            events: await getEvents(ctx.params.year)
        }
    };
});
router.get("/events/:year/team", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            events: await getEventsSorted(
                ctx.params.year,
                ctx.session.scoutingTeamNumber
            )
        }
    };
});
router.get("/matches/:event", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            matches: await getMatches(ctx.params.event)
        }
    };
});
router.get("/matches/full/:event", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            matches: await getMatchesFull(ctx.params.event)
        }
    };
});

router.post(
    "/entry/add/:event/:match/:team/:color",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        let body = ctx.request.body as any;
        let entry = (await addEntry(
            ctx.session.scoutingTeamNumber,
            (body.username as string) || ctx.session.scoutingUsername,
            ctx.params.event,
            parseInt(ctx.params.match),
            ctx.params.team,
            ctx.params.color,
            body.data as [any],
            body.abilities as [any],
            body.counters as [any],
            body.timers as [any],
            body.ratings as [any],
            body.comments as string,
            body.timestamp as number
        )) as any;
        ctx.body = {
            success: true,
            body: {
                hash: entry.hash,
                xp: entry.xp || 0,
                nuts: entry.nuts || 0,
                bolts: entry.bolts || 0,
                accuracyBoosters: {
                    xp: entry.accuracyBoosters.xp || 0,
                    nuts: entry.accuracyBoosters.nuts || 0,
                    bolts: entry.accuracyBoosters.bolts || 0
                },
                totals: await getTotalIncentives(
                    ctx.session.scoutingTeamNumber,
                    ctx.session.scoutingUsername
                )
            }
        };
    }
);

router.get("/entry/verify/:hash", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            verified: await entryExistsByHash(ctx.params.hash)
        }
    };
});

router.get("/entry/latest/:event", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            latest: await getLatestMatch(ctx.params.event)
        }
    };
});

router.get(
    "/entry/data/event/:event/csv",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        ctx.body = {
            success: true,
            body: {
                csv: await getSharedData(
                    ctx.params.event,
                    ctx.session.scoutingTeamNumber
                ),
                notes: scoutingConfig.notes()
            }
        };
    }
);

router.get(
    "/entry/data/event/:event/csv/parsed",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        ctx.body = {
            success: true,
            body: {
                csv: await getSharedData(
                    ctx.params.event,
                    ctx.session.scoutingTeamNumber,
                    true
                ),
                notes: scoutingConfig.notes()
            }
        };
    }
);

router.get(
    "/entry/data/event/:event/csv/:team",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        ctx.body = {
            success: true,
            body: {
                csv: await getTeamData(
                    ctx.params.event,
                    ctx.params.team,
                    ctx.session.scoutingTeamNumber
                ),
                notes: scoutingConfig.notes()
            }
        };
    }
);

router.get(
    "/entry/data/event/:event/tba",
    requireScoutingAuth,
    async (ctx, next) => {
        ctx.body = {
            success: true,
            body: {
                matches: await getMatchesFull(ctx.params.event)
            }
        };
        addAPIHeaders(ctx);
    }
);

router.get("/team/get/:team", requireScoutingAuth, async (ctx, next) => {
    ctx.body = {
        success: true,
        body: {
            team: await getTeam(ctx.params.team)
        }
    };
    addAPIHeaders(ctx);
});

router.post("/team/add/:team", requireScoutingAuth, async (ctx, next) => {
    let body = ctx.request.body as any;
    if (config.auth.adminTokens[body.adminToken] != null) {
        let team = (await getTeamByNumber(ctx.params.team)) as any;
        if (team == null) {
            await addTeam(
                body.teamName,
                ctx.params.team,
                body.accessToken,
                body.country,
                body.state
            );
            processAdmin(
                config.auth.adminTokens[body.adminToken],
                "add",
                ctx.params.team,
                body
            );
        } else {
            let hashedAccessToken = await hashAccessToken(body.accessToken);
            team.teamName = body.teamName;
            team.accessToken = hashedAccessToken;
            team.country = body.country;
            team.state = body.state;
            await team.save();
            processAdmin(
                config.auth.adminTokens[body.adminToken],
                "update",
                ctx.params.team,
                body
            );
        }
        ctx.body = {
            success: true
        };
    } else {
        ctx.body = {
            success: false,
            error: "Invalid admin token!"
        };
    }
    addAPIHeaders(ctx);
});

router.post("/team/list", requireScoutingAuth, async (ctx, next) => {
    let body = ctx.request.body as any;
    if (config.auth.adminTokens[body.adminToken] != null) {
        ctx.body = {
            success: true,
            body: {
                teams: (await getAllTeams())
                    .map((team: any) => {
                        return {
                            name: team.teamName,
                            teamNumber: team.teamNumber,
                            country: team.country,
                            state: team.state
                        };
                    })
                    .sort((a: any, b: any) => {
                        let aTeamNumber = parseInt(a.teamNumber);
                        let bTeamNumber = parseInt(b.teamNumber);
                        if (isNaN(aTeamNumber)) {
                            aTeamNumber = 9999999;
                        }
                        if (isNaN(bTeamNumber)) {
                            bTeamNumber = 9999999;
                        }
                        return aTeamNumber - bTeamNumber;
                    })
            }
        };
    } else {
        ctx.body = {
            success: false,
            error: "Invalid admin token!"
        };
    }
    addAPIHeaders(ctx);
});

router.post("/team/add/:team", requireScoutingAuth, async (ctx, next) => {
    ctx.body = {
        success: false
    };
    addAPIHeaders(ctx);
});

router.get(
    "/entry/analysis/event/:event",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        // let entries = await getTeamEntriesByEvent(
        //     ctx.params.event,
        //     ctx.session.scoutingTeamNumber
        // );
        let entries = await getNumberOfEntriesByEvent(ctx.params.event);
        let analysis: any = {
            display: [],
            data: {}
        };
        if (
            // entries.length >= 5 ||
            // config.auth.scoutingAdmins.includes(ctx.session.scoutingTeamNumber)
            entries >= 1
        ) {
            analysis = await scoutingConfig.analysis(
                ctx.params.event,
                undefined
            );
        }
        if (analysis.display.length > 0) {
            ctx.body = {
                success: true,
                body: {
                    display: analysis.display,
                    data: analysis.data
                }
            };
        } else {
            ctx.body = {
                success: false,
                error: `Not enough data has been collected at this event to run the analyzer for this team. Please try entering a different event or check back later after scouting more matches!`
            };
        }
    }
);

router.get(
    "/entry/analysis/event/:event/:team",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        // let entries = await getTeamEntriesByEvent(
        //     ctx.params.event,
        //     ctx.session.scoutingTeamNumber
        // );
        let entries = await getNumberOfEntriesByEvent(ctx.params.event);
        let analysis: any = {
            display: [],
            data: {}
        };
        if (
            // entries.length >= 5 ||
            // config.auth.scoutingAdmins.includes(ctx.session.scoutingTeamNumber)
            entries >= 1
        ) {
            analysis = await scoutingConfig.analysis(
                ctx.params.event,
                ctx.params.team
            );
        }
        if (analysis.display.length > 0) {
            ctx.body = {
                success: true,
                body: {
                    display: analysis.display,
                    data: analysis.data
                }
            };
        } else {
            ctx.body = {
                success: false,
                error: `Not enough data has been collected on team ${ctx.params.team} at this event to run the analyzer for this team. Please try entering a different team number, or check back later after scouting more matches!`
            };
        }
    }
);

router.get(
    "/entry/compare/event/:event/:teams",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        // let entries = await getTeamEntriesByEvent(
        //     ctx.params.event,
        //     ctx.session.scoutingTeamNumber
        // );
        let entries = await getNumberOfEntriesByEvent(ctx.params.event);
        let comparison: any = {
            display: [],
            data: {}
        };
        if (
            // entries.length >= 5 ||
            // config.auth.scoutingAdmins.includes(ctx.session.scoutingTeamNumber)
            entries >= 1
        ) {
            comparison = await scoutingConfig.compare(
                ctx.params.event,
                ctx.params.teams.split(",")
            );
        }
        if (comparison.display.length > 0) {
            ctx.body = {
                success: true,
                body: {
                    display: comparison.display,
                    data: comparison.data
                }
            };
        } else {
            ctx.body = {
                success: false,
                error: `Not enough data has been collected on these teams at this event to run comparisons on them. Please try entering different team numbers, or check back later after scouting more matches!`
            };
        }
    }
);

router.get(
    "/entry/predict/event/:event/:redTeams/:blueTeams",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        // let entries = await getTeamEntriesByEvent(
        //     ctx.params.event,
        //     ctx.session.scoutingTeamNumber
        // );
        let entries = await getNumberOfEntriesByEvent(ctx.params.event);
        let prediction: any = {
            display: [],
            data: {}
        };
        let redTeamNumbers = [...new Set(ctx.params.redTeams)];
        let blueTeamNumbers = [...new Set(ctx.params.blueTeams)];
        if (redTeamNumbers.length < 3 || blueTeamNumbers.length < 3) {
            ctx.body = {
                success: false,
                error: `Please enter all six team numbers!`
            };
        } else if (
            // entries.length >= 5 ||
            // config.auth.scoutingAdmins.includes(ctx.session.scoutingTeamNumber)
            entries >= 1
        ) {
            prediction = await scoutingConfig.predict(
                ctx.params.event,
                ctx.params.redTeams.split(","),
                ctx.params.blueTeams.split(",")
            );
        }
        if (prediction.display.length > 0) {
            ctx.body = {
                success: true,
                body: {
                    display: prediction.display,
                    data: prediction.data
                }
            };
        } else {
            ctx.body = {
                success: false,
                error: `Not enough data has been collected on these teams at this event to run a prediction with them. Please try entering different team numbers, or check back later after scouting more matches!`
            };
        }
    }
);

router.get("/:event/:year/teams/tpw/:team", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    let y = ctx.params.year;
    let year: number;

    try {
        year = parseInt(y);
    } catch (err) {
        console.error(err);
        ctx.body = {
            success: false,
            error: `An error occured. Invalid parameters.`
        };
    }

    if (config.auth.blacklist.includes(String(ctx.params.team))) {
        ctx.status = 418; // im a teapot! - nelson gou 2025
        ctx.body = {
            success: false,
            error: "An internal error occured. Please try again later or try entering a different event!"
        }
        return;
    }

    let teams = await getTeamsAtEvent(ctx.params.event, ctx.params.team, year);
    
    if (teams) {
        const blacklist = new Set(config.auth.blacklist.map(String));
        teams = teams.map(team => {
            if (blacklist.has(String(team.team)) && team.tpw == true) {
                return { ...team, tpw: false };
            }
            return team;
        });
    }

    if (teams) {
        ctx.body = {
            success: true,
            body: {
                data: teams
            }
        };
    } else {
        ctx.body = {
            success: false,
            error: `Your team is not attending this event. Please try entering a different event to check which teams use TPW!`
        };
    }
});

router.get("/leaderboard", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    try {
        const leaders = await aggregateLeaderboard();
        const leadersWithLevels = leaders.map((leader) => {
            const { level, progress } = getLevelAndProgress(leader.totalXp);
            return {
                ...leader,
                level,
                progress
            };
        });

        const allSortedLeaders = [...leadersWithLevels].sort((a, b) => {
            if (b.level === a.level) {
                return b.totalXp - a.totalXp;
            }
            return b.level - a.level;
        });

        const top50 = allSortedLeaders.slice(0, 50);

        const currentUserTeam = ctx.session.scoutingTeamNumber;
        const currentUserName = ctx.session.scoutingUsername;
        const currentUserIndex = allSortedLeaders.findIndex(
            (leader) =>
                leader.team.toString() === currentUserTeam &&
                leader.username === currentUserName
        );

        if (currentUserIndex === -1) {
            ctx.body = {
                success: true,
                body: {
                    leaders: top50,
                    currentUser: null
                }
            };
            return;
        }

        const currentUserData = {
            username: currentUserName,
            team: currentUserTeam,
            level: allSortedLeaders[currentUserIndex].level,
            progress: allSortedLeaders[currentUserIndex].progress,
            nuts: allSortedLeaders[currentUserIndex].nuts,
            bolts: allSortedLeaders[currentUserIndex].bolts,
            totalXp: allSortedLeaders[currentUserIndex].totalXp,
            rank: currentUserIndex + 1
        };

        let displayList = allSortedLeaders.slice(0, 50);
        displayList.push({
            ...allSortedLeaders[currentUserIndex],
            rank: currentUserIndex + 1
        });

        ctx.body = {
            success: true,
            body: {
                leaders: displayList,
                currentUser: currentUserData
            }
        };
    } catch (error) {
        ctx.body = {
            success: false,
            error: "Unable to fetch leaderboard, please try again later.",
            message: error.message
        };
    }
});

router.get("/shop/items", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    try {
        const items = await getShopItems();
        const userTotals = await getTotalIncentives(
            ctx.session.scoutingTeamNumber,
            ctx.session.scoutingUsername
        );

        ctx.body = {
            success: true,
            body: {
                items,
                balance: {
                    nuts: userTotals.nuts || 0,
                    bolts: userTotals.bolts || 0
                }
            }
        };
    } catch (error) {
        ctx.body = {
            success: false,
            error: "Failed to fetch shop items"
        };
    }
});

router.post(
    "/shop/purchase/:itemId",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        try {
            const result = await purchaseShopItem(
                ctx.params.itemId,
                ctx.session.scoutingTeamNumber,
                ctx.session.scoutingUsername
            );

            if (result.success) {
                ctx.body = {
                    success: true,
                    body: {
                        message: "Purchase successful",
                        item: result.item,
                        newBalance: result.newBalance
                    }
                };
            } else {
                ctx.body = {
                    success: false,
                    error: result.error
                };
            }
        } catch (error) {
            ctx.body = {
                success: false,
                error: "Failed to process purchase"
            };
        }
    }
);

router.get("/shop/inventory", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    try {
        const inventory = await getUserInventory(
            ctx.session.scoutingTeamNumber,
            ctx.session.scoutingUsername
        );

        ctx.body = {
            success: true,
            body: {
                inventory
            }
        };
    } catch (error) {
        ctx.body = {
            success: false,
            error: "Failed to fetch inventory"
        };
    }
});

export default router;
