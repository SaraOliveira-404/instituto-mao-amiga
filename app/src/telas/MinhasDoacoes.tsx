import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Keyboard,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Doacao } from '../tipos/doacao';
import { buscarPagina, consumirAlteracao } from '../services/doacoesService'; 
import { tiposItem } from '../dados/TiposItem';
import { ItemDoacao } from '../componentes/ItemDoacao';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'>;

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// TELA DE HISTÓRICO: doações vindas da API (mais novas primeiro), com filtro por tipo e rolagem infinita
export default function MinhasDoacoes({ navigation, route }: Props) {
  // lista paginada (antes era o array inteiro do AsyncStorage)
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true); // começa true: a primeira página já está a caminho
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // "busca" é o que a pessoa digita; "filtro" é o texto já enviado à API (depois de 400 ms parado)
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const carregandoRef = useRef(false);
  const versaoBusca = useRef(0);
  const filtroAtual = useRef(''); // guarda o filtro atual para recarregar a lista sem perder a busca

  // carrega uma página da API (com o filtro atual); se falhar (API desligada) mostra mensagem
  const carregarPagina = useCallback(async (numero: number, texto: string) => {
    // Página 0 = busca nova: zera a lista e invalida qualquer resposta que ainda esteja a caminho
    if (numero === 0) {
      versaoBusca.current += 1;
      setDoacoes([]);
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
      setDoacoes((anteriores) =>
        numero === 0 ? resposta.content : [...anteriores, ...resposta.content]
      );
      setPaginaAtual(resposta.page.number);
      setTotalPaginas(resposta.page.totalPages);
    } catch {
      if (versao !== versaoBusca.current) return;
      setErro('Não foi possível carregar as doações. Verifique se a API está ligada.');
    } finally {
      if (versao === versaoBusca.current) {
        carregandoRef.current = false;
        setCarregando(false);
      }
    }
  }, []);

  // toda vez que a tela volta a ficar visível, se houve cadastro/edição/exclusão recarrega do topo
  useFocusEffect(
    useCallback(() => {
      if (consumirAlteracao()) carregarPagina(0, filtroAtual.current);
    }, [carregarPagina])
  );

  //espera a pessoa parar de digitar por 400 ms antes de buscar (evita uma chamada por letra)
  useEffect(() => {
    const timer = setTimeout(() => setFiltro(busca.trim()), 400);
    return () => clearTimeout(timer);
  }, [busca]);

  // sempre que o filtro muda (e na primeira abertura), volta para a primeira página
  useEffect(() => {
    filtroAtual.current = filtro;
    carregarPagina(0, filtro);
  }, [filtro, carregarPagina]);

  // ao chegar no fim da lista pede a próxima página (nunca repetida e para na última)
  function carregarMais() {
    if (carregandoRef.current || erro !== '' || paginaAtual + 1 >= totalPaginas) return;
    carregarPagina(paginaAtual + 1, filtro);
  }

  //botão "Tentar novamente": repete a página que falhou
  function tentarNovamente() {
    carregarPagina(doacoes.length === 0 ? 0 : paginaAtual + 1, filtro);
  }

  // Recebe a mensagem de sucesso enviada por outra tela (ex: "Doação excluída com sucesso!")
  useEffect(() => {
    const mensagem = route.params?.mensagem;
    if (!mensagem) return;

    setMensagemSucesso(mensagem);
    navigation.setParams({ mensagem: undefined });
  }, [route.params?.mensagem, navigation]);

  // Mensagem some sozinha depois de 1 segundo
  useEffect(() => {
    if (mensagemSucesso === '') return;

    const timer = setTimeout(() => setMensagemSucesso(''), 1000);
    return () => clearTimeout(timer);
  }, [mensagemSucesso]);

  // Ao tocar num item, abre o detalhe
  const abrirDetalhe = useCallback(
    (doacao: Doacao) => {
      navigation.navigate('DetalheDoacao', { doacao });
    },
    [navigation]
  );

  // Sugestões de tipo para o campo de filtro
  const termo = normalizar(busca.trim());
  const sugestoes = tiposItem.filter((tipo) => normalizar(tipo).includes(termo));

  function selecionarSugestao(tipo: string) {
    setBusca(tipo);
    setMostrarSugestoes(false);
    Keyboard.dismiss();
  }

  //Erro (API desligada) com botão para tentar de novo
  const blocoErro = (
    <View style={styles.vazio}>
      <Text style={styles.erroTexto}>{erro}</Text>
      <TouchableOpacity style={styles.botaoTentar} onPress={tentarNovamente}>
        <Text style={styles.botaoTexto}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {mensagemSucesso !== '' && (
          <Text style={styles.sucesso}>{mensagemSucesso}</Text>
        )}

        {/* Filtro por tipo de item: quem filtra agora é a API */}
        <TextInput
          style={styles.busca}
          placeholder="Filtrar por tipo de item (ex: roupa)"
          value={busca}
          onChangeText={(texto) => {
            setBusca(texto);
            setMostrarSugestoes(true);
          }}
          onFocus={() => setMostrarSugestoes(true)}
          onBlur={() => setMostrarSugestoes(false)}
          autoCorrect={false}
        />

        {mostrarSugestoes && sugestoes.length > 0 && (
          <ScrollView
            style={styles.listaSugestoes}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {sugestoes.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={styles.sugestaoItem}
                onPress={() => selecionarSugestao(tipo)}
              >
                <Text style={styles.sugestaoTexto}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Lista com FlatList; keyExtractor usa o id; onEndReached = rolagem infinita */}
        <FlatList
          data={doacoes}
          keyExtractor={(doacao) => doacao.id}
          renderItem={({ item }) => <ItemDoacao doacao={item} onPress={abrirDetalhe} />}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={doacoes.length === 0 ? styles.vazioContainer : styles.lista}
          //4 estados da primeira página, cada um com a sua mensagem
          ListEmptyComponent={
            carregando ? (
              <ActivityIndicator style={styles.carregando} /> // carregando
            ) : erro !== '' ? (
              blocoErro // erro (API desligada)
            ) : filtro === '' ? (
              // vazio: nenhuma doação cadastrada
              <View style={styles.vazio}>
                <Text style={styles.vazioTexto}>Você ainda não registrou nenhuma doação.</Text>
                <TouchableOpacity
                  style={styles.botao}
                  onPress={() => navigation.navigate('CadastroDoacao')}
                >
                  <Text style={styles.botaoTexto}>+ Cadastrar Doação</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // vazio: o filtro não achou nada
              <View style={styles.vazio}>
                <Text style={styles.vazioTexto}>Nenhuma doação encontrada para "{filtro}".</Text>
              </View>
            )
          }
          ListFooterComponent={
            doacoes.length > 0 ? (
              carregando ? <ActivityIndicator style={styles.carregando} /> : erro !== '' ? blocoErro : undefined
            ) : undefined
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  lista: { padding: 20, paddingTop: 8 },
  vazioContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  vazio: { alignItems: 'center' },
  vazioTexto: { fontSize: 16, color: '#333333', textAlign: 'center', marginBottom: 16 },
  erroTexto: { fontSize: 15, color: '#d32f2f', textAlign: 'center' },
  carregando: { marginVertical: 16 },
  busca: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  listaSugestoes: {
    maxHeight: 180,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    flexGrow: 0,
  },
  sugestaoItem: {
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sugestaoTexto: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  botao: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sucesso: {
    color: '#c41d1d',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});