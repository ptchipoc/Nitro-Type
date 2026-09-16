import { useMutation } from "@tanstack/react-query";
import { createSession } from "../actions/create-setion.action";
import { CreateSessionInput } from "../inputs/create-session.input";
import { TypingSessionByIdResponse } from "../response/get-setionId.response";

export function useTypingCreateSession() {
    return useMutation<TypingSessionByIdResponse, Error, CreateSessionInput>({
        mutationFn: (input: CreateSessionInput) => createSession(input),
    });
}
