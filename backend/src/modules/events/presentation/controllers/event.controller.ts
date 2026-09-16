import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import {
  ErrorResponse,
  RateLimitResponse,
  SuccessArrayResponse,
  SuccessResponse,
} from "@common/responses/envelope.response";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { EventService } from "@modules/events/app/services/event.service";
import { CreateEventInput } from "@modules/events/presentation/inputs/create-event.input";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { CreateEventRoundInput } from "@modules/events/presentation/inputs/create-event-round.input";
import { InviteParticipantInput } from "@modules/events/presentation/inputs/invite-participant.input";
import { EventResponse } from "@modules/events/presentation/responses/event.response";
import { EventRoundResponse } from "@modules/events/presentation/responses/event-round.response";
import { EventParticipantResponse } from "@modules/events/presentation/responses/event-participant.response";
import { EventRankingResponse } from "@modules/events/presentation/responses/event-ranking.response";
import { RolesGuard } from "@common/guards/roles.guard";
import { ListEventsInput } from "@modules/events/presentation/inputs/list-events.Input";
import { SubmitResultRoundInput } from "@modules/events/presentation/inputs/submit-result-round.input";
import { EventTotalWinResponse } from "../responses/event-total-win.response";

@ApiTags("Events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // ─── Criar evento ────────────────────────────────────────────

  @Post()
  @ApiOperation({
    summary: "Criar evento",
    description:
      "Cria um novo evento. Públicos só podem ser criados por admins. Privados por qualquer utilizador.",
  })
  @ApiResponse({ status: 201, type: SuccessResponse(EventResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 429, type: RateLimitResponse })
  async create(@Body() body: CreateEventInput, @CurrentUser() auth: AuthUser) {
    const data = await this.eventService.createNewEvent(body, auth.sub);
    return data;
  }

  // ─── Listar eventos públicos ──────────────────────────────────

  @Get("public")
  @ApiOperation({
    summary: "Listar eventos públicos",
    description: "Retorna todos os eventos públicos disponíveis.",
  })
  @ApiResponse({ status: 200, type: SuccessArrayResponse(EventResponse) })
  @ApiResponse({ status: 429, type: RateLimitResponse })
  async listPublic() {
    const data = await this.eventService.listPublicEvents();
    return data;
  }

  // ─── Listar eventos ───────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: "Listar eventos",
    description: "Retorna todos os eventos disponíveis.",
  })
  @ApiResponse({ status: 200, type: SuccessArrayResponse(EventResponse) })
  @ApiResponse({ status: 429, type: RateLimitResponse })
  async list(@CurrentUser() auth: AuthUser, @Query() query: ListEventsInput) {
    const data = await this.eventService.listEvents(
      auth.sub,
      query.status,
      query.type,
    );
    return data;
  }

  @Post(":eventId/rounds/submit")
  @ApiOperation({
    summary: "Gravar resultados da rodada",
    description: "Grava os resultados da rodada.",
  })
  // @ApiResponse({ status: 201, type: SuccessResponse(EventRoundResultResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async submitRoundResults(
    @Body() body: SubmitResultRoundInput,
    @CurrentUser() auth: AuthUser,
  ) {
    const data = await this.eventService.submitRoundResults(body, auth.sub);
    return data;
  }

  // ─── Buscar evento por ID ─────────────────────────────────────

  @Get(":eventId")
  @ApiOperation({
    summary: "Buscar evento",
    description: "Retorna os dados de um evento pelo ID.",
  })
  @ApiResponse({ status: 200, type: SuccessResponse(EventResponse) })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async findOne(@Param("eventId") eventId: string) {
    const data = await this.eventService.findEvent(eventId);
    return data;
  }

  // ─── Adicionar rodada ─────────────────────────────────────────

  @Post(":eventId/rounds")
  @ApiOperation({
    summary: "Adicionar rodada",
    description:
      "Adiciona uma rodada ao evento. Só o criador pode fazer isso e o evento tem que estar em DRAFT.",
  })
  @ApiResponse({ status: 201, type: SuccessResponse(EventRoundResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async addRound(
    @Param("eventId") eventId: string,
    @Body() body: CreateEventRoundInput,
    @CurrentUser() auth: AuthUser,
  ) {
    const data = await this.eventService.addRoundToEvent(
      eventId,
      body,
      auth.sub,
    );
    return data;
  }

  // ─── Iniciar evento ───────────────────────────────────────────

  @Patch(":eventId/start")
  @ApiOperation({
    summary: "Iniciar evento",
    description:
      "Inicia o evento manualmente. Para privados o criador decide quando começa.",
  })
  @ApiResponse({ status: 200, type: SuccessResponse(EventResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async start(
    @Param("eventId") eventId: string,
    @CurrentUser() auth: AuthUser,
  ) {
    const data = await this.eventService.startAnEvent(eventId, auth.sub);
    return data;
  }

  // ─── Convidar participante ────────────────────────────────────

  @Post(":eventId/invite")
  @ApiOperation({
    summary: "Convidar participante",
    description:
      "Convida um utilizador por email para o evento privado. Dispara notificação automática.",
  })
  @ApiResponse({ status: 201, type: SuccessResponse(EventParticipantResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async invite(
    @Param("eventId") eventId: string,
    @Body() body: InviteParticipantInput,
    @CurrentUser() auth: AuthUser,
  ) {
    const data = await this.eventService.inviteToEvent(eventId, body, auth.sub);
    return data;
  }

  // ─── Aceitar convite ──────────────────────────────────────────

  @Patch(":eventId/accept")
  @ApiOperation({
    summary: "Aceitar convite",
    description: "Utilizador aceita o convite para participar do evento.",
  })
  @ApiResponse({ status: 200, type: SuccessResponse(EventParticipantResponse) })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async accept(
    @Param("eventId") eventId: string,
    @CurrentUser() auth: AuthUser,
  ) {
    const data = await this.eventService.acceptEventInvite(eventId, auth.sub);
    return data;
  }

  // ─── Ranking do evento ────────────────────────────────────────

  @Get(":eventId/ranking")
  @ApiOperation({
    summary: "Ranking do evento",
    description:
      "Retorna o ranking final dos participantes com medalhas atribuídas.",
  })
  @ApiResponse({ status: 200, type: SuccessResponse(EventRankingResponse) })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async ranking(@Param("eventId") eventId: string) {
    const data = await this.eventService.rankingOfEvent(eventId);
    return data;
  }

  // ─── XP e Vitórias do Usuário ─────────────────────────────────

  @Get("me/xp-transactions")
  @ApiOperation({
    summary: "Transações de XP em Eventos",
    description: "Retorna o histórico de XP do utilizador logado.",
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, type: ErrorResponse })
  async getMyXpTransactions(@CurrentUser() auth: AuthUser) {
    const data = await this.eventService.getUserEventXpTransactions(auth.sub);
    return {
      message: "Transações de XP retornadas com sucesso",
      data,
    };
  }
}
