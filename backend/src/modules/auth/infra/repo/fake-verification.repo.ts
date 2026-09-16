import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";

export class FakeVerificationRepository extends VerificationRepository {
  private store = new Map<string, VerificationEntity>();

  async findByIdentifier(identifier: string) {
    return (
      [...this.store.values()].find((v) => v.identifier === identifier) ?? null
    );
  }

  async findByIdentifierAndType(identifier: string, type: VerificationType) {
    return (
      [...this.store.values()].find(
        (v) => v.identifier === identifier && v.type === type,
      ) ?? null
    );
  }

  async save(v: VerificationEntity) {
    this.store.set(v.id, v);
  }
  async delete(id: string) {
    this.store.delete(id);
  }
  async deleteByIdentifier(identifier: string) {
    for (const [k, v] of this.store.entries()) {
      if (v.identifier === identifier) this.store.delete(k);
    }
  }

  async deleteByIdentifierAndType(
    identifier: string,
    type: VerificationType,
  ): Promise<void> {
    for (const [k, v] of this.store.entries()) {
      if (v.identifier === identifier && v.type === type) this.store.delete(k);
    }
  }
  clear() {
    this.store.clear();
  }
}
