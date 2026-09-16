import { NotificationRepository } from "@modules/notification/domain/repo/notification.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MarkAsReadInput } from "../../presentation/inputs/markas-read.Input";

@Injectable()
export class MarkAsReadUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(input: MarkAsReadInput, userId: string): Promise<void> {
    const notification = await this.notificationRepo.findById(input.id);

    if (!notification || notification.recipientId !== userId) {
      throw new NotFoundException("Notificação não encontrada");
    }

    notification.markAsRead();
    await this.notificationRepo.save(notification);
  }
}
