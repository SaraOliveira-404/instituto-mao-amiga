import { View, Text, StyleSheet } from 'react-native';

type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  recebeOuDistribui: string;
};

const pontosMock: Ponto[] = [
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

function PontoItem({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemNome}>{ponto.nome}</Text>
    </View>
  );
}

function TelaListaPontos() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pontos de Coleta e Distribuição</Text>
      {pontosMock.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.campo}>Endereço: {ponto.endereco}</Text>
      <Text style={styles.campo}>Horário: {ponto.horario}</Text>
      <Text style={styles.campo}>{ponto.recebeOuDistribui}</Text>
    </View>
  );
}

function TelaDetalhePonto() {
  return <DetalhePonto ponto={pontosMock[0]} />;
}


export default function App() {
  //return <TelaListaPontos />;
  return <TelaDetalhePonto />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1B3A5C',
  },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 12,
  },
  campo: {
    fontSize: 16,
    marginTop: 6,
    color: '#333333',
  },
});
