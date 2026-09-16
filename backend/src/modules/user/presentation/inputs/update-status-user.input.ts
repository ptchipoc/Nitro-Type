import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";

export class UpdateStatusUserInput {
  @ApiProperty({
    title: "Status do utilizador",
    enum: UserStatus,
    description:
      "O status do utilizador deve ser um dos seguintes: " +
      Object.values(UserStatus).join(", "),
    required: true,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus, {
    message: `O status deve ser um dos seguintes: ${Object.values(UserStatus).join(", ")}`,
  })
  status: UserStatus;
}
