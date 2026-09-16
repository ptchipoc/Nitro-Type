import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { TypingLearningRepository } from "@modules/typing/domain/repo/typing-learning.repository";
import { TypingLearningEntity } from "@modules/typing/domain/entities/typing-learning";
import { TypingStage } from "@modules/typing/domain/entities/enums/typing-stage";

@Injectable()
export class PrismaTypingLearningRepository
  implements TypingLearningRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<TypingLearningEntity | null> {
    const data = await this.prisma.typingLearning.findUnique({
      where: { userId },
    });

    if (!data) return null;

    return TypingLearningEntity.reconstitute({
      id: data.id,
      userId: data.userId,
      currentStage: data.currentStage as TypingStage,
      totalAccuracy: data.totalAccuracy,
      totalSessions: data.totalSessions,
      lastPracticedAt: data.lastPracticedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async save(entity: TypingLearningEntity): Promise<void> {
    const data = entity.publicData();

    await this.prisma.typingLearning.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }
}
