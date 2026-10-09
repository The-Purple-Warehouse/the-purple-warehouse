import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "3000",
    server: {
        port: 18900,
        domain: "2026ma.thepurplewarehouse.com"
    },
    db: secret.production3000.db,
    auth: secret.production3000.auth,
    features: ["scouting", "tps"],
    year: 3000
};

export default config;
