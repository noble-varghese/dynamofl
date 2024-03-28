import { createLogger, format as _format, transports as _transports } from 'winston';
const { combine, timestamp, printf, align, colorize } = _format;

const devLogger = () => {
    return createLogger({
        format: combine(
            colorize({ all: true }),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            align(),
            printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        transports: [new _transports.Console()]
    });
}

const prodLogger = () => {
    return createLogger({
        format: _format.simple(),
        transports: [new _transports.Console()]
    });
}

// If we're not in production then log to the `console` with the format:
export const logger = process.env.NODE_ENV === 'production' ? prodLogger() : devLogger()
