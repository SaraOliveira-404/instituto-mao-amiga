import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Doacao, Ponto } from '../tipos';
import { pontosMock } from '../dados/Pontos';
import { listarDoacoes, salvarDoacao, carregarRascunho, salvarRascunho } from '../dados/Doacoes';
import { ItemDoacao } from '../componentes/ItemDoacao';

export default function CadastroDoacao() {
    const [tipoItem, setTipoItem] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pontoDestino, setPontoDestino] = useState('');

    const [erroTipoItem, setErroTipoItem] = useState('');
    const [erroQuantidade, setErroQuantidade] = useState('');
    const [erroPontoDestino, setErroPontoDestino] = useState('');

    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);
    const [mostrarPontos, setMostrarPontos] = useState(false);
    const [carregado, setCarregado] = useState(false);

    // Carregar doações salvas
    useEffect(() => {
        (async () => {
            const salvas = await listarDoacoes();
            setDoacoes(salvas);

            const r = await carregarRascunho();
            if (r) {
                setTipoItem(r.tipoItem);
                setQuantidade(r.quantidade);
                setPontoDestino(r.pontoDestino);
                setPontoSelecionado(
                    pontosMock.find((p) => p.id === r.pontoId) ?? null
                );
            }
            setCarregado(true);
        })();
    }, []);

    useEffect(() => {
        if (!carregado) return;
        const vazio = !tipoItem && !quantidade && !pontoDestino;
        salvarRascunho(
            vazio
                ? null
                : {
                    tipoItem,
                    quantidade,
                    pontoDestino,
                    pontoId: pontoSelecionado?.id ?? null,
                }
        );
    }, [carregado, tipoItem, quantidade, pontoDestino, pontoSelecionado]);

    // Validação do tipo do item (não pode ser vazio)
    function validarTipoItem(valor: string) {
        setTipoItem(valor);

        if (valor.trim() === '') {
            setErroTipoItem('Informe o tipo do item.');
            return;
        }

        setErroTipoItem('');
    }

    // Validação da quantidade (não de ser vazio e deve ser um número inteiro)
    function validarQuantidade(valor: string) {
        setQuantidade(valor);

        if (valor.trim() === '') {
            setErroQuantidade('Informe a quantidade.');
            return;
        }

        if (!/^\d+$/.test(valor)) {
            setErroQuantidade('Quantidade deve ser um número inteiro.');
            return;
        }

        setErroQuantidade('');
    }

    // Validação do ponto de destino (não pode ser vazio e deve ser selecionado da lista)
    function validarPontoDestino() {
        if (pontoSelecionado === null) {
            setErroPontoDestino('Selecione um ponto de destino.');
            return false;
        }

        setErroPontoDestino('');
        return true;
    }

    // Selecionar um ponto da lista
    function selecionarPonto(ponto: Ponto) {
        setPontoDestino(ponto.nome);
        setPontoSelecionado(ponto);
        setMostrarPontos(false);
    }

    // Filtrar pontos conforme o texto digitado
    const pontosFiltrados = [...pontosMock]
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .filter((ponto) =>
            ponto.nome
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .includes(pontoDestino.toLowerCase())
        );

    // Cadastrar doação
    async function handleCadastrar() {
        validarTipoItem(tipoItem);
        validarQuantidade(quantidade);

        const pontoValido = validarPontoDestino();

        if (
            tipoItem.trim() === '' ||
            quantidade.trim() === '' ||
            !/^\d+$/.test(quantidade) ||
            !pontoValido
        ) {
            return;
        }
        
        const novaDoacao = await salvarDoacao({
            tipoItem: tipoItem.trim(),
            quantidade: quantidade.trim(),
            pontoDestino: pontoSelecionado!.nome,
        });

        if (!novaDoacao) return; 

        setDoacoes([novaDoacao, ...doacoes]);

        // Limpar formulário
        setTipoItem('');
        setQuantidade('');
        setPontoDestino('');
        setPontoSelecionado(null);

        setErroTipoItem('');
        setErroQuantidade('');
        setErroPontoDestino('');
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={['bottom', 'left', 'right']}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.campo}>
                        <Text style={styles.label}>Tipo do item</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Roupas, alimentos, brinquedos"
                            value={tipoItem}
                            onChangeText={validarTipoItem}
                        />

                        {erroTipoItem !== '' && (
                            <Text style={styles.erro}>{erroTipoItem}</Text>
                        )}
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.label}>Quantidade</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Apenas números inteiros"
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
                            placeholder="Digite para buscar um ponto"
                            value={pontoDestino}
                            onFocus={() => setMostrarPontos(true)}
                            onChangeText={(texto) => {
                                setPontoDestino(texto);
                                setPontoSelecionado(null);
                                setErroPontoDestino('');
                                setMostrarPontos(true);
                            }}
                        />

                        {mostrarPontos && pontoSelecionado === null && (
                            <View style={styles.listaPontos}>
                                {pontosFiltrados.map((ponto) => (
                                    <TouchableOpacity
                                        key={ponto.id}
                                        style={styles.pontoItem}
                                        onPress={() => selecionarPonto(ponto)}
                                    >
                                        <Text style={styles.pontoNome}>
                                            {ponto.nome}
                                        </Text>

                                        <Text style={styles.pontoEndereco}>
                                            {ponto.endereco}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {erroPontoDestino !== '' && (
                            <Text style={styles.erro}>
                                {erroPontoDestino}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={handleCadastrar}
                    >
                        <Text style={styles.textoBotao}>
                            Cadastrar Doação
                        </Text>
                    </TouchableOpacity>

                    {doacoes.length > 0 && (
                        <View style={styles.listaContainer}>
                            <Text style={styles.listaTitulo}>
                                Doações cadastradas
                            </Text>

                            {doacoes.map((d) => (
                                <ItemDoacao
                                    key={d.id}
                                    doacao={d}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    flex: {
        flex: 1,
    },

    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },

    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#1B3A5C',
    },

    campo: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },

    erro: {
        color: '#d32f2f',
        fontSize: 13,
        marginTop: 4,
    },

    listaPontos: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },

    pontoItem: {
        padding: 12,
        minHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    pontoNome: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1B3A5C',
    },

    pontoEndereco: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },

    botao: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        minHeight: 44,
    },

    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    listaContainer: {
        marginTop: 24,
    },

    listaTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1B3A5C',
    },
});