import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bullmq";
import { LoggerModule } from "nestjs-pino";
import { appConfig } from "@config/app.config";
import { PrismaModule } from "@shared/database/prisma.module";
import { AuthModule } from "@modules/auth/auth.module";
import { UserModule } from "@modules/user/user.module";
import { TokenModule } from "@shared/adapters/token/token.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { bullConfig } from "@config/bull.config";
import { jwtConfig } from "@config/jwt.config";
import { loggerConfig } from "@config/logger.config";
import { TypingModule } from "@modules/typing/typing.module";
import { AppService } from "./app/app.service";
import { NotificationModule } from "@modules/notification/notification.module";
import { ScheduleModule } from "@nestjs/schedule";
import { EventModule } from "@modules/events/event.module";
import { RedisModule } from "@shared/modules/redis/redis.module";
import { CacheModule } from "@nestjs/cache-manager";
import { cacheConfig } from "@config/cache.config";
import { CommunityModule } from "@modules/community/community.module";
import { AppController } from "./app/app.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { throttlerConfig } from "@config/throttler.config";
import { EventBusModule } from "@shared/modules/events/event-bus.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: throttlerConfig,
    }),

    RedisModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: cacheConfig,
    }),
    ScheduleModule.forRoot(),
    // LoggerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: loggerConfig,
    // }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: bullConfig,
    }),

    EventEmitterModule.forRoot({ wildcard: true }),
    PrismaModule,
    TokenModule,
    EventBusModule,
    AuthModule,
    UserModule,
    TypingModule,
    EventModule,
    CommunityModule,
    NotificationModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
  controllers: [AppController],
})
export class AppModule {}
