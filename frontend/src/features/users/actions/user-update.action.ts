import { apiClient } from "@/features/apiClient";
import { UserUpdateInput } from "../inputs/user-update.input";
import { UserResponse } from "../response/user.response";

export const userUpdateAction = ( userData: UserUpdateInput) => {
    return apiClient<UserResponse>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(userData),
    });
}