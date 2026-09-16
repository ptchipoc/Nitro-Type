import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GetUserInput {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Id do utilizador",
  })
  @IsUUID("4", { message: "O id deve ser um UUID v4" })
  id: string;
}
