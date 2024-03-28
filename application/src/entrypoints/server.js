import express from 'express';
import { logger } from "../logger/logger.js";
import helmet from 'helmet';
import { defineRoutes } from './routes.js';
import errorHandler from '../middlewares/errorHandler.js';
import { config } from "../configuration/index.js"
import '../data-loaders/index.js';

export const startWebServer = async (cfgFile = null) => {
    logger.info("Starting the server")

    const app = express();



    // Helmet helps secure Express apps by setting HTTP response headers.
    app.use(helmet())
    // app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    defineRoutes(app)

    // Error Handler middleware.
    app.use(errorHandler);

    const APIAddress = await openConnection(app);
    return APIAddress;
}

const openConnection = (app) => {
    const serverPort = config.server.port
    const hostName = config.server.host
    const connection = app.listen(serverPort, hostName, () => {
        logger.info(`Server is running on ${hostName}:${serverPort}`)
        return connection.address()
    })
    return new Promise(() => { });
}