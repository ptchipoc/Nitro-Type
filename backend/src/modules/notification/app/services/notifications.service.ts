import { Injectable } from "@nestjs/common";
import { ListNotificationsUseCase } from "../use-case/list-notifications.use-case";
import { MarkAsReadUseCase } from "../use-case/mark-as-read.use-case";
import { MarkAllAsReadUseCase } from "../use-case/mark-all-as-read.use-case";
import { ListNotificationsInput } from "../../presentation/inputs/list-motifications.input";
import { MarkAsReadInput } from "../../presentation/inputs/markas-read.Input";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly listUseCase: ListNotificationsUseCase,
    private readonly markAsReadUseCase: MarkAsReadUseCase,
    private readonly markAllAsReadUseCase: MarkAllAsReadUseCase,
  ) {}

  listNotifications(input: ListNotificationsInput, userId: string) {
    return this.listUseCase.execute(input, userId);
  }

  markAsRead(input: MarkAsReadInput, userId: string) {
    return this.markAsReadUseCase.execute(input, userId);
  }

  markAllAsRead(userId: string) {
    return this.markAllAsReadUseCase.execute(userId);
  }
}
