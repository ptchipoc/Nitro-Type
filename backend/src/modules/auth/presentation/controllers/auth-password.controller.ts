import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ForgotPasswordService } from "@modules/auth/app/services/forgot-password.service";
import { ResetPasswordService } from "@modules/auth/app/services/reset-password.service";
import { ResetPasswordInput } from "@modules/auth/presentation/inputs/reset-password.input";
import { Public } from "@common/decorators/public.decorator";
import { SendOTPInput } from "@modules/auth/presentation/inputs/send-otp.input";
import { SuccessResponse } from "@common/responses/envelope.response";
import { AuthMessageResponse } from "../responses/message.response";

@ApiTags("Auth - Password")
@Public()
@Controller("auth/password")
export class AuthPasswordController {
  private readonly logger = new Logger(AuthPasswordController.name);

  constructor(
    private readonly forgotPassword: ForgotPasswordService,
    private readonly resetPassword: ResetPasswordService,
  ) {}

  @Public()
  @Post("forgot")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Solicitar reset de password" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthMessageResponse),
    description: "Código enviado se email existir",
  })
  async forgot(@Body() input: SendOTPInput) {
    return this.forgotPassword.execute(input.email);
  }

  @Post("reset")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Redefinir password com OTP" })
  @ApiResponse({
    status: 200,
    type: SuccessResponse(AuthMessageResponse),
    description: "Password actualizada",
  })
  @ApiResponse({ status: 401, description: "Código inválido ou expirado" })
  async reset(@Body() input: ResetPasswordInput) {
    return this.resetPassword.execute(input);
  }
}
