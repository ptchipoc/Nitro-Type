import { Injectable, Logger } from "@nestjs/common";
import { SendFriendRequestUseCase } from "../use-case/friendship/send-friend-request.use-case";
import { AcceptFriendRequestUseCase } from "../use-case/friendship/accept-friend-request.use-case";
import { RejectFriendRequestUseCase } from "../use-case/friendship/reject-friend-request.use-case";
import { RemoveFriendUseCase } from "../use-case/friendship/remove-friend.use-case";
import { ListFriendsUseCase } from "../use-case/friendship/list-friends.use-case";
import { ListFriendRequestsUseCase } from "../use-case/friendship/list-friend-requests.use-case";
import { CancelFriendRequestUseCase } from "../use-case/friendship/cancel-friend-request.use-case";

@Injectable()
export class FriendshipService {
  private readonly logger = new Logger(FriendshipService.name);

  constructor(
    private readonly sendRequest: SendFriendRequestUseCase,
    private readonly acceptRequest: AcceptFriendRequestUseCase,
    private readonly rejectRequest: RejectFriendRequestUseCase,
    private readonly removeFriend: RemoveFriendUseCase,
    private readonly listFriendsUseCase: ListFriendsUseCase,
    private readonly listRequestsUseCase: ListFriendRequestsUseCase,
    private readonly cancelRequest: CancelFriendRequestUseCase,
  ) {}

  async sendFriendRequest(senderId: string, receiverId: string) {
    return this.sendRequest.execute(senderId, receiverId);
  }

  async accept(friendshipId: string, currentUserId: string) {
    return this.acceptRequest.execute(friendshipId, currentUserId);
  }

  async reject(friendshipId: string, currentUserId: string) {
    return this.rejectRequest.execute(friendshipId, currentUserId);
  }

  async cancel(friendshipId: string, currentUserId: string) {
    return this.cancelRequest.execute(friendshipId, currentUserId);
  }

  async remove(friendshipId: string, currentUserId: string) {
    return this.removeFriend.execute(friendshipId, currentUserId);
  }

  async listFriends(userId: string) {
    return this.listFriendsUseCase.execute(userId);
  }

  async listRequests(userId: string) {
    return this.listRequestsUseCase.execute(userId);
  }
}
