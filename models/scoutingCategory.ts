import mongoose from "../db";

export default mongoose.model(
    "ScoutingCategory",
    new mongoose.Schema({
        name: String,
        identifier: String,
        dataType: {
            type: String,
            required: false
        }
    })
);
