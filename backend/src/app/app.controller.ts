import { Public } from "@common/decorators/public.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("status")
@Controller("/")
export class AppController {
  @Get("health")
  @Public()
  @ApiOkResponse({
    description: "Status do servidor",
  })
  getHealth() {
    return { status: "ok" };
  }
}
