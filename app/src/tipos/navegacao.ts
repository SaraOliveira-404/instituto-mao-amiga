// Rotas tipadas do app
import type { Doacao } from './doacao';
import type { Ponto } from './ponto';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string }; 
  CadastroPonto: { ponto?: Ponto } | undefined; 
  CadastroDoacao: { doacao?: Doacao } | undefined;
  MinhasDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacaoId: string; mensagem?: string };
};