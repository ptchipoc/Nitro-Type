import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Logger,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { CreateSessionInput } from "@modules/typing/presentation/inputs/create-session.input";
import { SubmitResultInput } from "@modules/typing/presentation/inputs/submit-result.input";
import { CreateSessionUseCase } from "@modules/typing/app/use-case/create-session.use-case";
import { SubmitResultUseCase } from "@modules/typing/app/use-case/result/submit-result.use-case";
import { GetSessionUseCase } from "@modules/typing/app/use-case/get-session.use-case";
import { GetSessionResultsUseCase } from "@modules/typing/app/use-case/result/get-session-results.use-case";
import { GetUserResultsUseCase } from "@modules/typing/app/use-case/result/get-user-results.use-case";
import { GetResultUseCase } from "@modules/typing/app/use-case/result/get-result.use-case";
import { ActivateSessionUseCase } from "@modules/typing/app/use-case/activate-session.use-case";
import { StartLearningSessionUseCase } from "@modules/typing/app/use-case/start-learning-session.use-case";
import { SubmitLearningResultUseCase } from "@modules/typing/app/use-case/submit-learning-result.use-case";

@ApiTags("Typing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("typing")
export class TypingController {
  private readonly logger = new Logger(TypingController.name);

  constructor(
    private readonly createSession: CreateSessionUseCase,
    private readonly submitResult: SubmitResultUseCase,
    private readonly getSession: GetSessionUseCase,
    private readonly getSessionResults: GetSessionResultsUseCase,
    private readonly getUserResults: GetUserResultsUseCase,
    private readonly getResult: GetResultUseCase,
    private readonly activateSession: ActivateSessionUseCase,
    private readonly startLearningSession: StartLearningSessionUseCase,
    private readonly submitLearningResult: SubmitLearningResultUseCase,
  ) {}

  @Post("sessions")
  @ApiOperation({ summary: "Criar nova sessão de typing" })
  @ApiResponse({ status: 201, description: "Sessão criada com sucesso" })
  @ApiResponse({ status: 400, description: "Input inválido" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({
    status: 404,
    description: "Nenhum texto disponível para a categoria e dificuldade",
  })
  async handleCreateSession(
    @Body() input: CreateSessionInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(`[POST] /typing/sessions — user: ${user.sub}`);
    return this.createSession.execute(input, user.sub);
  }

  @Get("sessions/:id")
  @ApiOperation({ summary: "Buscar sessão por ID" })
  @ApiParam({ name: "id", description: "ID da sessão (UUID)" })
  @ApiResponse({ status: 200, description: "Dados da sessão" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Sessão não encontrada" })
  async handleGetSession(@Param("id") id: string) {
    this.logger.log(`[GET] /typing/sessions/${id}`);
    return this.getSession.execute(id);
  }

  @Post("sessions/result")
  @ApiOperation({ summary: "Submeter resultado de uma sessão" })
  @ApiResponse({ status: 201, description: "Resultado submetido com sucesso" })
  @ApiResponse({
    status: 400,
    description: "Input inválido ou dados inconsistentes",
  })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Sessão não encontrada" })
  @ApiResponse({
    status: 409,
    description: "Resultado já submetido para esta sessão",
  })
  async handleSubmitResult(
    @Body() input: SubmitResultInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /typing/sessions/result — user: ${user.sub} | session: ${input.sessionId}`,
    );
    return this.submitResult.execute(input, user.sub);
  }

  @Get("sessions/:id/results")
  @ApiOperation({ summary: "Buscar resultados de uma sessão" })
  @ApiParam({ name: "id", description: "ID da sessão (UUID)" })
  @ApiResponse({ status: 200, description: "Resultados da sessão" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Sessão não encontrada" })
  async handleGetSessionResults(@Param("id") id: string) {
    this.logger.log(`[GET] /typing/sessions/${id}/results`);
    return this.getSessionResults.execute(id);
  }

  @Get("me/results")
  @ApiOperation({ summary: "Buscar resultados de um usuário" })
  @ApiResponse({ status: 200, description: "Resultados do usuário" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async handleGetUserResults(@CurrentUser() user: AuthUser) {
    this.logger.log(`[GET] /typing/me/results`);
    return this.getUserResults.execute(user.sub);
  }

  @Get("results/:id")
  @ApiOperation({ summary: "Buscar resultado por ID" })
  @ApiParam({ name: "id", description: "ID do resultado (UUID)" })
  @ApiResponse({ status: 200, description: "Dados do resultado" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Resultado não encontrado" })
  async handleGetResult(@Param("id") id: string) {
    this.logger.log(`[GET] /typing/results/${id}`);
    return this.getResult.execute(id);
  }

  @Patch("sessions/:id/activate")
  @ApiOperation({ summary: "Ativar sessão" })
  @ApiParam({ name: "id", description: "ID da sessão (UUID)" })
  @ApiResponse({ status: 200, description: "Sessão ativada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Sessão não encontrada" })
  async handleActivateSession(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /typing/sessions/${id}/activate — user: ${user.sub}`,
    );
    return this.activateSession.execute(user.sub, id);
  }

  // ─── Learning ───────────────────────────────────────────────

  @Post("learning/start")
  @ApiOperation({ summary: "Iniciar ou retomar trilha de aprendizado" })
  @ApiResponse({ status: 201, description: "Sessão de aprendizado iniciada" })
  async handleStartLearning(@CurrentUser() user: AuthUser) {
    this.logger.log(`[POST] /typing/learning/start — user: ${user.sub}`);
    return this.startLearningSession.execute(user.sub);
  }

  @Post("learning/submit")
  @ApiOperation({ summary: "Submeter resultado de aprendizado" })
  @ApiResponse({ status: 201, description: "Resultado processado" })
  async handleSubmitLearning(
    @Body() input: SubmitResultInput,
    @CurrentUser() user: AuthUser,
  ) {
    this.logger.log(
      `[POST] /typing/learning/submit — user: ${user.sub} | session: ${input.sessionId}`,
    );
    return this.submitLearningResult.execute(input, user.sub);
  }
}
