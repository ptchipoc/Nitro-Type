import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { VerificationRepository } from "@modules/auth/domain/repo/verification.repo";
import { VerificationEntity } from "@modules/auth/domain/entities/verification.entity";
import { VerificationType } from "@modules/auth/domain/entities/enums/verification-type";

@Injectable()
export class PrismaVerificationRepository extends VerificationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByIdentifier(
    identifier: string,
  ): Promise<VerificationEntity | null> {
    const raw = await this.prisma.verification.findFirst({
      where: { identifier },
      orderBy: { createdAt: "desc" },
    });
    return raw
      ? new VerificationEntity({
          id: raw.id,
          identifier: raw.identifier,
          value: raw.value,
          expiresAt: raw.expiresAt,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        })
      : null;
  }

  async findByIdentifierAndType(
    identifier: string,
    type: VerificationType,
  ): Promise<VerificationEntity | null> {
    const raw = await this.prisma.verification.findFirst({
      where: { identifier, type },
      orderBy: { createdAt: "desc" },
    });
    console.log(raw);
    return raw
      ? new VerificationEntity({
          id: raw.id,
          identifier: raw.identifier,
          value: raw.value,
          type: raw.type as VerificationType,
          expiresAt: raw.expiresAt,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        })
      : null;
  }

  async save(v: VerificationEntity): Promise<void> {
    await this.prisma.verification.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        identifier: v.identifier,
        value: v.value,
        type: v.type,
        expiresAt: v.expiresAt,
      },
      update: { value: v.value, expiresAt: v.expiresAt, updatedAt: new Date() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.verification.delete({ where: { id } });
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    await this.prisma.verification.deleteMany({ where: { identifier } });
  }

  async deleteByIdentifierAndType(
    identifier: string,
    type: VerificationType,
  ): Promise<void> {
    await this.prisma.verification.deleteMany({ where: { identifier, type } });
  }
}
