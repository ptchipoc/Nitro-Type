import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationGateway } from "../../presentation/gateways/notification.gateway";
import { SystemNotificationEvent } from "../../domain/events/system-notification.event";
import { CommunityNotificationEvent } from "../../domain/events/community-notification.event";
import { EventNotificationEvent } from "../../domain/events/event-notification.event";
import { DmNotificationEvent } from "../../domain/events/dm-notification.event";
import { FriendNotificationEvent } from "../../domain/events/friend-notification.event";
import { SendNotificationUseCase } from "../../app/use-case/send-notification.use-case";
import { NotificationType } from "../../domain/entities/enums/notification-type";
import { NotificationCreatedEvent } from "@modules/notification/domain/events/notification-created.event";
import { Logger } from "@nestjs/common";

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);
  constructor(
    private readonly sendNotification: SendNotificationUseCase,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @OnEvent("notification.created")
  handleCreated(event: NotificationCreatedEvent): void {
    this.logger.log("[NotificationListener] handleCreated:", event);
    this.notificationGateway.emitToUser(
      event.notification.recipientId,
      event.notification.publicData(),
    );
  }

  @OnEvent("system.notification")
  async handleSystem(event: SystemNotificationEvent): Promise<void> {
    this.logger.log("[NotificationListener] handleSystem:", event);
    const titles: Record<string, string> = {
      BANNED: "A tua conta foi banida",
      BLOCKED: "A tua conta foi bloqueada",
      UNBLOCKED: "A tua conta foi desbloqueada",
      GENERAL: "Notificação do sistema",
    };

    await this.sendNotification.execute({
      recipientId: event.recipientId,
      type: NotificationType.SYSTEM,
      title: titles[event.action],
      message: event.reason ?? "Ação executada pelo sistema.",
      metadata: { action: event.action, reason: event.reason },
    });
  }

  @OnEvent("community.notification")
  async handleCommunity(event: CommunityNotificationEvent): Promise<void> {
    this.logger.log("[NotificationListener] handleCommunity:", event);
    const titles: Record<string, string> = {
      CHANNEL_INVITE: `Foste convidado para ${event.channelName}`,
      CHANNEL_KICK: `Foste removido de ${event.channelName}`,
      ROLE_UPDATED: `As tuas permissões em ${event.channelName} foram atualizadas`,
    };

    await this.sendNotification.execute({
      recipientId: event.recipientId,
      type: NotificationType.COMMUNITY,
      title: titles[event.action],
      message: titles[event.action],
      metadata: {
        action: event.action,
        channelId: event.channelId,
        channelName: event.channelName,
        ...event.extra,
      },
    });
  }

  @OnEvent("EVENT.NOTIFICATION")
  async handleEventx(event: EventNotificationEvent): Promise<void> {
    this.logger.log("[NotificationListener] handleEvent:", event);
    const titles: Record<string, string> = {
      EVENT_INVITE: `Foste convidado para ${event.eventName}`,
      EVENT_STARTED: `O torneio ${event.eventName} começou!`,
      EVENT_RESULT: `Resultado do torneio ${event.eventName}`,
      EVENT_ACCEPTED: `O convite para ${event.eventName} foi aceite!`,
    };

    await this.sendNotification.execute({
      recipientId: event.recipientId,
      type: NotificationType.EVENT,
      title: titles[event.action],
      message: event.message ?? titles[event.action],
      metadata: {
        action: event.action,
        eventId: event.eventId,
        eventName: event.eventName,
        ...event.extra,
      },
    });
  }

  @OnEvent("notification.dm")
  async handleDm(event: DmNotificationEvent): Promise<void> {
    this.logger.log("[NotificationListener] handleDm:", event);
    await this.sendNotification.execute({
      recipientId: event.recipientId,
      type: NotificationType.DIRECT_MESSAGE,
      title: `Nova mensagem de ${event.senderUsername}`,
      message: event.preview,
      metadata: {
        senderId: event.senderId,
        senderUsername: event.senderUsername,
      },
    });
  }

  @OnEvent("friend.notification")
  async handleFriend(event: FriendNotificationEvent): Promise<void> {
    this.logger.log("[NotificationListener] handleFriend:", event);
    const titles: Record<string, string> = {
      FRIEND_REQUEST: `${event.senderName} quer ser teu amigo`,
      FRIEND_ACCEPTED: `${event.senderName} aceitou o teu pedido de amizade`,
      FRIEND_REJECTED: `${event.senderName} rejeitou o teu pedido de amizade`,
      FRIEND_REMOVED: `${event.senderName} removeu-te da lista de amigos`,
    };

    await this.sendNotification.execute({
      recipientId: event.recipientId,
      type: NotificationType.FRIEND_REQUEST,
      title: titles[event.action],
      message: titles[event.action],
      metadata: {
        action: event.action,
        senderName: event.senderName,
        ...event.extra,
      },
    });
  }
}
