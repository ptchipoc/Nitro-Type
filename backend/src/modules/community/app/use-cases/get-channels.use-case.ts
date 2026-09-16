import { Injectable, Logger } from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";

@Injectable()
export class GetChannelsUseCase {
  private readonly logger = new Logger(GetChannelsUseCase.name);

  constructor(private readonly channelRepo: ChannelRepository) {}

  async execute(userId: string) {
    const publicChannels = await this.channelRepo.findAllPublic();
    const privateChannels = await this.channelRepo.findPrivateByUserId(userId);

    return {
      public: publicChannels.map((c) => c.publicData()),
      private: privateChannels.map((c) => c.publicData()),
    };
  }
}
