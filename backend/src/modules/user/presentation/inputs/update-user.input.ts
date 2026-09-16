import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ProfileVisibility } from "@modules/user/domain/entities/enums/profile-visibility.enum";

export class SocialLinkInput {
  @ApiProperty({ example: "github", description: "Nome da plataforma" })
  @IsString({ message: "Plataforma deve ser uma string" })
  platform: string;

  @ApiProperty({
    example: "https://github.com/xavier",
    description: "URL do perfil",
  })
  @IsString({ message: "URL deve ser uma string" })
  url: string;
}

export class UpdateUserInput {
  @ApiProperty({
    example: "Xavier Silva",
    description: "Nome do utilizador",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  @MinLength(2, { message: "Nome deve ter pelo menos 2 caracteres" })
  name?: string;

  @ApiProperty({
    example: "https://cdn.example.com/avatar.jpg",
    description: "URL do avatar",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Avatar URL deve ser uma string" })
  @IsUrl({}, { message: "Avatar URL deve ser uma URL válida" })
  avatarUrl?: string;

  @ApiProperty({
    example: "Desenvolvedor Full Stack em Luanda",
    description: "Biografia",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Bio deve ser uma string" })
  bio?: string;

  @ApiProperty({
    example: "AO",
    description: "País (código ISO)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Country deve ser uma string" })
  country?: string;

  @ApiProperty({
    type: [SocialLinkInput],
    description: "Links das redes sociais",
    required: false,
    example: [{ platform: "github", url: "https://github.com/xavier" }],
  })
  @IsOptional()
  @IsArray({ message: "Social links deve ser um array" })
  @ValidateNested({ each: true })
  @Type(() => SocialLinkInput)
  socialLinks?: SocialLinkInput[];
}
