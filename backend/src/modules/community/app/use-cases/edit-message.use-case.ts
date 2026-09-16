import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MessageRepository } from "../../domain/repository/message.repo";
import { EditMessageInput } from "../../presentation/inputs/edit-message.input";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { MessageEditedEvent } from "../../domain/events/message-edited.event";

@Injectable()
export class EditMessageUseCase {
  private readonly logger = new Logger(EditMessageUseCase.name);

  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: EditMessageInput, userId: string) {
    const message = await this.messageRepo.findById(input.messageId);
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada");
    }

    if (message.authorId !== userId) {
      throw new ForbiddenException("Não podes editar mensagens de outros");
    }

    message.edit(input.content);
    await this.messageRepo.save(message);

    await this.eventBus.publish([
      new MessageEditedEvent(
        message.id,
        message.channelId ?? undefined,
        message.dmId ?? undefined,
        userId,
        input.content,
      ),
    ]);

    this.logger.log(`Message edited: ${message.id} by ${userId}`);
    return message.publicData();
  }
}
