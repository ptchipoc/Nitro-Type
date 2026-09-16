import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ChannelEntity } from "../../domain/entities/channel.entity";
import { ChannelMemberEntity } from "../../domain/entities/channel-member.entity";
import { ChannelCreatedEvent } from "../../domain/events/channel-created.event";
import { MemberRole } from "../../domain/entities/enums/member-role";
import { ChannelType } from "../../domain/entities/enums/channel-type";
import { CreateChannelInput } from "../../presentation/inputs/create-channel.input";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { generateSlug } from "@shared/helpers/slug.helper";

@Injectable()
export class CreateChannelUseCase {
  private readonly logger = new Logger(CreateChannelUseCase.name);

  constructor(
    private readonly channelRepo: ChannelRepository,
    private readonly memberRepo: ChannelMemberRepository,
    private readonly eventBus: EventBusPort,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: CreateChannelInput, creatorId: string) {
    const user = await this.userRepo.findById(creatorId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    if (input.type == ChannelType.PUBLIC && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "Apenas administradores podem criar canais públicos",
      );
    }

    const slug = generateSlug(input.name);
    const existing = await this.channelRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictException("Canal já existe");
    }

    const channel = ChannelEntity.create({
      name: input.name,
      description: input.description,
      type: input.type,
      slug,
      isPlatformManaged: input.isPlatformManaged ?? false,
      createdBy: creatorId,
    });
    await this.channelRepo.save(channel);

    // Criador entra automaticamente como OWNER
    const member = ChannelMemberEntity.create({
      channelId: channel.id,
      userId: creatorId,
      role: MemberRole.GROUP_OWNER,
    });
    await this.memberRepo.save(member);

    await this.eventBus.publish([
      new ChannelCreatedEvent(channel.id, creatorId, channel.type),
    ]);

    this.logger.log(`Channel created: ${channel.id} by ${creatorId}`);
    return channel.publicData();
  }
}
