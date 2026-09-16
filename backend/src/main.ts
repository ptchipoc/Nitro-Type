import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { AppValidationPipe } from "./common/pipes/validation.pipe";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { IoAdapter } from "@nestjs/platform-socket.io";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true, // necessário para WebhookSignatureGuard
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("app.port") ?? 3000;
  const name = config.get<string>("app.name") ?? "Transcender";
  const isProd = config.get<boolean>("app.isProd") ?? false;

  // ── Cookie Parser ───────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── Global Pipes / Filters / Interceptors ───────────────────────────────────
  app.useGlobalPipes(AppValidationPipe);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger ─────────────────────────────────────────────────────────────────
  if (!isProd) {
    const swaggerCfg = new DocumentBuilder()
      .setTitle(name)
      .setDescription("Backend API Transcender")
      .setVersion("1.0.0")
      .addBearerAuth()
      .addCookieAuth("refresh_token")
      .addCookieAuth("access_token")
      .addServer("/backend", "Backend API")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerCfg);
    app.use(
      "/swagger",
      apiReference({
        spec: {
          content: document,
        },
        theme: "dark",
      }),
    );
  }

  app.enableCors(config.get("app.cors"));
  await app.listen(port);
  console.log(`\n🚀 ${name}: http://localhost:${port}`);
  console.log(` CORS:`, config.get("app.cors"));
  if (!isProd) console.log(`📚 Swagger:  http://localhost:${port}/swagger`);
}

bootstrap();
