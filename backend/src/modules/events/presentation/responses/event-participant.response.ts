import { ApiProperty } from "@nestjs/swagger";
import { ParticipantStatus } from "@modules/events/domain/entities/enums/participant-status";

export class EventParticipantResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ParticipantStatus })
  status: ParticipantStatus;

  @ApiProperty({ example: 245.5 })
  totalScore: number;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
