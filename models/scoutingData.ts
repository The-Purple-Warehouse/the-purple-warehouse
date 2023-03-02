import mongoose from "../db";

export default mongoose.model(
    "ScoutingData",
    new mongoose.Schema({
        category: {
            ref: "ScoutingCategory",
            type: mongoose.Schema.Types.ObjectId
        },
        data: String
    })
);
