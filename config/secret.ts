import * as fs from "fs";

let secret: any = {};

try {
    let path =
        __dirname +
        (__dirname.endsWith("build/config")
            ? "/../../config/secret.json"
            : "/secret.json");
    if (fs.existsSync(path)) {
        let secretFile = JSON.parse(fs.readFileSync(path).toString());
        if(secretFile.development != null) {
            secret.development = secretFile.development;
        }
        if(secretFile.staging != null) {
            secret.staging = secretFile.staging;
        }
        if(secretFile.production != null) {
            secret.production = secretFile.production;
        }
    }
} catch (err) {}

export default secret;
