import { createLogger, transports, format } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

// Create a custom transport for console
const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
});

// Setup logger for production using winston and for development using console.log
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: isProduction
    ? [
        new transports.File({
          filename: '/home/ec2-user/server/dist/server.log',
        }),
      ]
    : [consoleTransport],
});

export default logger;
