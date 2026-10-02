export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  recebeOuDistribui: string;
};

export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  criadoEm: string;
};

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string };
  CadastroDoacao: undefined;
  MinhasDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacao: Doacao };
};