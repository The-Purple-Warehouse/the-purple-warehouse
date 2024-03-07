import * as Koa from "koa";
import Router from "koa-router";
import * as json from "koa-json";
import * as logger from "koa-logger";
import * as views from "koa-views";
import bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import * as session from "koa-session";
import * as Handlebars from "handlebars";
import requireScoutingAuth from "../middleware/requireScoutingAuth";
import auth from "../helpers/auth";
import { teamExistsByNumber } from "../helpers/teams";
import scoutingConfig from "../config/scouting";
import config from "../config";
import { getTotalIncentives } from "../helpers/scouting";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", requireScoutingAuth, async (ctx, next) => {
    await ctx.render("scouting/index", {
        preload: scoutingConfig.preload(),
        pages: scoutingConfig.layout(),
        username: ctx.session.scoutingUsername,
        team: ctx.session.scoutingTeamNumber,
        incentives: await getTotalIncentives(
            ctx.session.scoutingTeamNumber,
            ctx.session.scoutingUsername
        ),
        year: config.year
    });
});

router.get("/login", async (ctx) => {
    await ctx.render("scouting/login");
});

router.get("/logout", async (ctx) => {
    if (ctx.session) {
        ctx.session = null;
    }
    ctx.redirect("/scouting");
});

function filterScopes(scopes) {
    let filtered = [];
    let available = ["tps.entry.add", "tps.entry.get", "tps.entry.edit", "tps.entry.delete"];
    for(let i = 0; i < scopes.length; i++) {
        if(available.includes(scopes[i])) {
            filtered.push(scopes[i]);
        }
    }
    return filtered;
}

function prettyScopes(scopes) {
    let pretty = {
        "tps.entry.add": "Add TPS scouting entries",
        "tps.entry.get": "Get TPS scouting entries",
        "tps.entry.edit": "Edit TPS scouting entries",
        "tps.entry.delete": "Delete TPS scouting entries",
    };
    return scopes.map(scope => pretty[scope]);
}

function getAuthDetails(original) {
    let auth = {
        valid: false
    };
    try {
        let details = JSON.parse(atob(original));
        if(details.scopes == null) {
            details.scopes = [];
        }
        details.scopes = filterScopes(details.scopes);
        if(details.site != null && details.redirect != null) {
            let splitDomain = (new URL(details.redirect)).hostname.split(".");
            let ending = splitDomain.pop();
            let secondEnding = splitDomain.pop();
            if(["co", "com", "org", "net", "edu"].includes(secondEnding)) {
                ending = `${secondEnding}.${ending}`;
            }
            let redirectHostname = (new URL(details.redirect)).hostname;
            let siteHostname = (new URL(details.site)).hostname;
            if(redirectHostname == siteHostname || (redirectHostname.endsWith(`.${siteHostname}`) && siteHostname != ending && !siteHostname.startsWith("."))) {
                auth.details = {
                    site: siteHostname,
                    redirect: details.redirect,
                    expiration: details.expiration,
                    scopes: details.scopes,
                    prettyScopes: prettyScopes(details.scopes),
                    original: original
                };
                auth.valid = true;
            }
        }
    } catch(err) {

    }
    return auth;
}

router.get("/auth/generate/:details", requireScoutingAuth, async (ctx, next) => {
    await ctx.render("scouting/auth", getAuthDetails(ctx.params.details));
});

router.post("/auth/generate/:details", requireScoutingAuth, async (ctx, next) => {
    let auth = getAuthDetails(ctx.params.details);
    if(auth.valid) {
        let apiKey = await addAPIKey({
            username: ctx.session.scoutingUsername,
            team: ctx.session.scoutingTeamNumber,
            app: auth.site,
            scopes: auth.scopes,
            expiration: auth.expiration || (new Date()).getTime() + (1000 * 60 * 60 * 24 * 365 * 10),
            source: "login"
        });
        await ctx.redirect(auth.redirect.replaceAll("<KEY>", apiKey.key));
    } else {
        await ctx.render("scouting/auth", auth);
    }
});

router.get("/instructions", async (ctx) => {
    ctx.redirect(
        "https://docs.google.com/document/d/1SdEaSTeu6o0BTn-wvD_D0uTKrmf6f1qnEvlie4Gzfyo/edit?usp=sharing"
    );
});

router.get("/feedback", async (ctx) => {
    await ctx.render("scouting/feedback");
});

router.post("/login", bodyParser(), async (ctx) => {
    if (
        ctx.session.teamNumber &&
        ctx.session.accessToken &&
        ctx.session.username
    ) {
        ctx.body = {
            success: true,
            body: {
                message: "You are already logged in."
            }
        };
    } else {
        const body = ctx.request.body as any;

        if (!body.teamNumber || !body.accessToken || !body.username) {
            ctx.body = {
                success: false,
                error: {
                    code: 0,
                    message:
                        "Please provide a team number, username, and access token."
                }
            };
        } else if (!(await teamExistsByNumber(body.teamNumber))) {
            ctx.body = {
                success: false,
                error: {
                    code: 0,
                    message:
                        "Your team is not registered to use the scouting app. Please contact kabir@ramzan.me to register your team."
                }
            };
        } else {
            let res;

            try {
                res = await auth(
                    body.teamNumber as string,
                    body.username as string,
                    body.accessToken as string
                );
                if (!ctx.session) {
                    ctx.body = {
                        success: false,
                        error: {
                            code: 0,
                            message: "There was an error logging in"
                        }
                    };
                } else {
                    ctx.session.scoutingAuthed = true;
                    ctx.session.scoutingTeamNumber = body.teamNumber as string;
                    ctx.session.scoutingUsername = (
                        body.username as string
                    ).toLowerCase();
                    ctx.body = {
                        success: true,
                        body: {
                            message: res.message
                        }
                    };
                }
            } catch (e) {
                ctx.body = {
                    success: false,
                    error: {
                        code: 0,
                        message: e.message
                    }
                };
            }
        }
    }
});

export default router;
