import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";
import { DMConversationEntity } from "../../domain/entities/dm-conversation.entity";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class OpenOrCreateDMUseCase {
  private readonly logger = new Logger(OpenOrCreateDMUseCase.name);

  constructor(
    private readonly dmRepo: DMConversationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string, participantId: string) {
    // Validação: não pode abrir DM consigo mesmo
    if (userId === participantId) {
      throw new ForbiddenException("Não podes abrir DM contigo mesmo");
    }

    // Validação: verificar se o participante existe
    const participant = await this.userRepo.findById(participantId);
    if (!participant) {
      throw new NotFoundException(
        `Utilizador com ID ${participantId} não encontrado`,
      );
    }

    // Procura conversa existente
    let dm = await this.dmRepo.findByParticipants(userId, participantId);

    // Se não existir, cria nova
    if (!dm) {
      dm = DMConversationEntity.create({
        participantAId: userId,
        participantBId: participantId,
      });
      await this.dmRepo.save(dm);
      this.logger.log(
        `New DM conversation created: ${userId} <-> ${participantId}`,
      );
    }

    return {
      ...dm.publicData(),
      participantName: participant.name,
    };
  }
}
