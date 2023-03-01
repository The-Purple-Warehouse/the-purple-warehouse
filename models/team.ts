import mongoose from "../db";

export default mongoose.model(
    "Team",
    new mongoose.Schema({
        teamName: String,
        teamNumber: Number,
        accessToken: String
    })
);
