import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { UserRegisteredEvent } from "@modules/auth/domain/events/user-registered.event";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ResendOtpService {
  private readonly logger = new Logger(ResendOtpService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly verificationRepo: VerificationRepository,
    private readonly eventBus: EventBusPort,
    private readonly config: ConfigService,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    const genericResponse = {
      message:
        "Se a conta existir e não estiver verificada, receberás um novo código.",
    };

    const user = await this.userRepo.findByEmail(email);
    if (!user) return genericResponse;

    if (user.emailVerified) return genericResponse;

    const expiresSeconds = this.config.get<number>("otp.expiresSeconds") ?? 300;

    await this.verificationRepo.deleteByIdentifierAndType(
      email,
      VerificationType.EMAIL_VERIFICATION,
    );

    const verification = VerificationEntity.generate(
      email,
      expiresSeconds,
      VerificationType.EMAIL_VERIFICATION,
    );

    await this.verificationRepo.save(verification);

    await this.eventBus.publish([
      new UserRegisteredEvent(user.id, user.email, user.name),
    ]);

    this.logger.log(`OTP reenviado para ${email}`);
    return genericResponse;
  }
}
