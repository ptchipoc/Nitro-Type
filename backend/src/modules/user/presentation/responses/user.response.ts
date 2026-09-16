import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";
import { UserProgressResponse } from "./user-progress.dto";

export class UserProfileResponse {
  @ApiProperty({
    title: "User ID",
    description: "Identificador único do usuário UUID v4",
  })
  userId: string;

  @ApiProperty({
    title: "Username",
    description: "Username do usuário",
  })
  username: string;

  @ApiPropertyOptional({
    title: "Avatar URL",
    description: "URL do avatar do usuário",
  })
  avatarUrl?: string;

  @ApiPropertyOptional({
    title: "Bio",
    description: "Biografia do usuário",
  })
  bio?: string;

  @ApiProperty({
    title: "Country",
    description: "País do usuário",
  })
  country: string;
}

export class UserResponse {
  @ApiProperty({
    title: "ID",
    description: "ID do usuário",
  })
  id: string;

  @ApiProperty({
    title: "Name",
    description: "Nome do usuário",
  })
  name: string;

  @ApiProperty({
    title: "Email",
    description: "Email do usuário",
  })
  email: string;

  @ApiProperty({
    title: "Role",
    description: "Role do usuário",
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    title: "Status",
    description: "Status do usuário",
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiPropertyOptional({
    title: "Profile",
    description: "Informações do perfil do usuário",
    type: () => UserProfileResponse,
  })
  profile?: UserProfileResponse;

  @ApiPropertyOptional({
    title: "Progress",
    description: "Informações de progresso do usuário",
    type: () => UserProgressResponse,
  })
  progress?: UserProgressResponse;

  @ApiProperty({
    title: "Created At",
    description: "Data de criação do usuário",
  })
  createdAt: Date;

  @ApiPropertyOptional({
    title: "Updated At",
    description: "Data de atualização do usuário",
  })
  updatedAt?: Date;

  @ApiPropertyOptional()
  lastLoginAt?: Date;
}

export class UserWithRankResponse extends UserResponse {
  @ApiProperty({
    title: "Rank Global",
    description: "Rank global do usuário",
  })
  rankGlobal: number;
}

// List response
export class UserListResponse {
  @ApiProperty({
    title: "Users",
    description: "Lista de usuários",
    type: () => [UserResponse],
  })
  users: UserResponse[];
}

// Ranking list response
export class UserRankingListResponse {
  @ApiProperty({
    title: "Users",
    description: "Lista de usuários",
    type: () => [UserWithRankResponse],
  })
  users: UserWithRankResponse[];
}
