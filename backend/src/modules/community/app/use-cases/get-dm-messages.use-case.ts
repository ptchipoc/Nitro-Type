import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";
import { MessageRepository } from "../../domain/repository/message.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class GetDMMessagesUseCase {
  private readonly logger = new Logger(GetDMMessagesUseCase.name);

  constructor(
    private readonly dmRepo: DMConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(dmId: string, userId: string, limit = 50) {
    const dm = await this.dmRepo.findById(dmId);
    if (!dm) {
      throw new NotFoundException("Conversa não encontrada");
    }

    if (!dm.hasParticipant(userId)) {
      throw new ForbiddenException("Não tens acesso a esta conversa");
    }

    const messages = await this.messageRepo.findByDMId(dmId, limit);
    
    // Obter nome do outro participante
    const otherParticipantId = dm.getOtherParticipant(userId);
    const participant = otherParticipantId
      ? await this.userRepo.findById(otherParticipantId)
      : null;

    return {
      conversation: {
        id: dm.id,
        participantId: otherParticipantId,
        participantName: participant?.name || "Utilizador desconhecido",
      },
      messages: messages.map((m) => m.publicData()),
    };
  }
}
