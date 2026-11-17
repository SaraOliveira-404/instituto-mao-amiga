import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'favoritos_pontos';

export async function listarFavoritos(): Promise<string[]> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    if (!texto) return [];
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function salvarFavoritos(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ids));
}

export async function alternarFavorito(id: string): Promise<string[]> {
  const atuais = await listarFavoritos();
  const novos = atuais.includes(id) ? atuais.filter((f) => f !== id) : [...atuais, id];
  await salvarFavoritos(novos);
  return novos;
}

export async function removerFavorito(id: string): Promise<string[]> {
  const novos = (await listarFavoritos()).filter((f) => f !== id);
  await salvarFavoritos(novos);
  return novos;
}