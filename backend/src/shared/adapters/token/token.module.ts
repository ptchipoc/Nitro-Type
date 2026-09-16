import { Global, Module } from "@nestjs/common";
import { TokenPort } from "./token.port";
import { TokenAdapter } from "./token.adapter";

@Global()
@Module({
  providers: [{ provide: TokenPort, useClass: TokenAdapter }],
  exports: [TokenPort],
})
export class TokenModule {}
