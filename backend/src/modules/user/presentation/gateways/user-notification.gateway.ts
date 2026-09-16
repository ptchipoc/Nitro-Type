import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  namespace: "user-notifications",
  cors: { origin: "*" },
})
export class UserNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(UserNotificationGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      this.logger.debug(`User ${userId} connected to notifications`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.debug(`User ${userId} disconnected from notifications`);
        break;
      }
    }
  }

  notifyStatusUpdate(
    userId: string,
    data: { status: string; reason?: string },
  ) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit("account_status_update", data);
      this.logger.debug(`Notification sent to user ${userId}: ${data.status}`);
    } else {
      this.logger.warn(
        `User ${userId} not connected, notification not sent via WS`,
      );
    }
  }

  notifyFriendRequest(
    userId: string,
    data: { action: string; senderId: string; senderName: string },
  ) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit("friend_request", data);
      this.logger.debug(`Friend notification sent to user ${userId}: ${data.action}`);
    } else {
      this.logger.warn(
        `User ${userId} not connected, friend notification not sent via WS`,
      );
    }
  }
}

