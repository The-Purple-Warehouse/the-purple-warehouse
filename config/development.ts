import { Config } from ".";
// @ts-ignore
import secret from "./secret";

const config: Config = {
    branch: "main",
    server: {
        port: 8080,
        domain: "localhost"
    },
    db: {
        database: "tpw-dev",
        username: "",
        password: "",
        host: "localhost",
        port: 27017
    },
    auth: {
        cookieKeys: ["1", "2", "3", "4", "I declare a thumb war"],
        access: {
            restricted: false,
            username: "admin",
            password: "admin"
        },
        ci: {
            deploy: ""
        },
        scoutingKeys: ["1", "2", "3", "4", "I declare a thumb war"],
        tba: secret.development.auth.tba,
        scoutingAdmins: [""]
    },
    features: ["scouting", "resources"]
};

export default config;
