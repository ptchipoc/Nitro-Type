import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
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
import { InviteToChannelInput } from "../inputs/invite-to-channel.input";

@ApiTags("Community — Invites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("community")
export class InvitesController {
  private readonly logger = new Logger(InvitesController.name);

  constructor(private readonly communityService: CommunityService) {}

  @Post("channels/:channelId/invites")
  @ApiOperation({ summary: "Criar convite para um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 201, description: "Convite criado" })
  @ApiResponse({
    status: 400,
    description: "Canal público não precisa de convite",
  })
  @ApiResponse({ status: 409, description: "Convite já enviado" })
  async inviteToChannel(
    @Param("channelId") channelId: string,
    @Body() input: InviteToChannelInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/channels/${channelId}/invites — user: ${user.sub}`,
    );
    return this.communityService.inviteToChannel(input, channelId, user.sub);
  }

  @Get("invites")
  @ApiOperation({ summary: "Listar convites pendentes do utilizador" })
  @ApiResponse({ status: 200, description: "Lista de convites" })
  async getMyInvites(@CurrentUser() user: AuthUser) {
    this.logger.log(`[GET] /community/invites — user: ${user.sub}`);
    return this.communityService.getMyInvites(user.sub);
  }

  @Post("invites/:code/accept")
  @ApiOperation({ summary: "Aceitar convite" })
  @ApiParam({ name: "code", description: "Código do convite" })
  @ApiResponse({ status: 201, description: "Convite aceito" })
  @ApiResponse({ status: 400, description: "Convite expirado" })
  @ApiResponse({ status: 403, description: "Convite não é para ti" })
  async acceptInvite(
    @Param("code") code: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/invites/${code}/accept — user: ${user.sub}`,
    );
    return this.communityService.acceptInvite(code, user.sub);
  }
}
