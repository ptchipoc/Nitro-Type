import { useQuery } from "@tanstack/react-query";
import { getRankingGlobal } from "../queries/get-ranking-global.query";

export function useGetRankingGlobal() {
  return useQuery({
    queryKey: ["users", "ranking", "global"],
    queryFn: getRankingGlobal,
  });
}
