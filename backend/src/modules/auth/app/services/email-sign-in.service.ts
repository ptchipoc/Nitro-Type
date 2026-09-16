import { UserRepository } from "@modules/user/domain/repository/user.repo";
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { TokenPort } from "@shared/adapters/token/token.port";
import { EmailSignInInput } from "@modules/auth/presentation/inputs/email-sign-in.input";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";

@Injectable()
export class EmailSignInService {
  private readonly logger = new Logger(EmailSignInService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly hash: HashPort,
    private readonly token: TokenPort,
  ) {}

  async execute(input: EmailSignInInput) {
    const user = await this.userRepo.findByEmail(input.email);

    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "Esta conta usa login social. Usa Google/GitHub/42Intra.",
      );
    }

    const valid = await this.hash.compare(input.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login falhado: ${input.email}`);
      throw new UnauthorizedException("Credenciais inválidas");
    }

    if (!user.emailVerified) {
      throw new ForbiddenException(
        "Email não verificado. Verifica o teu email para continuar.",
      );
    }

    if (
      user.status === UserStatus.SUSPENDED ||
      user.status === UserStatus.BANNED
    ) {
      throw new ForbiddenException("Conta suspensa ou banida");
    }

    user.recordLogin();
    await this.userRepo.save(user);

    this.logger.log(`Login: ${user.id}`);
    const pair = this.token.generatePair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { user: user.publicMiniData(), ...pair };
  }
}
