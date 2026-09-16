import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ChannelMemberEntity } from "../../domain/entities/channel-member.entity";
import { MemberAddedEvent } from "../../domain/events/member-added.event";
import { MemberRole } from "../../domain/entities/enums/member-role";
import { AddMemberInput } from "../../presentation/inputs/add-member.input";

@Injectable()
export class AddMemberUseCase {
  private readonly logger = new Logger(AddMemberUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: AddMemberInput, executorId: string) {
    const executor = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      executorId,
    );
    if (!executor) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!executor.permissions.canAddMembers) {
      throw new ForbiddenException("Sem permissão para adicionar membros");
    }

    const existing = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      input.userId,
    );

    if (existing?.isBanned) {
      throw new ForbiddenException("Utilizador banido deste canal");
    }

    if (existing) {
      throw new ConflictException("Utilizador já é membro");
    }

    const member = ChannelMemberEntity.create({
      channelId: input.channelId,
      userId: input.userId,
      role: MemberRole.GROUP_MEMBER,
    });
    await this.memberRepo.save(member);

    await this.eventBus.publish([
      new MemberAddedEvent(input.channelId, input.userId, executorId),
    ]);

    this.logger.log(
      `Member ${input.userId} added to channel ${input.channelId}`,
    );
    return member.publicData();
  }
}
