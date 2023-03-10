import mongoose from "../db";

export default mongoose.model(
    "Team",
    new mongoose.Schema({
        teamName: String,
        teamNumber: String,
        accessToken: String
    })
);
