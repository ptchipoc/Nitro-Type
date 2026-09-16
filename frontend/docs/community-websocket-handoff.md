# Community WebSocket Handoff

Foco: trabalhar apenas na area de comunidade do frontend.

## O que foi feito

- Foi criado o hook de socket da comunidade:
  - `src/features/community/hooks/use-community-socket.ts`
- Foi integrada a ligacao WebSocket no controller principal da pagina:
  - `src/app/(private)/community/components/useCommunityPageController.ts`

## Contrato real do backend usado

- Namespace: `/community`
- Auth do socket: `auth.userId`
- Eventos usados:
  - `channel:join`
  - `channel:leave`
  - `channel:message`
  - `dm:join`
  - `dm:leave`
  - `dm:message`
  - `presence:update`
  - `presence:get`
  - `message:reaction:add`
  - `message:reaction:remove`
- Eventos recebidos:
  - `user:online`
  - `user:offline`
  - `presence:updated`
  - `presence:status`
  - `channel:message`
  - `dm:message`
  - `message:reaction:added`
  - `message:reaction:removed`

## Detalhes importantes

- O backend de comunidade nao usa JWT guard no gateway; ele le `client.handshake.auth.userId`.
- `dm:message` pode chegar com envelope `{ conversation, message }`, nao apenas `message`.
- `message:reaction:added` manda no campo `reaction` a mensagem inteira atualizada.
- O frontend trata isso no controller.

## Estado atual

- Carga inicial continua por REST.
- Atualizacao em tempo real de mensagens, DMs, reactions e presence passa por socket quando conectado.
- Edicao, delete e gestao de membros continuam por HTTP.

## Validacao feita

- Estes ficheiros passaram no eslint isolado:
  - `src/features/community/hooks/use-community-socket.ts`
  - `src/app/(private)/community/components/useCommunityPageController.ts`

## Limite desta entrega

- O lint global do projeto continua com muitos erros antigos fora da comunidade.
- Ignorar areas fora da comunidade.

## Prompt rapido para continuar noutra conversa

Usa apenas a area de comunidade do frontend.
Abre e continua a partir de `Frontend/client/docs/community-websocket-handoff.md`.
Ja existe integracao inicial de WebSocket em:
- `Frontend/client/src/features/community/hooks/use-community-socket.ts`
- `Frontend/client/src/app/(private)/community/components/useCommunityPageController.ts`

Proximo foco: validar UX em tempo real da comunidade e ajustar apenas o que for necessario dentro dessa area.
