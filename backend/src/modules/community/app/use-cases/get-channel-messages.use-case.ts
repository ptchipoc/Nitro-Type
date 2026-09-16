import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { MessageRepository } from "../../domain/repository/message.repo";

@Injectable()
export class GetChannelMessagesUseCase {
  private readonly logger = new Logger(GetChannelMessagesUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly messageRepo: MessageRepository,
  ) {}

  async execute(channelId: string, userId: string, limit = 50) {
    const member = await this.memberRepo.findByChannelAndUser(
      channelId,
      userId,
    );
    if (!member) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (member.isBanned) {
      throw new ForbiddenException("Estás banido deste canal");
    }

    const messages = await this.messageRepo.findByChannelId(channelId, limit);
    return messages.map((m) => m.publicData());
  }
}
