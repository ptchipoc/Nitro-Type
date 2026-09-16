import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userUpdateAction } from "../actions/user-update.action";
import { UserUpdateInput } from "../inputs/user-update.input";
import { UserResponse } from "../response/user.response";

export const userUpdateMeHook = () => {
    const queryClient = useQueryClient();
    return useMutation<UserResponse, Error, UserUpdateInput>({
        mutationFn: (userData) => userUpdateAction(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "me"] });
        },
    });
}