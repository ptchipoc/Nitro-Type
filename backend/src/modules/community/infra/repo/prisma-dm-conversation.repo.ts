import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";
import { DMConversationEntity } from "../../domain/entities/dm-conversation.entity";

@Injectable()
export class PrismaDMConversationRepository extends DMConversationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(conversation: DMConversationEntity): Promise<void> {
    const data = {
      id: conversation.id,
      participantAId: conversation.participantAId,
      participantBId: conversation.participantBId,
      lastMessageAt: conversation.lastMessageAt ?? null,
      createdAt: conversation.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.dMConversation.upsert({
      where: { id: conversation.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<DMConversationEntity | null> {
    const raw = await this.prisma.dMConversation.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByParticipants(
    userAId: string,
    userBId: string,
  ): Promise<DMConversationEntity | null> {
    const raw = await this.prisma.dMConversation.findFirst({
      where: {
        OR: [
          { participantAId: userAId, participantBId: userBId },
          { participantAId: userBId, participantBId: userAId },
        ],
      },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByUserId(userId: string): Promise<DMConversationEntity[]> {
    const rows = await this.prisma.dMConversation.findMany({
      where: {
        OR: [{ participantAId: userId }, { participantBId: userId }],
      },
      orderBy: { lastMessageAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.dMConversation.delete({ where: { id } });
  }

  private toEntity(raw: any): DMConversationEntity {
    return DMConversationEntity.reconstitute({
      id: raw.id,
      participantAId: raw.participantAId,
      participantBId: raw.participantBId,
      lastMessageAt: raw.lastMessageAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
