import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  recebeOuDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Central - Mercado São José',
    endereco: 'Rua 15, nº 320, Setor Central',
    horario: 'Seg a Sex, 8h às 17h',
    recebeOuDistribui: 'Recebe doações de alimentos não perecíveis',
  },
  {
    id: '2',
    nome: 'Feira da Vila Nova',
    endereco: 'Av. Anhanguera, esquina com Rua T-30',
    horario: 'Sáb, 6h às 12h',
    recebeOuDistribui: 'Recebe frutas e verduras excedentes da feira',
  },
  {
    id: '3',
    nome: 'Centro Comunitário Jardim das Flores',
    endereco: 'Rua das Acácias, nº 145, Jardim das Flores',
    horario: 'Ter e Qui, 13h às 18h',
    recebeOuDistribui: 'Distribui roupas e alimentos para famílias cadastradas',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemNome}>{ponto.nome}</Text>
    </TouchableOpacity>
  );
}

function ListaPontos({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pontos de Coleta e Distribuição</Text>
      {pontosMock.map((ponto) => (
        <PontoItem
          key={ponto.id}
          ponto={ponto}
          onPress={() => navigation.navigate('DetalhePonto', { pontoId: ponto.id })}
        />
      ))}
    </View>
  );
}

export default ListaPontos;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1B3A5C' },
  item: { padding: 12, marginBottom: 8, backgroundColor: '#F0F0F0' },
  itemNome: { fontSize: 16, fontWeight: 'bold' },
});