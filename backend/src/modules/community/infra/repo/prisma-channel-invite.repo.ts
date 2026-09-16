import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { ChannelInviteRepository } from "../../domain/repository/channel-invite.repo";
import { ChannelInviteEntity } from "../../domain/entities/channel-invite.entity";

@Injectable()
export class PrismaChannelInviteRepository extends ChannelInviteRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(invite: ChannelInviteEntity): Promise<void> {
    const data = {
      id: invite.id,
      channelId: invite.channelId,
      invitedBy: invite.invitedBy,
      invitedUserId: invite.invitedUserId,
      code: invite.code,
      status: invite.status,
      expiresAt: invite.expiresAt ?? null,
      createdAt: invite.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.channelInvite.upsert({
      where: { id: invite.id },
      create: data,
      update: data,
    });
  }

  async findById(id: string): Promise<ChannelInviteEntity | null> {
    const raw = await this.prisma.channelInvite.findUnique({
      where: { id },
      include: { channel: true },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByCode(code: string): Promise<ChannelInviteEntity | null> {
    const raw = await this.prisma.channelInvite.findUnique({
      where: { code },
      include: { channel: true },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByChannelAndUser(
    channelId: string,
    userId: string,
  ): Promise<ChannelInviteEntity | null> {
    const raw = await this.prisma.channelInvite.findFirst({
      where: { channelId, invitedUserId: userId },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findByUserId(userId: string): Promise<ChannelInviteEntity[]> {
    const rows = await this.prisma.channelInvite.findMany({
      where: { invitedUserId: userId },
      include: { channel: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.channelInvite.delete({ where: { id } });
  }

  private toEntity(raw: any): ChannelInviteEntity {
    return ChannelInviteEntity.reconstitute({
      id: raw.id,
      channelId: raw.channelId,
      invitedBy: raw.invitedBy,
      invitedUserId: raw.invitedUserId,
      code: raw.code,
      status: raw.status,
      expiresAt: raw.expiresAt ?? undefined,
      channelName: raw.channel?.name, // Mapeia o nome do canal
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
