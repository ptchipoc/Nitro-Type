import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendDMInput {
  @ApiProperty({
    title: "ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário que receberá a mensagem",
  })
  @IsUUID("4", { message: "O campo toUserId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo toUserId é obrigatório" })
  toUserId: string;

  @ApiProperty({
    title: "Conteúdo da mensagem",
    example: "Olá, como vai você?",
    description: "O conteúdo da mensagem",
    maxLength: 1000,
  })
  @IsString({ message: "O campo content deve ser uma string" })
  @IsNotEmpty({ message: "O campo content é obrigatório" })
  @MaxLength(1000, {
    message: "O campo content deve ter no máximo 1000 caracteres",
  })
  content: string;

  @ApiProperty({
    title: "ID da mensagem",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID da mensagem à qual esta mensagem está respondendo",
    required: false,
  })
  @IsUUID("4", { message: "O campo replyToId deve ser um UUID válido" })
  @IsOptional()
  replyToId?: string;
}
