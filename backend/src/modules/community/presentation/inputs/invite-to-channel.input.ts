import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InviteToChannelInput {
  // @ApiProperty({
  //   example: "123e4567-e89b-12d3-a456-426614174000",
  //   description: "O ID do canal",
  // })
  // @IsUUID("4", { message: "O campo channelId deve ser um UUID válido" })
  // @IsNotEmpty({ message: "O campo channelId é obrigatório" })
  // channelId: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário que será convidado",
  })
  @IsUUID("4", { message: "O campo invitedUserId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo invitedUserId é obrigatório" })
  invitedUserId: string;
}
