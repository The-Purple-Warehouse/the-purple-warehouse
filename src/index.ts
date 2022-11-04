import * as Koa from "koa";
import * as Router from "koa-router";
import * as json from "koa-json";
import * as views from "koa-views";
import * as bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import * as moment from "moment";

import { register, registerHelper } from "./helpers/components";
import { getAllResourcesByParent, addFile, addFolder, getResource, removeResource } from "./helpers/resources";
import { addAPIHeaders } from "./helpers/utils";

import config from "./config";

console.log();
console.log();
console.log("--- PROCESS INITIALIZED ---");
console.log("Time:", Date.now());

(global as any).__base = __dirname + "/";
console.log("__base:", global.__base);

const app = new Koa();
const router = new Router<Koa.DefaultState, Koa.Context>();

app.use(json());
app.use(bodyParser());

app.use(views(global.__base + "views", {
	map: {
		hbs: "handlebars"
	},
	extension: "hbs"
}));

register(`${__dirname}/views/partials/head.hbs`);
register(`${__dirname}/views/partials/nav.hbs`);
register(`${__dirname}/views/partials/copyright.hbs`);
register(`${__dirname}/views/app/partials/feed.hbs`);
register(`${__dirname}/views/app/partials/resources.hbs`);

function getTimeFormatted() {
	return moment().format("MMMM Do YYYY, h:mm:ss a") + " (" + Date.now() + ")";
}

router.get("/", async (ctx, next) => {
	await ctx.render("index")
});

router.get("/api/v1/resources/list/:parent", async(ctx, next) => {
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
				}
			})
		}
	};
});

router.post("/api/v1/resources/files/add/:parent", async(ctx, next) => {
	addAPIHeaders(ctx);
	if(typeof ctx.request.body.name != "string" || ctx.request.body.name == "") {
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
				identifier: await addFile(ctx.request.body.name as string, ctx.request.body.content, ctx.params.parent)
			}
		};
	}
});

router.post("/api/v1/resources/folders/add/:parent", async(ctx, next) => {
	addAPIHeaders(ctx);
	if(typeof ctx.request.body.name != "string" || ctx.request.body.name == "") {
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
				identifier: await addFolder(ctx.request.body.name as string, ctx.params.parent)
			}
		};
	}
});

router.get("/api/v1/resources/get/:identifier", async(ctx, next) => {
	addAPIHeaders(ctx);
	let resource = (await getResource(ctx.params.identifier))[0] as any;
	if(resource != null) {
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

router.get("/api/v1/resources/delete/:identifier", async(ctx, next) => {
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

router.get("/app/", async (ctx, next) => {
	await ctx.render("app/index", {resources: await getAllResourcesByParent("global")})
});

app.use(router.routes());

app.use(serve(`${__dirname}/static`, '/static'))

const port = config.server.port || 5000;
const server = app.listen(port, () => {
	console.log();
	console.log("--- WEBSERVER ON ---");
	console.log("Listening at http://" + config.server.domain + ":" + port);
	console.log();
}).on("error", (err) => {
	console.error("Connection error:", err);
});

