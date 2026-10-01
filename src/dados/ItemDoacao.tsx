import { View, Text, StyleSheet } from 'react-native';
import type { Doacao } from '../tipos';

export function ItemDoacao({ doacao }: { doacao: Doacao }) {
  return (
    <View style={styles.item}>
      <Text style={styles.texto}>
        {doacao.tipoItem} — {doacao.quantidade} — {doacao.pontoDestino}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginBottom: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  texto: { fontSize: 14 },
});