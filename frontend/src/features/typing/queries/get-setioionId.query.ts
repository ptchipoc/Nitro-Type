import { apiClient } from "@/features/apiClient";
import { TypingSessionByIdResponse } from "../response/get-setionId.response";

export function getSessionById(id: string) {
    return apiClient<TypingSessionByIdResponse>(`/typing/sessions/${id}`);
}
