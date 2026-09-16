import { UserPresenceEntity } from "../entities/user-presence.entity";

export abstract class UserPresenceRepository {
  abstract save(presence: UserPresenceEntity): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserPresenceEntity | null>;
  abstract delete(userId: string): Promise<void>;
}
