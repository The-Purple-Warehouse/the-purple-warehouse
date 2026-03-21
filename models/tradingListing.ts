import mongoose from "../db";

export default mongoose.model(
    "TradingListing",
    new mongoose.Schema({
        type: {
            type: String,
            enum: ["offer", "request"],
            required: true
        },
        team: {
            type: Number,
            required: true
        },
        teamName: String,
        item: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        description: String,
        contact: {
            type: String,
            required: true
        },
        event: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    })
);
