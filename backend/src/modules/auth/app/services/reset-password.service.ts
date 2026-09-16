import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";
import { ResetPasswordInput } from "@modules/auth/presentation/inputs/reset-password.input";

@Injectable()
export class ResetPasswordService {
  private readonly logger = new Logger(ResetPasswordService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly verificationRepo: VerificationRepository,
    private readonly hash: HashPort,
  ) {}

  async execute(input: ResetPasswordInput): Promise<{ message: string }> {
    const verification = await this.verificationRepo.findByIdentifierAndType(
      input.email,
      VerificationType.PASSWORD_RESET,
    );

    if (!verification)
      throw new UnauthorizedException("Código inválido ou já usado");
    if (verification.isExpired()) {
      await this.verificationRepo.delete(verification.id);
      throw new UnauthorizedException("Código expirado — solicita um novo");
    }
    if (verification.value !== input.code)
      throw new UnauthorizedException("Código inválido");

    await this.verificationRepo.delete(verification.id);

    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new UnauthorizedException("Utilizador não encontrado");

    user.upadatePassword(await this.hash.hash(input.newPassword));
    await this.userRepo.save(user);

    this.logger.log(`Password redefinida: ${user.id}`);
    return { message: "Password actualizada com sucesso." };
  }
}
