import { apiClient } from "@/features/apiClient";
import { RecentTransationsXPResponse } from "../response/user-recent-xp-transations.response";

export const getRecentXpTransations = async () => {
    return apiClient<RecentTransationsXPResponse>("/users/me/xp-transactions");
};