import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { MessageType } from "../../domain/entities/enums/message-type";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageInput {

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID da mensagem",
  })
  @IsUUID("4", { message: "O campo dmId deve ser um UUID válido" })
  @IsOptional()
  dmId?: string;

  @ApiProperty({
    title: "Conteúdo da mensagem",
    example: "Olá, como vai você?",
    description: "O conteúdo da mensagem",
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    title: "Tipo da mensagem",
    example: MessageType.TEXT,
    description: `
    O tipo da mensagem

    ${Object.values(MessageType).join(", ")}
    `,
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;

  @ApiProperty({
    title: "ID da mensagem",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID da mensagem à qual esta mensagem está respondendo",
  })
  @IsUUID("4", { message: "O campo replyToId deve ser um UUID válido" })
  @IsOptional()
  replyToId?: string;

  @ApiProperty({
    title: "IDs dos usuários mencionados",
    example: ["123e4567-e89b-12d3-a456-426614174000"],
    description: "Os IDs dos usuários mencionados",
  })
  @IsOptional()
  mentions?: string[] = [];

  @ApiProperty({
    title: "IDs dos anexos",
    example: ["123e4567-e89b-12d3-a456-426614174000"],
    description: "Os IDs dos anexos",
  })
  @IsOptional()
  attachmentIds?: string[] = [];
}


export class ParamsChannelId {

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do canal",
  })
  @IsUUID("4", { message: "O campo channelId deve ser um UUID válido" })
  @IsNotEmpty()
  channelId: string;
}
 