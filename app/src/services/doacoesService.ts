import { get, post, put, del, ApiError } from './api';
import type { Doacao, DoacaoDados, PaginaDoacoes } from '../tipos/doacao';

let houveAlteracao = false;

export function consumirAlteracao(): boolean {
  const resultado = houveAlteracao;
  houveAlteracao = false;
  return resultado;
}

export function buscarPagina(pagina = 0, filtro = '', tamanho = 10, ponto = ''): Promise<PaginaDoacoes> {
  return get<PaginaDoacoes>(
    `/doacoes/filtro?filtro=${encodeURIComponent(filtro)}&ponto=${encodeURIComponent(ponto)}&page=${pagina}&size=${tamanho}`
  );
}

export async function buscarPorId(id: string): Promise<Doacao | null> {
  try {
    return await get<Doacao>(`/doacoes/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function cadastrar(dados: DoacaoDados): Promise<Doacao> {
  const nova = await post<Doacao>('/doacoes', dados);
  houveAlteracao = true;
  return nova;
}

export async function editar(id: string, dados: DoacaoDados): Promise<Doacao> {
  const editada = await put<Doacao>(`/doacoes/${id}`, dados);
  houveAlteracao = true;
  return editada;
}

export async function excluir(id: string): Promise<void> {
  await del(`/doacoes/${id}`);
  houveAlteracao = true;
}