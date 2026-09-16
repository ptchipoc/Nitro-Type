import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import { EventRoundStatus } from "@modules/events/domain/entities/enums/event-round-status";

export class EventRoundResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty({ example: 1 })
  roundNumber: number;

  @ApiProperty({ enum: TypingCategory })
  category: TypingCategory;

  @ApiProperty({ enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @ApiProperty({ enum: EventRoundStatus })
  status: EventRoundStatus;

  @ApiProperty()
  text: string;

  @ApiProperty()
  timeLimit: number;

  @ApiProperty()
  wordCount: number;

  @ApiPropertyOptional()
  startedAt?: Date;

  @ApiPropertyOptional()
  finishedAt?: Date;

  @ApiProperty()
  createdAt: Date;
}
