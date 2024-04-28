import winston from "winston";
import "winston-daily-rotate-file";

const { createLogger, format, transports } = winston;

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // This captures error information
    format.splat(),
    format.json(),
    format.printf((info) => {
      if (info.message instanceof Error) {
        return `${info.timestamp} ${info.level}: ${
          info.message.stack
        }\nAdditional Info: ${info.additionalInfo || ""}`;
      }
      return `${info.timestamp} ${info.level}: ${
        info.message
      }\nAdditional Info: ${info.additionalInfo || ""}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),
  ],
});

export default logger;
