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

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", requireScoutingAuth, async (ctx, next) => {
    await ctx.render("scouting/index", {
        preload: ["./img/2023grid-red.png", "./img/2023grid-blue.png"],
        pages: scoutingConfig.layout(),
        username: ctx.session.scoutingUsername,
        team: ctx.session.scoutingTeamNumber
    });
});

router.get("/login", async (ctx) => {
    await ctx.render("scouting/login");
});

router.get("/logout", async (ctx) => {
    if (!ctx.session) {
        return ctx.throw(
            500,
            JSON.stringify({
                message: "There was an error logging out"
            })
        );
    } else {
        ctx.session = null;
    }

    ctx.body = {
        success: true,
        message: "Logging out..."
    };
    ctx.status = 200;
});

router.post("/login", bodyParser(), async (ctx) => {
    if (
        ctx.session.teamNumber &&
        ctx.session.accessToken &&
        ctx.session.username
    ) {
        ctx.body = {
            success: true,
            message: "You are already logged in."
        };
    } else {
        const body = ctx.request.body as any;

        if (!body.teamNumber || !body.accessToken || !body.username) {
            ctx.body = {
                success: false,
                message:
                    "Please provide a team number, username, and access token."
            };
        } else if (!(await teamExistsByNumber(body.teamNumber))) {
            ctx.body = {
                success: false,
                message:
                    "Your team is not registered to use the scouting app. Please contact kabir@ramzan.me to register your team."
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
                        message: "There was an error logging in"
                    };
                } else {
                    ctx.session.scoutingAuthed = true;
                    ctx.session.scoutingTeamNumber = body.teamNumber as string;
                    ctx.session.scoutingUsername = (
                        body.username as string
                    ).toLowerCase();
                    ctx.body = {
                        success: true,
                        message: res.message
                    };
                }
            } catch (e) {
                ctx.body = {
                    success: false,
                    message: e.message
                };
            }
        }
    }
});

export default router;
