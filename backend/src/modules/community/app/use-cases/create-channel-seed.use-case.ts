import { Injectable, Logger } from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { ChannelEntity } from "../../domain/entities/channel.entity";
import { ChannelType } from "../../domain/entities/enums/channel-type";
import { generateSlug } from "@shared/helpers/slug.helper";

@Injectable()
export class CreateChannelSeedUseCase {
  private readonly logger = new Logger(CreateChannelSeedUseCase.name);

  constructor(private readonly channelRepo: ChannelRepository) {}

  async execute() {
    const slug = generateSlug("Geral");
    const existing = await this.channelRepo.findBySlug(slug);
    if (existing) {
      this.logger.log("Canal 'Geral' já existe, skipping seed");
      return;
    }

    const channel = ChannelEntity.create({
      name: "Geral",
      description: "Canal geral para todos os membros",
      type: ChannelType.PUBLIC,
      slug,
      isPlatformManaged: true,
      createdBy: "system",
    });
    await this.channelRepo.save(channel);

    this.logger.log("Canal 'Geral' criado com sucesso");
  }
}
