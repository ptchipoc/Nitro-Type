import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";

export abstract class VerificationRepository {
  abstract findByIdentifier(
    identifier: string,
  ): Promise<VerificationEntity | null>;
  abstract findByIdentifierAndType(
    identifier: string,
    type: VerificationType,
  ): Promise<VerificationEntity | null>;
  abstract save(v: VerificationEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByIdentifier(identifier: string): Promise<void>;
  abstract deleteByIdentifierAndType(
    identifier: string,
    type: VerificationType,
  ): Promise<void>;
}
