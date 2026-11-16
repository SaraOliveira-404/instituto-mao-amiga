import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import { excluir } from '../services/doacoesService'; 
import { formatarData } from '../utilitarios/formatarData';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function DetalheDoacao({ route, navigation }: Props) {
  const { doacao } = route.params;
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    const mensagem = route.params.mensagem;
    if (!mensagem) return;

    setMensagemSucesso(mensagem);
    navigation.setParams({ mensagem: undefined });
  }, [route.params.mensagem, navigation]);

  // Mensagem some sozinha depois de 1 segundo
  useEffect(() => {
    if (mensagemSucesso === '') return;

    const timer = setTimeout(() => setMensagemSucesso(''), 1000);
    return () => clearTimeout(timer);
  }, [mensagemSucesso]);

  // Pede confirmação (Alert) antes de apagar
  function confirmarExclusao() {
    Alert.alert(
      'Excluir doação',
      'Tem certeza que deseja excluir esta doação? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            // apaga na API (DELETE). Se falhar, continua na tela e avisa (não finge que deu certo)
            try {
              await excluir(doacao.id);
              // Volta ao histórico enviando a mensagem de sucesso
              navigation.popTo('MinhasDoacoes', {
                mensagem: 'Doação excluída com sucesso!',
              });
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível excluir a doação. Verifique se a API está ligada e tente novamente.'
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
        {mensagemSucesso !== '' && (
          <Text style={styles.sucesso}>{mensagemSucesso}</Text>
        )}

        <Text style={styles.titulo}>{doacao.tipoItem}</Text>

        {/* Todos os campos da doação */}
        <Text style={styles.rotulo}>ID</Text>
        <Text style={styles.valor} selectable>{doacao.id}</Text>

        <Text style={styles.rotulo}>Tipo do item</Text>
        <Text style={styles.valor}>{doacao.tipoItem}</Text>

        <Text style={styles.rotulo}>Quantidade</Text>
        <Text style={styles.valor}>{doacao.quantidade}</Text>

        <Text style={styles.rotulo}>Descrição</Text>
        <Text style={styles.valor}>{doacao.descricao}</Text>

        <Text style={styles.rotulo}>Ponto de destino</Text>
        <Text style={styles.valor}>{doacao.pontoDestino}</Text>

        <Text style={styles.rotulo}>Registrada em</Text>
        <Text style={styles.valor}>{formatarData(doacao.criadoEm)}</Text>

        {/* Abre o MESMO formulário do cadastro, já preenchido com esta doação */}
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('CadastroDoacao', { doacao })}
        >
          <Text style={styles.botaoTexto}>Editar doação</Text>
        </TouchableOpacity>

        {/* Botão de excluir (pede confirmação antes) */}
        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
          <Text style={styles.botaoTexto}>Excluir doação</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  rotulo: { fontSize: 13, fontWeight: '600', color: '#666666', marginTop: 12 },
  valor: { fontSize: 16, color: '#333333', marginTop: 2 },
  botaoEditar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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
  sucesso: {
    color: '#2e7d32',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
});