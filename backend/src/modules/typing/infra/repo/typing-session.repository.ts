import { Injectable } from "@nestjs/common";
import { TypingSessionRepository } from "@modules/typing/domain/repo/typing-session.repository";
import { PrismaService } from "@shared/database/prisma.service";
import { TypingSessionEntity } from "@modules/typing/domain/entities/typing-session";

@Injectable()
export class PrismaTypingSessionRepository extends TypingSessionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(session: TypingSessionEntity): Promise<void> {
    const data = {
      id: session.id,
      creatorId: session.creatorId,
      category: session.category,
      difficulty: session.difficulty,
      text: session.textContent.text,
      wordCount: session.textContent.wordCount,
      timeLimit: session.timeLimit,
      status: session.status,
      startedAt: session.startedAt ?? null,
      finishedAt: session.finishedAt ?? null,
      createdAt: session.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.typingSession.upsert({
      where: { id: session.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<TypingSessionEntity | null> {
    const raw = await this.prisma.typingSession.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByCreatorId(creatorId: string): Promise<TypingSessionEntity[]> {
    const rows = await this.prisma.typingSession.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(raw: any): TypingSessionEntity {
    return TypingSessionEntity.reconstitute({
      id: raw.id,
      creatorId: raw.creatorId,
      category: raw.category,
      difficulty: raw.difficulty,
      textContent: {
        text: raw.text,
        wordCount: raw.wordCount,
      },
      timeLimit: raw.timeLimit,
      status: raw.status,
      startedAt: raw.startedAt ?? undefined,
      finishedAt: raw.finishedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    });
  }
}
