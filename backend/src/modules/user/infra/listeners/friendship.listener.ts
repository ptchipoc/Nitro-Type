import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { FriendRequestSentEvent } from "@modules/user/domain/events/friend-request-sent.event";
import { FriendRequestAcceptedEvent } from "@modules/user/domain/events/friend-request-accepted.event";
import { FriendRequestRejectedEvent } from "@modules/user/domain/events/friend-request-rejected.event";
import { FriendRequestCancelledEvent } from "@modules/user/domain/events/friend-request-cancelled.event";
import { FriendRemovedEvent } from "@modules/user/domain/events/friend-removed.event";
import { FriendNotificationEvent } from "@modules/notification/domain/events/friend-notification.event";
import { UserNotificationGateway } from "@modules/user/presentation/gateways/user-notification.gateway";

@Injectable()
export class FriendshipListener {
  private readonly logger = new Logger(FriendshipListener.name);

  constructor(
    private readonly eventBus: EventBusPort,
    private readonly gateway: UserNotificationGateway,
  ) {}

  @OnEvent("friend.request.sent")
  async handleFriendRequestSent(event: FriendRequestSentEvent): Promise<void> {
    this.logger.log(
      `[friend.request.sent] ${event.senderId} → ${event.receiverId}`,
    );

    // Emite evento para o módulo de notificação persistir
    await this.eventBus.publish([
      new FriendNotificationEvent(
        event.receiverId,
        "FRIEND_REQUEST",
        event.senderName,
        { senderId: event.senderId },
      ),
    ]);

    // Notifica o receiver via WS
    this.gateway.notifyFriendRequest(event.receiverId, {
      action: "FRIEND_REQUEST",
      senderId: event.senderId,
      senderName: event.senderName,
    });
  }

  @OnEvent("friend.request.accepted")
  async handleFriendRequestAccepted(
    event: FriendRequestAcceptedEvent,
  ): Promise<void> {
    this.logger.log(
      `[friend.request.accepted] ${event.receiverId} aceitou ${event.senderId}`,
    );

    await this.eventBus.publish([
      new FriendNotificationEvent(
        event.senderId,
        "FRIEND_ACCEPTED",
        event.receiverName,
        { receiverId: event.receiverId },
      ),
    ]);

    this.gateway.notifyFriendRequest(event.senderId, {
      action: "FRIEND_ACCEPTED",
      senderId: event.receiverId,
      senderName: event.receiverName,
    });
  }

  @OnEvent("friend.request.rejected")
  async handleFriendRequestRejected(
    event: FriendRequestRejectedEvent,
  ): Promise<void> {
    this.logger.log(
      `[friend.request.rejected] ${event.receiverId} rejeitou ${event.senderId}`,
    );

    await this.eventBus.publish([
      new FriendNotificationEvent(
        event.senderId,
        "FRIEND_REJECTED",
        event.receiverName,
        { receiverId: event.receiverId },
      ),
    ]);

    this.gateway.notifyFriendRequest(event.senderId, {
      action: "FRIEND_REJECTED",
      senderId: event.receiverId,
      senderName: event.receiverName,
    });
  }

  @OnEvent("friend.removed")
  async handleFriendRemoved(event: FriendRemovedEvent): Promise<void> {
    this.logger.log(
      `[friend.removed] ${event.userId} removeu ${event.friendId}`,
    );

    await this.eventBus.publish([
      new FriendNotificationEvent(
        event.friendId,
        "FRIEND_REMOVED",
        event.userName,
        { userId: event.userId },
      ),
    ]);

    this.gateway.notifyFriendRequest(event.friendId, {
      action: "FRIEND_REMOVED",
      senderId: event.userId,
      senderName: event.userName,
    });
  }

  @OnEvent("friend.request.cancelled")
  async handleFriendRequestCancelled(event: FriendRequestCancelledEvent): Promise<void> {
    this.logger.log(
      `[friend.request.cancelled] ${event.senderId} cancelou pedido para ${event.receiverId}`,
    );

    // Optionally emit a notification or just a websocket event to update UI
    this.gateway.notifyFriendRequest(event.receiverId, {
      action: "FRIEND_CANCELLED",
      senderId: event.senderId,
      senderName: event.senderName,
    });
  }
}
