import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: "/notifications", cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);
  @WebSocketServer()
  private readonly server: Server;

  async handleConnection(client: Socket): Promise<void> {
    const userId = client.handshake.auth?.userId as string;
    if (!userId) {
      client.disconnect();
      this.logger.log("[WS] [Notifications] Tentativa de conexao sem usuario");
      return;
    }

    await client.join(`user:${userId}`);
    this.logger.log(`[WS] [Notifications] Usuario ${userId} conectado`);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.handshake.auth?.userId as string;

    if (userId) {
      await client.leave(`user:${userId}`);
      console.log(`[WS] [Notifications] User ${userId} desconectado`);
    }
  }

  emitToUser(userId: string, notification: Record<string, unknown>): void {
    this.logger.log(
      `[WS] [Notifications] Enviando notificacao para o usuario ${userId}`,
    );
    this.server.to(`user:${userId}`).emit("notification", notification);
  }
}
