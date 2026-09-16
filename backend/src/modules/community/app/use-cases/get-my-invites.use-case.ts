import { Injectable, Logger } from "@nestjs/common";
import { ChannelInviteRepository } from "../../domain/repository/channel-invite.repo";

@Injectable()
export class GetMyInvitesUseCase {
  private readonly logger = new Logger(GetMyInvitesUseCase.name);

  constructor(private readonly inviteRepo: ChannelInviteRepository) {}

  async execute(userId: string) {
    const invites = await this.inviteRepo.findByUserId(userId);
    return invites.map((i) => i.publicData());
  }
}
