import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { FriendRequestCancelledEvent } from "@modules/user/domain/events/friend-request-cancelled.event";

@Injectable()
export class CancelFriendRequestUseCase {
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

    if (friendship.senderId !== currentUserId) {
      throw new ForbiddenException("Só o remetente pode cancelar o pedido");
    }

    friendship.cancel();
    await this.friendshipRepo.delete(friendshipId);

    const sender = await this.userRepo.findById(currentUserId);
    await this.eventBus.publish([
      new FriendRequestCancelledEvent(
        friendship.senderId,
        friendship.receiverId,
        sender?.name ?? "Utilizador",
      ),
    ]);
  }
}
