import { Injectable, NotFoundException } from "@nestjs/common";
import { EventRepository } from "../../domain/repository/event.repo";

@Injectable()
export class GetEventRankingUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  /**
   * Calcula o ranking final do evento.
   * Ordena participantes por totalScore DESC e resolve medalhas.
   */
  async execute(eventId: string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new NotFoundException("Evento nao encontrado");

    const sorted = [...event.participants].sort(
      (a, b) => b.totalScore - a.totalScore,
    );

    const ranking = sorted.map((participant, index) => {
      const rank = index + 1;
      const medal = event.resolveMedalForRank(rank);

      return {
        rank,
        userId: participant.userId,
        totalScore: participant.totalScore,
        medal: medal ?? null,
        xp: event.resolveXPForRank(rank),
      };
    });

    return { eventId, ranking };
  }
}
