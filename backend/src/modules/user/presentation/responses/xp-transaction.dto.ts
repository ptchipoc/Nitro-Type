import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class XpTransactionResponse {
  @ApiProperty({ description: "ID da transação" })
  id: string;

  @ApiProperty({ description: "Quantidade de XP" })
  amount: number;

  @ApiProperty({ description: "Motivo (Ex: Typed Activity, Event Round)" })
  reason: string;

  @ApiPropertyOptional({ description: "ID de referência relacionado ao motivo" })
  referenceId?: string | null;

  @ApiProperty({ description: "Data de criação" })
  createdAt: Date;
}
