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
    getTeamEntriesByEvent,
    getSharedData
} from "../../helpers/scouting";
import { getEvents, getMatches, getMatchesFull } from "../../helpers/tba";
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
        ctx.body = {
            success: true,
            body: {
                hash: (
                    (await addEntry(
                        ctx.session.scoutingTeamNumber,
                        (ctx.request.body.username as string) ||
                            ctx.session.scoutingUsername,
                        ctx.params.event,
                        parseInt(ctx.params.match),
                        ctx.params.team,
                        ctx.params.color,
                        ctx.request.body.data as [any],
                        ctx.request.body.abilities as [any],
                        ctx.request.body.counters as [any],
                        ctx.request.body.timers as [any],
                        ctx.request.body.ratings as [any],
                        ctx.request.body.comments as string,
                        ctx.request.body.timestamp as number
                    )) as any
                ).hash
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
    "/entry/analysis/event/:event",
    requireScoutingAuth,
    async (ctx, next) => {
        addAPIHeaders(ctx);
        let entries = await getTeamEntriesByEvent(
            ctx.params.event,
            ctx.session.scoutingTeamNumber
        );
        let analysis: any = {};
        if (entries.length >= 5) {
            analysis = await scoutingConfig.analysis(
                ctx.params.event,
                ctx.session.scoutingTeamNumber
            );
        }
        ctx.body = {
            success: true,
            body: {
                display: analysis.display,
                data: analysis.data
            }
        };
    }
);

export default router;
