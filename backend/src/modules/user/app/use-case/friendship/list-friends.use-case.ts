import { Injectable } from "@nestjs/common";
import { FriendshipRepository } from "@modules/user/domain/repository/friendship.repo";

@Injectable()
export class ListFriendsUseCase {
  constructor(private readonly friendshipRepo: FriendshipRepository) {}

  async execute(userId: string) {
    const friendships = await this.friendshipRepo.findFriendsWithUsers(userId);
    return friendships.map((f) => {
      const isSender = f.senderId === userId;
      const friend = isSender ? f.receiver : f.sender;
      return {
        friendshipId: f.id,
        friendshipCreatedAt: f.createdAt,
        ...friend,
      };
    });
  }
}
