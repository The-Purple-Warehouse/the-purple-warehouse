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

import {
    getAllResourcesByParent,
    addFile,
    addFolder,
    getResource,
    removeResource
} from "../helpers/resources";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
    await ctx.render("app/index", {
        resources: await getAllResourcesByParent("global")
    });
});

export default router;
