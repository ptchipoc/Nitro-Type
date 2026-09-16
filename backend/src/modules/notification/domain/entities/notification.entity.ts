import { randomUUID } from "crypto";
import { CreateNotificationProps } from "./props/create-notification";
import { BaseEntity } from "@shared/entities/base.entity";
import { NotificationType } from "./enums/notification-type";
import { ConflictException } from "@nestjs/common";

export interface NotificationProps {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationEntity extends BaseEntity {
  constructor(private readonly props: NotificationProps) {
    super(props.id, props.createdAt, props.updatedAt);
  }

  get recipientId() {
    return this.props.recipientId;
  }
  get type() {
    return this.props.type;
  }
  get title() {
    return this.props.title;
  }
  get message() {
    return this.props.message;
  }
  get metadata() {
    return this.props.metadata;
  }
  get isRead() {
    return this.props.isRead;
  }

  //   factory methods
  static create(props: CreateNotificationProps): NotificationEntity {
    return new NotificationEntity({
      id: randomUUID(),
      recipientId: props.recipientId,
      type: props.type,
      title: props.title,
      message: props.message,
      metadata: props.metadata ?? {},
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstruct(props: NotificationProps): NotificationEntity {
    return new NotificationEntity(props);
  }

  //   business logic methods
  markAsRead() {
    if (this.props.isRead) {
      throw new ConflictException("Notificação já está marcada como lida");
    }
    this.props.isRead = true;
    this.touch();
  }

  isReaded() {
    return this.props.isRead;
  }

  publicData() {
    return {
      id: this.id,
      recipientId: this.recipientId,
      type: this.type,
      title: this.title,
      message: this.message,
      metadata: this.metadata,
      isRead: this.isRead,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
