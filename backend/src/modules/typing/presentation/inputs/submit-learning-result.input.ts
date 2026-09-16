import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from "class-validator";

export class SubmitLearningResultInput {
  @IsUUID()
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID da sessão",
  })
  @IsNotEmpty({ message: "ID da sessão é obrigatório" })
  sessionId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    example: 98.5,
    description: "Precisão alcançada (%)",
  })
  accuracy: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 45,
    description: "Palavras por minuto (WPM)",
  })
  wpm: number;
}
