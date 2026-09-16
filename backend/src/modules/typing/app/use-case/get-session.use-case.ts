import { Injectable, NotFoundException } from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";

@Injectable()
export class GetSessionUseCase {
  constructor(private readonly sessionRepo: TypingSessionRepository) {}

  async execute(sessionId: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException("Sessao nao encontrada");
    return session.publicData();
  }
}
