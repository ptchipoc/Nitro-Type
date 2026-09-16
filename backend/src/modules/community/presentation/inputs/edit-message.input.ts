import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EditMessageInput {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID da mensagem que será editada",
  })
  @IsUUID("4", { message: "O campo messageId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo messageId é obrigatório" })
  messageId: string;

  @ApiProperty({
    example: "Novo conteúdo da mensagem",
    description: "O novo conteúdo da mensagem",
  })
  @IsString({ message: "O campo content deve ser uma string" })
  @IsNotEmpty({ message: "O campo content é obrigatório" })
  @MaxLength(1000, {
    message: "O campo content deve ter no máximo 1000 caracteres",
  })
  @MinLength(1, {
    message: "O campo content deve ter pelo menos 1 caractere",
  })
  content: string;
}
