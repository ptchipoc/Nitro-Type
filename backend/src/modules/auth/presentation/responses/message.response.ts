import { ApiProperty } from "@nestjs/swagger";

export class AuthMessageResponse {
  @ApiProperty()
  message: string;
}
