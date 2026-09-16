import { Injectable } from "@nestjs/common";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";

@Injectable()
export class GetSessionResultsUseCase {
  constructor(private readonly resultRepo: TypingSessionResultRepository) {}

  async execute(sessionId: string) {
    const results = await this.resultRepo.findBySessionId(sessionId);
    return results.map((result) => result.publicData());
  }
}
