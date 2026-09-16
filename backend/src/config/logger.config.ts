import { ConfigService } from "@nestjs/config";
import { Params } from "nestjs-pino";

export const loggerConfig = (config: ConfigService): Params => ({
  pinoHttp: {
    level: config.get("log.level") ?? "debug",
    transport: config.get<boolean>("log.pretty")
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
    redact: ["req.headers.authorization", 'req.headers["x-signature"]'],
  },
});
