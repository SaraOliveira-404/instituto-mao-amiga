import { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native'; 
import type { Doacao } from '../tipos';
import { formatarData } from '../utilitarios/formatarData'; 

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <Text style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}: </Text>
      {valor}
    </Text>
  );
}

type Props = {
  doacao: Doacao;
  onPress?: (doacao: Doacao) => void;
};

export const ItemDoacao = memo(function ItemDoacao({ doacao, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.item}
      disabled={!onPress}
      onPress={() => onPress?.(doacao)}
    >
      <Text style={styles.titulo}>{doacao.tipoItem}</Text>

      <Linha rotulo="Quantidade" valor={doacao.quantidade} />
      <Linha rotulo="Destino" valor={doacao.pontoDestino} />
      <Linha rotulo="Registrada em" valor={formatarData(doacao.criadoEm)} />

      <Text style={styles.id}>ID: {doacao.id}</Text>
    </TouchableOpacity>
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