import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, FlatList, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Doacao } from '../tipos';
import { listarDoacoes } from '../dados/Doacoes';
import { ItemDoacao } from '../componentes/ItemDoacao';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'>;

export default function MinhasDoacoes({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then((lista) => {
        setDoacoes(lista);
        setCarregando(false);
      });
    }, [])
  );

  if (carregando) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={doacoes}
        keyExtractor={(doacao) => doacao.id} 
        renderItem={({ item }) => <ItemDoacao doacao={item} />}
        contentContainerStyle={doacoes.length === 0 ? styles.vazioContainer : styles.lista}
        
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>Você ainda não registrou nenhuma doação.</Text>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate('CadastroDoacao')}
            >
              <Text style={styles.botaoTexto}>+ Cadastrar Doação</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  lista: { padding: 20 },
  vazioContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  vazio: { alignItems: 'center' },
  vazioTexto: { fontSize: 16, color: '#333333', textAlign: 'center', marginBottom: 16 },
  botao: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});