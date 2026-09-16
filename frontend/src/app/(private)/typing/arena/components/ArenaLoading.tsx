/**
 * ArenaLoading - Componente responsável por exibir o estado de carregamento
 * Mostra um spinner animado enquanto a sessão está sendo carregada
 */
export function ArenaLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}