import development from "./development";
import staging from "./staging";
import production from "./production";
import production2023 from "./production2023";
import production2024 from "./production2024";

const env = process.env.NODE_ENV || "development";

if (
    ![
        "development",
        "staging",
        "production",
        "production2023",
        "production2024"
    ].includes(env)
)
    throw new Error(`Config file for environment ${env} could not be found.`);
const config: Config = {
    production,
    production2023,
    production2024,
    staging,
    development
}[env];

export default config;

export interface Config {
    branch: string;
    server: {
        port: number;
        domain: string;
    };
    db?: {
        database: string;
        username: string;
        password: string;
        host: string;
        port: number;
    };
    auth?: {
        cookieKeys: string[];
        access: {
            restricted: boolean;
            username?: string;
            password?: string;
        };
        ci: {
            deploy: string;
        };
        scoutingKeys: string[];
        tba: string;
        scoutingAdmins: string[];
        blacklist: string[];
        scoutingInternal: {
            teamNumber: string;
            accessToken: string;
        };
        adminTokens: any;
    };
    features: string[];
    year: number;
}
