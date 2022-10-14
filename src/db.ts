import * as mongoose from "mongoose"
import config from "./config"

if (config.db.username == "" && config.db.password == "")
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
else
    mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", function (e) {
    console.log("Error with MongoDB: " + e);
    process.exit(1)
})

db.once("open", function () {
    console.log(`Successfully connected to MongoDB on port ${config.db.port}`)
})

export default mongoose;