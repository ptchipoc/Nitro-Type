import { MedalType } from "@modules/events/domain/entities/enums/medal-type";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EventRankingEntryResponse {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty()
  userId: string;

  @ApiProperty({ example: 245.5 })
  totalScore: number;

  @ApiPropertyOptional({ enum: MedalType })
  medal?: MedalType;
}

export class EventRankingResponse {
  @ApiProperty()
  eventId: string;

  @ApiProperty({ type: () => [EventRankingEntryResponse] })
  ranking: EventRankingEntryResponse[];
}
