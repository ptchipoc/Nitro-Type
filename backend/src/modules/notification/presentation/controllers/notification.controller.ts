import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { ListNotificationsInput } from "@modules/notification/presentation/inputs/list-motifications.input";
import { NotificationsService } from "@modules/notification/app/services/notifications.service";
import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("notifications")
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Lista as notificações do usuário autenticado",
    description: "Lista as notificações do usuário autenticado",
  })
  @ApiResponse({ status: 200, description: "Lista de notificações" })
  list(
    @CurrentUser() authUser: AuthUser,
    @Query() query: ListNotificationsInput,
  ) {
    return this.service.listNotifications(query, authUser.sub);
  }

  @Patch(":id/read")
  @ApiOperation({
    summary: "Marca uma notificação como lida",
    description: "Marca uma notificação como lida",
  })
  @ApiResponse({ status: 200, description: "Notificação marcada como lida" })
  read(@Param("id") id: string, @CurrentUser() authUser: AuthUser) {
    return this.service.markAsRead({ id }, authUser.sub);
  }

  @Patch("read-all")
  @ApiOperation({
    summary: "Marca todas as notificações como lidas",
    description: "Marca todas as notificações como lidas",
  })
  @ApiResponse({
    status: 200,
    description: "Todas as notificações marcadas como lidas",
  })
  readAll(@CurrentUser() authUser: AuthUser) {
    return this.service.markAllAsRead(authUser.sub);
  }
}
