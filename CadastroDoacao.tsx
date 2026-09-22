// CadastroDoacao.tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mao_amiga:doacoes';

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
};

export default function CadastroDoacao() {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);

  useEffect(() => {
    carregarDoacoes();
  }, []);

  async function carregarDoacoes() {
    try {
      const salvo = await AsyncStorage.getItem(STORAGE_KEY);
      if (salvo) {
        setDoacoes(JSON.parse(salvo));
      }
    } catch (e) {
      console.warn('Erro ao carregar doações do AsyncStorage', e);
    }
  }

  async function salvarDoacoes(novaLista: Doacao[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
      setDoacoes(novaLista);
    } catch (e) {
      console.warn('Erro ao salvar doações no AsyncStorage', e);
    }
  }

  function validarQuantidade(valor: string) {
    setQuantidade(valor);

    if (valor.trim() === '') {
      setErroQuantidade('Informe a quantidade.');
      return;
    }

    const apenasInteiro = /^\d+$/;
    if (!apenasInteiro.test(valor)) {
      setErroQuantidade('Quantidade deve ser um número inteiro.');
      return;
    }

    setErroQuantidade('');
  }

  function handleCadastrar() {
    validarQuantidade(quantidade);

    if (
      tipoItem.trim() === '' ||
      quantidade.trim() === '' ||
      !/^\d+$/.test(quantidade) ||
      pontoDestino.trim() === ''
    ) {
      return;
    }

    const novaDoacao: Doacao = {
      id: Date.now().toString(),
      tipoItem: tipoItem.trim(),
      quantidade: quantidade.trim(),
      pontoDestino: pontoDestino.trim(),
    };

    const novaLista = [...doacoes, novaDoacao];
    salvarDoacoes(novaLista);

    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
    setErroQuantidade('');
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Cadastro de Doação</Text>

          <View style={styles.campo}>
            <Text style={styles.label}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Roupas, alimentos, brinquedos"
              value={tipoItem}
              onChangeText={setTipoItem}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5"
              keyboardType="numeric"
              value={quantidade}
              onChangeText={validarQuantidade}
            />
            {erroQuantidade !== '' && (
              <Text style={styles.erro}>{erroQuantidade}</Text>
            )}
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Ponto de destino</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ponto de Coleta Centro"
              value={pontoDestino}
              onChangeText={setPontoDestino}
            />
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
            <Text style={styles.textoBotao}>Cadastrar Doação</Text>
          </TouchableOpacity>

          {doacoes.length > 0 && (
            <View style={styles.listaContainer}>
              <Text style={styles.listaTitulo}>Doações cadastradas</Text>
              {doacoes.map((d) => (
                <View key={d.id} style={styles.listaItem}>
                  <Text style={styles.listaItemTexto}>
                    {d.tipoItem} — {d.quantidade} — {d.pontoDestino}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#1B3A5C' },
  campo: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  erro: { color: '#d32f2f', fontSize: 13, marginTop: 4 },
  botao: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 44,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listaContainer: { marginTop: 24 },
  listaTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#1B3A5C' },
  listaItem: {
    padding: 10,
    marginBottom: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  listaItemTexto: { fontSize: 14 },
});