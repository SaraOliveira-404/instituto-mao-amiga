// Transforma a data salva (ISO) em texto legível, ex: "02/10/2026 14:30"

export function formatarData(iso: string): string {
  const limpo = iso.replace(/(\.\d{3})\d+/, '$1');
  const data = new Date(limpo);
  if (isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}