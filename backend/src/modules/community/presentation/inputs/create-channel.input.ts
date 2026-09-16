import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { ChannelType } from "../../domain/entities/enums/channel-type";

export class CreateChannelInput {
  @ApiProperty({
    title: "Nome do canal",
    example: "Meu Canal",
    description: "O nome do canal",
  })
  @IsString({ message: "O campo name deve ser uma string" })
  @IsNotEmpty({ message: "O campo name é obrigatório" })
  @MinLength(3, { message: "O campo name deve ter pelo menos 3 caracteres" })
  @MaxLength(50, { message: "O campo name deve ter no máximo 50 caracteres" })
  name: string;

  @ApiProperty({
    title: "Descrição do canal",
    example: "Descrição do canal",
    description: "A descrição do canal",
  })
  @IsString({ message: "O campo description deve ser uma string" })
  @IsOptional()
  @MaxLength(255, {
    message: "O campo description deve ter no máximo 255 caracteres",
  })
  description?: string;

  @ApiProperty({
    title: "Tipo do canal",
    example: ChannelType.PRIVATE,
    enum: ChannelType,
    description: "O tipo do canal",
  })
  @IsEnum(ChannelType, {
    message:
      "O campo type deve ser um dos seguintes: ${Object.values(ChannelType).join(', ')}",
  })
  @IsNotEmpty()
  type: ChannelType;

  @ApiProperty({
    title: "Gerenciado pela plataforma",
    example: false,
    description: "Se o canal é gerenciado pela plataforma",
  })
  @IsBoolean({ message: "O campo isPlatformManaged deve ser um booleano" })
  @IsOptional()
  isPlatformManaged?: boolean = false;
}
