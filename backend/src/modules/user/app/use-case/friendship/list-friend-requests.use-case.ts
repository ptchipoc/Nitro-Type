import { Injectable } from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";

@Injectable()
export class ListFriendRequestsUseCase {
  constructor(private readonly friendshipRepo: FriendshipRepository) {}

  async execute(userId: string) {
    const [received, sent, rejected, blocked] = await Promise.all([
      this.friendshipRepo.findPendingRequestsWithUsers(userId),
      this.friendshipRepo.findSentRequestsWithUsers(userId),
      this.friendshipRepo.findRejectedRequestsWithUsers(userId),
      this.friendshipRepo.findBlockedRequestsWithUsers(userId),
    ]);

    return {
      received: received,
      sent: sent,
      rejected: rejected,
      blocked: blocked,
    };
  }
}
