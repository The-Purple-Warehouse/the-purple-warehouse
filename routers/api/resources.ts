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

import {
    getAllResourcesByParent,
    addFile,
    addFolder,
    getResource,
    removeResource
} from "../../helpers/resources";
import { addAPIHeaders } from "../../helpers/utils";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
    addAPIHeaders(ctx);
    ctx.body = {
        success: true
    };
});

router.get("/list/:parent", async (ctx, next) => {
    addAPIHeaders(ctx);
    let resources = await getAllResourcesByParent(ctx.params.parent);
    ctx.body = {
        success: true,
        body: {
            resources: resources.map((resource: any) => {
                return {
                    identifier: resource.identifier,
                    type: resource.type,
                    name: resource.name,
                    content: resource.content,
                    parent: resource.parent
                };
            })
        }
    };
});

router.post("/files/add/:parent", async (ctx, next) => {
    addAPIHeaders(ctx);
    let body = ctx.request.body as any;
    if (typeof body.name != "string" || body.name == "") {
        ctx.body = {
            success: false,
            error: {
                code: 0,
                message: ""
            }
        };
    } else {
        ctx.body = {
            success: true,
            body: {
                identifier: await addFile(
                    body.name as string,
                    body.content,
                    ctx.params.parent
                )
            }
        };
    }
});

router.post("/folders/add/:parent", async (ctx, next) => {
    addAPIHeaders(ctx);
    let body = ctx.request.body as any;
    if (typeof body.name != "string" || body.name == "") {
        ctx.body = {
            success: false,
            error: {
                code: 0,
                message: ""
            }
        };
    } else {
        ctx.body = {
            success: true,
            body: {
                identifier: await addFolder(
                    body.name as string,
                    ctx.params.parent
                )
            }
        };
    }
});

router.get("/get/:identifier", async (ctx, next) => {
    addAPIHeaders(ctx);
    let resource = (await getResource(ctx.params.identifier))[0] as any;
    if (resource != null) {
        ctx.body = {
            success: true,
            body: {
                type: resource.type,
                name: resource.name,
                content: resource.content,
                parent: resource.parent
            }
        };
    } else {
        ctx.body = {
            success: false,
            error: {
                code: 0,
                message: ""
            }
        };
    }
});

router.get("/delete/:identifier", async (ctx, next) => {
    addAPIHeaders(ctx);
    let removed = removeResource(ctx.params.identifier);
    if (removed) {
        ctx.body = {
            success: true,
            body: {}
        };
    } else {
        ctx.body = {
            success: false,
            error: {
                code: 0,
                message: ""
            }
        };
    }
});

export default router;
