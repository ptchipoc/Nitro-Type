import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RemoveMemberInput {
  @ApiProperty({
    title: "ID do canal",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do canal do qual o usuário será removido",
  })
  @IsUUID("4", { message: "O campo channelId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo channelId é obrigatório" })
  channelId: string;

  @ApiProperty({
    title: "ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário que será removido",
  })
  @IsUUID("4", { message: "O campo userId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo userId é obrigatório" })
  userId: string;

  @ApiProperty({
    title: "Notificar canal",
    example: true,
    description: "Se deve notificar o canal sobre a remoção",
    default: true,
  })
  @IsBoolean({ message: "O campo notifyChannel deve ser um booleano" })
  @IsOptional()
  notifyChannel?: boolean = true;
}
