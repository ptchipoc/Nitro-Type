import { useQuery } from "@tanstack/react-query";
import {
  fetchResult,
  fetchUserResults,
} from "@/lib/api/endpoints/typing/typing.service";
import { TypingSessionResult } from "@/lib/api/endpoints/typing/typing.type";

export const typingKeys = {
  all: ["typing"] as const,
  results: () => [...typingKeys.all, "results"] as const,
  mine: () => [...typingKeys.results(), "me"] as const,
  detail: (id: string) => [...typingKeys.results(), id] as const,
};

export function useUserResults() {
  return useQuery<TypingSessionResult[]>({
    queryKey: typingKeys.mine(),
    queryFn: fetchUserResults,
    staleTime: 1000 * 60, // 1 min cache
  });
}

export function useTypingResult(id: string) {
  return useQuery<TypingSessionResult>({
    queryKey: typingKeys.detail(id),
    queryFn: () => fetchResult(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}
