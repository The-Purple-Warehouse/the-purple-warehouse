import * as fs from "fs";
import development from "./development";

let secret = {
    development: development,
    staging: development,
    production: development
};

try {
    let path =
        __dirname +
        (__dirname.endsWith("build/config")
            ? "/../../config/secret.json"
            : "/secret.json");
    if (fs.existsSync(path)) {
        secret = JSON.parse(fs.readFileSync(path).toString());
    }
} catch (err) {}

export default secret;
