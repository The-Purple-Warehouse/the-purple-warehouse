import production from "./production";
import development from "./development";

const env = process.env.NODE_ENV || "development";

if (!["development", "production"].includes(env))
    throw new Error(`Config file for environment ${env} could not be found.`);
const config: Config = env === "production" ? production : development;

export default config;

export interface Config {
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
    };
    features: string[];
}
