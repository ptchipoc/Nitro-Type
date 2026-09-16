import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

export class AddReactionInput {
  @ApiProperty({
    title: "O ID da mensagem",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID da mensagem à qual a reação será adicionada",
  })
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    title: "O emoji",
    example: "👍",
    description: "O emoji que será adicionado à mensagem",
  })
  @IsString({ message: "O campo emoji deve ser uma string" })
  @IsNotEmpty({ message: "O campo emoji é obrigatório" })
  emoji: string;
}
