import * as Koa from "koa";
import * as Router from "koa-router";
import * as json from "koa-json";
import * as views from "koa-views";
import * as bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import * as moment from "moment";

import { register, registerHelper } from "./helpers/components";

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
const res = ["App Dev", "Software", "Scouting", "Mechanical", "Machining", "Electrical", "Design", "Outreach", "Media"];
const res1 = [
	{name: "App Dev", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Software", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Scouting", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Mechanical", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Electrical", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Design", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Outreach", inner: [{name: "1"}, {name: "2"}, {name: "3"}]},
	{name: "Media", inner: [{name: "1"}, {name: "2"}, {name: "3"}]}
]

router.get("/data/", async(ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	ctx.body = (res1)
});

router.get("/app/", async (ctx, next) => {
	await ctx.render("app/index", {resources: res1})
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

