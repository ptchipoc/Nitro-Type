import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { UpdateMemberRoleInput } from "../../presentation/inputs/update-member-role.input";
import { MemberRole } from "../../domain/entities/enums/member-role";

@Injectable()
export class UpdateMemberRoleUseCase {
  private readonly logger = new Logger(UpdateMemberRoleUseCase.name);

  constructor(private readonly memberRepo: ChannelMemberRepository) {}

  async execute(input: UpdateMemberRoleInput, executorId: string) {
    const executor = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      executorId,
    );
    if (!executor) {
      throw new ForbiddenException("Não és membro deste canal");
    }

    if (!executor.permissions.canManageRoles) {
      throw new ForbiddenException("Sem permissão para alterar roles");
    }

    const target = await this.memberRepo.findByChannelAndUser(
      input.channelId,
      input.userId,
    );
    if (!target) {
      throw new NotFoundException("Membro não encontrado");
    }

    target.updateRole(input.role as MemberRole);
    await this.memberRepo.save(target);

    this.logger.log(
      `Member ${input.userId} role updated to ${input.role} in channel ${input.channelId}`,
    );
    return target.publicData();
  }
}
