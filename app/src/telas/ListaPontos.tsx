import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, FlatList, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Ponto } from '../tipos/ponto';
import type { Doacao } from '../tipos/doacao';
import { listarPontos } from '../services/pontoService'; //NOVO: pontos vêm da API (o array fixo saiu)
import { listarDoacoes } from '../services/doacaoStorage';
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
  const [doacoes, setDoacoes] = useState<Doacao[]>([]); // alimenta o resumo geral

  //NOVO: estado da lista vinda da API (paginada)
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  //Roda toda vez que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then(setDoacoes);
    }, [])
  );

  //NOVO: carrega uma página da API; se falhar (API desligada) mostra mensagem em vez de travar
  const carregarPagina = useCallback(async (numero: number) => {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await listarPontos(numero);
      setPontos((anteriores) =>
        numero === 0 ? resposta.content : [...anteriores, ...resposta.content]
      );
      setPaginaAtual(resposta.page.number);
      setTotalPaginas(resposta.page.totalPages);
    } catch {
      setErro('Não foi possível carregar os pontos. Verifique se a API está ligada.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPagina(0);
  }, [carregarPagina]);

  //NOVO: ao chegar no fim da lista, pede a próxima página
  function carregarMais() {
    if (carregando || erro !== '' || paginaAtual + 1 >= totalPaginas) return;
    carregarPagina(paginaAtual + 1);
  }

  //NOVO: mensagem de erro quando a API está fora do ar
  const blocoErro = (
    <View style={styles.erroBox}>
      <Text style={styles.erroTexto}>{erro}</Text>
    </View>
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
        data={pontos}
        keyExtractor={(ponto) => String(ponto.id)}
        // Resumo geral no topo da lista (rola junto com os pontos)
        ListHeaderComponent={<ResumoDoacoes doacoes={doacoes} />}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
          />
        )}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator style={styles.carregando} />
          ) : erro !== '' ? (
            blocoErro
          ) : (
            <Text style={styles.vazio}>Nenhum ponto cadastrado.</Text>
          )
        }
        ListFooterComponent={
          pontos.length > 0 ? (
            carregando ? <ActivityIndicator style={styles.carregando} /> : erro !== '' ? blocoErro : undefined
          ) : undefined
        }
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
  carregando: { marginVertical: 16 },
  vazio: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  erroBox: { alignItems: 'center', marginVertical: 8 },
  erroTexto: { fontSize: 15, color: '#d32f2f', textAlign: 'center' },
});
