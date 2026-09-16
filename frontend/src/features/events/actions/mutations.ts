import { apiClient } from "@/features/apiClient";
import {
  EventParticipantResponse,
  EventResponse,
  EventRoundResponse,
  EventRoundResultResponse,
} from "../queries/event.response";
import {
  CreateEventInput,
  CreateRoundInput,
  InviteToEventInput,
  SubmitRoundResultsInput,
} from "./event.inputs";

export function createEvent(input: CreateEventInput) {
  return apiClient<EventResponse>("/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createRound(eventId: string, input: CreateRoundInput) {
  return apiClient<EventRoundResponse>(`/events/${eventId}/rounds`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function scheduleEvent(eventId: string) {
  return apiClient<EventResponse>(`/events/${eventId}/schedule`, {
    method: "PATCH",
  });
}

export function startEvent(eventId: string) {
  return apiClient<EventResponse>(`/events/${eventId}/start`, {
    method: "PATCH",
  });
}

export function inviteToEvent(eventId: string, input: InviteToEventInput) {
  return apiClient<EventParticipantResponse>(`/events/${eventId}/invite`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function acceptInvite(eventId: string) {
  return apiClient<EventParticipantResponse>(`/events/${eventId}/accept`, {
    method: "PATCH",
  });
}

export function submitRoundResults(
  eventId: string,
  input: SubmitRoundResultsInput,
) {
  return apiClient<EventRoundResultResponse>(
    `/events/${eventId}/rounds/submit`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
