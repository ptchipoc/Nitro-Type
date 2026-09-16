import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendOTPInput {
  @ApiProperty({ example: "xavier@xlobe.tech" })
  @IsEmail({}, { message: "Email inválido" })
  email: string;
}
