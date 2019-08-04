const { createLogger, format, transports } = require('winston')


const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.colorize(),
    myFormat
  ),
  transports: [
    new transports.Console()
  ],
})

module.exports = logger
