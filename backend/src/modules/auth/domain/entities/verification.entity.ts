import { randomUUID } from "crypto";
import { VerificationType } from "./enums/verification-type";

interface Props {
  id?: string;
  identifier: string; // userId ou email
  value: string; // código OTP
  type?: VerificationType;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * VerificationEntity — entidade independente para OTP.
 * identifier: userId ou email
 * value:      código OTP (6 dígitos)
 * Uso único — apagada após verificação bem-sucedida.
 */
export class VerificationEntity {
  public readonly id: string;
  public readonly identifier: string;
  public readonly value: string;
  public readonly type: VerificationType;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(p: Props) {
    this.id = p.id ?? randomUUID();
    this.identifier = p.identifier;
    this.value = p.value;
    this.type = p.type ?? VerificationType.EMAIL_VERIFICATION;
    this.expiresAt = p.expiresAt;
    this.createdAt = p.createdAt ?? new Date();
    this.updatedAt = p.updatedAt ?? new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  static generate(
    identifier: string,
    expiresSeconds: number,
    type?: VerificationType,
  ): VerificationEntity {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + expiresSeconds * 1000);
    return new VerificationEntity({
      identifier,
      type: type,
      value: code,
      expiresAt,
    });
  }
}
