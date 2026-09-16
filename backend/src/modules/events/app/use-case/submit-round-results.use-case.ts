import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { EventRoundResultEntity } from "../../domain/entities/event-round-result.entity";
import { SubmitResultRoundInput } from "../../presentation/inputs/submit-result-round.input";
import { EventRoundResultRepository } from "../repo/event-round-result.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ParticipantResultSubmittedEvent } from "@modules/events/domain/events/participant-result-submitted.event";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { FinishEventUseCase } from "./finish-event.use-case";
import { CloseRoundUseCase } from "./close-round.use-case";

@Injectable()
export class SubmitRoundResultsUseCase {
  private readonly logger = new Logger(SubmitRoundResultsUseCase.name);

  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventBus: EventBusPort,
    private readonly eventRoundResultRepo: EventRoundResultRepository,
    private readonly userRepo: UserRepository,
    private readonly closeRoundUseCase: CloseRoundUseCase,
  ) {}

  async execute(input: SubmitResultRoundInput, userId: string) {
    this.logger.log(
      `Recording results for event ${input.eventId}, round ${input.roundNumber}`,
    );

    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.error(`User ${userId} not found`);
      throw new BadRequestException("User not found");
    }

    const event = await this.eventRepo.findById(input.eventId);
    if (!event) {
      this.logger.error(`Event ${input.eventId} not found`);
      throw new BadRequestException("Event not found");
    }

    const participant = event.getParticipant(userId);
    if (!participant) {
      this.logger.error(
        `Participant ${userId} not found in event ${input.eventId}`,
      );
      throw new BadRequestException("Participant not found in event");
    }

    // se ele ja submeteu returna o result

    const existingResult =
      await this.eventRoundResultRepo.findByRoundNumberAndUser(
        event.currentRound,
        userId,
        event.id,
      );
    if (existingResult) {
      this.logger.log(
        `Participant ${userId} already submitted result for event ${input.eventId}, round ${event.currentRound}`,
      );
      return existingResult.publicData();
    }

    let sucessResult: EventRoundResultEntity | null = null;
    try {
      const result = EventRoundResultEntity.create({
        userId: userId,
        eventId: input.eventId,
        roundNumber: event.currentRound,
        typedChars: input.typedChars,
        totalChars: input.totalChars,
        correctChars: input.correctChars,
        incorrectChars: input.incorrectChars,
        completionTime: input.completionTime,
        wordCount: input.wordCount,
        timeLimit: input.timeLimit,
      });

      // input do user

      console.log(`Input do user typedChars: ${input.typedChars}`);
      console.log(`Input do user correctChars: ${input.correctChars}`);
      console.log(`Input do user incorrectChars: ${input.incorrectChars}`);
      console.log(`Input do user completionTime: ${input.completionTime}`);
      console.log(`Input do user wordCount: ${input.wordCount}`);
      console.log(`Input do user timeLimit: ${input.timeLimit}`);

      console.log(`Result wpm: ${result.wpm}`);
      console.log(`Result accuracy: ${result.accuracy}`);
      console.log(`Result score: ${result.score}`);

      await this.eventRoundResultRepo.save(result);
      participant.addScore(result.score);

      console.log(
        `Participant ${userId} score: ${event.getParticipant(userId)?.totalScore}`,
      );
      this.logger.log(
        `User ${userId}: WPM=${result.wpm.toFixed(2)}, Acc=${result.accuracy.toFixed(2)}%, Score=${result.score}`,
      );
      await this.eventRepo.save(event);
      sucessResult = result;
    } catch (error) {
      this.logger.error(
        `Erro ao gravar resultado do evento ${event.id}, round ${event.currentRound}`,
      );
      this.logger.error(error);
    }

    if (event.status == EventStatus.ACTIVE) {
      // Verifica se todos os participantes ativos já submeteram → fecha a rodada antecipadamente
      const activeParticipants = event.getActiveParticipants();
      const roundResults = await this.eventRoundResultRepo.findByRoundNumber(
        event.currentRound,
        event.id,
      );

      if (roundResults.length >= activeParticipants.length) {
        this.logger.log(
          `All ${activeParticipants.length} active participants submitted for round ${event.currentRound} — closing round early`,
        );
        await this.closeRoundUseCase.execute(event.id, event.currentRound);
        return null;
      } else {
        this.eventBus.publish([
          new ParticipantResultSubmittedEvent(
            event.id,
            userId,
            event.currentRound,
            sucessResult?.score ?? 0,
            sucessResult?.wpm ?? 0,
            sucessResult?.accuracy ?? 0,
            sucessResult?.completionRate ?? 0,
            sucessResult?.errorRate ?? 0,
            sucessResult?.completionTime ?? 0,
          ),
        ]);
      }
    }
    this.logger.log(`Results recorded and event ${event.id} saved.`);
    return sucessResult?.publicData() ?? null;
  }
}
