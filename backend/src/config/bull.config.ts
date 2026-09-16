import { ConfigService } from "@nestjs/config";
import { BullRootModuleOptions } from "@nestjs/bullmq";

export const bullConfig = (config: ConfigService): BullRootModuleOptions => ({
  connection: {
    host: config.get<string>("redis.host"),
    port: config.get<number>("redis.port"),
    password: config.get<string>("redis.password"),
  },
});
