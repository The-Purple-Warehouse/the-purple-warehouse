import { Config } from "."

const config: Config = {
	server: {
		port: 8000,
		domain: "localhost"
	},
	db: {
		database: 'tpw-dev',
		username: '',
		password: '',
		host: 'localhost',
		port: 27017,
	},
}

export default config;