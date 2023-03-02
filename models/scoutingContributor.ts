import mongoose from "../db";

export default mongoose.model(
    "ScoutingContributor",
    new mongoose.Schema({
        team: {
            ref: "Team",
            type: mongoose.Schema.Types.ObjectId
        },
        username: String
    })
);
