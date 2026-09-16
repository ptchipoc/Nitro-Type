import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { PasswordResetRequestedEvent } from "@modules/auth/domain/events/password-reset-requested.event";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly verificationRepo: VerificationRepository,
    private readonly eventBus: EventBusPort,
    private readonly config: ConfigService,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    this.logger.log(`Password reset solicitado: ${email}`);

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      this.logger.warn(`[AUTH] Não exite um usuário com esse email ${email}`);
      return { message: "Se o email existir, receberás um código em breve." };
    }

    const expiresSeconds = this.config.get<number>("otp.expiresSeconds") ?? 300;

    await this.verificationRepo.deleteByIdentifierAndType(
      email,
      VerificationType.PASSWORD_RESET,
    );

    const verification = VerificationEntity.generate(
      email,
      expiresSeconds,
      VerificationType.PASSWORD_RESET,
    );

    await this.verificationRepo.save(verification);

    await this.eventBus.publish([
      new PasswordResetRequestedEvent(
        user.email,
        user.name,
        verification.value,
      ),
    ]);

    return { message: "Se o email existir, receberás um código em breve." };
  }
}
