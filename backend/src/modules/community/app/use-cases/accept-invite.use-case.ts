import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { ChannelInviteRepository } from "../../domain/repository/channel-invite.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ChannelMemberEntity } from "../../domain/entities/channel-member.entity";
import { MemberAddedEvent } from "../../domain/events/member-added.event";
import { MemberRole } from "../../domain/entities/enums/member-role";

@Injectable()
export class AcceptInviteUseCase {
  private readonly logger = new Logger(AcceptInviteUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly inviteRepo: ChannelInviteRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(code: string, userId: string) {
    const invite = await this.inviteRepo.findByCode(code);
    if (!invite) {
      throw new NotFoundException("Convite não encontrado");
    }

    if (invite.invitedUserId !== userId) {
      throw new ForbiddenException("Este convite não é para ti");
    }

    if (invite.isExpired()) {
      throw new BadRequestException("Convite expirou");
    }

    const member = await this.memberRepo.findByChannelAndUser(
      invite.channelId,
      userId,
    );
    if (member) {
      if (member.isBanned) {
        throw new BadRequestException("Você foi banido deste canal");
      }
      throw new BadRequestException("Você já é membro deste canal");
    } else {
      invite.accept();
      await this.inviteRepo.save(invite);

      const newMember = ChannelMemberEntity.create({
        channelId: invite.channelId,
        userId,
        role: MemberRole.GROUP_MEMBER,
      });
      await this.memberRepo.save(newMember);

      await this.eventBus.publish([
        new MemberAddedEvent(invite.channelId, userId, invite.invitedBy),
      ]);

      this.logger.log(`Invite ${code} accepted by ${userId}`);
      return newMember.publicData();
    }
  }
}
