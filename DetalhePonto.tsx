import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { pontosMock, Ponto } from './ListaPontos';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

function PontoDetalhe({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.campo}>Endereço: {ponto.endereco}</Text>
      <Text style={styles.campo}>Horário: {ponto.horario}</Text>
      <Text style={styles.campo}>{ponto.recebeOuDistribui}</Text>
    </View>
  );
}

function DetalhePonto({ route }: Props) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) return null;

  return <PontoDetalhe ponto={ponto} />;
}

export default DetalhePonto;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12 },
  campo: { fontSize: 16, marginTop: 6, color: '#333333' },
});