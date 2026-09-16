import { Injectable, Logger } from "@nestjs/common";
import { UserPresenceRepository } from "../../domain/repository/user-presence.repo";

@Injectable()
export class GetPresenceUseCase {
  private readonly logger = new Logger(GetPresenceUseCase.name);

  constructor(private readonly presenceRepo: UserPresenceRepository) {}

  async execute(userId: string) {
    const presence = await this.presenceRepo.findByUserId(userId);
    if (!presence) {
      return null;
    }
    return presence.publicData();
  }
}
