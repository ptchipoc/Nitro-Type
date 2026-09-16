import { useQuery } from "@tanstack/react-query";
import { getFriendPendentsFriends } from "../queries/friend-pendents-friends.query";
import { FriendPendentsFriendsResponse } from "../response/friend-pendents-friends.response";

export const useFriendPendentsFriendsHook = () => {
  return useQuery<FriendPendentsFriendsResponse>({
    queryKey: ["friends", "pendents"],
    queryFn: getFriendPendentsFriends,
  });
}