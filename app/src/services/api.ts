// ÚNICO arquivo do app que chama fetch. A URL da API fica só aqui.
//
// Onde colocar o endereço:
//  - Celular com Expo Go: IP do computador na mesma rede Wi-Fi (descubra com `hostname -I`)
//  - Emulador Android: http://10.0.2.2:8081/api/v1
//  - Emulador iOS / web: http://localhost:8081/api/v1
//NOVO: porta ajustada para 8083 (a mesma do application.properties); o `;;` do fim foi removido
export const API_URL = 'http://192.168.2.8:8083/api/v1';

// Erro com o status HTTP, para as telas saberem diferenciar 404 de "API fora do ar"
export class ApiError extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Se a API estiver desligada, o próprio fetch lança erro (quem chamou trata).
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