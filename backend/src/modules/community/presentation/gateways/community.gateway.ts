import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CommunityService } from "../../app/services/community.service";

interface ClientUser {
  userId: string;
  socketId: string;
}

@WebSocketGateway({ namespace: "/community", cors: true })
export class CommunityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CommunityGateway.name);
  private readonly connectedUsers = new Map<string, ClientUser>();

  @WebSocketServer()
  private server!: Server;

  constructor(private readonly communityService: CommunityService) {}

  // ─── CONNECTION & DISCONNECTION ──────────────────────────────────

  async handleConnection(client: Socket): Promise<void> {
    const userId = client.handshake.auth?.userId as string;

    if (!userId) {
      this.logger.warn("[WS] [Community] Conexão rejeitada: userId não fornecido");
      client.disconnect();
      return;
    }

    try {
      // Registar utilizador conectado
      this.connectedUsers.set(client.id, { userId, socketId: client.id });

      // Entrar na sala do utilizador
      await client.join(`user:${userId}`);

      // Atualizar presença
      await this.communityService.updatePresence(userId, "ONLINE");

      this.logger.log(
        `[WS] [Community] Utilizador ${userId} conectado (socket: ${client.id})`,
      );

      // Notificar outros utilizadores da presença
      this.server.emit("user:online", { userId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      this.connectedUsers.delete(client.id);
      this.logger.error(
        `[WS] [Community] Erro ao conectar ${userId}: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (clientData) {
      const { userId } = clientData;
      this.connectedUsers.delete(client.id);

      // Atualizar presença para offline
      try {
        await this.communityService.updatePresence(userId, "OFFLINE");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        this.logger.error(
          `[WS] [Community] Erro ao atualizar presença de ${userId}: ${errorMessage}`,
        );
      }

      this.logger.log(
        `[WS] [Community] Utilizador ${userId} desconectado (socket: ${client.id})`,
      );

      // Notificar outros utilizadores
      this.server.emit("user:offline", { userId });
    }
  }

  // ─── CHANNEL MESSAGES ────────────────────────────────────────────

  @SubscribeMessage("channel:message")
  async handleChannelMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; content: string; replyToId?: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(
      `[WS] [Channel] Mensagem de ${userId} no canal ${data.channelId}`,
    );

    try {
      // Enviar mensagem através do serviço
      const message = await this.communityService.sendMessage(
        {
          content: data.content,
          replyToId: data.replyToId,
        },
        data.channelId,
        userId,
      );

      // Emitir para o canal
      this.server
        .to(`channel:${data.channelId}`)
        .emit("channel:message", { channelId: data.channelId, message });

      this.logger.log(
        `[WS] [Channel] Mensagem enviada no canal ${data.channelId}`,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(
        `[WS] [Channel] Erro ao enviar mensagem: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
    }
  }

  @SubscribeMessage("channel:join")
  async handleChannelJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(`[WS] [Channel] ${userId} entrando no canal ${data.channelId}`);

    // Entrar na sala do canal
    await client.join(`channel:${data.channelId}`);

    // Notificar outros utilizadores no canal
    this.server
      .to(`channel:${data.channelId}`)
      .emit("channel:user-joined", { channelId: data.channelId, userId });
  }

  @SubscribeMessage("channel:leave")
  async handleChannelLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(`[WS] [Channel] ${userId} saindo do canal ${data.channelId}`);

    // Sair da sala do canal
    await client.leave(`channel:${data.channelId}`);

    // Notificar outros utilizadores no canal
    this.server
      .to(`channel:${data.channelId}`)
      .emit("channel:user-left", { channelId: data.channelId, userId });
  }

  // ─── DIRECT MESSAGES ─────────────────────────────────────────────

  @SubscribeMessage("dm:message")
  async handleDMMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { participantId: string; content: string; replyToId?: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(
      `[WS] [DM] Mensagem de ${userId} para ${data.participantId}`,
    );

    try {
      // Abre ou cria DM
      const dm = await this.communityService.openOrCreateDM(
        userId,
        data.participantId,
      );

      // Enviar mensagem
      const message = await this.communityService.sendDM(
        {
          toUserId: data.participantId,
          content: data.content,
          replyToId: data.replyToId,
        },
        userId,
      );

      // Emitir para ambos os participantes
      const dmRoom = this.createDMRoom(userId, data.participantId);
      this.server
        .to(dmRoom)
        .emit("dm:message", { participantId: data.participantId, message });

      this.logger.log(
        `[WS] [DM] Mensagem enviada entre ${userId} e ${data.participantId}`,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(`[WS] [DM] Erro ao enviar mensagem: ${errorMessage}`);
      client.emit("error", { message: errorMessage });
    }
  }

  @SubscribeMessage("dm:join")
  async handleDMJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { participantId: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    const dmRoom = this.createDMRoom(userId, data.participantId);

    this.logger.log(
      `[WS] [DM] ${userId} entrando na conversa com ${data.participantId}`,
    );

    // Entrar na sala da DM
    await client.join(dmRoom);

    // Notificar o outro participante
    this.server
      .to(`user:${data.participantId}`)
      .emit("dm:user-joined", { userId, participantId: data.participantId });
  }

  @SubscribeMessage("dm:leave")
  async handleDMLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { participantId: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    const dmRoom = this.createDMRoom(userId, data.participantId);

    this.logger.log(
      `[WS] [DM] ${userId} saindo da conversa com ${data.participantId}`,
    );

    // Sair da sala da DM
    await client.leave(dmRoom);

    // Notificar o outro participante
    this.server
      .to(`user:${data.participantId}`)
      .emit("dm:user-left", { userId, participantId: data.participantId });
  }

  // ─── PRESENCE ────────────────────────────────────────────────────

  @SubscribeMessage("presence:update")
  async handlePresenceUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { status: "online" | "offline" | "idle" | "dnd" },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(`[WS] [Presence] ${userId} status: ${data.status}`);

    try {
      // Atualizar presença no serviço
      const updatedPresence = await this.communityService.updatePresence(
        userId,
        data.status,
      );

      // Notificar todos os utilizadores
      this.server.emit("presence:updated", {
        userId,
        status: updatedPresence.status,
        lastSeenAt: updatedPresence.lastSeenAt,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(
        `[WS] [Presence] Erro ao atualizar presença: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
    }
  }

  @SubscribeMessage("presence:get")
  async handlePresenceGet(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ): Promise<void> {
    this.logger.log(`[WS] [Presence] Obtendo presença de ${data.userId}`);

    try {
      const presence = await this.communityService.getPresence(data.userId);
      client.emit("presence:status", { userId: data.userId, ...presence });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(
        `[WS] [Presence] Erro ao obter presença: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
    }
  }

  // ─── REACTIONS ───────────────────────────────────────────────────

  @SubscribeMessage("message:reaction:add")
  async handleReactionAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; emoji: string; type: "channel" | "dm"; channelId?: string; participantId?: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(`[WS] [Reaction] ${userId} adicionou ${data.emoji} a ${data.messageId}`);

    try {
      const reaction = await this.communityService.addReaction(
        { messageId: data.messageId, emoji: data.emoji },
        userId,
      );

      // Determinar sala para emitir
      let room: string;
      if (data.type === "channel" && data.channelId) {
        room = `channel:${data.channelId}`;
      } else if (data.type === "dm" && data.participantId) {
        room = this.createDMRoom(userId, data.participantId);
      } else {
        return;
      }

      // Emitir para a sala apropriada
      this.server
        .to(room)
        .emit("message:reaction:added", {
          messageId: data.messageId,
          emoji: data.emoji,
          userId,
          reaction,
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(
        `[WS] [Reaction] Erro ao adicionar reação: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
    }
  }

  @SubscribeMessage("message:reaction:remove")
  async handleReactionRemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; emoji: string; type: "channel" | "dm"; channelId?: string; participantId?: string },
  ): Promise<void> {
    const clientData = this.connectedUsers.get(client.id);

    if (!clientData) {
      this.logger.warn("[WS] Cliente não autenticado");
      return;
    }

    const { userId } = clientData;
    this.logger.log(`[WS] [Reaction] ${userId} removeu ${data.emoji} de ${data.messageId}`);

    try {
      await this.communityService.removeReaction(data.messageId, data.emoji, userId);

      // Determinar sala para emitir
      let room: string;
      if (data.type === "channel" && data.channelId) {
        room = `channel:${data.channelId}`;
      } else if (data.type === "dm" && data.participantId) {
        room = this.createDMRoom(userId, data.participantId);
      } else {
        return;
      }

      // Emitir para a sala apropriada
      this.server
        .to(room)
        .emit("message:reaction:removed", {
          messageId: data.messageId,
          emoji: data.emoji,
          userId,
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(
        `[WS] [Reaction] Erro ao remover reação: ${errorMessage}`,
      );
      client.emit("error", { message: errorMessage });
    }
  }

  // ─── HELPERS ─────────────────────────────────────────────────────

  /**
   * Cria um identificador único para uma sala de DM
   * Garante que ambos os participantes estejam na mesma sala
   */
  private createDMRoom(userId1: string, userId2: string): string {
    const sorted = [userId1, userId2].sort();
    return `dm:${sorted[0]}:${sorted[1]}`;
  }

  /**
   * Broadcast para um canal específico
   */
  broadcastToChannel(
    channelId: string,
    event: string,
    data: Record<string, unknown>,
  ): void {
    this.server.to(`channel:${channelId}`).emit(event, data);
  }

  /**
   * Broadcast para uma conversa DM
   */
  broadcastToDM(
    userId1: string,
    userId2: string,
    event: string,
    data: Record<string, unknown>,
  ): void {
    const room = this.createDMRoom(userId1, userId2);
    this.server.to(room).emit(event, data);
  }

  /**
   * Broadcast para um utilizador específico
   */
  broadcastToUser(
    userId: string,
    event: string,
    data: Record<string, unknown>,
  ): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Broadcast para todos os utilizadores (menos um)
   */
  broadcastToAll(
    event: string,
    data: Record<string, unknown>,
    excludeUserId?: string,
  ): void {
    if (excludeUserId) {
      this.server.except(`user:${excludeUserId}`).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }
}
