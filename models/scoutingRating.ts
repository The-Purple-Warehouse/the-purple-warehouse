import mongoose from "../db";

export default mongoose.model(
    "ScoutingRating",
    new mongoose.Schema({
        category: {
            ref: "ScoutingCategory",
            type: mongoose.Schema.Types.ObjectId
        },
        rating: Number
    })
);
