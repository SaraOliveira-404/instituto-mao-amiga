import { useCallback, useEffect, useState } from 'react';
import {
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
import type { RootStackParamList, Doacao } from '../tipos';
import { listarDoacoes } from '../dados/Doacoes';
import { tiposItem } from '../dados/TiposItem';
import { ItemDoacao } from '../componentes/ItemDoacao';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'>;

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase();
}

// Issue #09: TELA DE HISTÓRICO (lista todas as doações salvas, com filtro por tipo)
export default function MinhasDoacoes({ navigation, route }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]); 
  const [carregando, setCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [busca, setBusca] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then((lista) => {
        setDoacoes(lista);
        setCarregando(false);
      });
    }, [])
  );

  // Recebe a mensagem de sucesso enviada por outra tela (ex: "Doação nº 3 excluída")
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

  // Issue #10: ao tocar num item, abre o detalhe 
  const abrirDetalhe = useCallback(
    (doacao: Doacao) => {
      navigation.navigate('DetalheDoacao', { doacao });
    },
    [navigation]
  );

  if (carregando) return null;

  // Issue #12: a lista filtrada
  const termo = normalizar(busca.trim());
  const doacoesFiltradas =
    termo === ''
      ? doacoes 
      : doacoes.filter((d) => normalizar(d.tipoItem).includes(termo));

  const sugestoes = tiposItem.filter((tipo) => normalizar(tipo).includes(termo));

  function selecionarSugestao(tipo: string) {
    setBusca(tipo);
    setMostrarSugestoes(false);
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {mensagemSucesso !== '' && (
          <Text style={styles.sucesso}>{mensagemSucesso}</Text>
        )}

        {doacoes.length > 0 && (
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
        )}

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

        {/* Issue #09: lista com FlatList; keyExtractor usa o id da doação */}
        <FlatList
          data={doacoesFiltradas}
          keyExtractor={(doacao) => doacao.id}
          renderItem={({ item }) => <ItemDoacao doacao={item} onPress={abrirDetalhe} />}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            doacoesFiltradas.length === 0 ? styles.vazioContainer : styles.lista
          }
          ListEmptyComponent={
            doacoes.length === 0 ? (
            
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
                <Text style={styles.vazioTexto}>
                  Nenhuma doação encontrada para "{busca.trim()}".
                </Text>
              </View>
            )
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