export interface JwtEnv {
  accessSecret: string;
  accessExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export const jwtEnv = (): JwtEnv => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "access-secret",
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "refresh-secret",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
});
