import {
  Body,
  Controller,
  Delete,
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
import { AddMemberInput } from "../inputs/add-member.input";
import { RemoveMemberInput } from "../inputs/remove-member.input";
import { BanMemberInput } from "../inputs/ban-member.input";
import { UpdateMemberRoleInput } from "../inputs/update-member-role.input";

@ApiTags("Community — Members")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("community/channels/:channelId/members")
export class MembersController {
  private readonly logger = new Logger(MembersController.name);

  constructor(private readonly communityService: CommunityService) {}

  @Post()
  @ApiOperation({ summary: "Adicionar membro a um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiResponse({ status: 201, description: "Membro adicionado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  @ApiResponse({ status: 409, description: "Utilizador já é membro" })
  async addMember(
    @Param("channelId") channelId: string,
    @Body() input: AddMemberInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/channels/${channelId}/members — user: ${user.sub}`,
    );
    return this.communityService.addMember({ ...input, channelId }, user.sub);
  }

  @Delete(":userId")
  @ApiOperation({ summary: "Remover membro de um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiParam({ name: "userId", description: "ID do utilizador" })
  @ApiResponse({ status: 204, description: "Membro removido" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async removeMember(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() input: RemoveMemberInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[DELETE] /community/channels/${channelId}/members/${userId} — user: ${user.sub}`,
    );
    await this.communityService.removeMember(
      { ...input, channelId, userId },
      user.sub,
    );
    return { ok: true };
  }

  @Post(":userId/ban")
  @ApiOperation({ summary: "Banir membro de um canal" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiParam({ name: "userId", description: "ID do utilizador" })
  @ApiResponse({ status: 204, description: "Membro banido" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async banMember(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() input: BanMemberInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /community/channels/${channelId}/members/${userId}/ban — user: ${user.sub}`,
    );
    await this.communityService.banMember(
      { ...input, channelId, userId },
      user.sub,
    );
    return { ok: true };
  }

  @Patch(":userId/role")
  @ApiOperation({ summary: "Alterar role de um membro" })
  @ApiParam({ name: "channelId", description: "ID do canal" })
  @ApiParam({ name: "userId", description: "ID do utilizador" })
  @ApiResponse({ status: 200, description: "Role alterada" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async updateMemberRole(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() input: UpdateMemberRoleInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[PATCH] /community/channels/${channelId}/members/${userId}/role — user: ${user.sub}`,
    );
    return this.communityService.updateMemberRole(
      { ...input, channelId, userId },
      user.sub,
    );
  }
}
