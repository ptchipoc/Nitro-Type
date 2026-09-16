import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SendFriendRequestInput {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID do utilizador a quem enviar o pedido de amizade",
  })
  @IsString({ message: "O ID do destinatário deve ser uma string" })
  @IsNotEmpty({ message: "O ID do destinatário é obrigatório" })
  @IsUUID("4", { message: "O ID do destinatário deve ser um UUID válido" })
  receiverId: string;
}
