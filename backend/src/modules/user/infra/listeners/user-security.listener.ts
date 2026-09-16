import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserBlockedEvent } from "../../domain/events/user-blocked.event";
import { UserSuspendedEvent } from "../../domain/events/user-suspended.event";
import { UserNotificationGateway } from "@modules/user/presentation/gateways/user-notification.gateway";

@Injectable()
export class UserSecurityListener {
  private readonly logger = new Logger(UserSecurityListener.name);

  constructor(private readonly gateway: UserNotificationGateway) {}

  @OnEvent("user.blocked")
  handleUserBlocked(event: UserBlockedEvent) {
    this.logger.log(` [user.blocked] userId: ${event.userId}`);
    this.gateway.notifyStatusUpdate(event.userId, {
      status: "BANNED",
      reason: event.reason,
    });
  }

  @OnEvent("user.suspended")
  handleUserSuspended(event: UserSuspendedEvent) {
    this.logger.log(`[user.suspended] userId: ${event.userId}`);
    this.gateway.notifyStatusUpdate(event.userId, {
      status: "SUSPENDED",
      reason: event.reason,
    });
  }
}
