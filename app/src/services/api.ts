// NOVO: ÚNICO arquivo do app que chama fetch. A URL da API fica só aqui.
//
// Onde colocar o endereço:
//  - Celular com Expo Go: IP do computador na mesma rede Wi-Fi (ex: 192.168.0.10)
//  - Emulador Android: http://10.0.2.2:8080
//  - Emulador iOS / web: http://localhost:8080
export const API_URL = 'http://10.150.154.176:8081';

// Erro com o status HTTP, para as telas saberem diferenciar 404 de "API fora do ar"
export class ApiError extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// GET genérico: devolve o JSON já tipado ou lança ApiError se o status não for 2xx.
// Se a API estiver desligada, o próprio fetch lança erro (quem chamou trata).
export async function apiGet<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`);
  if (!resposta.ok) {
    throw new ApiError(resposta.status, `Erro ${resposta.status} ao acessar ${caminho}`);
  }
  return (await resposta.json()) as T;
}
