import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { MessageRepository } from "../../domain/repository/message.repo";
import { MessageEntity } from "../../domain/entities/message.entity";
import e from "express";

@Injectable()
export class PrismaMessageRepository extends MessageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(message: MessageEntity): Promise<void> {
    const data = {
      id: message.id,
      channelId: message.channelId ?? null,
      dmConversationId: message.dmId ?? null,
      authorId: message.authorId,
      content: message.content,
      type: message.type,
      reactions: JSON.stringify(message.reactions),
      mentions: message.mentions,
      attachmentIds: message.attachmentIds,
      replyToId: message.replyToId ?? null,
      edited: message.edited,
      editedAt: message.editedAt ?? null,
      deletedAt: message.deletedAt ?? null,
      createdAt: message.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.message.upsert({
      where: { id: message.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const raw = await this.prisma.message.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true ,
          },
        },
      },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByChannelId(
    channelId: string,
    limit = 50,
    cursor?: string,
  ): Promise<MessageEntity[]> {
    const rows = await this.prisma.message.findMany({
      where: { channelId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true ,
          },
        },
      },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });
    return rows.reverse().map((r) => this.toEntity(r));
  }

  async findByDMId(
    dmId: string,
    limit = 50,
    cursor?: string,
  ): Promise<MessageEntity[]> {
    const rows = await this.prisma.message.findMany({
      where: { dmConversationId: dmId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true ,
          },
        },
      },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });
    return rows.reverse().map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.message.delete({ where: { id } });
  }

  private toEntity(raw: any): MessageEntity {
    let authorInfo = null;
    if (raw.author) {
      authorInfo = {
        id: raw.author.id,
        email: raw.author.email,
        name: raw.author.name,
        username: "Teste", //TODO: Remover essa cara
        avatarUrl: raw.author.avatarUrl,
      };
    }
    return MessageEntity.reconstitute({
      id: raw.id,
      channelId: raw.channelId ?? undefined,
      dmId: raw.dmConversationId ?? undefined,
      authorId: raw.authorId,
      content: raw.content,
      type: raw.type,
      reactions:
        typeof raw.reactions === "string"
          ? JSON.parse(raw.reactions)
          : raw.reactions,
      mentions: raw.mentions,
      attachmentIds: raw.attachmentIds,
      replyToId: raw.replyToId ?? undefined,
      edited: raw.edited,
      editedAt: raw.editedAt ?? undefined,
      deletedAt: raw.deletedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: authorInfo,
    });
  }
}
