import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MessageRepository } from "../../domain/repository/message.repo";

@Injectable()
export class DeleteMessageUseCase {
  private readonly logger = new Logger(DeleteMessageUseCase.name);

  constructor(private readonly messageRepo: MessageRepository) {}

  async execute(messageId: string, userId: string) {
    const message = await this.messageRepo.findById(messageId);
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada");
    }

    if (message.authorId !== userId) {
      throw new ForbiddenException("Não podes apagar mensagens de outros");
    }

    message.delete();
    await this.messageRepo.save(message);

    this.logger.log(`Message deleted: ${messageId}`);
  }
}
