// NOVO: tipo da doação (antes ficava em tipos.ts). Agora quantidade é número.
export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
  descricao: string;
};
