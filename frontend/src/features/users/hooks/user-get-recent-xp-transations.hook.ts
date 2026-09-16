import { useQuery } from "@tanstack/react-query";
import { RecentTransationsXPResponse } from "../response/user-recent-xp-transations.response";
import { getRecentXpTransations } from "../queries/get-recent-xp-transations.query";

export const useGetRecentXpTransations = () => {
    return useQuery<RecentTransationsXPResponse>({
        queryKey: ["recent-xp-transations"],
        queryFn: () => getRecentXpTransations(),
    });
};