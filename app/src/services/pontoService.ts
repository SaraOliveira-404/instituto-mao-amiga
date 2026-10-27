// NOVO: funções que as telas usam para buscar pontos. Nenhuma tela monta URL nem chama fetch.
import { apiGet, ApiError } from './api';
import type { Ponto, PaginaPontos } from '../tipos/ponto';

// Uma página de pontos (GET /pontos?page=&size=&sort=)
export function listarPontos(pagina = 0, tamanho = 20): Promise<PaginaPontos> {
  return apiGet<PaginaPontos>(`/pontos?page=${pagina}&size=${tamanho}&sort=nome,asc`);
}

// Um ponto pelo id (GET /pontos/{id}). Devolve null quando a API responde 404.
export async function buscarPontoPorId(id: number): Promise<Ponto | null> {
  try {
    return await apiGet<Ponto>(`/pontos/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// Todos os pontos (junta as páginas de 50 em 50). Usado na escolha do destino do cadastro.
export async function listarTodosPontos(): Promise<Ponto[]> {
  const todos: Ponto[] = [];
  let pagina = 0;
  let totalPaginas = 1;

  while (pagina < totalPaginas) {
    const resposta = await listarPontos(pagina, 50);
    todos.push(...resposta.content);
    totalPaginas = resposta.page.totalPages;
    pagina += 1;
  }
  return todos;
}
