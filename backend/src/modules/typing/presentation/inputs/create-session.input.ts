import { IsEnum, IsNotEmpty } from "class-validator";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import { SessionMode } from "@shared/entities/enums/session";
import { ApiProperty } from "@nestjs/swagger";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";

export class CreateSessionInput {
  @ApiProperty({
    enum: TypingCategory,
    example: TypingCategory.ANIME,
    description: "A categoria do texto a ser digitado",
  })
  @IsEnum(TypingCategory, {
    message: `Categoria inválida, utilize: ${Object.values(TypingCategory).join(", ")}`,
  })
  @IsNotEmpty({ message: "Categoria é obrigatória" })
  category: TypingCategory;

  @ApiProperty({
    enum: DifficultyLevel,
    example: DifficultyLevel.EASY,
    description: "A dificuldade do texto a ser digitado",
  })
  @IsEnum(DifficultyLevel, {
    message: `Dificuldade inválida, utilize: ${Object.values(DifficultyLevel).join(", ")}`,
  })
  @IsNotEmpty({ message: "Dificuldade é obrigatória" })
  difficulty: DifficultyLevel;
}
