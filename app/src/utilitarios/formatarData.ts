// Issue #10: transforma a data salva (ISO) em texto legível, ex: "02/10/2026 14:30"
// É usado em ItemDoacao e DetalheDoacao por isso está em um aquivo separado para não precisar repetir o código
// Fica em utilitarios por retornar algo diferente do que recebe

export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}