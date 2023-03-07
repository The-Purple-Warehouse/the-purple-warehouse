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

import { addAPIHeaders } from "../../helpers/utils";
import {addFile} from "../../helpers/resources";
import { addEntry, entryExistsByHash, getLatestMatch, getTeamEntriesByEvent } from "../../helpers/scouting";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true
    };
});

router.post("/entry/add/:event/:match/:team/:color", requireScoutingAuth, async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            hash: (await addEntry(
                ctx.session.scoutingTeamNumber,
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
            ) as any).hash
        }
    };
});

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
    }
});

router.get("/entry/data/event/:event", requireScoutingAuth, async (ctx, next) => {
    ctx.body = {
        success: true,
        body: {
            entries: await getTeamEntriesByEvent(event, ctx.session.scoutingTeamNumber);
        }
    }
    addAPIHeaders(ctx);
});

export default router;
