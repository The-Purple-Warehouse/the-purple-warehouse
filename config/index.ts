import * as production from "./production";
import * as development from "./development";

const env = process.env.NODE_ENV || "development";

const config = { production, development }[env] as Config;
if (!config) throw new Error(`Config file for environment ${env} could not be found.`);

export default config;

export interface Config {
	server: {
		port: number,
		domain: string
	}
}