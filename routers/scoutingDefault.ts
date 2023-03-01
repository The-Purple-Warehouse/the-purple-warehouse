import * as Koa from "koa";
import Router from "koa-router";
import * as json from "koa-json";
import * as logger from "koa-logger";
import * as views from "koa-views";
import bodyParser from "koa-bodyparser";
import requireScoutingAuth from "../middleware/requireScoutingAuth";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
    ctx.redirect("/scouting");
});

export default router;
