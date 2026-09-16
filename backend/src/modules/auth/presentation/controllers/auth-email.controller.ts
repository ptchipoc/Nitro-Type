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

import { EmailSignInService } from "@modules/auth/app/services/email-sign-in.service";
import { VerifyOtpService } from "@modules/auth/app/services/verify-otp.service";
import { EmailSignUpInput } from "@modules/auth/presentation/inputs/email-sign-up.input";
import { EmailSignInInput } from "@modules/auth/presentation/inputs/email-sign-in.input";
import { VerifyOtpInput } from "@modules/auth/presentation/inputs/verify-otp.input";
import { Public } from "@common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { ResendOtpService } from "@modules/auth/app/services/resend-otp.service";
import { SendOTPInput } from "@modules/auth/presentation/inputs/send-otp.input";
import {
  ErrorResponse,
  SuccessResponse,
} from "@common/responses/envelope.response";
import { setAuthCookies } from "@modules/auth/app/helpers/cookie.helper";
import { AuthUserResponse } from "../responses/auth.response";
import { AuthMessageResponse } from "../responses/message.response";
import { EmailSignUpService } from "@modules/auth/app/services/email-sign-up.service";

@ApiTags("Auth — Email")
@Public()
@Controller("auth")
export class AuthEmailController {
  private readonly logger = new Logger(AuthEmailController.name);

  constructor(
    private readonly emailSignUp: EmailSignUpService,
    private readonly emailSignIn: EmailSignInService,
    private readonly verifyOtp: VerifyOtpService,
    private readonly resendOtp: ResendOtpService,
    private readonly config: ConfigService,
  ) {}

  @Post("sign-up/email")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registar com email + password" })
  @ApiResponse({
    status: 201,
    type: SuccessResponse(AuthMessageResponse),
    description: "Conta criada — OTP enviado por email",
  })
  @ApiResponse({
    status: 409,
    type: ErrorResponse,
    description: "Email já registado",
  })
  @ApiResponse({
    status: 422,
    type: ErrorResponse,
    description: "Input inválido",
  })
  async signUp(@Body() input: EmailSignUpInput) {
    return this.emailSignUp.execute(input);
  }

  @Post("sign-in/email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login com email + password" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthUserResponse),
    description: "Login bem-sucedido",
  })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @ApiResponse({ status: 403, description: "Email não verificado" })
  async signIn(
    @Body() input: EmailSignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.emailSignIn.execute(input);
    setAuthCookies(res, this.config, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post("verify/email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verificar email com OTP" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthUserResponse),
    description: "Email verificado — tokens devolvidos",
  })
  @ApiResponse({ status: 401, description: "OTP inválido ou expirado" })
  async verify(
    @Body() input: VerifyOtpInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.verifyOtp.execute(input.email, input.code);
    setAuthCookies(res, this.config, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post("verify/resend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reenviar OTP de verificação de email" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthMessageResponse),
    description: "OTP reenviado se conta existir e não estiver verificada",
  })
  @ApiResponse({ status: 422, description: "Input inválido" })
  async resendVOtp(@Body() input: SendOTPInput) {
    return this.resendOtp.execute(input.email);
  }
}
