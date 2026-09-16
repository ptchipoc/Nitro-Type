import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";

export class ListEventsInput {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "A pesquisa passou dos 100 caracteres" })
  search?: string;

  @ApiProperty({
    enum: EventStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventStatus, {
    message: `Estado de evento inválido os valores são: ${Object.values(EventStatus).join(", ")}`,
  })
  status?: EventStatus;

  @ApiProperty({
    required: false,
    enum: EventType,
  })
  @IsOptional()
  @IsEnum(EventType, {
    message: `Tipo de evento inválido os valores são: ${Object.values(EventType).join(", ")}`,
  })
  type?: EventType;
}
