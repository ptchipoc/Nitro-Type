import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { WsJwtGuard } from "@common/guards/ws-jwt-guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";

@WebSocketGateway({
  namespace: "events",
  cors: { origin: "*" },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(EventGateway.name);

  // Map userId → socketId (para saber quem está online)
  private connectedUsers = new Map<string, string>();

  constructor(private readonly eventRepo: EventRepository) {}

  // ─── Conexão ─────────────────────────────────────────────────

  handleConnection(client: Socket): void {
    this.logger.log(`[WS] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    // Remove do map de utilizadores conectados
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`[WS] Cliente desconectado: ${userId}`);
        break;
      }
    }
  }

  // ─── JOIN na sala do evento ───────────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("event:join")
  async handleJoinEvent(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
    @CurrentUser() auth: AuthUser,
  ): Promise<void> {
    const event = await this.eventRepo.findById(data.eventId);
    if (!event) throw new WsException("Evento nao encontrado");

    const participant = event.getParticipant(auth.sub);
    if (!participant) {
      throw new WsException("Nao tens acesso a este evento");
    }
    // Entra na room do Socket.IO
    client.join(`event:${data.eventId}`);
    this.connectedUsers.set(auth.sub, client.id);

    this.logger.log(`[WS] ${auth.sub} entrou na sala event:${data.eventId}`);

    // Envia o estado actual do evento ao utilizador
    client.emit("event:state", event.publicData());
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("event:progress")
  async handleProgress(
    @MessageBody()
    data: {
      eventId: string;
      roundId: string;
      typedChars: number;
      correctTypedChars: number;
      incorrectTypedChars: number;
      progress: number;
      completionTime?: number;
    },
    @CurrentUser() auth: AuthUser,
  ): Promise<void> {
    // Valida os dados básicos
    if (
      data.typedChars < 0 ||
      data.correctTypedChars < 0 ||
      data.incorrectTypedChars < 0
    ) {
      throw new WsException("Dados de progresso inválidos");
    }

    if (data.correctTypedChars + data.incorrectTypedChars !== data.typedChars) {
      throw new WsException("correct + incorrect tem que ser igual ao total");
    }

    // Broadcast do progresso em tempo real para todos na sala
    this.emitToEvent(data.eventId, "event:participant_progress", {
      userId: auth.sub,
      typedChars: data.typedChars,
      correctTypedChars: data.correctTypedChars,
      incorrectTypedChars: data.incorrectTypedChars,
      progress: data.progress,
      completionTime: data.completionTime,
    });
    this.logger.log(`[WS] Progresso de ${auth.sub}: ${data.progress}%`);
    if (data.completionTime) {
      this.logger.log(
        `[WS] ${auth.sub} terminou a rodada em ${data.completionTime}s`,
      );
    }
  }

  // ─── LEAVE da sala do evento ──────────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("event:leave")
  async handleLeaveEvent(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
    @CurrentUser() userId: string,
  ): Promise<void> {
    const event = await this.eventRepo.findById(data.eventId);
    if (!event) return;

    const participant = event.getParticipant(userId);
    if (participant) {
      participant.abandon();
      await this.eventRepo.save(event);
    }

    client.leave(`event:${data.eventId}`);
    this.logger.log(`[WS] ${userId} saiu da sala event:${data.eventId}`);

    // Se todos abandonaram → emite evento
    if (event.allParticipantsGone()) {
      this.emitToEvent(data.eventId, "event:all_abandoned", {
        eventId: data.eventId,
      });
    }
  }

  // ─── Ping / heartbeat ────────────────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit("pong", { ts: new Date().toISOString() });
  }

  // ─── Emit helpers (chamados pelos listeners) ─────────────────

  emitToEvent(eventId: string, event: string, payload: any): void {
    this.server.to(`event:${eventId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: any): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
