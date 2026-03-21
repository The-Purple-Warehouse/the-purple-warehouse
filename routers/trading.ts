import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { getTeam } from "../helpers/tba";
import { addListing, getListings, deleteListing } from "../helpers/trading";
import { addAPIHeaders } from "../helpers/utils";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/team/:number", async (ctx) => {
    addAPIHeaders(ctx);
    try {
        const teamNumber = parseInt(ctx.params.number);
        if (!teamNumber || teamNumber < 1) {
            ctx.body = { success: false, error: "Invalid team number" };
            return;
        }
        const team = await getTeam(teamNumber);
        if (team && (team as any).nickname) {
            ctx.body = {
                success: true,
                body: {
                    team: teamNumber,
                    teamName: (team as any).nickname
                }
            };
        } else {
            ctx.body = { success: false, error: "Team not found" };
        }
    } catch (err) {
        ctx.body = { success: false, error: "Could not look up team" };
    }
});

router.get("/listings", async (ctx) => {
    addAPIHeaders(ctx);
    try {
        const query = ctx.query as any;
        const listings = await getListings({
            type: query.type,
            category: query.category,
            event: query.event
        });
        ctx.body = {
            success: true,
            body: { listings }
        };
    } catch (err) {
        ctx.body = {
            success: false,
            error: "Could not fetch listings"
        };
    }
});

router.post("/listings", bodyParser(), async (ctx) => {
    addAPIHeaders(ctx);
    try {
        const body = ctx.request.body as any;

        if (
            !body.type ||
            !body.team ||
            !body.item ||
            !body.category ||
            !body.contact
        ) {
            ctx.body = {
                success: false,
                error: "Missing required fields: type, team, item, category, contact"
            };
            return;
        }

        if (!["offer", "request"].includes(body.type)) {
            ctx.body = {
                success: false,
                error: "Type must be 'offer' or 'request'"
            };
            return;
        }

        const listing = await addListing({
            type: body.type,
            team: parseInt(body.team),
            teamName: body.teamName || "",
            item: body.item,
            category: body.category,
            quantity: parseInt(body.quantity) || 1,
            description: body.description || "",
            contact: body.contact,
            event: body.event || "general"
        });

        ctx.body = {
            success: true,
            body: {
                listing
            }
        };
    } catch (err) {
        ctx.body = {
            success: false,
            error: "Could not create listing"
        };
    }
});

router.delete("/listings/:id", bodyParser(), async (ctx) => {
    addAPIHeaders(ctx);
    try {
        const body = ctx.request.body as any;
        if (!body.team) {
            ctx.body = {
                success: false,
                error: "Team number required"
            };
            return;
        }
        await deleteListing(ctx.params.id, parseInt(body.team));
        ctx.body = { success: true, body: { message: "Listing deleted" } };
    } catch (err) {
        ctx.body = {
            success: false,
            error: err.message || "Could not delete listing"
        };
    }
});

export default router;
