import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { UserPresenceRepository } from "../../domain/repository/user-presence.repo";
import { UserPresenceEntity } from "../../domain/entities/user-presence.entity";
import { UserPresenceStatus } from "../../domain/entities/enums/user-presence";

@Injectable()
export class PrismaUserPresenceRepository extends UserPresenceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(presence: UserPresenceEntity): Promise<void> {
    const data = {
      id: presence.id,
      userId: presence.userId,
      status: presence.status,
      lastSeenAt: presence.lastSeenAt,
      createdAt: presence.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.userPresence.upsert({
      where: { userId: presence.userId },
      create: {
        id: presence.id,
        userId: presence.userId,
        status: presence.status,
        lastSeenAt: presence.lastSeenAt,
        createdAt: presence.createdAt,
        updatedAt: new Date(),
      },
      update: {
        status: presence.status,
        lastSeenAt: presence.lastSeenAt,
        updatedAt: new Date(),
      },
    });
  }

  async findByUserId(userId: string): Promise<UserPresenceEntity | null> {
    const raw = await this.prisma.userPresence.findUnique({
      where: { userId },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.userPresence.delete({ where: { userId } });
  }

  private toEntity(raw: any): UserPresenceEntity {
    return UserPresenceEntity.reconstitute({
      id: raw.id,
      userId: raw.userId,
      status: raw.status,
      lastSeenAt: raw.lastSeenAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
