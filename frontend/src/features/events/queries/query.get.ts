import { apiClient } from "@/features/apiClient";
import { EventListResponse, EventParticipantListResponse, EventRankingResponseWrapper, EventResponse, TotalWinsByUserResponse } from "./event.response";
import { EventStatus, EventType } from "../types";


export function getEvents(status?: EventStatus, type?: EventType) {
  const query = new URLSearchParams();
  if (status) query.append("status", status);
  if (type) query.append("type", type);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiClient<EventListResponse>(`/events${queryString}`);
}

export function getPublicEvents() {
  return apiClient<EventListResponse>(`/events/public`);
}

export function getEvent(eventId: string) {
  return apiClient<EventResponse>(`/events/${eventId}`);
}

export function getEventRanking(eventId: string) {
  return apiClient<EventRankingResponseWrapper>(`/events/${eventId}/ranking`);
}

export function getEventParticipants(eventId: string) {
  return apiClient<EventParticipantListResponse>(
    `/events/${eventId}/participants`,
  );
}

export function getTotalWinsByUser(eventId: string) {
  return apiClient<TotalWinsByUserResponse>(`/events/${eventId}/total-win`);
}