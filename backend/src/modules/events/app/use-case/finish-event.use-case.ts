import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventFinishedEvent } from "../../domain/events/event-finished.event";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { GetEventRankingUseCase } from "./get-event-ranking.use-case";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventType } from "@modules/events/domain/entities/enums/event-type";

@Injectable()
export class FinishEventUseCase {
  private readonly logger = new Logger(FinishEventUseCase.name);

  constructor(
    private readonly eventRepo: EventRepository,
    private readonly eventBus: EventBusPort,
    private readonly getRankEvent: GetEventRankingUseCase,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(eventId: string): Promise<void> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    event.finish();
    await this.eventRepo.save(event);

    const ranking = await this.getRankEvent.execute(eventId);
    ranking.ranking.forEach(async (p) => {
      if (p.rank == 1) {
        const user = await this.userRepo.findById(p.userId);
        if (user && user.progress) {
          user.progress.incrementEventsWon();
          await this.userRepo.save(user);
          this.logger.log(
            `User [${user.email}] ganhou o evento [${event.name}] - ${user.progress.eventsWon}`,
          );
        }
      }
    });
    // if (event.type == EventType.PUBLIC) {
    //   const ranking = await this.getRankEvent.execute(eventId);
    //   ranking.ranking.forEach(async (p) => {
    //     const user = await this.userRepo.findById(p.userId);
    //     const participant = event.getParticipant(p.userId);
    //     if (
    //       user &&
    //       user.progress &&
    //       participant &&
    //       participant.totalScore > 0
    //     ) {
    //       const medal = event.resolveMedalForRank(p.rank);
    //       const xp = event.resolveXPForRank(p.rank);
    //       user.progress.addXp(
    //         xp,
    //         `Medalha de ${medal} no evento ${event.name}`,
    //         event.id,
    //       );
    //       if (p.rank === 1 && p.totalScore > 0) {
    //         user.progress.incrementEventsWon();
    //       }
    //       await this.userRepo.save(user);
    //       this.logger.log(
    //         `User ${user.name} recebeu ${xp} XP extra por ficar em ${p.rank}º lugar!`,
    //       );
    //       await this.eventRepo.save(event);
    //     }
    //   });
    // } else {

    // }

    await this.eventBus.publish([new EventFinishedEvent(event.id, event.name)]);

    this.logger.log(`[FinishEvent] eventId: ${eventId} finalizado`);
  }
}
