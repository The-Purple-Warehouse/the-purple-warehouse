import mongoose from "../db";

let ScoutingContributor = new mongoose.Schema({
    team: {
        ref: "Team",
        type: mongoose.Schema.Types.ObjectId
    },
    username: String
});

export default mongoose.model(
    "PurchaseEntry",
    new mongoose.Schema({
        contributor: ScoutingContributor,
        nuts: {
            type: Number,
            required: false,
            default: 0
        },
        bolts: {
            type: Number,
            required: false,
            default: 0
        },
    })
);
