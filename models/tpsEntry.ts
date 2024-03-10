import mongoose from "../db";

export interface TPSEntryType {
    metadata: any;
    abilities: any;
    counters: any;
    data: any;
    ratings: any;
    timers: any;
    serverTimestamp: number;
    accuracy: number;
    hash: string;
    privacy: TPSPrivacyRule[];
    threshold: number;
}

export interface TPSPrivacyRule {
    path: string;
    private?: boolean;
    teams?: string[];
    type?: "scrambled" | "redacted" | "excluded";
    detail?: any;
}

export default mongoose.model(
    "TPSEntry",
    new mongoose.Schema({
        metadata: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        abilities: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        counters: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        data: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        ratings: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        timers: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        serverTimestamp: Number,
        accuracy: {
            required: false,
            type: Number
        },
        hash: String,
        privacy: {
            required: false,
            type: mongoose.Schema.Types.Mixed
        },
        threshold: {
            required: false,
            type: Number
        }
    })
);
