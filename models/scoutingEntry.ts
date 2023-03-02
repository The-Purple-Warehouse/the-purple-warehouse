import mongoose from "../db";

export default mongoose.model(
    "ScoutingEntry",
    new mongoose.Schema({
        contributor: {
            ref: "ScoutingContributor",
            type: mongoose.Schema.Types.ObjectId
        },
        match: Number,
        team: String,
        color: String,
        data: [{
            ref: "ScoutingData",
            type: mongoose.Schema.Types.ObjectId
        }],
        abilities: [{
            ref: "ScoutingAbility",
            type: mongoose.Schema.Types.ObjectId
        }],
        counters: [{
            ref: "ScoutingCounter",
            type: mongoose.Schema.Types.ObjectId
        }],
        timers: [{
            ref: "ScoutingTimer",
            type: mongoose.Schema.Types.ObjectId
        }],
        ratings: [{
            ref: "ScoutingRating",
            type: mongoose.Schema.Types.ObjectId
        }],
        comments: String
    })
);
