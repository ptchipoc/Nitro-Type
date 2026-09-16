import { apiFetch } from "../../client";
import {
  CreateEventInput,
  CreateRoundInput,
  InviteToEventInput,
  SubmitRoundResultsInput,
} from "./event.input";
import {
  EventResponse,
  EventListResponse,
  EventParticipantResponse,
  EventParticipantListResponse,
  EventRoundResponse,
  EventRoundResultResponse,
  EventRankingResponseWrapper,
} from "./event.response";
import { EventStatus, EventType } from "./event.type";

// ─── Mutations ──────────────────────────────────────────────────

export function createEvent(input: CreateEventInput) {
  return apiFetch<EventResponse>("/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createRound(eventId: string, input: CreateRoundInput) {
  return apiFetch<EventRoundResponse>(`/events/${eventId}/rounds`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function scheduleEvent(eventId: string) {
  return apiFetch<EventResponse>(`/events/${eventId}/schedule`, {
    method: "PATCH",
  });
}

export function startEvent(eventId: string) {
  return apiFetch<EventResponse>(`/events/${eventId}/start`, {
    method: "PATCH",
  });
}

export function inviteToEvent(eventId: string, input: InviteToEventInput) {
  return apiFetch<EventParticipantResponse>(`/events/${eventId}/invite`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function acceptInvite(eventId: string) {
  return apiFetch<EventParticipantResponse>(`/events/${eventId}/accept`, {
    method: "PATCH",
  });
}

export function submitRoundResults(
  eventId: string,
  input: SubmitRoundResultsInput,
) {
  return apiFetch<EventRoundResultResponse>(
    `/events/${eventId}/rounds/submit`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

// ─── Queries ────────────────────────────────────────────────────

export function getEvents(status?: EventStatus, type?: EventType) {
  const query = new URLSearchParams();
  if (status) query.append("status", status);
  if (type) query.append("type", type);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<EventListResponse>(`/events${queryString}`);
}

export function getPublicEvents() {
  return apiFetch<EventListResponse>(`/events/public`);
}

export function getEvent(eventId: string) {
  return apiFetch<EventResponse>(`/events/${eventId}`);
}

export function getEventRanking(eventId: string) {
  return apiFetch<EventRankingResponseWrapper>(`/events/${eventId}/ranking`);
}

export function getEventParticipants(eventId: string) {
  return apiFetch<EventParticipantListResponse>(
    `/events/${eventId}/participants`,
  );
}
