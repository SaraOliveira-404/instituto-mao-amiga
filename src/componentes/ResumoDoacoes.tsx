// Issue #13: mostra o total de doações e a quantidade somada por tipo de item

import { View, Text, StyleSheet } from 'react-native';
import type { Doacao } from '../tipos';

type Props = {
  doacoes: Doacao[];
  titulo?: string;
};

type TotalTipo = { tipo: string; quantidade: number; doacoes: number };

// Escolhe singular ou plural: (1, 'doação', 'doações') -> 'doação'
function plural(n: number, singular: string, pluralTxt: string) {
  return n === 1 ? singular : pluralTxt;
}

// Agrupa as doações por tipo, soma as quantidades e ordena da maior para a menor
function calcularTotais(doacoes: Doacao[]): TotalTipo[] {
  const porTipo: Record<string, TotalTipo> = {};

  for (const d of doacoes) {
    const atual = porTipo[d.tipoItem] ?? { tipo: d.tipoItem, quantidade: 0, doacoes: 0 };
    atual.quantidade += Number(d.quantidade) || 0; 
    atual.doacoes += 1;
    porTipo[d.tipoItem] = atual;
  }

  // ordem do maior para o menor
  return Object.values(porTipo).sort(
    (a, b) => b.quantidade - a.quantidade || a.tipo.localeCompare(b.tipo, 'pt-BR')
  );
}

export function ResumoDoacoes({ doacoes, titulo = 'Resumo das doações' }: Props) {
  // Calculado a cada renderização
  const totais = calcularTotais(doacoes);
  const totalUnidades = totais.reduce((soma, t) => soma + t.quantidade, 0);

  return (
    <View style={styles.caixa}>
      <Text style={styles.titulo}>{titulo}</Text>

      {/* Issue #13: estado vazio, sem doações a tela não quebra */}
      {doacoes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma doação registrada ainda.</Text>
      ) : (
        <>
          <Text style={styles.total}>
            Total: {doacoes.length} {plural(doacoes.length, 'doação', 'doações')} ·{' '}
            {totalUnidades} {plural(totalUnidades, 'unidade', 'unidades')}
          </Text>

          {/* Uma linha por tipo, ex: "Roupas: 15 unidades em 3 doações" */}
          {totais.map((t) => (
            <Text key={t.tipo} style={styles.linha}>
              <Text style={styles.tipo}>{t.tipo}: </Text>
              {t.quantidade} {plural(t.quantidade, 'unidade', 'unidades')} em {t.doacoes}{' '}
              {plural(t.doacoes, 'doação', 'doações')}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1B3A5C',
  },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 6 },
  total: { fontSize: 14, fontWeight: '600', color: '#333333', marginBottom: 6 },
  linha: { fontSize: 14, color: '#333333', marginTop: 2 },
  tipo: { fontWeight: '600' },
  vazio: { fontSize: 14, color: '#666666' },
});