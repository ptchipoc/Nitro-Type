import {
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MessageRepository } from "../../domain/repository/message.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ReactionAddedEvent } from "../../domain/events/reaction-added.event";
import { AddReactionInput } from "../../presentation/inputs/add-reaction.input";

@Injectable()
export class AddReactionUseCase {
  private readonly logger = new Logger(AddReactionUseCase.name);

  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: AddReactionInput, userId: string) {
    const message = await this.messageRepo.findById(input.messageId);
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada");
    }

    message.addReaction(input.emoji, userId);
    await this.messageRepo.save(message);

    await this.eventBus.publish([
      new ReactionAddedEvent(input.messageId, userId, input.emoji),
    ]);

    this.logger.log(
      `Reaction ${input.emoji} added to message ${input.messageId} by ${userId}`,
    );
    return message.publicData();
  }
}
