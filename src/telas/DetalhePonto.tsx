import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Ponto, Doacao } from '../tipos';
import { pontosMock } from '../dados/Pontos';
import { listarDoacoesPorPonto } from '../dados/Doacoes';
import { ItemDoacao } from '../componentes/ItemDoacao';
import { ResumoDoacoes } from '../componentes/ResumoDoacoes';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

// Mostra os dados do ponto, o resumo e as doações recentes destinadas a ele
function PontoDetalhe({ ponto }: { ponto: Ponto }) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);

  useEffect(() => {
    listarDoacoesPorPonto(ponto.nome).then(setDoacoes);
  }, [ponto.nome]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.campo}>Endereço: {ponto.endereco}</Text>
        <Text style={styles.campo}>Horário: {ponto.horario}</Text>
        <Text style={styles.campo}>{ponto.recebeOuDistribui}</Text>

        <View style={styles.secaoResumo}>
          <ResumoDoacoes doacoes={doacoes} titulo="Resumo deste ponto" />
        </View>

        <View style={styles.secaoDoacoes}>
          <Text style={styles.secaoTitulo}>Doações deste ponto</Text>

          {doacoes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma doação registrada ainda.</Text>
          ) : (
            doacoes.map((d) => <ItemDoacao key={d.id} doacao={d} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12 },
  campo: { fontSize: 16, marginTop: 6, color: '#333333' },
  secaoResumo: { marginTop: 24 },
  secaoDoacoes: { marginTop: 8 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 8 },
  vazio: { fontSize: 14, color: '#666' },
});