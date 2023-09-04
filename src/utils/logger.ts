import { format, createLogger, transports } from 'winston'
import 'winston-daily-rotate-file'

const { combine, timestamp, label } = format

const CATEGORY = 'Log Rotation'

const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/rotate-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
})

export const logger = createLogger({
  level: 'error',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: 'ddd-DD-MMM-YYYY MM-DD-YYYY HH:mm:ss',
    }),
    format.prettyPrint()
  ),
  transports: [fileRotateTransport, new transports.Console()],
  silent: process.env.NODE_ENV === 'test',
})
