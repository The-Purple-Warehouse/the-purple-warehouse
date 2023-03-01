import { Config } from ".";
import secret from "./secret";

const config: Config = {
    server: {
        port: 5000,
        domain: "thepurplewarehouse.com",
    },
    db: secret.production.db,
    auth: secret.production.auth,
    features: ["scouting"]
};

export default config;
