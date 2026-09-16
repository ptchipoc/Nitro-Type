import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";

export class SubmitResultInput {
  @IsUUID()
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID da sessão",
  })
  @IsNotEmpty({ message: "ID da sessão é obrigatório" })
  sessionId: string;

  @IsInt()
  @ApiProperty({
    example: 100,
    description: "Total de digitações",
  })
  @Min(1, { message: "Total de digitações deve ser maior que 0" })
  typedChars: number;

  @IsInt()
  @ApiProperty({
    example: 100,
    description: "Total de digitações corretas",
  })
  @Min(0, {
    message: "Total de digitações corretas deve ser maior ou igual a 0",
  })
  correctTypedChars: number;

  @IsInt()
  @ApiProperty({
    example: 100,
    description: "Total de digitações incorretas",
  })
  @Min(0, {
    message: "Total de digitações incorretas deve ser maior ou igual a 0",
  })
  incorrectTypedChars: number;
}
