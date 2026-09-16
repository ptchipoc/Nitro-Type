import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";

@Injectable()
export class BlockUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(userId: string, reason?: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    user.block(reason);
    await this.userRepo.save(user);
    await this.eventBus.publish(user.domainEvents);
    user.clearEvents();
  }
}
