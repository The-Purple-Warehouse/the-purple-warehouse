import mongoose from "../db";

let ScoutingContributor = new mongoose.Schema({
    team: {
        ref: "Team",
        type: mongoose.Schema.Types.ObjectId
    },
    username: String
});

let ScoutingData = new mongoose.Schema({
    category: {
        ref: "ScoutingCategory",
        type: mongoose.Schema.Types.ObjectId
    },
    data: mongoose.Schema.Types.Mixed
});

let ScoutingAbility = new mongoose.Schema({
    category: {
        ref: "ScoutingCategory",
        type: mongoose.Schema.Types.ObjectId
    },
    ability: mongoose.Schema.Types.Mixed
});

let ScoutingCounter = new mongoose.Schema({
    category: {
        ref: "ScoutingCategory",
        type: mongoose.Schema.Types.ObjectId
    },
    counter: Number
});

let ScoutingTimer = new mongoose.Schema({
    category: {
        ref: "ScoutingCategory",
        type: mongoose.Schema.Types.ObjectId
    },
    timer: Number
});

let ScoutingRating = new mongoose.Schema({
    category: {
        ref: "ScoutingCategory",
        type: mongoose.Schema.Types.ObjectId
    },
    rating: Number
});

export default mongoose.model(
    "ScoutingEntry",
    new mongoose.Schema({
        contributor: ScoutingContributor,
        event: String,
        match: Number,
        team: String,
        color: String,
        data: [ScoutingData],
        abilities: [ScoutingAbility],
        counters: [ScoutingCounter],
        timers: [ScoutingTimer],
        ratings: [ScoutingRating],
        comments: String,
        clientTimestamp: Number,
        serverTimestamp: Number,
        hash: String
    })
);
