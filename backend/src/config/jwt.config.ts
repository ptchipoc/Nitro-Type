import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>("jwt.accessSecret"),
  signOptions: { expiresIn: config.get<string>("jwt.accessExpiresIn") },
});
