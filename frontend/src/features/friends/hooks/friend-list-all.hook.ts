import { useQuery } from "@tanstack/react-query";
import { getFriendListAll } from "../queries/friend-list-all.query";
import { FriendListAllResponse } from "../response/friend-list-all.response";

export const useFriendListAllHook = () => {
  return useQuery<FriendListAllResponse>({
    queryKey: ["friends", "list-all"],
    queryFn: getFriendListAll,
  });
}