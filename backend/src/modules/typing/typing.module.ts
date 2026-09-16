import { OnSessionListener } from "./infra/listeners/session.listener";
import { TypingSessionRepository } from "./domain/repo/typing-session.repository";
import { PrismaTypingSessionRepository } from "./infra/repo/typing-session.repository";
import { TypingSessionResultRepository } from "./domain/repo/typing-session-result.repository";
import { PrismaTypingSessionResultRepository } from "./infra/repo/typing-session-result.repository";
import { TextPoolModule } from "@shared/modules/text-pool/text-pool.module";
import { TypingController } from "./presentation/controllers/typing.controller";
import { TypingLearningRepository } from "./domain/repo/typing-learning.repository";
import { PrismaTypingLearningRepository } from "./infra/repo/prisma-typing-learning.repository";
import { UserModule } from "@modules/user/user.module";
import { CreateSessionUseCase } from "./app/use-case/create-session.use-case";
import { SubmitResultUseCase } from "./app/use-case/result/submit-result.use-case";
import { GetSessionUseCase } from "./app/use-case/get-session.use-case";
import { GetSessionResultsUseCase } from "./app/use-case/result/get-session-results.use-case";
import { GetUserResultsUseCase } from "./app/use-case/result/get-user-results.use-case";
import { GetResultUseCase } from "./app/use-case/result/get-result.use-case";
import { ActivateSessionUseCase } from "./app/use-case/activate-session.use-case";
import { StartLearningSessionUseCase } from "./app/use-case/start-learning-session.use-case";
import { SubmitLearningResultUseCase } from "./app/use-case/submit-learning-result.use-case";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: TypingSessionRepository,
      useClass: PrismaTypingSessionRepository,
    },
    {
      provide: TypingSessionResultRepository,
      useClass: PrismaTypingSessionResultRepository,
    },
    {
      provide: TypingLearningRepository,
      useClass: PrismaTypingLearningRepository,
    },
    OnSessionListener,
    CreateSessionUseCase,
    SubmitResultUseCase,
    GetSessionUseCase,
    GetSessionResultsUseCase,
    GetUserResultsUseCase,
    GetResultUseCase,
    ActivateSessionUseCase,
    StartLearningSessionUseCase,
    SubmitLearningResultUseCase,
  ],
  controllers: [TypingController],
  imports: [TextPoolModule],
  exports: [
    TypingSessionRepository,
    TypingSessionResultRepository,
    TypingLearningRepository,
    CreateSessionUseCase,
  ],
})
export class TypingModule {}
