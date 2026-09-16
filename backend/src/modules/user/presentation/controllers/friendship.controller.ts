import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { AuthUser, CurrentUser } from "@common/decorators/current-user.decorator";
import { FriendshipService } from "@modules/user/app/services/friendship.service";
import { SendFriendRequestInput } from "@modules/user/presentation/inputs/send-friend-request.input";
import {
  SuccessResponse,
  SuccessArrayResponse,
} from "@common/responses/envelope.response";
import {
  FriendListResponse,
  FriendRequestListResponse,
  FriendshipResponse,
} from "../responses/friendship.response";

@ApiTags("Friends")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users/friends")
export class FriendshipController {
  private readonly logger = new Logger(FriendshipController.name);

  constructor(private readonly friendshipService: FriendshipService) {}

  @Post("request")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Enviar pedido de amizade" })
  @ApiResponse({ status: 201, description: "Pedido enviado" })
  async sendRequest(
    @CurrentUser() user: AuthUser,
    @Body() input: SendFriendRequestInput,
  ) {
    await this.friendshipService.sendFriendRequest(user.sub, input.receiverId);
    return { message: "Pedido de amizade enviado com sucesso" };
  }

  @Post(":id/accept")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aceitar pedido de amizade" })
  @ApiResponse({ status: 200, description: "Pedido aceite" })
  async accept(
    @CurrentUser() user: AuthUser,
    @Param("id") friendshipId: string,
  ) {
    await this.friendshipService.accept(friendshipId, user.sub);
    return { message: "Pedido de amizade aceite" };
  }

  @Post(":id/reject")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rejeitar pedido de amizade" })
  @ApiResponse({ status: 200, description: "Pedido rejeitado" })
  async reject(
    @CurrentUser() user: AuthUser,
    @Param("id") friendshipId: string,
  ) {
    await this.friendshipService.reject(friendshipId, user.sub);
    return { message: "Pedido de amizade rejeitado" };
  }

  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cancelar pedido de amizade" })
  @ApiResponse({ status: 200, description: "Pedido cancelado" })
  async cancel(
    @CurrentUser() user: AuthUser,
    @Param("id") friendshipId: string,
  ) {
    await this.friendshipService.cancel(friendshipId, user.sub);
    return { message: "Pedido de amizade cancelado" };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remover amigo" })
  @ApiResponse({ status: 200, description: "Amigo removido" })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param("id") friendshipId: string,
  ) {
    await this.friendshipService.remove(friendshipId, user.sub);
    return { message: "Amigo removido com sucesso" };
  }

  @Get()
  @ApiOperation({ summary: "Listar amigos" })
  @ApiResponse({
    status: 200,
    type: SuccessArrayResponse(FriendshipResponse),
    description: "Lista de amigos",
  })
  async listFriends(@CurrentUser() user: AuthUser) {
    return this.friendshipService.listFriends(user.sub);
  }

  @Get("requests")
  @ApiOperation({ summary: "Listar pedidos de amizade pendentes" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(FriendRequestListResponse),
    description: "Pedidos pendentes (recebidos e enviados)",
  })
  async listRequests(@CurrentUser() user: AuthUser) {
    return this.friendshipService.listRequests(user.sub);
  }
}
