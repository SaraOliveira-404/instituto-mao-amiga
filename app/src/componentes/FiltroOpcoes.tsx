// Linha de botões de filtro reutilizável
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export type OpcaoFiltro = { rotulo: string; valor: string };

type Props = {
  opcoes: OpcaoFiltro[];
  valor: string; // valor escolhido ('' = todos)
  onChange: (valor: string) => void;
};

export function FiltroOpcoes({ opcoes, valor, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.linha}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {opcoes.map((op) => {
        const escolhido = valor === op.valor;
        return (
          <TouchableOpacity
            key={op.rotulo}
            style={[styles.chip, escolhido && styles.chipEscolhido]}
            onPress={() => onChange(op.valor)}
          >
            <Text style={[styles.texto, escolhido && styles.textoEscolhido]}>{op.rotulo}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linha: { flexGrow: 0 },
  conteudo: { gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#1B3A5C',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    minHeight: 44,
  },
  chipEscolhido: { backgroundColor: '#1B3A5C' },
  texto: { fontSize: 14, fontWeight: '600', color: '#1B3A5C' },
  textoEscolhido: { color: '#fff' },
});