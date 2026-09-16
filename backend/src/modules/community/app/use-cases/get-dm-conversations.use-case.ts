import { Injectable, Logger } from "@nestjs/common";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class GetDMConversationsUseCase {
  private readonly logger = new Logger(GetDMConversationsUseCase.name);

  constructor(
    private readonly dmRepo: DMConversationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string) {
    const dms = await this.dmRepo.findByUserId(userId);

    // Enriquecer com dados do outro participante
    const enrichedDms = await Promise.all(
      dms.map(async (dm) => {
        const otherParticipantId = dm.getOtherParticipant(userId);
        if (!otherParticipantId) {
          return dm.publicData();
        }

        const participant = await this.userRepo.findById(otherParticipantId);
        return {
          ...dm.publicData(),
          participantName: participant?.name || "Utilizador desconhecido",
          participantId: otherParticipantId,
        };
      }),
    );

    return enrichedDms;
  }
}
