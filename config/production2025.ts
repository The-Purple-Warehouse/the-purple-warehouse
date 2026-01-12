import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "2025",
    server: {
        port: 18925,
        domain: "2025.thepurplewarehouse.com"
    },
    db: secret.production2025.db,
    auth: secret.production2025.auth,
    features: ["scouting", "tps"],
    year: 2025
};

export default config;
