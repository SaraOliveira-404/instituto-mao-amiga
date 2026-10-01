import { memo } from 'react'; //NOVO: memo evita redesenhar o item quando nada nele mudou
import { View, Text, StyleSheet } from 'react-native';
import type { Doacao } from '../tipos';

function formatarData(iso: string): string {
  const data = new Date(iso);
  if (isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <Text style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}: </Text>
      {valor}
    </Text>
  );
}

export const ItemDoacao = memo(function ItemDoacao({ doacao }: { doacao: Doacao }) {
  return (
    <View style={styles.item}>
      <Text style={styles.titulo}>{doacao.tipoItem}</Text>

      <Linha rotulo="Quantidade" valor={doacao.quantidade} />
      <Linha rotulo="Destino" valor={doacao.pontoDestino} />
      <Linha rotulo="Registrada em" valor={formatarData(doacao.criadoEm)} />

      <Text style={styles.id} selectable>
        ID: {doacao.id}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 4 },
  linha: { fontSize: 14, color: '#333333', marginTop: 2 },
  rotulo: { fontWeight: '600' },
  id: { fontSize: 12, color: '#666666', marginTop: 6 },
});