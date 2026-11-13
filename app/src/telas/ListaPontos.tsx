import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Ponto } from '../tipos/ponto';
import type { Doacao } from '../tipos/doacao';
import { buscarPagina, consumirAlteracao } from '../services/pontosService';
import { listarDoacoes } from '../services/doacaoStorage';
import { ResumoDoacoes } from '../componentes/ResumoDoacoes';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

// Item da lista: toque abre o detalhe do ponto
function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemNome}>{ponto.nome}</Text>
      <Text style={styles.itemInfo}>
        {ponto.bairro} · {ponto.tipo}
      </Text>
    </TouchableOpacity>
  );
}

// Botões de atalho, busca, resumo geral e lista de pontos
function ListaPontos({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]); // alimenta o resumo geral

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  //"busca" é o que a pessoa digita; "filtro" é o texto já enviado à API (depois de 400 ms parado)
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');

  const carregandoRef = useRef(false);
  const versaoBusca = useRef(0);
  const filtroAtual = useRef(''); // guarda o filtro atual para recarregar a lista sem perder a busca

  //Carrega uma página da API (com o filtro atual); se falhar (API desligada) mostra mensagem
  const carregarPagina = useCallback(async (numero: number, texto: string) => {
    // Página 0 = busca nova: zera a lista e invalida qualquer resposta que ainda esteja a caminho
    if (numero === 0) {
      versaoBusca.current += 1;
      setPontos([]);
      setPaginaAtual(0);
      setTotalPaginas(0);
    }
    const versao = versaoBusca.current;

    carregandoRef.current = true;
    setCarregando(true);
    setErro('');
    try {
      const resposta = await buscarPagina(numero, texto);
      if (versao !== versaoBusca.current) return; // resposta de uma busca antiga: ignora
      setPontos((anteriores) =>
        numero === 0 ? resposta.content : [...anteriores, ...resposta.content]
      );
      setPaginaAtual(resposta.page.number);
      setTotalPaginas(resposta.page.totalPages);
    } catch {
      if (versao !== versaoBusca.current) return;
      setErro('Não foi possível carregar os pontos. Verifique se a API está ligada.');
    } finally {
      if (versao === versaoBusca.current) {
        carregandoRef.current = false;
        setCarregando(false);
      }
    }
  }, []);

  //Roda toda vez que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then(setDoacoes);
      if (consumirAlteracao()) carregarPagina(0, filtroAtual.current);
    }, [carregarPagina])
  );

  //Espera a pessoa parar de digitar por 400 ms antes de buscar (evita uma chamada por letra)
  useEffect(() => {
    const timer = setTimeout(() => setFiltro(busca.trim()), 400);
    return () => clearTimeout(timer);
  }, [busca]);

  //Sempre que o filtro muda (e na primeira abertura), volta para a primeira página
  useEffect(() => {
    filtroAtual.current = filtro;
    carregarPagina(0, filtro);
  }, [filtro, carregarPagina]);

  //Ao chegar no fim da lista, pede a próxima página (nunca repetida e para na última)
  function carregarMais() {
    if (carregandoRef.current || erro !== '' || paginaAtual + 1 >= totalPaginas) return;
    carregarPagina(paginaAtual + 1, filtro);
  }

  //Botão "Tentar novamente" do erro: repete a página que falhou
  function tentarNovamente() {
    carregarPagina(pontos.length === 0 ? 0 : paginaAtual + 1, filtro);
  }

  //Mensagem de erro quando a API está fora do ar
  const blocoErro = (
    <View style={styles.erroBox}>
      <Text style={styles.erroTexto}>{erro}</Text>
      <TouchableOpacity style={styles.botaoTentar} onPress={tentarNovamente}>
        <Text style={styles.botaoCadastroTexto}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* (N2-4): abre o formulário de ponto vazio (modo cadastro) */}
      <TouchableOpacity
        style={styles.botaoPonto}
        onPress={() => navigation.navigate('CadastroPonto')}
      >
        <Text style={styles.botaoCadastroTexto}>+ Cadastrar Ponto</Text>
      </TouchableOpacity>

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

      {/* Campo de busca (filtra pela API por nome ou bairro) */}
      <TextInput
        style={styles.busca}
        placeholder="Buscar ponto por nome ou bairro"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

      <FlatList
        data={pontos}
        keyExtractor={(ponto) => ponto.id}
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
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator style={styles.carregando} />
          ) : erro !== '' ? (
            blocoErro
          ) : (
            <Text style={styles.vazio}>
              {filtro !== ''
                ? `Nenhum ponto encontrado para "${filtro}".`
                : 'Nenhum ponto cadastrado.'}
            </Text>
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
  itemInfo: { fontSize: 13, color: '#666', marginTop: 2 },
  busca: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  botaoPonto: {
    backgroundColor: '#00796b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
  },
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
  botaoTentar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  botaoCadastroTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  carregando: { marginVertical: 16 },
  vazio: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  erroBox: { alignItems: 'center', marginVertical: 8 },
  erroTexto: { fontSize: 15, color: '#d32f2f', textAlign: 'center' },
});