import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MemberRole } from "@modules/community/domain/entities/enums/member-role";

export class UpdateMemberRoleInput {
  @ApiProperty({
    title: "ID do canal",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do canal",
  })
  @IsUUID("4", { message: "O campo channelId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo channelId é obrigatório" })
  channelId: string;

  @ApiProperty({
    title: "ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "O ID do usuário",
  })
  @IsUUID("4", { message: "O campo userId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O campo userId é obrigatório" })
  userId: string;

  @ApiProperty({
    title: "Cargo",
    example: MemberRole.GROUP_MEMBER,
    description: `Os cargos disponíveis são: ${Object.values(MemberRole).join(", ")}`,
    enum: MemberRole,
  })
  @IsEnum(MemberRole, {
    message: `O campo role deve ser um cargo válido. Os cargos disponíveis são: ${Object.values(MemberRole).join(", ")}`,
  })
  @IsNotEmpty({ message: "O campo role é obrigatório" })
  role: MemberRole;
}
