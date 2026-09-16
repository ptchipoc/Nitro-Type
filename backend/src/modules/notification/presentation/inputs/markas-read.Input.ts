import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class MarkAsReadInput {
  @ApiProperty({ description: "Id da notificação" })
  @IsNotEmpty({ message: "O id não pode ser vazio" })
  @IsUUID("4", { message: "O id deve ser um uuid válido" })
  id: string;
}
