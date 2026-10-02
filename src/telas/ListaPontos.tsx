import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Ponto, Doacao } from '../tipos';
import { pontosMock } from '../dados/Pontos';
import { listarDoacoes } from '../dados/Doacoes';
import { ResumoDoacoes } from '../componentes/ResumoDoacoes';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

// Item da lista: toque abre o detalhe do ponto
function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemNome}>{ponto.nome}</Text>
    </TouchableOpacity>
  );
}

// TELA INICIAL: botões de atalho, resumo geral e lista de pontos
function ListaPontos({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]); // alimenta o resmumo geral

  //Roda toda vez que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then(setDoacoes);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <TouchableOpacity
        style={styles.botaoCadastro}
        onPress={() => navigation.navigate('CadastroDoacao')}
      >
        <Text style={styles.botaoCadastroTexto}>+ Cadastrar Doação</Text>
      </TouchableOpacity>

      {/* Tela de histórico */}
      <TouchableOpacity
        style={styles.botaoHistorico}
        onPress={() => navigation.navigate('MinhasDoacoes')}
      >
        <Text style={styles.botaoCadastroTexto}>Minhas Doações</Text>
      </TouchableOpacity>

      <FlatList
        data={pontosMock}
        keyExtractor={(ponto) => ponto.id}
        // Resumo geral no topo da lista (rola junto com os pontos)
        ListHeaderComponent={<ResumoDoacoes doacoes={doacoes} />}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

export default ListaPontos;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
    minHeight: 44, 
    justifyContent: 'center',
  },
  itemNome: { fontSize: 16, fontWeight: 'bold' },
  botaoCadastro: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44, 
  },

  botaoHistorico: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 44, 
  },
  botaoCadastroTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});