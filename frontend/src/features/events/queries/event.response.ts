import { ApiEnvelope } from "@/features/apiClient";
import { EventInvite, EventParticipant, EventRankingResponse, EventRoundResult, TypingEvent, TotalWinsByUser } from "../types";


export type EventResponse = ApiEnvelope<TypingEvent>;
export type EventListResponse = ApiEnvelope<TypingEvent[]>;
export type EventParticipantResponse = ApiEnvelope<EventParticipant>;
export type EventParticipantListResponse = ApiEnvelope<EventParticipant[]>;
export type EventInviteResponse = ApiEnvelope<EventInvite>;
// export type EventRoundResponse = ApiEnvelope<EventRound>;
export type EventRoundResultResponse = ApiEnvelope<EventRoundResult>;
export type EventRankingResponseWrapper = ApiEnvelope<EventRankingResponse>;
export type TotalWinsByUserResponse = ApiEnvelope<TotalWinsByUser>;