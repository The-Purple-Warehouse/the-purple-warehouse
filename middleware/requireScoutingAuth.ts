import * as Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    if (
        !ctx.session ||
        !ctx.session.scoutingAuthed ||
        !ctx.session.scoutingTeamNumber ||
        !ctx.session.scoutingUsername
    ) {
        await ctx.render("app/scoutingLogin");
    } else {
        await next();
    }
};
