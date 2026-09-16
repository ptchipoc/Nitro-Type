import {
  BadRequestException,
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
import { EditChannelInput } from "../../presentation/inputs/edit-channel.input";
import { generateSlug } from "@shared/helpers/slug.helper";

@Injectable()
export class EditChannelUseCase {
  private readonly logger = new Logger(EditChannelUseCase.name);

  constructor(
    private readonly channelRepo: ChannelRepository,
    private readonly memberRepo: ChannelMemberRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    channelId: string,
    input: EditChannelInput,
    executorId: string,
  ) {
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) {
      throw new NotFoundException("Canal não encontrado");
    }

    const user = await this.userRepo.findById(executorId);
    const member = await this.memberRepo.findByChannelAndUser(
      channelId,
      executorId,
    );

    const isOwner = member?.role === MemberRole.GROUP_OWNER;
    const isAdmin = user?.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Não tens permissão para editar este canal");
    }

    const updateData: any = {};
    updateData.name = input.name;
    updateData.description = input.description;

    channel.updateInfo(updateData);
    await this.channelRepo.save(channel);

    this.logger.log(`Channel edited: ${channel.id} by ${executorId}`);
    return channel.publicData();
  }
}
