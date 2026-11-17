// Campo de busca reutilizável: clica e já digita, com ✕ para limpar.
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type OpcaoBusca = { id: string; titulo: string; subtitulo?: string };


function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

type Props = {
  valor: string; 
  onChangeTexto: (texto: string) => void;
  placeholder?: string;
  opcoes?: OpcaoBusca[]; 
  onEscolher?: (opcao: OpcaoBusca) => void; 
  desabilitado?: boolean;
};

export function CampoBusca({
  valor,
  onChangeTexto,
  placeholder = 'Buscar por nome ou bairro',
  opcoes,
  onEscolher,
  desabilitado = false,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function abrir() {
    if (timer.current) clearTimeout(timer.current);
    setAberto(true);
  }

  function fecharDepois() {
    timer.current = setTimeout(() => setAberto(false), 250);
  }

  function escolher(opcao: OpcaoBusca) {
    onEscolher?.(opcao);
    setAberto(false);
  }

  const termo = normalizar(valor.trim());
  const sugestoes = (opcoes ?? [])
    .filter(
      (o) =>
        normalizar(o.titulo).includes(termo) || normalizar(o.subtitulo ?? '').includes(termo)
    )
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));

  return (
    <View>
      <View style={[styles.linha, desabilitado && styles.linhaDesabilitada]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={valor}
          editable={!desabilitado}
          onChangeText={(t) => {
            onChangeTexto(t);
            setAberto(true);
          }}
          onFocus={abrir}
          onBlur={fecharDepois}
          autoCorrect={false}
        />
        {valor !== '' && !desabilitado && (
          <TouchableOpacity
            style={styles.botaoLimpar}
            onPress={() => onChangeTexto('')}
            accessibilityLabel="Limpar busca"
          >
            <Text style={styles.limpar}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {opcoes !== undefined && aberto && !desabilitado && (
        <ScrollView style={styles.lista} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {sugestoes.map((o) => (
            <TouchableOpacity key={o.id} style={styles.item} onPress={() => escolher(o)}>
              <Text style={styles.itemTitulo}>{o.titulo}</Text>
              {o.subtitulo ? <Text style={styles.itemSub}>{o.subtitulo}</Text> : null}
            </TouchableOpacity>
          ))}
          {sugestoes.length === 0 && <Text style={styles.vazio}>Nada encontrado.</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minHeight: 44,
    backgroundColor: '#fff',
  },
  linhaDesabilitada: { backgroundColor: '#eee' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  botaoLimpar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  limpar: { fontSize: 16, color: '#666' },
  lista: {
    maxHeight: 220,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  item: {
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitulo: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  itemSub: { fontSize: 13, color: '#666', marginTop: 2 },
  vazio: { padding: 12, fontSize: 13, color: '#666' },
});