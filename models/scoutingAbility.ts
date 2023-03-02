import mongoose from "../db";

export default mongoose.model(
    "ScoutingAbility",
    new mongoose.Schema({
        category: {
            ref: "ScoutingCategory",
            type: mongoose.Schema.Types.ObjectId
        },
        ability: mongoose.Schema.Types.Mixed
    })
);
