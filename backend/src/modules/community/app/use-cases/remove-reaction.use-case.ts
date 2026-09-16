import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MessageRepository } from "../../domain/repository/message.repo";

@Injectable()
export class RemoveReactionUseCase {
  private readonly logger = new Logger(RemoveReactionUseCase.name);

  constructor(private readonly messageRepo: MessageRepository) {}

  async execute(messageId: string, emoji: string, userId: string) {
    const message = await this.messageRepo.findById(messageId);
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada");
    }

    message.removeReaction(emoji, userId);
    await this.messageRepo.save(message);

    this.logger.log(
      `Reaction ${emoji} removed from message ${messageId} by ${userId}`,
    );
  }
}
