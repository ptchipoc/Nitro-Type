import { DMConversationEntity } from "../entities/dm-conversation.entity";

export abstract class DMConversationRepository {
  abstract save(conversation: DMConversationEntity): Promise<void>;
  abstract findById(id: string): Promise<DMConversationEntity | null>;
  abstract findByParticipants(userAId: string, userBId: string): Promise<DMConversationEntity | null>;
  abstract findByUserId(userId: string): Promise<DMConversationEntity[]>;
  abstract delete(id: string): Promise<void>;
}
