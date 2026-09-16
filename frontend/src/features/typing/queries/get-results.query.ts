import { apiClient } from "@/features/apiClient";
import { TypingSessionResultByIdResponse } from "../response/get-user-by-id.response";

export function getResults(id: string) {
    return apiClient<TypingSessionResultByIdResponse>(`/typing/results/${id}`);
}