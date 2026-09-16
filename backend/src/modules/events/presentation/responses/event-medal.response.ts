import { ApiProperty } from "@nestjs/swagger";
import { MedalType } from "@modules/events/domain/entities/enums/medal-type";

export class EventMedalResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty({ example: 1 })
  rankPosition: number;

  @ApiProperty({ enum: MedalType })
  medalType: MedalType;

  @ApiProperty()
  createdAt: Date;
}
