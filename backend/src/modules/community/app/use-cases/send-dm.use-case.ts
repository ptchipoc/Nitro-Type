import { Injectable, Logger } from "@nestjs/common";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";
import { MessageRepository } from "../../domain/repository/message.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { DMConversationEntity } from "../../domain/entities/dm-conversation.entity";
import { MessageEntity } from "../../domain/entities/message.entity";
import { MessageSentEvent } from "../../domain/events/message-sent.event";
import { SendDMInput } from "../../presentation/inputs/send-dm.input";

@Injectable()
export class SendDMUseCase {
  private readonly logger = new Logger(SendDMUseCase.name);

  constructor(
    private readonly dmRepo: DMConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: SendDMInput, senderId: string) {
    // Cria conversa se não existe
    let dm = await this.dmRepo.findByParticipants(senderId, input.toUserId);

    if (!dm) {
      dm = DMConversationEntity.create({
        participantAId: senderId,
        participantBId: input.toUserId,
      });
      await this.dmRepo.save(dm);
    }

    const message = MessageEntity.create({
      dmId: dm.id,
      authorId: senderId,
      content: input.content,
      replyToId: input.replyToId,
    });
    await this.messageRepo.save(message);

    // Atualiza lastMessageAt
    dm.updateLastMessageAt();
    await this.dmRepo.save(dm);

    await this.eventBus.publish([
      new MessageSentEvent(message.id, undefined, dm.id, senderId),
    ]);

    this.logger.log(`DM sent from ${senderId} to ${input.toUserId}`);
    return {
      conversation: dm.publicData(),
      message: message.publicData(),
    };
  }
}
