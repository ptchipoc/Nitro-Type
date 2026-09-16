import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { CommunityService } from "../../app/services/community.service";
import { SendDMInput } from "../inputs/send-dm.input";
import { OpenOrCreateDMInput } from "../inputs/open-or-create-dm.input";

@ApiTags("Community — Direct Messages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("community")
export class DMsController {
  private readonly logger = new Logger(DMsController.name);

  constructor(private readonly communityService: CommunityService) {}

  // ─── DM CONVERSATIONS ────────────────────────────────────────────────
  @Get("dms")
  @ApiOperation({ summary: "Listar conversas DM" })
  @ApiResponse({ status: 200, description: "Lista de conversas" })
  async getDMConversations(@CurrentUser() user: AuthUser) {
    this.logger.log(`[GET] /community/dms — user: ${user.sub}`);
    return this.communityService.getDMConversations(user.sub);
  }

  @Post("dms")
  @ApiOperation({ summary: "Criar ou abrir conversa DM" })
  @ApiResponse({ status: 201, description: "Conversa criada/aberta" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 403, description: "Não podes abrir DM contigo mesmo" })
  @ApiResponse({ status: 404, description: "Utilizador não encontrado" })
  async createOrOpenDM(
    @Body() input: OpenOrCreateDMInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/dms — user: ${user.sub}, participant: ${input.participantId}`,
    );
    // Abre ou cria uma conversa DM com o participante
    return this.communityService.openOrCreateDM(user.sub, input.participantId);
  }

  @Post("dms/get-id/:participantId")
  @ApiOperation({
    summary: "Obter ID da conversa DM com um participante",
    description:
      "Retorna o ID da conversa DM existente ou cria uma nova e retorna seu ID",
  })
  @ApiParam({ name: "participantId", description: "ID do participante" })
  @ApiResponse({
    status: 200,
    description: "ID da conversa DM",
    schema: { example: { dmId: "conversation-id-123" } },
  })
  @ApiResponse({ status: 403, description: "Não podes abrir DM contigo mesmo" })
  @ApiResponse({ status: 404, description: "Participante não encontrado" })
  async getDMId(
    @Param("participantId") participantId: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/dms/get-id/${participantId} — user: ${user.sub}`,
    );
    const dm = await this.communityService.openOrCreateDM(
      user.sub,
      participantId,
    );
    return { dmId: dm.id };
  }

  @Get("dms/:dmId/messages")
  @ApiOperation({ summary: "Listar mensagens de uma conversa DM" })
  @ApiParam({ name: "dmId", description: "ID da conversa" })
  @ApiResponse({ status: 200, description: "Lista de mensagens" })
  @ApiResponse({ status: 403, description: "Sem acesso a esta conversa" })
  async getDMMessages(
    @Param("dmId") dmId: string,
    @Query("limit") limit: number = 50,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[GET] /community/dms/${dmId}/messages — user: ${user.sub}`,
    );
    return this.communityService.getDMMessages(dmId, user.sub, limit);
  }

  @Post("dms/:participantId/messages")
  @ApiOperation({ summary: "Enviar mensagem numa conversa DM" })
  @ApiParam({ name: "participantId", description: "ID do participante" })
  @ApiResponse({ status: 201, description: "Mensagem enviada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 403, description: "Sem acesso a esta conversa" })
  @ApiResponse({ status: 404, description: "Participante não encontrado" })
  async sendDMMessage(
    @Param("participantId") participantId: string,
    @Body() input: SendDMInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/dms/${participantId}/messages — user: ${user.sub}`,
    );
    // Abre ou cria DM e envia a mensagem
    const dm = await this.communityService.openOrCreateDM(
      user.sub,
      participantId,
    );
    return this.communityService.sendDM(
      { ...input, toUserId: participantId },
      user.sub,
    );
  }

  // ─── PRESENCE ────────────────────────────────────────────────────────
  @Patch("presence")
  @ApiOperation({ summary: "Atualizar status de presença" })
  @ApiResponse({ status: 200, description: "Presença atualizada" })
  async updatePresence(
    @Body() input: { status: string },
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(`[PATCH] /community/presence — user: ${user.sub}`);
    return this.communityService.updatePresence(user.sub, input.status);
  }

  @Get("presence/:userId")
  @ApiOperation({ summary: "Obter status de presença de um utilizador" })
  @ApiParam({ name: "userId", description: "ID do utilizador" })
  @ApiResponse({ status: 200, description: "Status de presença" })
  async getPresence(@Param("userId") userId: string) {
    this.logger.log(`[GET] /community/presence/${userId}`);
    return this.communityService.getPresence(userId);
  }
}
