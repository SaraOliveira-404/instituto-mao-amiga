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
import type { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import type { Doacao, Ponto, RootStackParamList } from '../tipos'; 
import { pontosMock } from '../dados/Pontos';
import { salvarDoacao, atualizarDoacao, carregarRascunho, salvarRascunho } from '../dados/Doacoes'; 

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>; 

export default function CadastroDoacao({ route, navigation }: Props) { 
    const doacaoEditando = route.params?.doacao;
    const modoEdicao = doacaoEditando !== undefined;

    const [tipoItem, setTipoItem] = useState(doacaoEditando?.tipoItem ?? '');
    const [quantidade, setQuantidade] = useState(doacaoEditando?.quantidade ?? '');
    const [pontoDestino, setPontoDestino] = useState(doacaoEditando?.pontoDestino ?? '');

    const [erroTipoItem, setErroTipoItem] = useState('');
    const [erroQuantidade, setErroQuantidade] = useState('');
    const [erroPontoDestino, setErroPontoDestino] = useState('');

    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(
        doacaoEditando
            ? pontosMock.find((p) => p.nome === doacaoEditando.pontoDestino) ?? null
            : null
    );
    const [mostrarPontos, setMostrarPontos] = useState(false);
    const [carregado, setCarregado] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    // Carregar o rascunho salvo
    useEffect(() => {
        if (modoEdicao) return;

        (async () => {
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
        if (!carregado || modoEdicao) return;
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

    // Faz a mensagem de sucesso sumir sozinha depois de 3 segundos
    useEffect(() => {
        if (mensagemSucesso === '') return;

        const timer = setTimeout(() => setMensagemSucesso(''), 3000);
        return () => clearTimeout(timer);
    }, [mensagemSucesso]);

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

    // Cadastrar uma doação nova OU salvar as alterações de uma existente
    async function handleCadastrar() {
        setMensagemSucesso('');

        // As mesmas validações valem para cadastro e edição
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

        //Edição, atualiza a doação existente
        if (doacaoEditando) {
            const atualizada: Doacao = {
                ...doacaoEditando,
                tipoItem: tipoItem.trim(),
                quantidade: quantidade.trim(),
                pontoDestino: pontoSelecionado!.nome,
            };

            const ok = await atualizarDoacao(atualizada);
            if (!ok) return;

            navigation.popTo('DetalheDoacao', {
                doacao: atualizada,
                mensagem: `Doação nº ${atualizada.id} editada com sucesso!`,
            });
            return;
        }

        const novaDoacao = await salvarDoacao({
            tipoItem: tipoItem.trim(),
            quantidade: quantidade.trim(),
            pontoDestino: pontoSelecionado!.nome,
        });

        if (!novaDoacao) return;

        setMensagemSucesso(`Doação nº ${novaDoacao.id} cadastrada com sucesso!`);

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
                    <Text style={styles.titulo}>
                        {modoEdicao ? `Editar Doação nº ${doacaoEditando!.id}` : 'Cadastro de Doação'}
                    </Text>

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
                            {modoEdicao ? 'Salvar alterações' : 'Cadastrar Doação'}
                        </Text>
                    </TouchableOpacity>

                    {modoEdicao && (
                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    )}

                    {mensagemSucesso !== '' && (
                        <Text style={styles.sucesso}>{mensagemSucesso}</Text>
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

    botaoCancelar: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        minHeight: 44,
    },

    textoBotaoCancelar: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 16,
    },

    sucesso: {
        color: '#2e7d32',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
    },
});