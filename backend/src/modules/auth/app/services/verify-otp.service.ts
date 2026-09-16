import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { TokenPort } from "@shared/adapters/token/token.port";

@Injectable()
export class VerifyOtpService {
  private readonly logger = new Logger(VerifyOtpService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly verificationRepo: VerificationRepository,
    private readonly token: TokenPort,
  ) {}

  async execute(email: string, code: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException("Utilizador não encontrado");

    if (user.isEmailVerified())
      throw new UnauthorizedException("Utilizador já verificado");

    const verification = await this.verificationRepo.findByIdentifier(email);

    if (!verification)
      throw new UnauthorizedException("OTP não encontrado ou já usado");
    if (verification.isExpired()) {
      await this.verificationRepo.deleteByIdentifier(email);
      throw new UnauthorizedException("OTP expirado — solicita um novo");
    }
    if (verification.value !== code)
      throw new UnauthorizedException("OTP inválido");

    await this.verificationRepo.delete(verification.id);

    user.verifyEmail();
    user.recordLogin();
    await this.userRepo.save(user);

    this.logger.log(`Email verificado: ${user.id}`);

    const pair = this.token.generatePair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { user: user.publicData(), ...pair };
  }
}
