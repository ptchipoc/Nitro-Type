import { ApiProperty } from "@nestjs/swagger";

export class EventRoundResultResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  roundNumber: number;

  @ApiProperty({ example: 87.5 })
  wpm: number;

  @ApiProperty({ example: 95.2 })
  accuracy: number;

  @ApiProperty({ example: 120.4 })
  score: number;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  completionRate: number;

  @ApiProperty()
  errorRate: number;

  @ApiProperty()
  completionTime: number;

  @ApiProperty()
  createdAt: Date;
}
