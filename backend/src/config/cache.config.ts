import { ConfigService } from "@nestjs/config";
import { CacheModuleOptions } from "@nestjs/cache-manager";

export const cacheConfig = (config: ConfigService): CacheModuleOptions => ({
  store: "redis",
  host: config.get<string>("redis.host"),
  port: config.get<number>("redis.port"),
  password: config.get<string>("redis.password"),
  db: config.get<number>("redis.db"),
});
