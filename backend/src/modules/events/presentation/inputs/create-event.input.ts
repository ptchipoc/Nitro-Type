import {
  EventCategory,
  EventDifficulty,
} from "@modules/events/domain/entities/enums/event-status";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  MaxLength,
  MinLength,
  IsPositive,
} from "class-validator";

export class CreateEventInput {
  @ApiProperty({ example: "Torneio de Algoritmos #1" })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "Evento de competição de algoritmos" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    enum: EventType,
    example: EventType.PRIVATE,
    description: "Tipo do evento",
  })
  @IsEnum(EventType)
  type: EventType;

  @ApiPropertyOptional({ example: "2026-05-01T10:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({
    example: 30,
    description: "Delay em segundos entre rodadas",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  betweenRoundsDelay?: number;

  @ApiProperty({
    example: 3,
    description: "Número de rodadas",
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  roundsCount: number;

  @ApiProperty({
    example: "ALGORITHMS",
    description: "Categoria do evento",
    enum: EventCategory,
  })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty({
    example: "EASY",
    description: "Dificuldade do evento",
    enum: EventDifficulty,
  })
  @IsEnum(EventDifficulty)
  difficulty: EventDifficulty;

  @ApiPropertyOptional({
    example: 10,
    description: "Número máximo de participantes",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxParticipants?: number;

  @ApiPropertyOptional({
    example: 100,
    description: "XP base para os participantes do evento",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseXp?: number;
}
