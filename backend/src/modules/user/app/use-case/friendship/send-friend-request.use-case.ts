import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { FriendshipEntity } from "@modules/user/domain/entities/friendship.entity";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { FriendRequestSentEvent } from "@modules/user/domain/events/friend-request-sent.event";

@Injectable()
export class SendFriendRequestUseCase {
  constructor(
    private readonly friendshipRepo: FriendshipRepository,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(senderId: string, receiverId: string): Promise<void> {
    if (senderId === receiverId) {
      throw new BadRequestException(
        "Não podes enviar pedido de amizade a ti próprio",
      );
    }

    const receiver = await this.userRepo.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    // Verifica se já existe relação em qualquer direcção
    const existing =
      (await this.friendshipRepo.findBySenderAndReceiver(
        senderId,
        receiverId,
      )) ??
      (await this.friendshipRepo.findBySenderAndReceiver(receiverId, senderId));

    if (existing) {
      if (existing.isPending()) {
        throw new BadRequestException(
          "Já existe um pedido de amizade pendente",
        );
      }
      if (existing.isAccepted()) {
        throw new BadRequestException("Já são amigos");
      }
      if (existing.isRejected()) {
        throw new BadRequestException("Pedido de amizade já rejeitado");
      }
      if (existing.isBlocked()) {
        throw new BadRequestException(
          "Não podes enviar pedido de amizade, foste bloqueado por este utilizador",
        );
      }
    }

    const sender = await this.userRepo.findById(senderId);
    if (!sender) {
      throw new NotFoundException("Utilizador remetente não encontrado");
    }

    const friendship = FriendshipEntity.create(senderId, receiverId);
    await this.friendshipRepo.save(friendship);

    await this.eventBus.publish([
      new FriendRequestSentEvent(senderId, receiverId, sender.name),
    ]);
  }
}
