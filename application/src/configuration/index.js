import convict from "convict";
import * as fs from "fs"
import * as yaml from "js-yaml"
import schema from "./schema.js"
import { logger } from "../logger/logger.js";
import { strict } from "assert";
import { DEFAULT_CONFIG_FILE } from "../utils/constants.js";

export const initializeAndValidate = (ymlData) => {
    const config = convict(schema)
    const loadedConfig = config.load(ymlData)
    config.validate({ allowed: strict });
    return loadedConfig.toString()
}

export const readConfig = (file) => {
    const path = file ?? DEFAULT_CONFIG_FILE
    const data = yaml.load(fs.readFileSync(path, 'utf8'));
    const config = initializeAndValidate(data)
    logger.info('Config Validation successful! The configuration is valid.')
    return JSON.parse(config)
}

const initConfig = () => {
    const config = readConfig()
    return config
}

export const config = initConfig()