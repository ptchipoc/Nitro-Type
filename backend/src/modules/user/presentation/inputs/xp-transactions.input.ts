import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class XpTransactionsInput {
  @ApiProperty({
    example: 50,
    required: false,
    description: "Limite de transações",
    default: 50,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Limite deve ser um número" })
  @Min(1, { message: "Limite deve ser maior que 1" })
  @Max(100, { message: "Limite deve ser menor que 100" })
  limit: number = 50;
}
