import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "@modules/notification/domain/repo/notification.repository";
import { NotificationEntity } from "@modules/notification/domain/entities/notification.entity";
import { NotificationType } from "@modules/notification/domain/entities/enums/notification-type";
import { PrismaService } from "@shared/database/prisma.service";

@Injectable()
export class NotificationRepositoryImpl extends NotificationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(raw: any): NotificationEntity {
    return NotificationEntity.reconstruct({
      title: raw.title,
      id: raw.id,
      recipientId: raw.recipientId,
      type: raw.type as NotificationType,
      message: raw.message,
      metadata: raw.metadata as Record<string, unknown>,
      isRead: raw.isRead,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async save(notification: NotificationEntity): Promise<void> {
    await this.prisma.notification.upsert({
      where: { id: notification.id },
      create: {
        id: notification.id,
        title: notification.title,
        recipientId: notification.recipientId,
        type: notification.type,
        message: notification.message,
        metadata: notification.metadata as any,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
      update: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        metadata: notification.metadata as any,
        isRead: notification.isRead,
        updatedAt: notification.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const raw = await this.prisma.notification.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findByRecipient(
    recipientId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]> {
    const raw = await this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return raw.map(this.toDomain.bind(this));
  }

  async countUnread(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientId, isRead: false },
    });
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true },
    });
  }
}
