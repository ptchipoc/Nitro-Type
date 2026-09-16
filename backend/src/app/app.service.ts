import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SeedService } from "@modules/user/app/services/seed.service";
import { CommunityService } from "@modules/community/app/services/community.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly seedService: SeedService,
    private readonly communityService: CommunityService,
  ) {}
  onApplicationBootstrap() {
    this.communityService.seedChannels();
    this.seedService.admin();
  }
}
