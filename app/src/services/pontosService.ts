import { get, post, put, del, ApiError } from './api';
import type { Ponto, PontoDados, PaginaPontos } from '../tipos/ponto';


export function listar(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}

export function buscarPagina(pagina = 0, filtro = '', tamanho = 10): Promise<PaginaPontos> {
  return get<PaginaPontos>(
    `/pontos/filtro?filtro=${encodeURIComponent(filtro)}&page=${pagina}&size=${tamanho}`
  );
}

export async function buscarPorId(id: string): Promise<Ponto | null> {
  try {
    return await get<Ponto>(`/pontos/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export function cadastrar(dados: PontoDados): Promise<Ponto> {
  return post<Ponto>('/pontos', dados);
}

export function editar(id: string, dados: PontoDados): Promise<Ponto> {
  return put<Ponto>(`/pontos/${id}`, dados);
}

export function excluir(id: string): Promise<void> {
  return del(`/pontos/${id}`);
}