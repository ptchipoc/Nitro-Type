import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { FriendRequestAcceptedEvent } from "@modules/user/domain/events/friend-request-accepted.event";

@Injectable()
export class AcceptFriendRequestUseCase {
  constructor(
    private readonly friendshipRepo: FriendshipRepository,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(friendshipId: string, currentUserId: string): Promise<void> {
    const friendship = await this.friendshipRepo.findById(friendshipId);
    if (!friendship) {
      throw new NotFoundException("Pedido de amizade não encontrado");
    }

    if (friendship.receiverId !== currentUserId) {
      throw new ForbiddenException("Só o destinatário pode aceitar o pedido");
    }

    friendship.accept();
    await this.friendshipRepo.save(friendship);

    const receiver = await this.userRepo.findById(currentUserId);
    await this.eventBus.publish([
      new FriendRequestAcceptedEvent(
        friendship.senderId,
        friendship.receiverId,
        receiver?.name ?? "Utilizador",
      ),
    ]);
  }
}
