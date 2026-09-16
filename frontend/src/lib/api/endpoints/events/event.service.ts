import {
  createEvent,
  createRound,
  inviteToEvent,
  acceptInvite,
  getPublicEvents,
  getEvent,
  getEventParticipants,
  getEvents,
  scheduleEvent,
  startEvent,
  submitRoundResults,
  getEventRanking,
} from "./event.feature";
import {
  CreateEventInput,
  CreateRoundInput,
  InviteToEventInput,
  SubmitRoundResultsInput,
} from "./event.input";
import { EventStatus, EventType } from "./event.type";

// ─── Mutations ──────────────────────────────────────────────────

export async function fetchSubmitRoundResults(
  eventId: string,
  input: SubmitRoundResultsInput,
) {
  const response = await submitRoundResults(eventId, input);
  if (!response.success) {
    throw new Error("Failed to submit round results");
  }
  return response.data;
}

export async function fetchCreateEvent(input: CreateEventInput) {
  const response = await createEvent(input);
  if (!response.success) {
    throw new Error("Failed to create event");
  }
  return response.data;
}

export async function fetchCreateRound(
  eventId: string,
  input: CreateRoundInput,
) {
  const response = await createRound(eventId, input);
  if (!response.success) {
    throw new Error("Failed to create round");
  }
  return response.data;
}

export async function fetchInviteToEvent(
  eventId: string,
  input: InviteToEventInput,
) {
  const response = await inviteToEvent(eventId, input);
  if (!response.success) {
    throw new Error("Failed to invite user");
  }
  return response.data;
}

export async function fetchAcceptInvite(eventId: string) {
  const response = await acceptInvite(eventId);
  if (!response.success) {
    throw new Error("Failed to accept invite");
  }
  return response.data;
}

export async function fetchScheduleEvent(eventId: string) {
  const response = await scheduleEvent(eventId);
  if (!response.success) {
    throw new Error("Failed to schedule event");
  }
  return response.data;
}

export async function fetchStartEvent(eventId: string) {
  const response = await startEvent(eventId);
  if (!response.success) {
    throw new Error("Failed to start event");
  }
  return response.data;
}

// ─── Queries ────────────────────────────────────────────────────

export async function fetchEvents(status?: EventStatus, type?: EventType) {
  const response = await getEvents(status, type);
  if (!response.success) {
    throw new Error("Failed to fetch events");
  }
  return response.data;
}

export async function fetchPublicEvents() {
  const response = await getPublicEvents();
  if (!response.success) {
    throw new Error("Failed to fetch public events");
  }
  return response.data;
}

export async function fetchEvent(eventId: string) {
  const response = await getEvent(eventId);
  if (!response.success) {
    throw new Error("Failed to fetch event");
  }
  return response.data;
}

export async function fetchEventParticipants(eventId: string) {
  const response = await getEventParticipants(eventId);
  if (!response.success) {
    throw new Error("Failed to fetch participants");
  }
  return response.data;
}

export async function fetchEventRanking(eventId: string) {
  const response = await getEventRanking(eventId);
  if (!response.success) {
    throw new Error("Failed to fetch ranking");
  }
  return response.data;
}
