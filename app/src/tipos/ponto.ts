// NOVO: espelha, campo a campo, o record PontoResponse da API (api/.../PontoResponse.java)
export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  recebeOuDistribui: string;
  latitude: number;
  longitude: number;
};

// NOVO: formato da página que a API devolve em GET /pontos (Page do Spring: content + page)
export type PaginaPontos = {
  content: Ponto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
