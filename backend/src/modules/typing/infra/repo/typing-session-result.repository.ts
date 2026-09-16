import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { TypingSessionResultEntity } from "@modules/typing/domain/entities/typing-session-result";
import { TypingSessionResultRepository } from "@modules/typing/domain/repo/typing-session-result.repository";

@Injectable()
export class PrismaTypingSessionResultRepository extends TypingSessionResultRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(result: TypingSessionResultEntity): Promise<void> {
    const data = {
      id: result.id,
      sessionId: result.sessionId,
      userId: result.userId,
      wpm: result.wpm,
      totalChars: result.totalChars,
      accuracy: result.accuracy,
      errorRate: result.errorRate,
      typedChars: result.typedChars,
      correctTypedChars: result.correctTypedChars,
      incorrectTypedChars: result.incorrectTypedChars,
      durationSeconds: result.durationSeconds,
      completedAt: result.completedAt,
      completionRate: result.completionRate,
      status: result.status,
      xpEarned: result.xpEarned,
      score: result.score,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt ?? new Date(),
    };

    await this.prisma.typingSessionResult.upsert({
      where: { id: result.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<TypingSessionResultEntity | null> {
    const raw = await this.prisma.typingSessionResult.findUnique({
      where: { id },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findBySessionId(
    sessionId: string,
  ): Promise<TypingSessionResultEntity[]> {
    const rows = await this.prisma.typingSessionResult.findMany({
      where: { sessionId },
      orderBy: { wpm: "desc" },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findByUserId(userId: string): Promise<TypingSessionResultEntity[]> {
    const rows = await this.prisma.typingSessionResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findBySessionAndUser(
    sessionId: string,
    userId: string,
  ): Promise<TypingSessionResultEntity | null> {
    const raw = await this.prisma.typingSessionResult.findFirst({
      where: { sessionId, userId },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  private toEntity(raw: any): TypingSessionResultEntity {
    return TypingSessionResultEntity.reconstitute({
      id: raw.id,
      sessionId: raw.sessionId,
      userId: raw.userId,
      wpm: raw.wpm,
      totalChars: raw.totalChars,
      accuracy: raw.accuracy,
      errorRate: raw.errorRate,
      typedChars: raw.typedChars,
      correctTypedChars: raw.correctTypedChars,
      incorrectTypedChars: raw.incorrectTypedChars,
      durationSeconds: raw.durationSeconds,
      completedAt: raw.completedAt,
      completionRate: raw.completionRate,
      status: raw.status,
      xpEarned: raw.xpEarned,
      score: raw.score,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
