import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { MemberRemovedEvent } from "../../domain/events/member-removed.event";
import { MemberRole } from "../../domain/entities/enums/member-role";
import { RemoveMemberInput } from "../../presentation/inputs/remove-member.input";

@Injectable()
export class RemoveMemberUseCase {
  private readonly logger = new Logger(RemoveMemberUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: RemoveMemberInput, executorId: string) {
    const executor = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      executorId,
    );
    if (!executor) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!executor.permissions.canRemoveMembers) {
      throw new ForbiddenException("Sem permissão para remover membros");
    }

    const target = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      input.userId,
    );
    if (!target) {
      throw new NotFoundException("Membro não encontrado");
    }

    if (target.role === MemberRole.GROUP_OWNER) {
      throw new ForbiddenException("O OWNER não pode ser removido");
    }

    await this.memberRepo.delete(target.id);

    await this.eventBus.publish([
      new MemberRemovedEvent(
        input.channelId,
        input.userId,
        executorId,
        input.notifyChannel ?? true,
      ),
    ]);

    this.logger.log(
      `Member ${input.userId} removed from channel ${input.channelId}`,
    );
  }
}
