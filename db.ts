import mongoose from "mongoose";
import config from "./config";

if (config.db.username == "" && config.db.password == "") {
    const mongoUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`
    mongoose.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
} else {
    const mongoUrl = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`
    mongoose.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
}

mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", function (e) {
    console.log("Error with MongoDB: " + e);
    process.exit(1);
});

db.once("open", function () {
    console.log(`Successfully connected to MongoDB on port ${config.db.port}`);
});

export default mongoose;

export function toObjectId(s: string) {
    return new mongoose.Schema.Types.ObjectId(s);
}

export function isValidID(ID: string) {
    return mongoose.Types.ObjectId.isValid(ID);
}
