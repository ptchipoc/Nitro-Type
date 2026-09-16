import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class BanMemberInput {
  @ApiProperty({
    title: "O ID do canal",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do canal ao qual o usuário será banido",
  })
  @IsUUID("4", { message: "O campo channelId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo channelId é obrigatório" })
  channelId: string;

  @ApiProperty({
    title: "O ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário que será banido do canal",
  })
  @IsUUID("4", { message: "O campo userId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo userId é obrigatório" })
  userId: string;

  @ApiProperty({
    title: "Notificar canal",
    example: true,
    description: "Se o canal deve ser notificado sobre o banimento",
  })
  @IsBoolean({ message: "O campo notifyChannel deve ser um booleano" })
  @IsOptional()
  notifyChannel?: boolean = true;
}
