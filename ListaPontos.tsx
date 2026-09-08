import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
    endereco: 'Rua 15, nº 320, Setor Central, Goiânia - GO',
    horario: 'Seg a Sex, 8h às 17h',
    recebeOuDistribui: 'Recebe doações de alimentos não perecíveis',
  },
  {
    id: '2',
    nome: 'Feira da Vila Nova',
    endereco: 'Av. Anhanguera, esquina com Rua T-30, Vila Nova, Goiânia - GO',
    horario: 'Sáb, 6h às 12h',
    recebeOuDistribui: 'Recebe frutas e verduras excedentes da feira',
  },
  {
    id: '3',
    nome: 'Centro Comunitário Jardim das Flores',
    endereco: 'Rua das Acácias, nº 145, Jardim das Flores, Goiânia - GO',
    horario: 'Ter e Qui, 13h às 18h',
    recebeOuDistribui: 'Distribui roupas e alimentos para famílias cadastradas',
  },
  {
    id: '4',
    nome: 'Paróquia São Francisco de Assis',
    endereco: 'Praça São Francisco, nº 88, Setor Sul, Goiânia - GO',
    horario: 'Dom, 9h às 13h',
    recebeOuDistribui: 'Recebe agasalhos e cobertores para o inverno',
  },
  {
    id: '5',
    nome: 'Escola Municipal Monteiro Lobato',
    endereco: 'Rua 44, nº 210, Setor Bueno, Goiânia - GO',
    horario: 'Seg a Sex, 7h às 12h',
    recebeOuDistribui: 'Recebe material escolar e livros usados',
  },
  {
    id: '6',
    nome: 'Associação de Moradores do Bairro Novo Mundo',
    endereco: 'Av. Perimetral Norte, nº 1500, Novo Mundo, Goiânia - GO',
    horario: 'Qua e Sex, 14h às 19h',
    recebeOuDistribui: 'Distribui cestas básicas para famílias cadastradas',
  },
  {
    id: '7',
    nome: 'Posto de Saúde Jardim Curitiba',
    endereco: 'Rua J-15, nº 60, Jardim Curitiba, Goiânia - GO',
    horario: 'Seg a Sex, 8h às 16h',
    recebeOuDistribui: 'Recebe fraldas geriátricas e produtos de higiene',
  },
  {
    id: '8',
    nome: 'Biblioteca Comunitária Vila Boa',
    endereco: 'Rua 5, nº 320, Vila Boa, Goiânia - GO',
    horario: 'Ter a Sáb, 9h às 17h',
    recebeOuDistribui: 'Distribui livros infantis e brinquedos educativos',
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
      <TouchableOpacity
        style={styles.botaoCadastro}
        onPress={() => navigation.navigate('CadastroDoacao')}
      >
        <Text style={styles.botaoCadastroTexto}>+ Cadastrar Doação</Text>
      </TouchableOpacity>
      <FlatList
        data={pontosMock}
        keyExtractor={(ponto) => ponto.id}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
          />
        )}
      />
    </View>
  );
}

export default ListaPontos;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1B3A5C' },
  item: { padding: 12, marginBottom: 8, backgroundColor: '#F0F0F0' },
  itemNome: { fontSize: 16, fontWeight: 'bold' },
  botaoCadastro: {backgroundColor: '#2e7d32', borderRadius: 8, padding: 12, alignItems: 'center',marginBottom: 16},
  botaoCadastroTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});