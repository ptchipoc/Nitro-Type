import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TokenModule } from "@shared/adapters/token/token.module";
import { EmailModule } from "@shared/adapters/email/email.module";
import { EmailSignInService } from "./app/services/email-sign-in.service";
import { VerifyOtpService } from "./app/services/verify-otp.service";
import { ProviderSignInService } from "./app/services/provider-sign-in.service";
import { RefreshTokenService } from "./app/services/refresh-token.service";
import { VerificationRepository } from "./domain/repo/verification.repo";
import { PrismaVerificationRepository } from "./infra/repo/prisma-verification.repo";
import { SendOtpProcessor } from "./infra/jobs/send-otp.processor";
import { UserRegisteredListener } from "./infra/listeners/user-registered.listener";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { HashAdapter } from "@shared/adapters/hash/hash.adapter";
import { ResetPasswordService } from "./app/services/reset-password.service";
import { ForgotPasswordService } from "./app/services/forgot-password.service";
import { PasswordResetRequestedListener } from "./infra/listeners/password-reset-requested.listener";
import { AuthEmailController } from "./presentation/controllers/auth-email.controller";
import { AuthPasswordController } from "./presentation/controllers/auth-password.controller";
import { AuthProviderController } from "./presentation/controllers/auth-provider.controller";
import { AuthSessionController } from "./presentation/controllers/auth-session.controller";
import { ResendOtpService } from "./app/services/resend-otp.service";
import { EmailSignUpService } from "./app/services/email-sign-up.service";
import { CommunityModule } from "@modules/community/community.module";

@Module({
  imports: [
    BullModule.registerQueue({ name: "auth" }),
    TokenModule,
    EmailModule,
    CommunityModule,
  ],
  controllers: [
    AuthEmailController,
    AuthPasswordController,
    AuthProviderController,
    AuthSessionController,
  ],
  providers: [
    EmailSignUpService,
    EmailSignInService,
    VerifyOtpService,
    ProviderSignInService,
    RefreshTokenService,
    ResetPasswordService,
    ForgotPasswordService,
    SendOtpProcessor,
    ResendOtpService,
    UserRegisteredListener,
    PasswordResetRequestedListener,
    {
      provide: VerificationRepository,
      useClass: PrismaVerificationRepository,
    },
    { provide: HashPort, useClass: HashAdapter },
  ],
  exports: [
    EmailSignInService,
    VerifyOtpService,
    ProviderSignInService,
    RefreshTokenService,
  ],
})
export class AuthModule {}
