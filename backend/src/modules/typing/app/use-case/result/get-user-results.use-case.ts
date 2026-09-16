import { Injectable } from "@nestjs/common";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";

@Injectable()
export class GetUserResultsUseCase {
  constructor(private readonly resultRepo: TypingSessionResultRepository) {}

  async execute(userId: string) {
    const results = await this.resultRepo.findByUserId(userId);
    return results.map((result) => result.publicData());
  }
}
