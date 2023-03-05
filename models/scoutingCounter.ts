import mongoose from "../db";

export default mongoose.model(
    "ScoutingCounter",
    new mongoose.Schema({
        category: {
            ref: "ScoutingCategory",
            type: mongoose.Schema.Types.ObjectId
        },
        counter: Number
    })
);
