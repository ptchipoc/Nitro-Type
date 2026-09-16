import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class EditChannelInput {
  @ApiProperty({
    title: "Nome do canal",
    example: "Novo Nome do Canal",
    description: "O novo nome do canal",
    required: false,
  })
  @IsString({ message: "O campo name deve ser uma string" })
  @IsOptional()
  @MinLength(3, { message: "O campo name deve ter pelo menos 3 caracteres" })
  @MaxLength(50, { message: "O campo name deve ter no máximo 50 caracteres" })
  name?: string;

  @ApiProperty({
    title: "Descrição do canal",
    example: "Nova descrição do canal",
    description: "A nova descrição do canal",
    required: false,
  })
  @IsString({ message: "O campo description deve ser uma string" })
  @IsOptional()
  @MaxLength(255, {
    message: "O campo description deve ter no máximo 255 caracteres",
  })
  description?: string;
}
