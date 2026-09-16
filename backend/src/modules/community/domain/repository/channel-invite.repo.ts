import { ChannelInviteEntity } from "../entities/channel-invite.entity";

export abstract class ChannelInviteRepository {
  abstract save(invite: ChannelInviteEntity): Promise<void>;
  abstract findById(id: string): Promise<ChannelInviteEntity | null>;
  abstract findByCode(code: string): Promise<ChannelInviteEntity | null>;
  abstract findByChannelAndUser(channelId: string, userId: string): Promise<ChannelInviteEntity | null>;
  abstract findByUserId(userId: string): Promise<ChannelInviteEntity[]>;
  abstract delete(id: string): Promise<void>;
}
