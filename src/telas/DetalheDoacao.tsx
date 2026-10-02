import { Alert, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos';
import { excluirDoacao } from '../dados/Doacoes';
import { formatarData } from '../utilitarios/formatarData';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function DetalheDoacao({ route, navigation }: Props) {
    // A doação chega pronta pela navegação (route.params), enviada pela tela Minhas Doações
    const { doacao } = route.params;

    // Pede confirmação antes de apagar
    function confirmarExclusao() {
        Alert.alert(
            'Excluir doação',
            'Tem certeza que deseja excluir esta doação? Essa ação não pode ser desfeita.',
            [
                // Cancelar só fecha o aviso, não apaga nada
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const ok = await excluirDoacao(doacao.id);
                        if (ok) {
                            navigation.popTo('MinhasDoacoes', {
                                mensagem: `Doação nº ${doacao.id} excluída com sucesso!`,
                            });
                        } else {
                            Alert.alert('Erro', 'Não foi possível excluir a doação. Tente novamente.');
                        }
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.titulo}>{doacao.tipoItem}</Text>

                <Text style={styles.rotulo}>ID</Text>
                <Text style={styles.valor} selectable>{doacao.id}</Text>

                <Text style={styles.rotulo}>Tipo do item</Text>
                <Text style={styles.valor}>{doacao.tipoItem}</Text>

                <Text style={styles.rotulo}>Quantidade</Text>
                <Text style={styles.valor}>{doacao.quantidade}</Text>

                <Text style={styles.rotulo}>Ponto de destino</Text>
                <Text style={styles.valor}>{doacao.pontoDestino}</Text>

                <Text style={styles.rotulo}>Registrada em</Text>
                <Text style={styles.valor}>{formatarData(doacao.criadoEm)}</Text>

                <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
                    <Text style={styles.botaoExcluirTexto}>Excluir doação</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
    rotulo: { fontSize: 13, fontWeight: '600', color: '#666666', marginTop: 12 },
    valor: { fontSize: 16, color: '#333333', marginTop: 2 },
    botaoExcluir: {
        backgroundColor: '#d32f2f',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        minHeight: 44,
    },
    botaoExcluirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});