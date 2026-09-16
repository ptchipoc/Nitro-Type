import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { MessageRepository } from "../../domain/repository/message.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { MessageEntity } from "../../domain/entities/message.entity";
import { MessageSentEvent } from "../../domain/events/message-sent.event";
import { SendMessageInput } from "../../presentation/inputs/send-message.input";
import { ChannelRepository } from "../../domain/repository/channel.repo";

@Injectable()
export class SendMessageUseCase {
  private readonly logger = new Logger(SendMessageUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly messageRepo: MessageRepository,
    private readonly channelRepo: ChannelRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: SendMessageInput, channelId: string, senderId: string) {
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) {
      throw new NotFoundException("Canal não encontrado");
    }

    const member = await this.memberRepo.findByChannelAndUser(
      channelId,
      senderId,
    );

    if (!member) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!member.permissions.canSendMessages) {
      throw new ForbiddenException("Sem permissão para enviar mensagens");
    }

    if (member.isBanned) {
      throw new ForbiddenException("Estás banido deste canal");
    }

    if (!member.permissions.canSendMessages) {
      throw new ForbiddenException("Sem permissão para enviar mensagens");
    }

    if (member.isBanned) {
      throw new ForbiddenException("Estás banido deste canal");
    }

    const message = MessageEntity.create({
      ...input,
      channelId,
      authorId: senderId,
    });
    await this.messageRepo.save(message);

    await this.eventBus.publish([
      new MessageSentEvent(
        message.id,
        message.channelId,
        message.dmId,
        senderId,
      ),
    ]);

    this.logger.log(`Message sent by ${senderId}: ${message.id}`);
    return message.publicData();
  }
}
