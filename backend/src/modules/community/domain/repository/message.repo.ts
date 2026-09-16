import { MessageEntity } from "../entities/message.entity";

export abstract class MessageRepository {
  abstract save(message: MessageEntity): Promise<void>;
  abstract findById(id: string): Promise<MessageEntity | null>;
  abstract findByChannelId(channelId: string, limit?: number, cursor?: string): Promise<MessageEntity[]>;
  abstract findByDMId(dmId: string, limit?: number, cursor?: string): Promise<MessageEntity[]>;
  abstract delete(id: string): Promise<void>;
}
