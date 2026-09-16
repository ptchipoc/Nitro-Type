import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";

export class AuthUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;
}
