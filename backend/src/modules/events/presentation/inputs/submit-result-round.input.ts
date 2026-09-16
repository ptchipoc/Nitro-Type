import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class SubmitResultRoundInput {
  @ApiProperty({
    example: "uuid",
    description: "ID do evento",
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    example: 1,
    description: "Numero da rodada",
  })
  @Type(() => Number)
  @IsNumber()
  roundNumber: number;

  @ApiProperty({
    example: 100,
    description: "Total de caracteres digitados",
  })
  @Type(() => Number)
  @IsNumber()
  typedChars: number;

  @ApiProperty({
    example: 100,
    description: "Total de caracteres do texto",
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  totalChars: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  correctChars: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  incorrectChars: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  completionTime: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  wordCount: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  timeLimit: number;
}
