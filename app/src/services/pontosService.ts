import { get, post, put, del, ApiError } from './api';
import type { Ponto, PontoDados, PaginaPontos } from '../tipos/ponto';

let houveAlteracao = false;

export function consumirAlteracao(): boolean {
  const resultado = houveAlteracao;
  houveAlteracao = false;
  return resultado;
}

export function listar(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}

export function buscarPagina(pagina = 0, filtro = '', tamanho = 10, tipo = ''): Promise<PaginaPontos> {
  return get<PaginaPontos>(
    `/pontos/filtro?filtro=${encodeURIComponent(filtro)}&tipo=${encodeURIComponent(tipo)}&page=${pagina}&size=${tamanho}`
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

export async function cadastrar(dados: PontoDados): Promise<Ponto> {
  const novo = await post<Ponto>('/pontos', dados);
  houveAlteracao = true;
  return novo;
}

export async function editar(id: string, dados: PontoDados): Promise<Ponto> {
  const editado = await put<Ponto>(`/pontos/${id}`, dados);
  houveAlteracao = true; 
  return editado;
}

export async function excluir(id: string): Promise<void> {
  await del(`/pontos/${id}`);
  houveAlteracao = true; 
}