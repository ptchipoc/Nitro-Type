import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class SearchUserInput {
  @ApiProperty({
    example: "user@example.com",
    description: "Email ou nome do utilizador",
  })
  @IsString({ message: "O search deve ser uma string" })
  @MinLength(3, { message: "O search deve ter pelo menos 3 caracteres" })
  @MaxLength(100, { message: "O search deve ter pelo menos 100 caracteres" })
  q: string;
}
