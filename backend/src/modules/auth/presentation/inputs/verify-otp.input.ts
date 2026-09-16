import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpInput {
  @ApiProperty({ example: 'xavier@xlobe.tech' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: '482931', description: 'Código OTP de 6 dígitos' })
  @IsString()
  @Length(6, 6, { message: 'OTP deve ter exactamente 6 dígitos' })
  code: string;
}
