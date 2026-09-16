import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { FriendRemovedEvent } from "@modules/user/domain/events/friend-removed.event";

@Injectable()
export class RemoveFriendUseCase {
  constructor(
    private readonly friendshipRepo: FriendshipRepository,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(friendshipId: string, currentUserId: string): Promise<void> {
    const friendship = await this.friendshipRepo.findById(friendshipId);
    if (!friendship) {
      throw new NotFoundException("Amizade não encontrada");
    }

    if (!friendship.isAccepted()) {
      throw new NotFoundException("Amizade não encontrada");
    }

    const isSender = friendship.senderId === currentUserId;
    const isReceiver = friendship.receiverId === currentUserId;
    if (!isSender && !isReceiver) {
      throw new ForbiddenException("Não tens permissão para remover esta amizade");
    }

    const friendId = isSender ? friendship.receiverId : friendship.senderId;
    const user = await this.userRepo.findById(currentUserId);

    await this.friendshipRepo.delete(friendshipId);

    await this.eventBus.publish([
      new FriendRemovedEvent(currentUserId, friendId, user?.name ?? "Utilizador"),
    ]);
  }
}
