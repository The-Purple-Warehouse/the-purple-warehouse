import development from "./development";
import staging from "./staging";
import production from "./production";

const env = process.env.NODE_ENV || "development";

if (!["development", "staging", "production"].includes(env))
    throw new Error(`Config file for environment ${env} could not be found.`);
const config: Config = env === "production" ? production : (env === "staging" ? staging : development);

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
        access: {
            restricted: boolean;
            username?: string;
            password?: string;
        };
    };
    features: string[];
}
