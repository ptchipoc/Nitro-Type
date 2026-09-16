import { useQuery } from "@tanstack/react-query";
import { getSessionById } from "../queries/get-setioionId.query";

export function useTypingGetSessionById(id: string) {
    return useQuery({
        queryKey: ["typing-get-session-by-id", id],
        queryFn: () => getSessionById(id),
        enabled: !!id,
    });
}