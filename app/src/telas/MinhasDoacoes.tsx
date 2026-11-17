import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Doacao } from '../tipos/doacao';
import type { Ponto } from '../tipos/ponto';
import { buscarPagina, consumirAlteracao } from '../services/doacoesService';
import { listar as listarTodosPontos } from '../services/pontosService';
import { tiposItem } from '../dados/tiposItem';
import { ItemDoacao } from '../componentes/ItemDoacao';
import { CampoBusca } from '../componentes/CampoBusca';
import { FiltroOpcoes } from '../componentes/FiltroOpcoes';
import { usePaginacao } from '../utilitarios/usePaginacao'; 

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'>;

const opcoesTipoItem = [
  { rotulo: 'Todos', valor: '' },
  ...tiposItem.map((t) => ({ rotulo: t, valor: t })),
];

// TELA DE HISTÓRICO: doações da API (mais novas primeiro), com filtro por tipo e por ponto
export default function MinhasDoacoes({ navigation, route }: Props) {
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [tipoFiltro, setTipoFiltro] = useState('');
  const [pontoFiltro, setPontoFiltro] = useState(''); 
  const [textoPonto, setTextoPonto] = useState(''); 

  const [pontos, setPontos] = useState<Ponto[]>([]);

  const {
    itens: doacoes,
    carregando,
    erro,
    carregarMais,
    recarregar,
    tentarNovamente,
  } = usePaginacao<Doacao>(
    (pagina) => buscarPagina(pagina, tipoFiltro, 10, pontoFiltro),
    'Não foi possível carregar as doações. Verifique se a API está ligada.'
  );

  useFocusEffect(
    useCallback(() => {
      if (consumirAlteracao()) recarregar();
    }, [recarregar])
  );

  useEffect(() => {
    listarTodosPontos().then(setPontos).catch(() => setPontos([]));
  }, []);

  // Sempre que o tipo OU o ponto muda (e na primeira abertura), volta para a primeira página
  useEffect(() => {
    recarregar();
  }, [tipoFiltro, pontoFiltro, recarregar]);

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
      navigation.navigate('DetalheDoacao', { doacaoId: doacao.id });
    },
    [navigation]
  );

  const semFiltro = tipoFiltro === '' && pontoFiltro === '';

  // Erro (API desligada) com botão para tentar de novo
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
      {mensagemSucesso !== '' && <Text style={styles.sucesso}>{mensagemSucesso}</Text>}

      <View style={styles.filtros}>
        <Text style={styles.rotuloFiltro}>Tipo de item</Text>
        <FiltroOpcoes opcoes={opcoesTipoItem} valor={tipoFiltro} onChange={setTipoFiltro} />

        <Text style={styles.rotuloFiltro}>Ponto de destino</Text>
        <CampoBusca
          valor={textoPonto}
          placeholder="Buscar ponto por nome ou bairro"
          opcoes={pontos.map((p) => ({ id: p.id, titulo: p.nome, subtitulo: p.bairro }))}
          onChangeTexto={(t) => {
            setTextoPonto(t);
            if (pontoFiltro !== '') setPontoFiltro(''); 
          }}
          onEscolher={(o) => {
            setTextoPonto(o.titulo); 
            setPontoFiltro(o.titulo);
          }}
        />
      </View>

      {/* Lista com FlatList; keyExtractor usa o id; onEndReached = rolagem infinita */}
      <FlatList
        data={doacoes}
        keyExtractor={(doacao) => doacao.id}
        renderItem={({ item }) => <ItemDoacao doacao={item} onPress={abrirDetalhe} />}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={doacoes.length === 0 ? styles.vazioContainer : styles.lista}
        // 4 estados da primeira página, cada um com a sua mensagem
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator style={styles.carregando} />
          ) : erro !== '' ? (
            blocoErro
          ) : semFiltro ? (
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
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>Nenhuma doação encontrada para este filtro.</Text>
            </View>
          )
        }
        ListFooterComponent={
          doacoes.length > 0 ? (
            carregando ? <ActivityIndicator style={styles.carregando} /> : erro !== '' ? blocoErro : undefined
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filtros: { paddingHorizontal: 20, paddingTop: 8 },
  rotuloFiltro: { fontSize: 13, fontWeight: '600', color: '#666666', marginTop: 8, marginBottom: 4 },
  lista: { padding: 20, paddingTop: 12 },
  vazioContainer: { padding: 20, paddingTop: 12 },
  vazio: { alignItems: 'center' },
  vazioTexto: { fontSize: 16, color: '#333333', textAlign: 'center', marginBottom: 16 },
  erroTexto: { fontSize: 15, color: '#d32f2f', textAlign: 'center' },
  carregando: { marginVertical: 16 },
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
    color: '#2e7d32',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});