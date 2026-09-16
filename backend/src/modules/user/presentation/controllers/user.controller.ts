import {
  Controller,
  Get,
  UseGuards,
  Logger,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { UpdateUserInput } from "@modules/user/presentation/inputs/update-user.input";
import { SearchUserInput } from "@modules/user/presentation/inputs/search-user.input";
import { RolesGuard } from "@common/guards/roles.guard";
import {
  ErrorResponse,
  SuccessArrayResponse,
  SuccessResponse,
} from "@common/responses/envelope.response";
import {
  UserListResponse,
  UserRankingListResponse,
  UserResponse,
  UserWithRankResponse,
} from "../responses/user.response";
import { UserClientService } from "@modules/user/app/services/user-client.service";
import { AuthMessageResponse } from "@modules/auth/presentation/responses/message.response";
import { EmailSignUpInput } from "@modules/auth/presentation/inputs/email-sign-up.input";
import { UserProgressResponse } from "../responses/user-progress.dto";
import { Roles } from "@common/decorators/roles.decorator";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { XpTransactionResponse } from "../responses/xp-transaction.dto";
import { XpTransactionsInput } from "../inputs/xp-transactions.input";
import { GetUserInput } from "../inputs/get-user.input";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly service: UserClientService) {}

  @Get()
  @ApiOperation({ summary: "Lista de usuários" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserListResponse),
    description: "Dados do utilizadores",
  })
  async allUser(@CurrentUser() user: AuthUser) {
    return this.service.getAll();
  }

  @Get("/id")
  @ApiOperation({ summary: "Obter usuário pelo id" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserWithRankResponse),
    description: "Dados do utilizador",
  })
  async getUser(@Query() input: GetUserInput) {
    return this.service.getUserById(input.id);
  }

  @Get("rankingGlobal")
  @ApiOperation({ summary: "Ranking global de usuários" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserRankingListResponse),
    description: "Dados do ranking global",
  })
  async rankingGlobal(@CurrentUser() user: AuthUser) {
    return this.service.getRankingGlobal();
  }

  @Get("me")
  @ApiOperation({ summary: "Meu perfil" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserWithRankResponse),
    description: "Dados do utilizador",
  })
  async me(@CurrentUser() user: AuthUser) {
    return this.service.getUserById(user.sub);
  }

  @Patch("me")
  @ApiOperation({ summary: "Actualizar perfil" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserResponse),
    description: "Perfil actualizado",
  })
  async update(@CurrentUser() user: AuthUser, @Body() input: UpdateUserInput) {
    return this.service.update(user.sub, input);
  }

  @Get("me/progress")
  @ApiOperation({ summary: "Ver meu progresso" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(UserProgressResponse),
    description: "Dados de progresso",
  })
  async myProgress(@CurrentUser() user: AuthUser) {
    return this.service.getUserProgress(user.sub);
  }

  @Get("me/xp-transactions")
  @ApiOperation({ summary: "Ver transações de XP recentes" })
  @ApiResponse({
    status: 200,
    type: SuccessArrayResponse(XpTransactionResponse),
    description: "Lista de transações recentes de XP",
  })
  async myRecentXp(
    @CurrentUser() user: AuthUser,
    @Query() input: XpTransactionsInput,
  ) {
    return this.service.getRecentXp(user.sub, input.limit);
  }

  @Get("search/:q")
  @ApiOperation({ summary: "Pesquisar Usuários" })
  @ApiResponse({
    status: 200,
    type: SuccessArrayResponse(UserResponse),
    description: "Lista de usuários encontrados",
  })
  async search(
    @CurrentUser() _user: AuthUser,
    @Param() input: SearchUserInput,
  ) {
    return this.service.searchUsers(input.q);
  }

  @Post("sign-up/email")
  @ApiTags("Auth — Email")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registar com email + password" })
  @ApiResponse({
    status: 201,
    type: SuccessResponse(AuthMessageResponse),
    description: "Conta criada — OTP enviado por email",
  })
  async signUp(@Body() input: EmailSignUpInput) {
    return this.service.registerByEmail(input);
  }

  // ─── Account Management (Admin) ─────────────────────

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Apagar utilizador (Admin)" })
  @ApiResponse({ status: 200, description: "Utilizador apagado" })
  async delete(@Param("id") id: string) {
    await this.service.delete(id);
    return { message: "Utilizador apagado com sucesso" };
  }

  @Post(":id/block")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Bloquear utilizador (Admin)" })
  @ApiResponse({ status: 201, description: "Utilizador bloqueado" })
  async block(@Param("id") id: string, @Query("reason") reason?: string) {
    await this.service.block(id, reason);
    return { message: "Utilizador bloqueado com sucesso" };
  }

  @Post(":id/suspend")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Suspender utilizador (Admin)" })
  @ApiResponse({ status: 201, description: "Utilizador suspenso" })
  async suspend(@Param("id") id: string, @Query("reason") reason?: string) {
    await this.service.suspend(id, reason);
    return { message: "Utilizador suspenso com sucesso" };
  }
}
