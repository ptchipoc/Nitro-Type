import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsUUID,
  IsPositive,
} from "class-validator";

export class ListNotificationsInput {
  @ApiProperty({
    title: "O numero da pagina",
    example: 1,
    description: "O numero da pagina",
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: "O numero da pagina deve ser maior que 0" })
  @Max(100, { message: "O numero da pagina deve ser menor que 100" })
  @IsPositive({ message: "O numero da pagina deve ser maior que 0" })
  page: number;

  @ApiProperty({
    title: "O numero de itens por pagina",
    example: 20,
    description: "O numero de itens por pagina",
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: "O numero de itens por pagina deve ser maior que 0" })
  @Max(100, { message: "O numero de itens por pagina deve ser menor que 100" })
  @IsPositive({ message: "O numero de itens por pagina deve ser maior que 0" })
  limit: number;
}
