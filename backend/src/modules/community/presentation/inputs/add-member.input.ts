import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class AddMemberInput {
  @ApiProperty({
    title: "O ID do canal",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do canal ao qual o usuário será adicionado",
  })
  @IsUUID()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({
    title: "O ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário que será adicionado ao canal",
  })
  @IsUUID("4", { message: "O campo userId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo userId é obrigatório" })
  userId: string;
}
