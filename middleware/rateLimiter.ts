import { RateLimit, Stores } from "koa2-ratelimit";
import mongoose from "../db";

import { retrieveRateLimit } from "../helpers/apiKey";

const mongo = new Stores.Mongodb(mongoose.connection, {
    collectionName: "ratelimits",
    collectionAbuseName: "ratelimitsabuses"
});

export const rateLimiter = RateLimit.middleware({
    interval: { sec: 1 }, // 1 second
    max: async (ctx) => {
        const apiKey = ctx.query.key;
        const rateInfo = await retrieveRateLimit(apiKey);
        return rateInfo.rateLimit; // max requests per second per team
    },
    keyGenerator: async (ctx) => {
        const apiKey = ctx.query.key;
        const rateInfo = await retrieveRateLimit(apiKey);
        return `teamid:${rateInfo.teamNumber}`; // team number as key
    },
    store: mongo,
    message: "Exceeded the rate limit. Try again later."
});
