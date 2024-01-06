import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "2023",
    server: {
        port: 18923,
        domain: "2023.thepurplewarehouse.com"
    },
    db: secret.production2023.db,
    auth: secret.production2023.auth,
    features: ["scouting"],
    year: 2023
};

export default config;