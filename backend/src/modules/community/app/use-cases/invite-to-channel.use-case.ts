import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { ChannelInviteRepository } from "../../domain/repository/channel-invite.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ChannelInviteEntity } from "../../domain/entities/channel-invite.entity";
import { InviteCreatedEvent } from "../../domain/events/invite-created.event";
import { InviteToChannelInput } from "../../presentation/inputs/invite-to-channel.input";

@Injectable()
export class InviteToChannelUseCase {
  private readonly logger = new Logger(InviteToChannelUseCase.name);

  constructor(
    private readonly channelRepo: ChannelRepository,
    private readonly memberRepo: ChannelMemberRepository,
    private readonly inviteRepo: ChannelInviteRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(
    input: InviteToChannelInput,
    channelId: string,
    invitedBy: string,
  ) {
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) {
      throw new NotFoundException("Canal não encontrado");
    }

    if (channel.isPublic()) {
      throw new BadRequestException("Canais públicos não precisam de convite");
    }

    const executor = await this.memberRepo.findByChannelAndUser(
      channelId,
      invitedBy,
    );
    if (!executor) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!executor.permissions.canAddMembers) {
      throw new ForbiddenException("Sem permissão para convidar");
    }

    const existing = await this.inviteRepo.findByChannelAndUser(
      channelId,
      input.invitedUserId,
    );
    if (existing?.isPending()) {
      throw new ConflictException("Convite já enviado");
    }

    const invite = ChannelInviteEntity.create({
      ...input,
      channelId,
      invitedBy,
      channelName: channel.name,
    });
    await this.inviteRepo.save(invite);

    await this.eventBus.publish([
      new InviteCreatedEvent(
        invite.channelId,
        invite.invitedUserId,
        invite.code,
      ),
    ]);

    this.logger.log(
      `Invite created for ${input.invitedUserId} to channel ${channelId}`,
    );
    return invite.publicData();
  }
}
