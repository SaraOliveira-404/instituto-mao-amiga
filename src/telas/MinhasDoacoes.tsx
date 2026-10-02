import { useCallback, useEffect, useState } from 'react'; 
import { Text, TouchableOpacity, FlatList, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Doacao } from '../tipos';
import { listarDoacoes } from '../dados/Doacoes';
import { ItemDoacao } from '../componentes/ItemDoacao';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasDoacoes'>;

export default function MinhasDoacoes({ navigation, route }: Props) { 
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Roda toda vez que a tela volta a ficar visível. Por isso uma doação nova aparece (e uma excluída some) sem fechar o app.
  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then((lista) => {
        setDoacoes(lista);
        setCarregando(false);
      });
    }, [])
  );


  useEffect(() => {
    const mensagem = route.params?.mensagem;
    if (!mensagem) return;

    setMensagemSucesso(mensagem);
    navigation.setParams({ mensagem: undefined });
  }, [route.params?.mensagem, navigation]);

  //Mensagem some sozinha depois de 1 segundos
  useEffect(() => {
    if (mensagemSucesso === '') return;

    const timer = setTimeout(() => setMensagemSucesso(''), 1000);
    return () => clearTimeout(timer);
  }, [mensagemSucesso]);

  // Abre o detalhe da doação tocada. Usa useCallback para a função não ser recriada a cada render (assim o React.memo do item continua funcionando)
  const abrirDetalhe = useCallback(
    (doacao: Doacao) => {
      navigation.navigate('DetalheDoacao', { doacao });
    },
    [navigation]
  );

  // Enquanto carrega, não mostra nada (evita piscar a mensagem de "vazio")
  if (carregando) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {mensagemSucesso !== '' && (
        <Text style={styles.sucesso}>{mensagemSucesso}</Text>
      )}

      <FlatList
        data={doacoes}
        keyExtractor={(doacao) => doacao.id}
        renderItem={({ item }) => <ItemDoacao doacao={item} onPress={abrirDetalhe} />}
        contentContainerStyle={doacoes.length === 0 ? styles.vazioContainer : styles.lista}
        // Estado vazio: mensagem + botão que leva ao cadastro
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
  sucesso: {
    color: '#c41d1d',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});