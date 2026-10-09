import { resolve } from "node:path";
import dotenv from "dotenv";
const NODE_ENV = process.env.NODE_ENV || "development";
const envPaths = {
    development: ".env.development",
    production: ".env.production",
};
const envFile = envPaths[NODE_ENV] || ".env.development";
dotenv.config({
    path: resolve(`${envFile}`),
});
export const config = {
    PORT: Number(process.env.PORT) || 3000,
    MONGO_URI: process.env.MONGO_URI,
};
//# sourceMappingURL=config.service.js.map