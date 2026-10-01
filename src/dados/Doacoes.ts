import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao } from '../tipos';

export const STORAGE_KEY = '@mao_amiga:doacoes';
const RASCUNHO_KEY = '@mao_amiga:rascunho_doacao';

export type Rascunho = {
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  pontoId: string | null;
};

export async function carregarDoacoes(): Promise<Doacao[]> {
  try {
    const salvo = await AsyncStorage.getItem(STORAGE_KEY);
    return salvo ? (JSON.parse(salvo) as Doacao[]) : [];
  } catch (e) {
    console.warn('Erro ao carregar doações do AsyncStorage', e);
    return [];
  }
}

export async function salvarDoacoes(doacoes: Doacao[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoes));
  } catch (e) {
    console.warn('Erro ao salvar doações no AsyncStorage', e);
  }
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