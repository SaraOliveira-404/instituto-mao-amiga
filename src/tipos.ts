// Tipos compartilhados pelo app inteiro

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
  descricao: string;
};


export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string };
  CadastroDoacao: { doacao?: Doacao } | undefined;
  MinhasDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacao: Doacao; mensagem?: string };
};