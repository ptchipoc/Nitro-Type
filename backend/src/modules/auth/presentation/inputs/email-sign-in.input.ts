import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class EmailSignInInput {
  @ApiProperty({ example: 'xavier@xlobe.tech' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Pass@1234' })
  @IsString()
  @IsNotEmpty({ message: 'Password não pode estar vazia' })
  password: string;
}
