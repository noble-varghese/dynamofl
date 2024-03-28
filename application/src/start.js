import { logger } from "./logger/logger.js";
import { startWebServer } from "./entrypoints/server.js"

async function start() {
    startWebServer()
}

start();