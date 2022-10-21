import * as Koa from "koa";
import * as Router from "koa-router";
import * as json from "koa-json";
import * as views from "koa-views";
import * as bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import * as moment from "moment";

import { register, registerHelper } from "./helpers/components";
import { getAllResourcesByParent } from "./helpers/resources";

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

router.get("/api/v1/resources/:parent", async(ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	ctx.body = {
		success: true,
		content: await getAllResourcesByParent(ctx.params.parent)
	};
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

