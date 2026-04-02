import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import moment from 'moment-timezone';
import DailyRotateFile = require('winston-daily-rotate-file')

const instanceId = process.env.NODE_APP_INSTANCE || '0';
const appendTimestamp = winston.format.timestamp({
    format: () => moment().tz('Asia/Jakarta').format()
});

export const winstonConfig = {
    transports : [
        new winston.transports.Console({
            format : winston.format.combine(
                appendTimestamp,
                // Kita tambahkan info [Instance ID] di console
                winston.format.printf(({ timestamp, level, message, context }) => {
                    return `[${timestamp}] [Instance-${instanceId}] ${level}: [${context || 'App'}] ${message}`;
                }),
                winston.format.colorize({ all: true }),
            )
        }),
        new DailyRotateFile({
            filename: 'logging/logs/app-%DATE%.log',
            datePattern: 'YYYY-MM',
            zippedArchive: true,
            maxSize: '500m',
            // maxFiles: '12m',
            format : winston.format.combine(
                appendTimestamp,
                winston.format((info) => {
                    info.instance_id = Number(instanceId);
                    return info;
                })(),
                winston.format.json()
            )
        })
    ]
}

