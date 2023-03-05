import * as Koa from "koa";
import * as json from "koa-json";
import * as logger from "koa-logger";
import * as views from "koa-views";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import auth from "../helpers/auth";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/login", async (ctx) => {
    await ctx.render("app/scoutingLogin");
})

router.get("/logout", async (ctx) => {
    if (!ctx.session) {
        return ctx.throw(
            500,
            JSON.stringify({
                message: "There was an error logging out",
            })
        );
    } else {
        ctx.session = null;
    }

    ctx.body = {
        success: true,
        message: "Logging out...",
    };
    ctx.status = 200;
});

router.post("/login", bodyParser(), async (ctx) => {
    if (ctx.teamNumber && ctx.session.accessToken && ctx.session.username) return ctx.throw(200,
        JSON.stringify({ message: "You are already logged in" }));
    
    const body = ctx.request.body as any;

    if (!body.teamNumber || !body.accessToken || !body.username) {
        return ctx.throw(
            401,
            JSON.stringify({
                message: "Please provide both a team number, access token, and username.",
            })
        );
    }

    let res;

    try {
        res = await auth(
            body.teamNumber as string,
            body.accessToken as string,
            body.username as string
        );
    } catch (e) {
        return ctx.throw(
            401,
            JSON.stringify({
                message: e.message,
            })
        );
    }

    if (!ctx.session)
        return ctx.throw(
            500,
            JSON.stringify({
                message: "There was an error logging in",
            })
        );

    ctx.session.authed = true;
    ctx.session.teamNumber = body.teamNumber as string;
    ctx.session.username = (body.username as string).toLowerCase();
    ctx.body = {
        success: true,
        message: res.message
    }
});


export default router