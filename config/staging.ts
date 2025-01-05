import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "staging",
    server: {
        port: 8971,
        domain: "staging.thepurplewarehouse.com"
    },
    db: secret.staging.db,
    auth: secret.staging.auth,
    features: ["scouting", "tps"],
    year: 2025
};

export default config;
