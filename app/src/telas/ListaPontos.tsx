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
import type { Ponto } from '../tipos/ponto';
import { buscarPagina, consumirAlteracao } from '../services/pontosService';
import { listarFavoritos, alternarFavorito } from '../services/favoritosService';
import { CampoBusca } from '../componentes/CampoBusca';
import { FiltroOpcoes } from '../componentes/FiltroOpcoes';
import { usePaginacao } from '../utilitarios/usePaginacao'; 

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

const opcoesTipo = [
  { rotulo: 'Todos', valor: '' },
  { rotulo: 'Coleta', valor: 'coleta' },
  { rotulo: 'Distribuição', valor: 'distribuição' },
];

// Item da lista: toque no texto abre o detalhe; toque no coração favorita
function PontoItem({
  ponto,
  favorito,
  onPress,
  onFavoritar,
}: {
  ponto: Ponto;
  favorito: boolean;
  onPress: () => void;
  onFavoritar: () => void;
}) {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.itemTexto} onPress={onPress}>
        <Text style={styles.itemNome}>{ponto.nome}</Text>
        <Text style={styles.itemInfo}>
          {ponto.bairro} · {ponto.tipo}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoFavorito}
        onPress={onFavoritar}
        accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Text style={[styles.coracao, favorito && styles.coracaoAtivo]}>
          {favorito ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Menu (botões e filtro de tipo), busca e lista de pontos
function ListaPontos({ navigation }: Props) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // "busca" é o que a pessoa digita; "filtro" é o texto já enviado à API
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(''); // '' = todos, 'coleta' ou 'distribuição'

  const {
    itens: pontos,
    carregando,
    erro,
    carregarMais,
    recarregar,
    tentarNovamente,
  } = usePaginacao<Ponto>(
    (pagina) => buscarPagina(pagina, filtro, 10, tipoFiltro),
    'Não foi possível carregar os pontos. Verifique se a API está ligada.'
  );

  useFocusEffect(
    useCallback(() => {
      if (consumirAlteracao()) recarregar();
      listarFavoritos().then(setFavoritos);
    }, [recarregar])
  );

  // Favorita/desfavorita 
  async function favoritar(id: string) {
    setFavoritos(await alternarFavorito(id));
  }

  // Espera a pessoa parar de digitar por 400 ms antes de buscar (evita uma chamada por letra)
  useEffect(() => {
    const timer = setTimeout(() => setFiltro(busca.trim()), 400);
    return () => clearTimeout(timer);
  }, [busca]);

  // Sempre que o filtro OU o tipo muda (e na primeira abertura), volta para a primeira página
  useEffect(() => {
    recarregar();
  }, [filtro, tipoFiltro, recarregar]);

  // Mensagem de erro quando a API está fora do ar
  const blocoErro = (
    <View style={styles.erroBox}>
      <Text style={styles.erroTexto}>{erro}</Text>
      <TouchableOpacity style={styles.botaoTentar} onPress={tentarNovamente}>
        <Text style={styles.botaoCadastroTexto}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  const menu = (
    <View>
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

      <TouchableOpacity
        style={styles.botaoHistorico}
        onPress={() => navigation.navigate('MinhasDoacoes')}
      >
        <Text style={styles.botaoCadastroTexto}>Minhas Doações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoFavoritos}
        onPress={() => navigation.navigate('MeusPontos')}
      >
        <Text style={styles.botaoCadastroTexto}>♥ Meus Pontos</Text>
      </TouchableOpacity>

      {/* Filtro por tipo usando o componente reutilizável */}
      <View style={styles.espaco}>
        <FiltroOpcoes opcoes={opcoesTipo} valor={tipoFiltro} onChange={setTipoFiltro} />
      </View>

      {/* Campo de busca reutilizável (a API filtra por nome ou bairro) */}
      <View style={styles.espaco}>
        <CampoBusca
          valor={busca}
          onChangeTexto={setBusca}
          placeholder="Buscar ponto por nome ou bairro"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={pontos}
        extraData={favoritos}
        keyExtractor={(ponto) => ponto.id}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            favorito={favoritos.includes(item.id)}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
            onFavoritar={() => favoritar(item.id)}
          />
        )}
        ListHeaderComponent={menu} 
        onEndReached={carregarMais}
        onEndReachedThreshold={1} 
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator style={styles.carregando} />
          ) : erro !== '' ? (
            blocoErro
          ) : (
            <Text style={styles.vazio}>
              {filtro !== '' || tipoFiltro !== ''
                ? 'Nenhum ponto encontrado para este filtro.'
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
  espaco: { marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
    minHeight: 44,
  },
  itemTexto: { flex: 1, paddingVertical: 12, justifyContent: 'center' },
  itemNome: { fontSize: 16, fontWeight: 'bold' },
  itemInfo: { fontSize: 13, color: '#666', marginTop: 2 },
  botaoFavorito: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  coracao: { fontSize: 26, color: '#666' },
  coracaoAtivo: { color: '#c2185b' },
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
    marginBottom: 12,
    minHeight: 44,
  },
  botaoFavoritos: {
    backgroundColor: '#c2185b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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