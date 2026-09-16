import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ChannelMemberEntity } from "../../domain/entities/channel-member.entity";
import { MemberRole } from "../../domain/entities/enums/member-role";
import { ChannelRepository } from "@modules/community/domain/repository/channel.repo";

@Injectable()
export class AddMemberPublicChannelUseCase {
  private readonly logger = new Logger(AddMemberPublicChannelUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly channelRepo: ChannelRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(userId: string) {
    const channels = await this.channelRepo.findAllPublic();
    channels.map(async (item) => {
      const existing = await this.memberRepo.findByChannelAndUser(
        item.id,
        userId,
      );

      if (existing) return;

      const member = ChannelMemberEntity.create({
        channelId: item.id,
        userId: userId,
        role: MemberRole.GROUP_MEMBER,
      });
      await this.memberRepo.save(member);

      this.logger.log(`Member ${userId} added to channel ${item.id}`);
    });
    this.logger.log(`Member ${userId} added to channel`);
  }
}
