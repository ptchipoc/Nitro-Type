import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UserPresenceRepository } from "../../domain/repository/user-presence.repo";
import { UserPresenceEntity } from "../../domain/entities/user-presence.entity";
import { UserPresenceStatus } from "../../domain/entities/enums/user-presence";

const PRESENCE_STATUS_MAP: Record<string, UserPresenceStatus> = {
  ONLINE: UserPresenceStatus.ONLINE,
  OFFLINE: UserPresenceStatus.OFFLINE,
  IDLE: UserPresenceStatus.IDLE,
  AWAY: UserPresenceStatus.IDLE,
  DND: UserPresenceStatus.IDLE,
};

function normalizePresenceStatus(status: string): UserPresenceStatus {
  const normalizedStatus = PRESENCE_STATUS_MAP[String(status ?? "").trim().toUpperCase()];

  if (!normalizedStatus) {
    throw new BadRequestException(
      `Invalid presence status \"${status}\". Allowed values: ONLINE, OFFLINE, IDLE`,
    );
  }

  return normalizedStatus;
}

@Injectable()
export class UpdatePresenceUseCase {
  private readonly logger = new Logger(UpdatePresenceUseCase.name);

  constructor(private readonly presenceRepo: UserPresenceRepository) {}

  async execute(userId: string, status: string) {
    const normalizedStatus = normalizePresenceStatus(status);
    let presence = await this.presenceRepo.findByUserId(userId);

    if (!presence) {
      presence = UserPresenceEntity.create(userId);
    }

    presence.setStatus(normalizedStatus);
    await this.presenceRepo.save(presence);

    this.logger.log(`Presence updated for ${userId} to ${normalizedStatus}`);
    return presence.publicData();
  }
}
