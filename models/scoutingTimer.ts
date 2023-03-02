import mongoose from "../db";

export default mongoose.model(
    "ScoutingTimer",
    new mongoose.Schema({
        category: {
            ref: "ScoutingCategory",
            type: mongoose.Schema.Types.ObjectId
        },
        timer: Number
    })
);
