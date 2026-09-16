import { jwtEnv } from "./env/jwt.env";
import { redisEnv } from "./env/redis.env";

export const appConfig = () => ({
  app: {
    name: process.env.APP_NAME ?? "Transcender",
    port: parseInt(process.env.PORT ?? "3000", 10),
    env: process.env.NODE_ENV ?? "development",
    isDev: (process.env.NODE_ENV ?? "development") === "development",
    isProd: process.env.NODE_ENV === "production",
    cors: {
      origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
      credentials: true,
    },
    seed: {
      adminName: process.env.ADMIN_NAME ?? "Hunter Keymura",
      adminEmail: process.env.ADMIN_EMAIL ?? "x@NT.com",
      adminPassword: process.env.ADMIN_PASSWORD ?? "Pass@1234",
      adminUsername: process.env.ADMIN_USERNAME ?? "keymura",
    },
  },
  jwt: jwtEnv(),
  redis: redisEnv(),
  email: {
    provider: process.env.EMAIL_PROVIDER ?? "resend",
    from: process.env.EMAIL_FROM ?? "noreply@transcender.app",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    smtp: {
      host: process.env.SMTP_HOST ?? "",
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  },
  otp: {
    expiresSeconds: parseInt(process.env.OTP_EXPIRES_SECONDS ?? "300", 10),
  },
  log: {
    level: process.env.LOG_LEVEL ?? "debug",
    pretty: process.env.LOG_PRETTY === "true",
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET ?? "webhook-secret",
  },
});

export interface AppConfig {
  app: {
    name: string;
    port: number;
    env: string;
    isDev: boolean;
    isProd: boolean;
    cors: {
      origin: string;
      credentials: boolean;
    };
    seed: {
      adminName: string;
      adminEmail: string;
      adminPassword: string;
      adminUsername: string;
    };
  };
  jwt: {
    accessSecret: string;
    accessExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  email: {
    provider: string;
    from: string;
    resendApiKey: string;
    smtp: {
      host: string;
      port: number;
      user: string;
      pass: string;
    };
  };
  otp: {
    expiresSeconds: number;
  };
  log: {
    level: string;
    pretty: boolean;
  };
  webhook: {
    secret: string;
  };
}
