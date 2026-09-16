import { useQuery } from "@tanstack/react-query";
import { getResults } from "../queries/get-results.query";

export function useTypingGetResults(id: string) {
    return useQuery({
        queryKey: ["typing-get-results", id],
        queryFn: () => getResults(id),
    });
}