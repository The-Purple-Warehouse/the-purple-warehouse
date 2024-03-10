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
    getEntriesByEvent,
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
    let scouter = checkNull(checkNull(tps.metadata, {}).scouter, {});
    let defaultTeams = [];
    if (scouter.team != null) {
        defaultTeams.push(scouter.team);
    }
    let privacy = validatePrivacyRules(body.privacy, defaultTeams);
    let threshold = 10;
    if(body.threshold != null && typeof body.threshold == "number") {
        threshold = body.threshold;
    }
    let verify = (await verifyAPIKey(
        query.key,
        scouter.name,
        scouter.app,
        scouter.team,
        ["tps.entry.add"],
        ["app", "team"]
    )) as any;
    if (
        verify.verified &&
        (verify.key.username == scouter.name ||
            verify.key.scopes.includes("tpw.scouting.impersonate"))
    ) {
        let entry = await addEntry(tps, privacy, threshold, new Date().getTime());
        if (entry == null) {
            ctx.body = {
                success: false
            };
        } else {
            ctx.body = {
                success: true,
                body: {
                    hash: entry.hash
                }
            };
        }
    } else {
        ctx.body = {
            success: false
        };
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
    let verify = (await verifyAPIKey(
        query.key,
        "",
        "",
        "",
        ["tps.entry.get"],
        []
    )) as any;
    if (verify.verified) {
        let entry = await getEntryByHash(ctx.params.hash);
        if(entry == null) {
            ctx.body = {
                success: false
            };
        } else {
            ctx.body = {
                success: true,
                body: {
                    entry: retrieveEntry(entry as any, verify.key.team)
                }
            };
        }
    } else {
        ctx.body = {
            success: false
        };
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
    const query = ctx.query as any;
    let verify = (await verifyAPIKey(
        query.key,
        "",
        "",
        "",
        ["tps.entry.get"],
        []
    )) as any;
    if (verify.verified) {
        let entries = await getEntriesByEvent(ctx.params.event);
        if(entries == null) {
            ctx.body = {
                success: false
            };
        } else {
            let contributions = 0;
            let teamEntries = entries.filter(entry => entry.metadata != null && entry.metadata.scouter != null && entry.metadata.scouter.team == verify.key.team);
            for(let i = 0; i < teamEntries.length; i++) {
                let threshold = teamEntries[i].threshold;
                if(threshold > 10) {
                    contributions += 10 / threshold;
                } else {
                    contributions += 1;
                }
            }
            ctx.body = {
                success: true,
                body: {
                    entries: entries.map((entry: any) => {
                        let threshold = entry.threshold;
                        if(threshold == null || typeof threshold != "number") {
                            threshold = 10;
                        }
                        let hashStarts = [
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
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f"
                        ].slice(
                            0,
                            threshold > 0 ? Math.floor(
                                (contributions > threshold
                                    ? threshold
                                    : contributions) *
                                    (16 / threshold)
                            ): 16
                        );
                        let scouter: any = {};
                        if(entry.metadata != null && entry.metadata.scouter != null) {
                            scouter = entry.metadata.scouter;
                        }
                        if(scouter.team != verify.key.team && !hashStarts.includes(entry.hash[0])) {
                            return null;
                        }
                        return {
                            entry: retrieveEntry(entry, verify.key.team),
                            hash: entry.hash
                        }
                    }).filter(entry => entry != null)
                }
            };
        }
    } else {
        ctx.body = {
            success: false
        };
    }
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
