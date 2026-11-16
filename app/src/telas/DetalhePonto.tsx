import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { Ponto } from '../tipos/ponto';
import { buscarPorId, excluir } from '../services/pontosService';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

// Mostra os dados do ponto, com os botões de editar e excluir
function PontoDetalhe({ ponto, navigation }: { ponto: Ponto; navigation: Props['navigation'] }) {
  // pede confirmação (Cancelar / Excluir) e só então envia o DELETE
  function confirmarExclusao() {
    Alert.alert(
      'Excluir ponto',
      `Tem certeza que deseja excluir "${ponto.nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluir(ponto.id);
              navigation.goBack(); // a lista recarrega sozinha e o ponto some
            } catch {
              // Não finge que deu certo: continua na tela e avisa
              Alert.alert(
                'Erro',
                'Não foi possível excluir o ponto. Verifique se a API está ligada e tente novamente.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.campo}>Endereço: {ponto.endereco}</Text>
        <Text style={styles.campo}>Bairro: {ponto.bairro}</Text>
        <Text style={styles.campo}>Horário: {ponto.horario}</Text>
        <Text style={styles.campo}>Tipo: {ponto.tipo}</Text>

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('CadastroPonto', { ponto })}
        >
          <Text style={styles.botaoTexto}>Editar ponto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
          <Text style={styles.botaoTexto}>Excluir ponto</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

//Os 4 estados possíveis da busca na API
type Estado = 'carregando' | 'ok' | 'naoEncontrado' | 'erro';

function DetalhePonto({ route, navigation }: Props) {
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [estado, setEstado] = useState<Estado>('carregando');

  //busca o ponto por id na API (404 => "ponto não encontrado")
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      buscarPorId(pontoId)
        .then((encontrado) => {
          if (!ativo) return;
          if (encontrado === null) {
            setEstado('naoEncontrado');
          } else {
            setPonto(encontrado);
            setEstado('ok');
          }
        })
        .catch(() => {
          if (ativo) setEstado('erro');
        });

      return () => {
        ativo = false;
      };
    }, [pontoId])
  );

  if (estado === 'carregando') return <ActivityIndicator style={styles.centro} />;
  if (estado === 'naoEncontrado') return <Text style={styles.mensagem}>Ponto não encontrado.</Text>;
  if (estado === 'erro' || ponto === null) {
    return (
      <Text style={styles.mensagemErro}>
        Não foi possível carregar o ponto. Verifique se a API está ligada.
      </Text>
    );
  }

  return <PontoDetalhe ponto={ponto} navigation={navigation} />;
}

export default DetalhePonto;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12 },
  campo: { fontSize: 16, marginTop: 6, color: '#333333' },
  botaoEditar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 44,
  },
  botaoExcluir: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 44,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centro: { marginTop: 32 },
  mensagem: { fontSize: 16, color: '#333333', textAlign: 'center', marginTop: 32, padding: 20 },
  mensagemErro: { fontSize: 16, color: '#d32f2f', textAlign: 'center', marginTop: 32, padding: 20 },
});