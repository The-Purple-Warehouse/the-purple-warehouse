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
    getTotalIncentives
} from "../../helpers/scouting";
import {
    getEvents,
    getEventsSorted,
    getMatches,
    getMatchesFull
} from "../../helpers/tba";
import scoutingConfig from "../../config/scouting";

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

export default router;
