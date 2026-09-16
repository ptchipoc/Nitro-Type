import { Module } from "@nestjs/common";
import { TextPoolService } from "./text-pool.service";

@Module({
  providers: [TextPoolService],
  exports: [TextPoolService],
})
export class TextPoolModule {}
