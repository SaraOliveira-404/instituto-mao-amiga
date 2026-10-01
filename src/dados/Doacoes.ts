import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao } from '../tipos';

const STORAGE_KEY = '@mao_amiga:doacoes';
const RASCUNHO_KEY = '@mao_amiga:rascunho_doacao';
const PROXIMO_ID_KEY = '@mao_amiga:proximo_id';

export type Rascunho = {
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  pontoId: string | null;
};

//O id e a data são gerados aqui dentro, no storage
type NovaDoacao = Omit<Doacao, 'id' | 'criadoEm'>;

async function lerTodas(): Promise<Doacao[]> {
  try {
    const salvo = await AsyncStorage.getItem(STORAGE_KEY);
    return salvo ? (JSON.parse(salvo) as Doacao[]) : [];
  } catch (e) {
    console.warn('Erro ao carregar doações do AsyncStorage', e);
    return [];
  }
}

//Id sequencial
async function gerarProximoId(): Promise<string> {
  const salvo = await AsyncStorage.getItem(PROXIMO_ID_KEY);
  const atual = salvo ? parseInt(salvo, 10) : 1;
  await AsyncStorage.setItem(PROXIMO_ID_KEY, String(atual + 1));
  return String(atual);
}

export async function listarDoacoes(): Promise<Doacao[]> {
  const todas = await lerTodas();
  return todas.sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );
}

export async function salvarDoacao(dados: NovaDoacao): Promise<Doacao | null> {
  try {
    const todas = await lerTodas();
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

export async function listarDoacoesPorPonto(nomePonto: string): Promise<Doacao[]> {
  const todas = await listarDoacoes();
  return todas.filter((d) => d.pontoDestino === nomePonto);
}

export async function carregarRascunho(): Promise<Rascunho | null> {
  try {
    const salvo = await AsyncStorage.getItem(RASCUNHO_KEY);
    return salvo ? (JSON.parse(salvo) as Rascunho) : null;
  } catch (e) {
    console.warn('Erro ao carregar rascunho', e);
    return null;
  }
}

export async function salvarRascunho(r: Rascunho | null): Promise<void> {
  try {
    if (r === null) await AsyncStorage.removeItem(RASCUNHO_KEY);
    else await AsyncStorage.setItem(RASCUNHO_KEY, JSON.stringify(r));
  } catch (e) {
    console.warn('Erro ao salvar rascunho', e);
  }
}