import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { MemberBannedEvent } from "../../domain/events/member-banned.event";
import { BanMemberInput } from "../../presentation/inputs/ban-member.input";

@Injectable()
export class BanMemberUseCase {
  private readonly logger = new Logger(BanMemberUseCase.name);

  constructor(
    private readonly memberRepo: ChannelMemberRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: BanMemberInput, executorId: string) {
    const executor = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      executorId,
    );
    if (!executor) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!executor.permissions.canBanMembers) {
      throw new ForbiddenException("Sem permissão para banir membros");
    }

    const target = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      input.userId,
    );
    if (!target) {
      throw new NotFoundException("Membro não encontrado");
    }

    target.ban();
    await this.memberRepo.save(target);

    await this.eventBus.publish([
      new MemberBannedEvent(
        input.channelId,
        input.userId,
        executorId,
        input.notifyChannel ?? true,
      ),
    ]);

    this.logger.log(`Member ${input.userId} banned from channel ${input.channelId}`);
  }
}
