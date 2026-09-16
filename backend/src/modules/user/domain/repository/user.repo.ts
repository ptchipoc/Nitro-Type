import { UserEntity } from "@modules/user/domain/entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract search(query: string): Promise<UserEntity[]>;
  abstract save(user: UserEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findRanking(): Promise<UserEntity[]>;
}
