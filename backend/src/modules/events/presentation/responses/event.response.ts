import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import {
  EventCategory,
  EventDifficulty,
  EventStatus,
} from "@modules/events/domain/entities/enums/event-status";
import { EventParticipantResponse } from "./event-participant.response";
import { EventMedalResponse } from "./event-medal.response";

export class EventResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: EventType })
  type: EventType;

  @ApiProperty({ enum: EventStatus })
  status: EventStatus;

  @ApiPropertyOptional()
  scheduledAt?: Date;

  @ApiProperty({ example: 30 })
  betweenRoundsDelay: number;

  @ApiPropertyOptional()
  startedAt?: Date;

  @ApiPropertyOptional()
  finishedAt?: Date;

  @ApiProperty()
  currentRound: number;

  @ApiProperty()
  roundsCount: number;

  @ApiProperty({ enum: EventCategory })
  category: EventCategory;

  @ApiProperty({ enum: EventDifficulty })
  difficulty: EventDifficulty;

  @ApiProperty({ type: () => [EventParticipantResponse] })
  participants: EventParticipantResponse[];

  @ApiProperty({ type: () => [EventMedalResponse] })
  medals: EventMedalResponse[];

  @ApiPropertyOptional()
  maxParticipants?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
