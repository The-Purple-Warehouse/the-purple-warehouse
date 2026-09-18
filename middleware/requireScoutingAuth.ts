import * as Koa from "koa";
import { teamExistsByNumber } from "../helpers/teams";
import auth from "../helpers/auth";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    const query = ctx.query as any;
    if (query.token && query.team) {
        if (!(await teamExistsByNumber(query.team))) {
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
                    query.team as string,
                    "",
                    query.token as string
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
                    ctx.session.scoutingTeamNumber = query.team as string;
                    ctx.session.scoutingUsername = "";
                    await next();
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
    } else if (
        !ctx.session ||
        !ctx.session.scoutingAuthed ||
        !ctx.session.scoutingTeamNumber ||
        !ctx.session.scoutingUsername
    ) {
        await ctx.render("scouting/login");
    } else {
        await next();
    }
};
