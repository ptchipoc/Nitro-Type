import { apiFetch } from "../../client";
import { CreateSectionInput, SubmitSessionInput } from "./typing.input";
import {
  TypingSectionResponse,
  TypingSessionResultResponse,
  TypingUserResultsResponse,
} from "./typing.response";

export function createSection(input: CreateSectionInput) {
  return apiFetch<TypingSectionResponse>("/typing/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getSection(id: string) {
  return apiFetch<TypingSectionResponse>(`/typing/sessions/${id}`);
}

export function submitSession(input: SubmitSessionInput) {
  return apiFetch<TypingSessionResultResponse>("/typing/sessions/result", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getUserResults() {
  return apiFetch<TypingUserResultsResponse>(`/typing/me/results`);
}

export function getResult(id: string) {
  return apiFetch<TypingSessionResultResponse>(`/typing/results/${id}`);
}

export function activateSession(id: string) {
  return apiFetch<TypingSectionResponse>(`/typing/sessions/${id}/activate`, {
    method: "PATCH",
  });
}
