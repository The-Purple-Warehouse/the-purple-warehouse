import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "prod",
    server: {
        port: 8970,
        domain: "thepurplewarehouse.com"
    },
    db: secret.production.db,
    auth: secret.production.auth,
    features: ["scouting", "tps"],
    year: 2026
};

export default config;
