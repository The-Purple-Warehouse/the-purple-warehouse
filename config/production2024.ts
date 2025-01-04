import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "2024",
    server: {
        port: 18924,
        domain: "2024.thepurplewarehouse.com"
    },
    db: secret.production2024.db,
    auth: secret.production2024.auth,
    features: ["scouting", "tps"],
    year: 2024
};

export default config;