import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CloseRoundUseCase } from "../../app/use-case/close-round.use-case";

export interface CloseRoundJobData {
  eventId: string;
  roundNumber: number;
}

@Processor("events")
export class CloseRoundProcessor extends WorkerHost {
  private readonly logger = new Logger(CloseRoundProcessor.name);

  constructor(private readonly closeRoundUseCase: CloseRoundUseCase) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === "close-round") {
      const data = job.data as CloseRoundJobData;
      this.logger.log(`[Events/BullMQ] Processing close-round job for eventId: ${data.eventId}, roundNumber: ${data.roundNumber}`);
      await this.closeRoundUseCase.execute(data.eventId, data.roundNumber);
    } else {
      this.logger.warn(`[Events/BullMQ] Unknown job: ${job.name}`);
    }
  }
}
