import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { TokenPort } from "@shared/adapters/token/token.port";

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly token: TokenPort,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException("Refresh token não fornecido");

    let payload: { sub: string };
    try {
      payload = this.token.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedException("Refresh token inválido ou expirado");
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException("Utilizador não encontrado");

    this.logger.debug(`Refresh token renovado: ${user.id}`);
    const pair = this.token.generatePair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return pair;
  }
}
