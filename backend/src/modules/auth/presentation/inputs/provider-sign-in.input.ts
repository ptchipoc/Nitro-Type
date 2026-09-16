import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsOptional, IsIn } from 'class-validator';

/**
 * ProviderSignInInput — dados padronizados do OAuth provider.
 * Todos os providers (Google, GitHub, 42Intra) enviam neste formato.
 */
export class ProviderSignInInput {
  @ApiProperty({ example: 'google', enum: ['google', 'github', 'intra42'] })
  @IsString()
  @IsIn(['google', 'github', 'intra42'], { message: 'Provider inválido' })
  provider: string;

  @ApiProperty({ example: '118392847362748' })
  @IsString()
  providerId: string;

  @ApiProperty({ example: 'xavier@gmail.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Xavier Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
