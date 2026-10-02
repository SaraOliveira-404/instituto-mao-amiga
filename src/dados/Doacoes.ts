// Issue #08: Único arquivo que acessa o AsyncStorage diretamente
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao } from '../tipos';

// Chaves usadas no armazenamento do aparelho
const STORAGE_KEY = '@mao_amiga:doacoes'; // array com todas as doações
const RASCUNHO_KEY = '@mao_amiga:rascunho_doacao'; // formulário em andamento
const PROXIMO_ID_KEY = '@mao_amiga:proximo_id'; // contador para gerar ids

export type Rascunho = {
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  pontoId: string | null;
  descricao?: string;
};

type NovaDoacao = Omit<Doacao, 'id' | 'criadoEm'>;

// Issue #08: gera um id único e sequencial
async function gerarProximoId(): Promise<string> {
  const salvo = await AsyncStorage.getItem(PROXIMO_ID_KEY);
  const atual = salvo ? parseInt(salvo, 10) : 1;
  await AsyncStorage.setItem(PROXIMO_ID_KEY, String(atual + 1));
  return String(atual);
}

// Issue #08: lê todas as doações salvas, ordenadas da mais recente para a mais antiga
export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const salvo = await AsyncStorage.getItem(STORAGE_KEY);
    const todas = salvo ? (JSON.parse(salvo) as Doacao[]) : [];
    return todas.sort(
      (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    );
  } catch (e) {
    console.warn('Erro ao carregar doações do AsyncStorage', e);
    return [];
  }
}

// Issue #08: acrescenta uma doação ao array sem apagar as anteriores
export async function salvarDoacao(dados: NovaDoacao): Promise<Doacao | null> {
  try {
    const todas = await listarDoacoes(); 
    const novaDoacao: Doacao = {
      ...dados,
      id: await gerarProximoId(),
      criadoEm: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...todas, novaDoacao]));
    return novaDoacao;
  } catch (e) {
    console.warn('Erro ao salvar doação no AsyncStorage', e);
    return null;
  }
}

// Issue #11: substitui uma doação existente pelo mesmo id (não duplica)
export async function atualizarDoacao(doacao: Doacao): Promise<boolean> {
  try {
    const todas = await listarDoacoes();
    const indice = todas.findIndex((d) => d.id === doacao.id);
    if (indice === -1) return false; // não achou a doação

    todas[indice] = doacao;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todas));
    return true;
  } catch (e) {
    console.warn('Erro ao atualizar doação no AsyncStorage', e);
    return false;
  }
}

// Issue #10: remove a doação com o id informado e salva o array sem ela
export async function excluirDoacao(id: string): Promise<boolean> {
  try {
    const todas = await listarDoacoes();
    const restantes = todas.filter((d) => d.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restantes));
    return true;
  } catch (e) {
    console.warn('Erro ao excluir doação do AsyncStorage', e);
    return false;
  }
}

// Doações de um ponto específico (usada no detalhe do ponto e no resumo por ponto
export async function listarDoacoesPorPonto(nomePonto: string): Promise<Doacao[]> {
  const todas = await listarDoacoes();
  return todas.filter((d) => d.pontoDestino === nomePonto);
}

// Lê o rascunho do formulário (para recuperar o que a pessoa já tinha digitado)
export async function carregarRascunho(): Promise<Rascunho | null> {
  try {
    const salvo = await AsyncStorage.getItem(RASCUNHO_KEY);
    return salvo ? (JSON.parse(salvo) as Rascunho) : null;
  } catch (e) {
    console.warn('Erro ao carregar rascunho', e);
    return null;
  }
}

// Salva o rascunho; se receber null, apaga o rascunho salvo
export async function salvarRascunho(r: Rascunho | null): Promise<void> {
  try {
    if (r === null) await AsyncStorage.removeItem(RASCUNHO_KEY);
    else await AsyncStorage.setItem(RASCUNHO_KEY, JSON.stringify(r));
  } catch (e) {
    console.warn('Erro ao salvar rascunho', e);
  }
}