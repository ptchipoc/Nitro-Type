import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { ChannelEntity } from "../../domain/entities/channel.entity";

@Injectable()
export class PrismaChannelRepository extends ChannelRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(channel: ChannelEntity): Promise<void> {
    const data = {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      description: channel.description ?? null,
      type: channel.type,
      isPlatformManaged: channel.isPlatformManaged,
      createdBy: channel.createdBy,
      isArchived: channel.isArchived,
      createdAt: channel.createdAt,
      updatedAt: new Date(),
    };

    await this.prisma.channel.upsert({
      where: { id: channel.id },
      create: data,
      update: data,
    });
  }

  async findBySlug(slug: string): Promise<ChannelEntity | null> {
    const raw = await this.prisma.channel.findUnique({
      where: { slug: slug },
      include: { members: true },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findById(id: string): Promise<ChannelEntity | null> {
    const raw = await this.prisma.channel.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!raw) return null;
    return this.toEntity(raw);
  }

  async findAll(): Promise<ChannelEntity[]> {
    const rows = await this.prisma.channel.findMany({
      where: { isArchived: false },
      include: { members: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findAllPublic(): Promise<ChannelEntity[]> {
    const rows = await this.prisma.channel.findMany({
      where: { type: "PUBLIC", isArchived: false },
      include: { members: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findPrivateByUserId(userId: string): Promise<ChannelEntity[]> {
    const rows = await this.prisma.channel.findMany({
      where: {
        type: "PRIVATE",
        isArchived: false,
        members: { some: { userId, isBanned: false } },
      },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findByIds(ids: string[]): Promise<ChannelEntity[]> {
    const rows = await this.prisma.channel.findMany({
      where: { id: { in: ids } },
      include: { members: true },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.channel.delete({ where: { id } });
  }

  private toEntity(raw: any): ChannelEntity {
    const memberCount = raw.members?.length ?? 0;
    return ChannelEntity.reconstitute({
      id: raw.id,
      name: raw.name,
      slug: raw.slug ?? undefined,
      description: raw.description ?? undefined,
      type: raw.type,
      isPlatformManaged: raw.isPlatformManaged,
      createdBy: raw.createdBy,
      memberCount: memberCount,
      isArchived: raw.isArchived,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
