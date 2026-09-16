import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export function SuccessResponse<T>(DataClass: new () => T) {
  const className = `${DataClass.name}Envelope`;

  class SuccessEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => DataClass })
    data: T;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }
  Object.defineProperty(SuccessEnvelope, "name", { value: className });
  return SuccessEnvelope;
}

export function SuccessArrayResponse<T>(DataClass: new () => T) {
  const className = `${DataClass.name}ArrayEnvelope`;

  class SuccessArrayEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    data: T[];

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }
  Object.defineProperty(SuccessArrayEnvelope, "name", { value: className });
  return SuccessArrayEnvelope;
}

export class ErrorDetailResponse {
  @ApiProperty({ example: 404 })
  code: number;

  @ApiProperty({ example: "Recurso não encontrado" })
  message: string;
}

export class ErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: () => ErrorDetailResponse })
  error: ErrorDetailResponse;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  ts: string;

  @ApiProperty({ example: "/wallet/me" })
  path: string;
}

export class RateLimitResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: {
      code: 429,
      message: "Demasiadas tentativas, por favor tenta novamente mais tarde.",
    },
  })
  error: ErrorDetailResponse;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  ts: string;

  @ApiProperty({ example: "/auth/sign-in/email" })
  path: string;
}
