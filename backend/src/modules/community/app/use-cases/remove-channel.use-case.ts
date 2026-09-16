import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { MemberRole } from "../../domain/entities/enums/member-role";

@Injectable()
export class RemoveChannelUseCase {
  private readonly logger = new Logger(RemoveChannelUseCase.name);

  constructor(
    private readonly channelRepo: ChannelRepository,
    private readonly memberRepo: ChannelMemberRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(channelId: string, executorId: string) {
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) {
      throw new NotFoundException("Canal não encontrado");
    }

    const user = await this.userRepo.findById(executorId);
    const member = await this.memberRepo.findByChannelAndUser(channelId, executorId);

    const isOwner = member?.role === MemberRole.GROUP_OWNER;
    const isAdmin = user?.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Não tens permissão para remover este canal");
    }

    await this.channelRepo.delete(channelId);

    this.logger.log(`Channel removed: ${channelId} by ${executorId}`);
    return { success: true };
  }
}
