import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { SessionStatus } from "@shared/entities/enums/session";

@Injectable()
export class ActivateSessionUseCase {
  constructor(
    private readonly sessionRepo: TypingSessionRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string, sessionId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Usuario nao encontrado");
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException("Sessao nao encontrada");
    if (session.creatorId !== user.id)
      throw new UnauthorizedException("Nao autorizado");
    switch (session.status) {
      case SessionStatus.ACTIVE:
        throw new BadRequestException("Sessao ja esta ativa");
      case SessionStatus.FINISHED:
        throw new BadRequestException("Sessao ja terminou");
      default:
        break;
    }
    session.activate();
    await this.sessionRepo.save(session);
    return session.publicData();
  }
}
