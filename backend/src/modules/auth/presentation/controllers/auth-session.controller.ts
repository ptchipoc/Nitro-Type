import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { RefreshTokenService } from "@modules/auth/app/services/refresh-token.service";
import { Public } from "@common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import {
  clearAuthCookies,
  setAuthCookies,
} from "@modules/auth/app/helpers/cookie.helper";
import { SuccessResponse } from "@common/responses/envelope.response";
import { AuthMessageResponse } from "../responses/message.response";

@ApiTags("Auth - Session")
@Public()
@Controller("auth")
export class AuthSessionController {
  private readonly logger = new Logger(AuthSessionController.name);

  constructor(
    private readonly refreshToken: RefreshTokenService,
    private readonly config: ConfigService,
  ) {}

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Renovar access token via refresh token (cookie)" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthMessageResponse),
    description: "Novo access token",
  })
  @ApiResponse({ status: 401, description: "Refresh token inválido" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies?.["refresh_token"];
    const result = await this.refreshToken.execute(rt);
    setAuthCookies(res, this.config, result.accessToken, result.refreshToken);
    return { message: "Sessão renovada" };
  }

  @Post("sign-out")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Terminar sessão" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthMessageResponse),
    description: "Sessão terminada",
  })
  async signOut(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res, this.config);
    return { message: "Sessão terminada" };
  }
}
