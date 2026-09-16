import { ChannelEntity } from "../entities/channel.entity";

export abstract class ChannelRepository {
  abstract save(channel: ChannelEntity): Promise<void>;
  abstract findById(id: string): Promise<ChannelEntity | null>;
  abstract findAll(): Promise<ChannelEntity[]>;
  abstract findAllPublic(): Promise<ChannelEntity[]>;
  abstract findPrivateByUserId(userId: string): Promise<ChannelEntity[]>;
  abstract findByIds(ids: string[]): Promise<ChannelEntity[]>;
  abstract findBySlug(slug: string): Promise<ChannelEntity | null>;
  abstract delete(id: string): Promise<void>;
}
