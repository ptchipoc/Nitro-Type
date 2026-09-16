import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class InviteParticipantInput {
  @ApiProperty({ example: "amigo@email.com" })
  @IsEmail()
  email: string;
}
