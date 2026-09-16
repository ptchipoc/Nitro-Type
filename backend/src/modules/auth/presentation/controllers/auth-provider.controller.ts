import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";
import { ProviderSignInService } from "@modules/auth/app/services/provider-sign-in.service";
import { ProviderSignInInput } from "@modules/auth/presentation/inputs/provider-sign-in.input";
import { Public } from "@common/decorators/public.decorator";
import { setAuthCookies } from "@modules/auth/app/helpers/cookie.helper";
import { ConfigService } from "@nestjs/config";
import { SuccessResponse } from "@common/responses/envelope.response";
import { AuthUserResponse } from "../responses/auth.response";

@ApiTags("Auth - Provider")
@Public()
@Controller("auth")
export class AuthProviderController {
  private readonly logger = new Logger(AuthProviderController.name);

  constructor(
    private readonly providerSignIn: ProviderSignInService,
    private readonly config: ConfigService,
  ) {}

  @Post("provider")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login/Registo via OAuth (Google, GitHub, 42Intra)",
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthUserResponse),
    description: "Login bem-sucedido — tokens devolvidos",
  })
  async providerAuth(
    @Body() input: ProviderSignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.providerSignIn.execute(input);
    setAuthCookies(res, this.config, result.accessToken, result.refreshToken);
    return { user: result.user };
  }
}
