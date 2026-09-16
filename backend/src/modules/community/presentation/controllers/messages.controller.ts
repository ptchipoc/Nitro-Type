import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
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
import { ParamsChannelId, SendMessageInput } from "../inputs/send-message.input";
import { AddReactionInput } from "../inputs/add-reaction.input";
import { EditMessageInput } from "../inputs/edit-message.input";

@ApiTags("Community — Messages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("community")
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

  constructor(private readonly communityService: CommunityService) {}

  // ─── CHANNEL MESSAGES ────────────────────────────────────────────────
  @Get("channels/:channelId/messages")
  @ApiOperation({ summary: "Listar mensagens de um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 200, description: "Lista de mensagens" })
  @ApiResponse({ status: 403, description: "Sem permissão de acesso" })
  async getChannelMessages(
    @Param("channelId") channelId: string,
    @Query("limit") limit: number = 50,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[GET] /community/channels/${channelId}/messages — user: ${user.sub}`,
    );
    return  this.communityService.getChannelMessages(channelId, user.sub, limit);
  }

  @Post("channels/:channelId/messages")
  @ApiOperation({ summary: "Enviar mensagem num canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 201, description: "Mensagem enviada" })
  @ApiResponse({ status: 403, description: "Sem permissão para enviar" })
  async sendChannelMessage(
    @Param() params: ParamsChannelId,
    @Body() input: SendMessageInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/channels/${params.channelId}/messages — user: ${user.sub}`,
    );
    return this.communityService.sendMessage(input, params.channelId, user.sub);
  }

  // ─── MESSAGE OPERATIONS ──────────────────────────────────────────────
  @Get("messages/:messageId")
  @ApiOperation({ summary: "Obter detalhes de uma mensagem" })
  @ApiParam({ name: "messageId", description: "ID da mensagem" })
  @ApiResponse({ status: 200, description: "Detalhes da mensagem" })
  @ApiResponse({ status: 404, description: "Mensagem não encontrada" })
  async getMessage(@Param("messageId") messageId: string) {
    this.logger.log(`[GET] /community/messages/${messageId}`);
    // TODO: Implementar no service se necessário
    return { message: "Get single message - TODO" };
  }

  @Patch("messages/:messageId")
  @ApiOperation({ summary: "Editar uma mensagem" })
  @ApiParam({ name: "messageId", description: "ID da mensagem" })
  @ApiResponse({ status: 200, description: "Mensagem editada" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async editMessage(
    @Param("messageId") messageId: string,
    @Body() input: EditMessageInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[PATCH] /community/messages/${messageId} — user: ${user.sub}`,
    );
    return this.communityService.editMessage({ ...input, messageId }, user.sub);
  }

  @Delete("messages/:messageId")
  @ApiOperation({ summary: "Apagar uma mensagem" })
  @ApiParam({ name: "messageId", description: "ID da mensagem" })
  @ApiResponse({ status: 204, description: "Mensagem apagada" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async deleteMessage(
    @Param("messageId") messageId: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[DELETE] /community/messages/${messageId} — user: ${user.sub}`,
    );
    await this.communityService.deleteMessage(messageId, user.sub);
    return { ok: true };
  }

  // ─── REACTIONS ───────────────────────────────────────────────────────
  @Put("messages/:messageId/reactions")
  @ApiOperation({ summary: "Adicionar reação a uma mensagem" })
  @ApiParam({ name: "messageId", description: "ID da mensagem" })
  @ApiResponse({ status: 200, description: "Reação adicionada" })
  @ApiResponse({ status: 404, description: "Mensagem não encontrada" })
  async addReaction(
    @Param("messageId") messageId: string,
    @Body() input: AddReactionInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[PUT] /community/messages/${messageId}/reactions — user: ${user.sub}`,
    );
    return this.communityService.addReaction({ ...input, messageId }, user.sub);
  }

  @Delete("messages/:messageId/reactions/:emoji")
  @ApiOperation({ summary: "Remover reação de uma mensagem" })
  @ApiParam({ name: "messageId", description: "ID da mensagem" })
  @ApiParam({ name: "emoji", description: "Emoji da reação" })
  @ApiResponse({ status: 204, description: "Reação removida" })
  async removeReaction(
    @Param("messageId") messageId: string,
    @Param("emoji") emoji: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[DELETE] /community/messages/${messageId}/reactions/${emoji} — user: ${user.sub}`,
    );
    await this.communityService.removeReaction(messageId, emoji, user.sub);
    return { ok: true };
  }
}
