import { Injectable, NotFoundException } from "@nestjs/common";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";

@Injectable()
export class GetResultUseCase {
  constructor(private readonly resultRepo: TypingSessionResultRepository) {}

  async execute(resultId: string) {
    const result = await this.resultRepo.findById(resultId);
    if (!result) throw new NotFoundException("Resultado nao encontrado");
    return result.publicData();
  }
}
