import { useQuery } from "@tanstack/react-query"
import { getMe } from "../queries/get-me.query";
import { UserResponse } from "../response/user.response";
import { getUser } from "../queries/get-user.query";

export const userGetUserHook = (userId: string) => {
    return useQuery<UserResponse>({
        queryKey: ["users", userId],
        queryFn: () => getUser(userId),
        // enabled: false
    });
}
