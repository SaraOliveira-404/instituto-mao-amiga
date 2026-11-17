// COLOQUE O IP DO SEU COMPUTADOR AQUI
export const API_URL = 'http://192.168.2.8:8083/api/v1';

export class ApiError extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function requisitar<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  if (!resposta.ok) {
    throw new ApiError(resposta.status, `Erro ${resposta.status} ao acessar ${caminho}`);
  }
  if (resposta.status === 204) return undefined as T; 
  return (await resposta.json()) as T;
}

export function get<T>(caminho: string): Promise<T> {
  return requisitar<T>(caminho);
}

export function post<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}

export function put<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>(caminho, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}

export function del(caminho: string): Promise<void> {
  return requisitar<void>(caminho, { method: 'DELETE' });
}