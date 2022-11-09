import mongoose from "../db";

export default mongoose.model(
    "Resource",
    new mongoose.Schema({
        identifier: String,
        type: String,
        name: String,
        parent: String,
        content: {}
    })
);
