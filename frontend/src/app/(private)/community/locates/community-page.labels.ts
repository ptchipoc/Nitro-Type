export const communityPageLabelsByLocale = {
  pt: {
    channels: "Canais",
    empty: "Seleciona um canal para comecar",
    loadingChannels: "A carregar canais...",
  },
  en: {
    channels: "Channels",
    empty: "Select a channel to get started",
    loadingChannels: "Loading channels...",
  },
  fr: {
    channels: "Canaux",
    empty: "Selectionnez un canal pour commencer",
    loadingChannels: "Chargement des canaux...",
  },
} as const;

export const communityPageNoticesByLocale = {
  pt: {
    inviteSent: (count: number) =>
      count === 1
        ? "Convite enviado com sucesso"
        : `${count} convites enviados com sucesso`,
    invitePartial: (ok: number, failed: number) =>
      `${ok} convites enviados, ${failed} falharam`,
    inviteError: "Nao foi possivel enviar os convites",
    inviteSelfError: "Nao podes enviar convite para ti mesmo",
    inviteAccepted: "Convite aceite com sucesso",
    inviteAcceptError: "Falha ao aceitar convite",
    alreadyMember: "Já fazes parte deste grupo",
    banned: "Foste banido deste grupo",
    dmReady: "Conversa aberta com sucesso",
    dmPending: "Pedido enviado. A conversa aparece quando for aceite",
    dmError: "Nao foi possivel iniciar conversa",
    dmSelfError: "Nao podes iniciar conversa contigo mesmo",
    userDirectoryRestricted:
      "Lista de utilizadores indisponivel para este perfil. Contacta um admin ou inicia interacao com o utilizador alvo.",
    noPermission: "Nao tens permissao para realizar esta acao",
    roleError: "Falha ao alterar o cargo do membro",
    removeError: "Falha ao remover o membro",
    banError: "Falha ao banir o membro",
  },
  en: {
    inviteSent: (count: number) =>
      count === 1
        ? "Invite sent successfully"
        : `${count} invites sent successfully`,
    invitePartial: (ok: number, failed: number) =>
      `${ok} invites sent, ${failed} failed`,
    inviteError: "Could not send invites",
    inviteSelfError: "You cannot invite yourself",
    inviteAccepted: "Invite accepted successfully",
    inviteAcceptError: "Failed to accept invite",
    alreadyMember: "You are already a member of this group",
    banned: "You are banned from this group",
    dmReady: "Conversation opened successfully",
    dmPending: "Request sent. Conversation appears after acceptance",
    dmError: "Could not start conversation",
    dmSelfError: "You cannot start a conversation with yourself",
    userDirectoryRestricted:
      "User directory is unavailable for this role. Ask an admin or interact with the target user first.",
    noPermission: "You do not have permission to perform this action",
    roleError: "Failed to update member role",
    removeError: "Failed to remove member",
    banError: "Failed to ban member",
  },
  fr: {
    inviteSent: (count: number) =>
      count === 1
        ? "Invitation envoyee avec succes"
        : `${count} invitations envoyees avec succes`,
    invitePartial: (ok: number, failed: number) =>
      `${ok} invitations envoyees, ${failed} echecs`,
    inviteError: "Impossible d'envoyer les invitations",
    inviteSelfError: "Tu ne peux pas t'inviter toi-meme",
    inviteAccepted: "Invitation acceptee avec succes",
    inviteAcceptError: "Echec lors de l'acceptation de l'invitation",
    alreadyMember: "Vous faites dejà partie de ce groupe",
    banned: "Vous êtes banni de ce groupe",
    dmReady: "Conversation ouverte avec succes",
    dmPending: "Demande envoyee. La conversation apparait apres acceptation",
    dmError: "Impossible de demarrer la conversation",
    dmSelfError: "Tu ne peux pas demarrer une conversation avec toi-meme",
    userDirectoryRestricted:
      "L'annuaire des utilisateurs est indisponible pour ce role. Demande a un admin ou interagis d'abord avec l'utilisateur cible.",
    noPermission: "Vous n'avez pas la permission d'effectuer cette action",
    roleError: "Echec de la mise a jour du role du membre",
    removeError: "Echec de la suppression du membre",
    banError: "Echec du bannissement du membre",
  },
} as const;
