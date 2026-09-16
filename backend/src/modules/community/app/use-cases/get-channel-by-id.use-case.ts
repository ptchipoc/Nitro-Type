import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";

@Injectable()
export class GetChannelByIdUseCase {
  private readonly logger = new Logger(GetChannelByIdUseCase.name);

  constructor(private readonly channelRepo: ChannelRepository) {}

  async execute(channelId: string) {
    const channel = await this.channelRepo.findById(channelId);
    if (!channel) {
      throw new NotFoundException("Canal não encontrado");
    }
    return channel.publicData();
  }
}
