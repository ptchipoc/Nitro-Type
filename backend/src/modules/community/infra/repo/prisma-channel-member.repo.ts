import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { ChannelMemberRepository } from "../../domain/repository/channel-member.repo";
import { ChannelMemberEntity } from "../../domain/entities/channel-member.entity";

@Injectable()
export class PrismaChannelMemberRepository extends ChannelMemberRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(member: ChannelMemberEntity): Promise<void> {
    const data = {
      id: member.id,
      channelId: member.channelId,
      userId: member.userId,
      role: member.role,
      permissions: JSON.stringify(member.permissions),
      isBanned: member.isBanned,
      bannedAt: member.bannedAt ?? null,
      joinedAt: member.joinedAt,
      createdAt: member.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.channelMember.upsert({
      where: { id: member.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<ChannelMemberEntity | null> {
    const raw = await this.prisma.channelMember.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByChannelAndUser(
    channelId: string,
    userId: string,
  ): Promise<ChannelMemberEntity | null> {
    const raw = await this.prisma.channelMember.findFirst({
      where: { channelId, userId },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByChannelId(channelId: string): Promise<ChannelMemberEntity[]> {
    const rows = await this.prisma.channelMember.findMany({
      where: { channelId },
      orderBy: { joinedAt: "asc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findByUserId(userId: string): Promise<ChannelMemberEntity[]> {
    const rows = await this.prisma.channelMember.findMany({
      where: { userId },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.channelMember.delete({ where: { id } });
  }

  async countByChannelId(channelId: string): Promise<number> {
    return this.prisma.channelMember.count({
      where: { channelId, isBanned: false },
    });
  }

  private toEntity(raw: any): ChannelMemberEntity {
    return ChannelMemberEntity.reconstitute({
      id: raw.id,
      channelId: raw.channelId,
      userId: raw.userId,
      role: raw.role,
      permissions:
        typeof raw.permissions === "string"
          ? JSON.parse(raw.permissions)
          : raw.permissions,
      isBanned: raw.isBanned,
      bannedAt: raw.bannedAt ?? undefined,
      joinedAt: raw.joinedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
