import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
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
import { CreateChannelInput } from "../inputs/create-channel.input";
import { EditChannelInput } from "../inputs/edit-channel.input";

@ApiTags("Community — Channels")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("community/channels")
export class ChannelsController {
  private readonly logger = new Logger(ChannelsController.name);

  constructor(private readonly communityService: CommunityService) {}

  @Post()
  @ApiOperation({ summary: "Criar novo canal" })
  @ApiResponse({ status: 201, description: "Canal criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async createChannel(
    @Body() input: CreateChannelInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(`[POST] /community/channels — user: ${user.sub}`);
    return this.communityService.createChannel(input, user.sub);
  }

  @Get()
  @ApiOperation({ summary: "Listar canais públicos e privados" })
  @ApiResponse({ status: 200, description: "Lista de canais" })
  async getChannels(@CurrentUser() user: AuthUser) {
    this.logger.log(`[GET] /community/channels — user: ${user.sub}`);
    return this.communityService.getChannels(user.sub);
  }

  @Get(":channelId")
  @ApiOperation({ summary: "Obter detalhes de um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 200, description: "Detalhes do canal" })
  @ApiResponse({ status: 404, description: "Canal não encontrado" })
  async getChannel(@Param("channelId") channelId: string) {
    this.logger.log(`[GET] /community/channels/${channelId}`);
    return this.communityService.getChannelById(channelId);
  }

  @Patch(":channelId")
  @ApiOperation({ summary: "Editar canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 200, description: "Canal editado com sucesso" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  @ApiResponse({ status: 404, description: "Canal não encontrado" })
  async editChannel(
    @Param("channelId") channelId: string,
    @Body() input: EditChannelInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(`[PATCH] /community/channels/${channelId} — user: ${user.sub}`);
    return this.communityService.editChannel(channelId, input, user.sub);
  }

  @Delete(":channelId")
  @ApiOperation({ summary: "Remover canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 200, description: "Canal removido com sucesso" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  @ApiResponse({ status: 404, description: "Canal não encontrado" })
  async removeChannel(
    @Param("channelId") channelId: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(`[DELETE] /community/channels/${channelId} — user: ${user.sub}`);
    return this.communityService.removeChannel(channelId, user.sub);
  }
}
