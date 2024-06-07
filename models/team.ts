import mongoose from "../db";

export default mongoose.model(
    "Team",
    new mongoose.Schema({
        teamName: String,
        teamNumber: String,
        rateLimit: Number, // in requests per second
        accessToken: String,
        country: String,
        state: String
    })
);
