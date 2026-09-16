import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class EmailSignUpInput {
  @ApiProperty({ example: 'xavier@xlobe.tech' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Xavier Silva' })
  @IsString()
  @MinLength(2,   { message: 'Nome muito curto' })
  @MaxLength(100, { message: 'Nome muito longo' })
  name: string;

  @ApiProperty({ example: 'Pass@1234', description: 'Mín. 8 chars, 1 maiúscula, 1 número, 1 especial' })
  @IsString()
  @MinLength(8, { message: 'Password deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: 'Password deve ter 1 maiúscula, 1 número e 1 caracter especial',
  })
  password: string;
}
