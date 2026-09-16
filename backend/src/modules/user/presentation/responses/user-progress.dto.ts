import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

export class UpdateUserProgressInput {
  @ApiProperty({ description: "Nova velocidade do utilizador" })
  @IsInt()
  @Min(0)
  wpm: number;

  @ApiProperty({ description: "Nova precisão do utilizador" })
  @IsInt()
  @Min(1)
  accuracy: number;

  @ApiProperty({ description: "Dificuldade do texto" })
  @IsString()
  difficulty: string;

  @ApiProperty({ description: "ID do resultado" })
  @IsString()
  resultId: string;

  @ApiProperty({ description: "Descrição da atividade" })
  @IsString()
  activityDesc: string;
}

export class UserProgressResponse {
  @ApiProperty({ description: "ID do registo de progresso" })
  id: string;

  @ApiProperty({ description: "XP total acumulado" })
  totalXp: number;

  @ApiProperty({ description: "Total de eventos" })
  totalEvents: number;

  @ApiProperty({ description: "Vitórias em eventos" })
  eventsWon: number;

  @ApiProperty({ description: "Nível atual" })
  level: number;

  @ApiProperty({ description: "Número do rank" })
  rank: number;

  @ApiProperty({ description: "Título do rank (ex: Mestre)" })
  rankTitle: string;

  @ApiPropertyOptional({ description: "Data da última atividade" })
  lastActivityAt?: Date;

  @ApiProperty({ description: "Data de criação" })
  createdAt: Date;

  @ApiProperty({ description: "Data de atualização" })
  updatedAt: Date;
}
