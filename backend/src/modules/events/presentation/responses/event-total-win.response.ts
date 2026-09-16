import { ApiProperty } from "@nestjs/swagger";

export class EventTotalWinResponse {
  @ApiProperty({ example: 1 })
  totalWin: number;
}
