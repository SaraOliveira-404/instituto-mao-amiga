// NOVO: rotas tipadas do app (antes ficava em tipos.ts)
import type { Doacao } from './doacao';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: number }; // NOVO: id da API é número
  CadastroDoacao: { doacao?: Doacao } | undefined;
  MinhasDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacao: Doacao; mensagem?: string };
};
