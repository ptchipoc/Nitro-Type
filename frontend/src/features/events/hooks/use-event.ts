import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../queries/query.get";

//Para remover o staleTime, basta retirar a propriedade do objeto retornado pela função useQuery. O React Query irá considerar os dados como "stale" imediatamente após serem carregados, o que significa que ele irá refetchar os dados toda vez que o componente for montado ou quando a janela for focada, por exemplo.
export function useEvent(eventId: string) {
  const ky = `event-${eventId}`
  return useQuery({
    queryKey: ["events", ky],
    queryFn: () => getEvent(eventId),
  });
}