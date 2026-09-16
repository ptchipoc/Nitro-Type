import { NotificationType } from "@modules/notification/domain/entities/enums/notification-type";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class SendNotificationInput {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsString({ message: "O ID do destinatário deve ser uma string" })
  @IsNotEmpty({ message: "O ID do destinatário é obrigatório" })
  @IsUUID("4", { message: "O ID do destinatário deve ser um UUID válido" })
  recipientId: string;

  @ApiProperty({
    title: "Tipo de notificação",
    description:
      "O tipo de notificação a ser enviada (SYSTEM, INVITATION, MESSAGE) as do system só os admin da plataforma podem enviar",
    enum: NotificationType,
    example: NotificationType.SYSTEM,
  })
  @IsNotEmpty({ message: "O tipo é obrigatório" })
  @IsEnum(NotificationType, {
    message: `O tipo deve ser um dos seguintes: ${Object.values(NotificationType).join(", ")}`,
  })
  type: NotificationType;

  @ApiProperty({
    title: "Título da notificação",
    description: "O título da notificação a ser enviada",
    example: "Convite para o evento",
  })
  @IsString({ message: "O título deve ser uma string" })
  @IsNotEmpty({ message: "O título é obrigatório" })
  title: string;

  @ApiProperty({
    title: "Mensagem da notificação",
    description: "A mensagem da notificação a ser enviada",
    example: "Você foi convidado para o evento",
  })
  @IsString({ message: "A mensagem deve ser uma string" })
  @IsNotEmpty({ message: "A mensagem é obrigatória" })
  message: string;

  @ApiProperty({
    title: "Metadados da notificação",
    description: "Os metadados da notificação a ser enviada",
    example: { id: "123e4567-e89b-12d3-a456-426614174000" },
    additionalProperties: true,
    required: false,
  })
  @IsObject({ message: "Os metadados devem ser um objeto" })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
