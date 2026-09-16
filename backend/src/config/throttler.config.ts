import { ConfigService } from "@nestjs/config";
import { ThrottlerModuleOptions, seconds } from "@nestjs/throttler";
// import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import Redis from "ioredis";

export const throttlerConfig = (
  config: ConfigService,
): ThrottlerModuleOptions => ({
  throttlers: [
    { name: "critical_auth", ttl: seconds(60), limit: 5 },
    { name: "critical_signup", ttl: seconds(60), limit: 3 },
    { name: "high", ttl: seconds(60), limit: 10 },
    { name: "medium", ttl: seconds(60), limit: 30 },
    { name: "low", ttl: seconds(60), limit: 60 },
  ],
  errorMessage: "Demasiadas tentativas, por favor tenta novamente mais tarde.",
  //   storage: new ThrottlerStorageRedisService(
  //     new Redis({
  //       host: config.get("REDIS_HOST", "localhost"),
  //       port: config.get<number>("REDIS_PORT", 6379),
  //       password: config.get("REDIS_PASSWORD"),
  //     }),
  //   ),
});
