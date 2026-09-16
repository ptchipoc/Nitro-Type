import { Injectable } from "@nestjs/common";
import { CreateEventUseCase } from "../use-case/create-event.use-case";
import { AddEventRoundUseCase } from "../use-case/add-event-round.use-case";
import { ScheduleEventUseCase } from "../use-case/schedule-event.use-case";
import { StartEventUseCase } from "../use-case/start-event.use-case";
import { InviteParticipantUseCase } from "../use-case/invite-participant.use-case";
import { AcceptInviteUseCase } from "../use-case/accept-invite.use-case";
import { GetEventUseCase } from "../use-case/get-event.use-case";
import { GetPublicEventsUseCase } from "../use-case/get-public-events.use-case";
import { GetEventRankingUseCase } from "../use-case/get-event-ranking.use-case";
import { CreateEventInput } from "../../presentation/inputs/create-event.input";
import { CreateEventRoundInput } from "../../presentation/inputs/create-event-round.input";
import { AddEventMedalInput } from "../../presentation/inputs/add-event-medal.input";
import { InviteParticipantInput } from "../../presentation/inputs/invite-participant.input";
import { FinishEventUseCase } from "../use-case/finish-event.use-case";
import { StartRoundUseCase } from "../use-case/start-round.use-case";
import { GetEventsUseCase } from "../use-case/get-events.use-case";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import { SubmitResultRoundInput } from "../../presentation/inputs/submit-result-round.input";
import { SubmitRoundResultsUseCase } from "../use-case/submit-round-results.use-case";
import { GetUserEventXpTransactionsUseCase } from "../use-case/get-user-event-xp-transactions.use-case";
import { GetUserEventWinsUseCase } from "../use-case/get-user-event-wins.use-case";

@Injectable()
export class EventService {
  constructor(
    private readonly createEvent: CreateEventUseCase,
    private readonly addRound: AddEventRoundUseCase,
    private readonly scheduleEvent: ScheduleEventUseCase,
    private readonly startEvent: StartEventUseCase,
    private readonly inviteParticipant: InviteParticipantUseCase,
    private readonly acceptInvite: AcceptInviteUseCase,
    private readonly getEvent: GetEventUseCase,
    private readonly getPublicEvents: GetPublicEventsUseCase,
    private readonly getEventRanking: GetEventRankingUseCase,
    private readonly finishEvent: FinishEventUseCase,
    private readonly _startRound: StartRoundUseCase,
    private readonly getEvents: GetEventsUseCase,
    private readonly submitRound: SubmitRoundResultsUseCase,
    private readonly getUserEventXpTransactionsUseCase: GetUserEventXpTransactionsUseCase,
    private readonly getUserEventWinsUseCase: GetUserEventWinsUseCase,
  ) {}

  createNewEvent(input: CreateEventInput, creatorId: string) {
    return this.createEvent.execute(input, creatorId);
  }

  submitRoundResults(input: SubmitResultRoundInput, userId: string) {
    return this.submitRound.execute(input, userId);
  }

  addRoundToEvent(
    eventId: string,
    input: CreateEventRoundInput,
    userId: string,
  ) {
    return this.addRound.execute(eventId, input, userId);
  }

  scheduleAnEvent(eventId: string, userId: string) {
    return this.scheduleEvent.execute(eventId, userId);
  }

  startAnEvent(eventId: string, userId: string) {
    return this.startEvent.execute(eventId, userId);
  }

  inviteToEvent(
    eventId: string,
    input: InviteParticipantInput,
    inviterId: string,
  ) {
    return this.inviteParticipant.execute(eventId, input, inviterId);
  }

  acceptEventInvite(eventId: string, userId: string) {
    return this.acceptInvite.execute(eventId, userId);
  }

  findEvent(eventId: string) {
    return this.getEvent.execute(eventId);
  }

  listPublicEvents() {
    return this.getPublicEvents.execute();
  }

  listEvents(userId: string, status?: EventStatus, type?: EventType) {
    return this.getEvents.execute(userId, status, type);
  }

  rankingOfEvent(eventId: string) {
    return this.getEventRanking.execute(eventId);
  }

  finishAnEvent(eventId: string) {
    return this.finishEvent.execute(eventId);
  }

  startRound(eventId: string) {
    return this._startRound.execute(eventId);
  }

  getUserEventXpTransactions(userId: string) {
    return this.getUserEventXpTransactionsUseCase.execute(userId);
  }

  getUserEventWins(userId: string) {
    return this.getUserEventWinsUseCase.execute(userId);
  }
}
