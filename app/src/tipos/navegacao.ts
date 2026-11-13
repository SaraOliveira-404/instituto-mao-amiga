// Rotas tipadas do app
import type { Doacao } from './doacao';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string }; //NOVO: id da API agora é UUID (texto)
  CadastroDoacao: { doacao?: Doacao } | undefined;
  MinhasDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacao: Doacao; mensagem?: string };
};