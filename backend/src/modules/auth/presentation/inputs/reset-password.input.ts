import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, MinLength } from "class-validator";

export class ResetPasswordInput {
  @ApiProperty({ example: "xavier@xlobe.tech" })
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @ApiProperty({ example: "482931" })
  @IsString()
  @Length(6, 6, { message: "Código deve ter 6 dígitos" })
  code: string;

  @ApiProperty({ example: "NewPass@1234" })
  @IsString()
  @MinLength(8, { message: "Password deve ter pelo menos 8 caracteres" })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: "Password deve ter 1 maiúscula, 1 número e 1 especial",
  })
  newPassword: string;
}
