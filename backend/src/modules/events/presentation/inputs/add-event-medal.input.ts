import { MedalType } from "@modules/events/domain/entities/enums/medal-type";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class AddEventMedalInput {
  @ApiProperty({ example: 1, description: "Posição no ranking (1 = 1º lugar)" })
  @IsInt()
  @Min(1)
  rankPosition: number;

  @ApiProperty({ enum: MedalType })
  @IsEnum(MedalType)
  medalType: MedalType;

  @ApiProperty({
    example: 100,
    description: "XP base para os participantes do evento",
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseXp: number;
}
