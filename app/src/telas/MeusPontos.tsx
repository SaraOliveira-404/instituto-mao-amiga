import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Ponto } from '../tipos/ponto';
import { buscarPorId } from '../services/pontosService';
import {
  listarFavoritos,
  removerFavorito,
  salvarFavoritos,
} from '../services/favoritosService';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;

export default function MeusPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const ids = await listarFavoritos();
      const resultados = await Promise.all(ids.map((id) => buscarPorId(id)));
      const encontrados = resultados.filter((p): p is Ponto => p !== null);
      setPontos(encontrados);

      // Limpa do aparelho os ids que não existem mais na API
      if (encontrados.length !== ids.length) {
        await salvarFavoritos(encontrados.map((p) => p.id));
      }
    } catch {
      setErro('Não foi possível carregar os favoritos. Verifique se a API está ligada.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega sempre que a tela fica visível
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // Desmarcar: tira da tela na hora e depois atualiza o AsyncStorage
  function desmarcar(id: string) {
    setPontos((atuais) => atuais.filter((p) => p.id !== id));
    removerFavorito(id);
  }

  if (carregando) return <ActivityIndicator style={styles.centro} />;

  if (erro !== '') {
    return (
      <View style={styles.vazio}>
        <Text style={styles.erroTexto}>{erro}</Text>
        <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={pontos}
        keyExtractor={(ponto) => ponto.id}
        contentContainerStyle={pontos.length === 0 ? styles.vazioContainer : undefined}
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>
            Você ainda não favoritou nenhum ponto. Toque no ♡ na lista para favoritar.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemTexto}
              onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
            >
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemInfo}>
                {item.bairro} · {item.tipo}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoFavorito}
              onPress={() => desmarcar(item.id)}
              accessibilityLabel="Remover dos favoritos"
            >
              <Text style={styles.coracao}>♥</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centro: { marginTop: 32 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
    minHeight: 44,
  },
  itemTexto: { flex: 1, paddingVertical: 12 },
  itemNome: { fontSize: 16, fontWeight: 'bold' },
  itemInfo: { fontSize: 13, color: '#666', marginTop: 2 },
  botaoFavorito: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  coracao: { fontSize: 26, color: '#c2185b' },
  vazioContainer: { flexGrow: 1, justifyContent: 'center' },
  vazioTexto: { fontSize: 16, color: '#333333', textAlign: 'center', padding: 20 },
  vazio: { alignItems: 'center', padding: 20, marginTop: 32 },
  erroTexto: { fontSize: 15, color: '#d32f2f', textAlign: 'center' },
  botaoTentar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});