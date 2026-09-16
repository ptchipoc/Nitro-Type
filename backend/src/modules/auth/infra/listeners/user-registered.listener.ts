import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { UserRegisteredEvent } from "@modules/auth/domain/events/user-registered.event";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";
import { ConfigService } from "@nestjs/config";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";
import { CommunityService } from "@modules/community/app/services/community.service";

/**
 * UserRegisteredListener — reage ao evento AUTH.USER_REGISTERED.
 * Gera o OTP e enfileira o job de envio de email.
 */
@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  constructor(
    private readonly verificationRepo: VerificationRepository,
    private readonly config: ConfigService,
    private readonly community: CommunityService,
    @InjectQueue("auth") private readonly authQueue: Queue,
  ) {}

  @OnEvent("AUTH.USER_REGISTERED")
  async handle(event: UserRegisteredEvent): Promise<void> {
    this.logger.log(`[Event] USER_REGISTERED — ${event.email}`);

    await this.community.addMemberInPulbicChannel(event.userId);

    if (event.state === "OTP") {
      const expiresSeconds =
        this.config.get<number>("otp.expiresSeconds") ?? 300;

      await this.verificationRepo.deleteByIdentifier(event.email);
      const verification = VerificationEntity.generate(
        event.email,
        expiresSeconds,
        VerificationType.EMAIL_VERIFICATION,
      );
      await this.verificationRepo.save(verification);

      await this.authQueue.add(
        "send-otp",
        {
          email: event.email,
          name: event.name,
          code: verification.value,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      this.logger.debug(`[Event] OTP enfileirado para ${event.email}`);
    }
  }
}
