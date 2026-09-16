import { CreateSessionInput } from "../inputs/create-session.input";
import { apiClient } from "@/features/apiClient";
import { TypingSessionByIdResponse } from "../response/get-setionId.response";

export function createSession(input: CreateSessionInput) {
    return apiClient<TypingSessionByIdResponse>("/typing/sessions", {
        method: "POST",
        body: JSON.stringify(input),
    });
}