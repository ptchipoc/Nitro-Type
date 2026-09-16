import { SetMetadata } from "@nestjs/common";

export const IS_OPTIONAL_KEY = "isOptional";
/**
 * @Optional
 * Uso:
 *  @Optional()
 *  @Get('produto/tags')
 *  tags() {}
 */
export const Optional = () => SetMetadata(IS_OPTIONAL_KEY, true);
