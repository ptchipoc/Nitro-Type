import { useQuery } from "@tanstack/react-query"
import { getMe } from "../queries/get-me.query";
import { UserResponse } from "../response/user.response";

export const userGetMeHook = () => {
    return useQuery<UserResponse>({
        queryKey: ["users", "me"],
        queryFn: getMe,
        // enabled: false
    });
}
