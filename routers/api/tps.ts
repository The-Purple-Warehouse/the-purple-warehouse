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
    retrieveEntry,
    getEntryByHash,
    entryExistsByHash,
    getLatestMatch,
    format,
    validatePrivacyRules
} from "../../helpers/tps";
import { verifyAPIKey } from "../../helpers/apiKey";

function checkNull(object1, object2) {
    return object1 !== null && object1 !== undefined ? object1 : object2;
}

const router = new Router<Koa.DefaultState, Koa.Context>();

router.post("/entry/add", async (ctx, next) => {
    addAPIHeaders(ctx);
    const query = ctx.query as any;
    const body = ctx.request.body as any;
    let tps = format(body.entry, false) as any;
    let privacy = validatePrivacyRules(body.privacy);
    let scouter = checkNull(checkNull(tps.metadata, {}).scouter, {});
    let verify = await verifyAPIKey(query.key, scouter.name, scouter.app, scouter.team, ["tps.entry.add"], ["app", "team"]) as any;
    if(verify.verified && (verify.key.username == scouter.name || verify.key.scopes.includes("tpw.scouting.impersonate"))) {
        let entry = await addEntry(tps, privacy, (new Date()).getTime());
        if(entry == null) {
            ctx.body = {
                success: false,
            }
        } else {
            ctx.body = {
                success: true,
                hash: entry.hash
            }
        }
    } else {
        ctx.body = {
            success: false,
        }
    }
});

router.get("/entry/verify/:hash", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            verified: await entryExistsByHash(ctx.params.hash)
        }
    };
});

router.get("/entry/get/:hash", async (ctx, next) => {
    addAPIHeaders(ctx);
    const query = ctx.query as any;
    let entry = await getEntryByHash(ctx.params.hash);
    if(entry == null) {
        ctx.body = {
            success: false
        };
    } else {
        let verify = await verifyAPIKey(query.key, "", "", "", ["tps.entry.get"], []) as any;
        if(verify.verified) {
            ctx.body = {
                success: true,
                body: {
                    entry: retrieveEntry(entry as any, verify.key.team)
                }
            };
        } else {
            ctx.body = {
                success: false
            };
        }
    }
    
});

router.post("/entry/list", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            entries: []
        }
    };
});

router.get("/entry/event/:event", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            entries: []
        }
    };
});

router.get("/entry/latest/:event", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true,
        body: {
            latest: await getLatestMatch(ctx.params.event)
        }
    };
});

export default router;
