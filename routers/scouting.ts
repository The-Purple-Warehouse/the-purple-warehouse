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
        )
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

router.get("/instructions", async (ctx) => {
    ctx.redirect(
        "https://docs.google.com/document/d/1SdEaSTeu6o0BTn-wvD_D0uTKrmf6f1qnEvlie4Gzfyo/edit?usp=sharing"
    );
});

router.get("/feedback", async (ctx) => {
    await ctx.render("scouting/feedback");
})

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
