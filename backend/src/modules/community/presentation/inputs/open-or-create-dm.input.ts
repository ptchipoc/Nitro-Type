import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OpenOrCreateDMInput {
  @ApiProperty({
    description: "ID do participante para abrir/criar conversa DM",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID("4", { message: "participantId deve ser um UUID válido" })
  @IsNotEmpty({ message: "participantId é obrigatório" })
  participantId!: string;
}
