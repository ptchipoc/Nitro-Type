import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UserEntity } from "@modules/user/domain/entities/user.entity";

export class FakeUserRepository extends UserRepository {
  private store = new Map<string, UserEntity>();

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async findByEmail(email: string) {
    return [...this.store.values()].find((u) => u.email === email) ?? null;
  }
  async save(user: UserEntity) {
    this.store.set(user.id, user);
  }
  async delete(id: string) {
    this.store.delete(id);
  }

  async search(query: string): Promise<UserEntity[]> {
    return [...this.store.values()].filter((u) =>
      (u.email + u.name).toLowerCase().includes(query.toLowerCase()),
    );
  }

  async findRanking(): Promise<UserEntity[]> {
    return [...this.store.values()];
  }

  async findAll(): Promise<UserEntity[]> {
    return [...this.store.values()];
  }

  snapshot() {
    return [...this.store.values()];
  }
  clear() {
    this.store.clear();
  }
}
