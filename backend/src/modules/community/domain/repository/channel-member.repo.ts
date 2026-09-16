import { ChannelMemberEntity } from "../entities/channel-member.entity";

export abstract class ChannelMemberRepository {
  abstract save(member: ChannelMemberEntity): Promise<void>;
  abstract findById(id: string): Promise<ChannelMemberEntity | null>;
  abstract findByChannelAndUser(channelId: string, userId: string): Promise<ChannelMemberEntity | null>;
  abstract findByChannelId(channelId: string): Promise<ChannelMemberEntity[]>;
  abstract findByUserId(userId: string): Promise<ChannelMemberEntity[]>;
  abstract delete(id: string): Promise<void>;
  abstract countByChannelId(channelId: string): Promise<number>;
}
