import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CadastroDoacao() {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');

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
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
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
    marginTop: 8,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});