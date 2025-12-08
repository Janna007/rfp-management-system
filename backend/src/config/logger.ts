import winston from 'winston'
const { combine, timestamp, json } = winston.format

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { serviceName: 'rfp-management system' },
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: combine(timestamp(), json()),
            // silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combine.log',
            level: 'info',
            format: combine(timestamp(), json()),
            // silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp(), json()),
            // silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'debug.log',
            level: 'debug',
            format: combine(timestamp(), json()),
            // silent: Config.NODE_ENV === 'test',
        }),
    ],
})

export default logger
